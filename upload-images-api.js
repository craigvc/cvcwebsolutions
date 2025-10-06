const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadImageToMedia(imagePath, altText) {
  try {
    const filePath = path.join(__dirname, 'public', imagePath);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ Image file not found: ${filePath}`);
      return null;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('alt', altText);

    console.log(`Uploading: ${path.basename(imagePath)}`);

    const response = await fetch('http://localhost:3456/api/media', {
      method: 'POST',
      body: form,
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Uploaded successfully: ${result.doc.filename} (ID: ${result.doc.id})`);
      return result.doc.id;
    } else {
      const errorText = await response.text();
      console.log(`❌ Upload failed: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

async function assignImageToPost(postId, mediaId, postTitle) {
  try {
    console.log(`Assigning image to: ${postTitle}`);

    const response = await fetch(`http://localhost:3456/api/blog-posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        featuredImage: mediaId
      })
    });

    if (response.ok) {
      console.log(`✅ Successfully assigned image to: ${postTitle}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Failed to assign image to ${postTitle}: ${response.status} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error assigning image to ${postTitle}:`, error.message);
    return false;
  }
}

async function uploadAndAssignAllImages() {
  try {
    // Read the image mapping
    const imageMapping = JSON.parse(fs.readFileSync('blog-image-mapping.json', 'utf8'));

    // Get all blog posts
    const postsResponse = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    if (!postsResponse.ok) {
      throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
    }

    const postsData = await postsResponse.json();
    const posts = postsData.docs || [];

    console.log('🖼️  Starting image upload and assignment process...\n');

    for (const post of posts) {
      const imagePath = imageMapping[post.slug];

      if (imagePath) {
        console.log(`\n--- Processing: ${post.title} ---`);
        console.log(`Image path: ${imagePath}`);

        // Upload image to media collection
        const mediaId = await uploadImageToMedia(imagePath, post.title);

        if (mediaId) {
          // Assign the image to the blog post
          await assignImageToPost(post.id, mediaId, post.title);
        }

        console.log(''); // Add spacing between posts
      } else {
        console.log(`⚠️ No image mapping found for: ${post.title} (${post.slug})`);
      }
    }

    console.log('\n✅ Image upload and assignment process completed!');
    console.log('All blog posts should now have their featured images stored in the database.');

  } catch (error) {
    console.error('❌ Error in upload process:', error.message);
  }
}

uploadAndAssignAllImages();