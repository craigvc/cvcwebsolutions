const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const OpenAI = require('openai');
require('dotenv').config();

const db = new Database('./data/payload.db');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Image prompts for each blog post based on titles and content
const imagePrompts = {
  6: "Professional business partnership handshake, modern digital marketing concept, website design elements floating in background, vibrant gradient colors purple and pink, clean corporate style, photorealistic",
  7: "Modern landing page on computer screen, high conversion rate graph trending upward, digital marketing elements, clean minimalist design, purple and teal color scheme, professional business setting",
  8: "Learning management system dashboard interface, corporate training environment, modern LMS platform, industrial refrigeration equipment in background, professional education technology, blue and purple gradient",
  10: "Marketing team collaboration, creative advertising agency workspace, digital screens showing marketing campaigns, modern professional setting, vibrant colors, teamwork and partnership theme",
  11: "Resource management system interface, business operations dashboard, customer experience optimization, modern enterprise software, industrial equipment integration, professional technology setting"
};

async function generateAndSaveImage(postId, prompt, title) {
  try {
    console.log(`\n🎨 Generating image for: ${title}`);
    console.log(`Prompt: ${prompt}\n`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard"
    });

    const imageUrl = response.data[0].url;
    console.log(`✓ Image generated: ${imageUrl}`);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to media folder with descriptive filename
    const filename = `blog-${postId}-ai-generated.png`;
    const mediaPath = path.join('./public/media', filename);
    fs.writeFileSync(mediaPath, buffer);
    console.log(`✓ Saved to: ${mediaPath}`);

    // Insert into media table
    const now = new Date().toISOString();
    const stats = fs.statSync(mediaPath);

    const mediaInsert = db.prepare(`
      INSERT INTO media (filename, mime_type, filesize, url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = mediaInsert.run(
      filename,
      'image/png',
      stats.size,
      `/media/${filename}`,
      now,
      now
    );

    const mediaId = result.lastInsertRowid;
    console.log(`✓ Media record created with ID: ${mediaId}`);

    // Update blog post with new featured image
    const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = ?');
    updateStmt.run(mediaId, now, postId);
    console.log(`✓ Updated blog post ${postId} with new image`);

    return mediaId;

  } catch (error) {
    console.error(`❌ Error generating image for post ${postId}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting AI image generation for blog posts...\n');

  // Get posts that need new images (using default image ID 7)
  const posts = db.prepare(`
    SELECT id, title
    FROM blog_posts
    WHERE featured_image_id = 7
    ORDER BY id
  `).all();

  console.log(`Found ${posts.length} posts needing AI-generated images\n`);

  for (const post of posts) {
    if (imagePrompts[post.id]) {
      await generateAndSaveImage(post.id, imagePrompts[post.id], post.title);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Verify all posts now have unique images
  console.log('\n📊 Final verification:');
  const verification = db.prepare(`
    SELECT bp.id, bp.title, bp.featured_image_id, m.filename
    FROM blog_posts bp
    LEFT JOIN media m ON bp.featured_image_id = m.id
    ORDER BY bp.id
  `).all();

  verification.forEach(post => {
    console.log(`  ${post.id}. ${post.title.substring(0, 60)}... (Image: ${post.filename})`);
  });

  db.close();
  console.log('\n✅ AI image generation complete!');
}

main().catch(console.error);
