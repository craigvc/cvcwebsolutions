const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function uploadImageToMedia(imagePath, altText) {
  try {
    const form = new FormData();
    const filePath = path.join(__dirname, 'public', imagePath);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ Image file not found: ${filePath}`);
      return null;
    }

    form.append('file', fs.createReadStream(filePath));
    form.append('alt', altText);

    const response = await fetch('http://localhost:3456/api/media', {
      method: 'POST',
      body: form,
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Uploaded: ${path.basename(imagePath)} (ID: ${result.doc.id})`);
      return result.doc.id;
    } else {
      const errorText = await response.text();
      console.log(`❌ Failed to upload ${imagePath}: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

async function updateBlogPostsWithImages() {
  try {
    // Read the image mapping
    const imageMapping = JSON.parse(fs.readFileSync('blog-image-mapping.json', 'utf8'));

    // Get all blog posts
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    const posts = data.docs || [];

    console.log('🖼️  Uploading images to media collection and updating blog posts...\n');

    for (const post of posts) {
      const imagePath = imageMapping[post.slug];

      if (imagePath) {
        console.log(`\nProcessing: ${post.title}`);
        console.log(`Image path: ${imagePath}`);

        // Upload image to media collection
        const mediaId = await uploadImageToMedia(imagePath, post.title);

        if (mediaId) {
          // Update the blog post with the media ID
          console.log(`Updating blog post with media ID: ${mediaId}`);

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
            console.log(`✅ Successfully updated blog post: ${post.title}`);
          } else {
            const errorText = await updateResponse.text();
            console.log(`❌ Failed to update blog post ${post.title}: ${updateResponse.status} - ${errorText}`);
          }
        }
      } else {
        console.log(`⚠️ No image mapping found for: ${post.title} (${post.slug})`);
      }
    }

    console.log('\n✅ Image upload and assignment completed!');
    console.log('Now the blog components can use post.featuredImage.url from the database.');

  } catch (error) {
    console.error('❌ Error in upload process:', error.message);
  }
}

// Check if FormData is available
try {
  require.resolve('form-data');
  updateBlogPostsWithImages();
} catch (e) {
  console.log('Installing form-data package...');
  require('child_process').execSync('npm install form-data', { stdio: 'inherit' });
  updateBlogPostsWithImages();
}