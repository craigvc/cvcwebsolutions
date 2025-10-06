const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function createMediaRecord() {
  try {
    // Get file stats for the copied image
    const filePath = 'public/media/welcome-to-cvc-web-solutions.jpg';
    const stats = fs.statSync(filePath);

    console.log('Creating media record for test image...');

    // Create media record via API
    const response = await fetch('http://localhost:3456/api/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: 'welcome-to-cvc-web-solutions.jpg',
        mimeType: 'image/jpeg',
        filesize: stats.size,
        width: 800, // Estimated
        height: 400, // Estimated
        url: '/media/welcome-to-cvc-web-solutions.jpg',
        alt: 'Welcome to CVC Web Solutions'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Media record created successfully!');
      console.log('Media ID:', result.doc.id);
      console.log('URL:', result.doc.url);

      // Now assign this to the "Welcome to CVC" blog post
      await assignImageToPost(result.doc.id);

    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create media record:', response.status, errorText);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function assignImageToPost(mediaId) {
  try {
    // Get the "Welcome to CVC" blog post
    const response = await fetch('http://localhost:3456/api/blog-posts?where[slug][equals]=welcome-to-cvc');

    if (!response.ok) {
      console.log('❌ Failed to find blog post');
      return;
    }

    const data = await response.json();
    const post = data.docs[0];

    if (!post) {
      console.log('❌ Blog post not found');
      return;
    }

    console.log('Assigning image to "Welcome to CVC" blog post...');

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
      console.log('✅ Successfully assigned image to blog post!');
      console.log('You can now test the blog to see the featured image.');
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ Failed to assign image:', updateResponse.status, errorText);
    }

  } catch (error) {
    console.error('Error assigning image:', error.message);
  }
}

createMediaRecord();