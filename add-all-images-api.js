const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function copyImageToMedia(sourceImagePath) {
  const filename = path.basename(sourceImagePath);
  const sourcePath = path.join(__dirname, 'public', sourceImagePath);
  const destPath = path.join(__dirname, 'public', 'media', filename);

  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Source image not found: ${sourcePath}`);
    return null;
  }

  fs.copyFileSync(sourcePath, destPath);
  console.log(`📁 Copied: ${filename}`);
  return filename;
}

async function createMediaRecord(filename, altText) {
  try {
    const filePath = path.join(__dirname, 'public', 'media', filename);
    const stats = fs.statSync(filePath);

    console.log(`Creating media record for: ${filename}`);

    const response = await fetch('http://localhost:3456/api/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: filename,
        mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        filesize: stats.size,
        width: 800,
        height: 400,
        url: `/media/${filename}`,
        alt: altText
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Media record created: ${filename} (ID: ${result.doc.id})`);
      return result.doc.id;
    } else {
      const errorText = await response.text();
      console.log(`❌ Failed to create media record for ${filename}: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error creating media record for ${filename}:`, error.message);
    return null;
  }
}

async function assignImageToPost(postSlug, mediaId, postTitle) {
  try {
    // Get the blog post by slug
    const response = await fetch(`http://localhost:3456/api/blog-posts?where[slug][equals]=${postSlug}`);

    if (!response.ok) {
      console.log(`❌ Failed to find blog post with slug: ${postSlug}`);
      return false;
    }

    const data = await response.json();
    const post = data.docs[0];

    if (!post) {
      console.log(`❌ Blog post not found: ${postSlug}`);
      return false;
    }

    console.log(`Assigning image to: ${postTitle}`);

    // Update the blog post with the media ID
    const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        featuredImage: mediaId
      })
    });

    if (updateResponse.ok) {
      console.log(`✅ Successfully assigned image to: ${postTitle}`);
      return true;
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Failed to assign image to ${postTitle}: ${updateResponse.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error assigning image to ${postTitle}:`, error.message);
    return false;
  }
}

async function addAllBlogImages() {
  try {
    // Read the image mapping
    const imageMapping = JSON.parse(fs.readFileSync('blog-image-mapping.json', 'utf8'));

    // Get all blog posts to get their titles
    const postsResponse = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    if (!postsResponse.ok) {
      throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
    }

    const postsData = await postsResponse.json();
    const posts = postsData.docs || [];

    console.log('🚀 Starting bulk image upload process...\n');

    let successCount = 0;
    let totalCount = 0;

    for (const post of posts) {
      const imagePath = imageMapping[post.slug];

      if (imagePath) {
        totalCount++;
        console.log(`\n--- Processing: ${post.title} ---`);
        console.log(`Slug: ${post.slug}`);
        console.log(`Image: ${imagePath}`);

        // Step 1: Copy image to media directory
        const filename = await copyImageToMedia(imagePath);

        if (filename) {
          // Step 2: Create media record
          const mediaId = await createMediaRecord(filename, post.title);

          if (mediaId) {
            // Step 3: Assign to blog post
            const assigned = await assignImageToPost(post.slug, mediaId, post.title);

            if (assigned) {
              successCount++;
            }
          }
        }

        console.log(''); // Add spacing between posts
      } else {
        console.log(`⚠️ No image mapping found for: ${post.title} (${post.slug})`);
      }
    }

    console.log('\n🎉 Bulk image upload completed!');
    console.log(`✅ Successfully processed: ${successCount}/${totalCount} images`);
    console.log('\nYour blog should now display all featured images from the database!');
    console.log('Check your blog at: http://localhost:3456/blog');

  } catch (error) {
    console.error('❌ Error in bulk upload process:', error.message);
  }
}

addAllBlogImages();