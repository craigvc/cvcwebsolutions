const fetch = require('node-fetch');

async function checkUpdatedMedia() {
  try {
    console.log('🔍 Checking updated media records...\n');

    // Get all media records directly
    const response = await fetch('http://localhost:3456/api/media?limit=10');
    const data = await response.json();

    console.log('Media records:');
    data.docs.forEach(media => {
      console.log(`- ${media.filename}: ${media.url}`);
    });

    // Also check a different blog post
    console.log('\n--- Checking Welcome to CVC post ---');
    const postResponse = await fetch('http://localhost:3456/api/blog-posts?where[slug][equals]=welcome-to-cvc&depth=2');
    const postData = await postResponse.json();
    const post = postData.docs[0];

    if (post && post.featuredImage) {
      console.log('Featured image URL:', post.featuredImage.url);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUpdatedMedia();