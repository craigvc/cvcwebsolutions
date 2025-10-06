const fetch = require('node-fetch');

async function findCorrectPost() {
  try {
    console.log('🔍 Finding the correct post ID for future-of-ai-web-development...\n');

    // Get all posts and find the one with the right slug
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    const data = await response.json();

    console.log('All posts with their IDs and slugs:');
    data.docs.forEach(post => {
      console.log(`ID: ${post.id} | Slug: ${post.slug} | Title: ${post.title}`);
    });

    // Find the specific post
    const targetPost = data.docs.find(post => post.slug === 'future-of-ai-web-development');

    if (targetPost) {
      console.log(`\n✅ Found target post:`);
      console.log(`ID: ${targetPost.id}`);
      console.log(`Title: ${targetPost.title}`);
      console.log(`Slug: ${targetPost.slug}`);

      // Now test fetching it by ID
      console.log(`\n--- Testing fetch by ID ${targetPost.id} ---`);
      const byIdResponse = await fetch(`http://localhost:3456/api/blog-posts/${targetPost.id}`);
      const byIdData = await byIdResponse.json();

      if (byIdData.doc) {
        console.log(`✅ Successfully fetched by ID:`);
        console.log(`Title: ${byIdData.doc.title}`);
        console.log(`Slug: ${byIdData.doc.slug}`);
        console.log(`Content blocks: ${byIdData.doc.content?.root?.children?.length || 0}`);
      } else {
        console.log(`❌ Failed to fetch by ID`);
      }
    } else {
      console.log(`❌ Could not find post with slug 'future-of-ai-web-development'`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findCorrectPost();