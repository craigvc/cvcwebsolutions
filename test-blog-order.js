const fetch = require('node-fetch');

async function testBlogOrder() {
  try {
    console.log('Testing blog post ordering...');

    // Test the API directly
    const response = await fetch('http://localhost:3456/api/blog-posts?where[status][equals]=published&sort=-publishedAt');

    if (!response.ok) {
      console.error('API request failed:', response.status);
      return;
    }

    const data = await response.json();
    const posts = data.docs || [];

    console.log('\nBlog posts in order:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Published: ${post.publishedAt}`);
      console.log(`   Date: ${new Date(post.publishedAt).toLocaleDateString()}`);
      console.log('');
    });

    // Check if sorting is working
    let isSorted = true;
    for (let i = 1; i < posts.length; i++) {
      const prevDate = new Date(posts[i-1].publishedAt);
      const currDate = new Date(posts[i].publishedAt);
      if (prevDate < currDate) {
        isSorted = false;
        console.log(`❌ Sort issue: ${posts[i-1].title} (${prevDate}) should come after ${posts[i].title} (${currDate})`);
      }
    }

    if (isSorted && posts.length > 0) {
      console.log('✅ Posts are correctly sorted by date (newest first)');
    } else if (posts.length === 0) {
      console.log('⚠️ No posts found');
    }

  } catch (error) {
    console.error('Error testing blog order:', error.message);
  }
}

testBlogOrder();