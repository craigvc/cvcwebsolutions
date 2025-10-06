const fetch = require('node-fetch');

async function debugBlogImages() {
  try {
    console.log('🔍 Debugging blog image references...\n');

    // Get a blog post with depth to see the featured image structure
    const response = await fetch('http://localhost:3456/api/blog-posts?where[slug][equals]=welcome-to-cvc&depth=2');
    const data = await response.json();
    const post = data.docs[0];

    if (!post) {
      console.log('❌ Post not found');
      return;
    }

    console.log('📝 Post:', post.title);
    console.log('🔗 Post ID:', post.id);

    if (post.featuredImage) {
      console.log('\n📷 Featured Image Details:');
      console.log(JSON.stringify(post.featuredImage, null, 2));
    } else {
      console.log('❌ No featured image found for this post');
    }

    // Also check what files actually exist in the media directory
    console.log('\n📁 Files in public/media directory:');
    const fs = require('fs');
    const path = require('path');

    try {
      const mediaDir = path.join(__dirname, 'public', 'media');
      const files = fs.readdirSync(mediaDir);
      files.forEach(file => {
        const filePath = path.join(mediaDir, file);
        const stats = fs.statSync(filePath);
        console.log(`  ${file} (${stats.size} bytes)`);
      });
    } catch (error) {
      console.log('❌ Error reading media directory:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugBlogImages();