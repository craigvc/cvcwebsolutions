const fs = require('fs');

async function createMinimalBlogPosts() {
  console.log('Creating minimal blog posts...');

  // Read the migrated posts
  const migratedPosts = JSON.parse(fs.readFileSync('migrated-blog-posts.json', 'utf8'));

  for (const post of migratedPosts) {
    try {
      // Create a minimal blog post with only required fields
      const minimalPost = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || 'No excerpt available',
        content: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: post.excerpt || post.title,
                    type: "text",
                    version: 1
                  }
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1
              }
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1
          }
        },
        status: 'published',
        publishedAt: post.publishedAt
      };

      console.log(`Creating: ${post.title}...`);
      const response = await fetch('http://localhost:3456/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minimalPost)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✓ Successfully created: ${post.title}`);
      } else {
        const errorText = await response.text();
        console.log(`✗ Failed to create "${post.title}":`, response.status);
        console.log('Error details:', errorText);
      }

    } catch (error) {
      console.error(`✗ Error creating "${post.title}":`, error.message);
    }

    // Small delay between imports
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Minimal blog post creation completed!');
}

// Run the import
if (require.main === module) {
  createMinimalBlogPosts().catch(console.error);
}

module.exports = { createMinimalBlogPosts };