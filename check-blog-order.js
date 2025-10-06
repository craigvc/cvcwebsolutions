const fetch = require('node-fetch');

async function checkBlogOrder() {
  try {
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=10&sort=-publishedAt');
    const data = await response.json();
    const posts = data.docs || [];

    console.log('First 3 blog posts (chronological order):');
    posts.slice(0, 3).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${new Date(post.publishedAt).toLocaleDateString()}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBlogOrder();