const fetch = require('node-fetch');

async function checkAllPosts() {
  try {
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    const data = await response.json();
    const posts = data.docs || [];

    console.log('All blog posts in database:');
    console.log('================================');

    posts.forEach((post, i) => {
      console.log(`${i + 1}. Title: ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Published: ${new Date(post.publishedAt).toLocaleDateString()}`);
      console.log(`   Excerpt: ${post.excerpt?.substring(0, 100)}...`);
      console.log('');
    });

    // Check which ones are published
    const published = posts.filter(p => p.status === 'published');
    console.log(`\nPublished posts: ${published.length}`);
    console.log(`Total posts: ${posts.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAllPosts();