const fetch = require('node-fetch');

async function debugSlugRouting() {
  try {
    console.log('🔍 Debugging slug routing issue...\n');

    // Test different slug queries to see what's happening
    const testSlugs = [
      'future-of-ai-web-development',
      'welcome-to-cvc',
      'building-scalable-ecommerce'
    ];

    for (const slug of testSlugs) {
      console.log(`--- Testing slug: ${slug} ---`);

      const response = await fetch(`http://localhost:3456/api/blog-posts?where[slug][equals]=${slug}&depth=2`);
      const data = await response.json();

      console.log(`Query: /api/blog-posts?where[slug][equals]=${slug}`);
      console.log(`Results found: ${data.docs?.length || 0}`);

      if (data.docs && data.docs.length > 0) {
        const post = data.docs[0];
        console.log(`Returned post: "${post.title}" (slug: ${post.slug})`);
        console.log(`Match: ${post.slug === slug ? '✅ CORRECT' : '❌ MISMATCH'}`);
      } else {
        console.log('❌ No posts found');
      }
      console.log('');
    }

    // Also check if there are duplicate slugs
    console.log('--- Checking for duplicate slugs ---');
    const allPostsResponse = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    const allPostsData = await allPostsResponse.json();

    const slugCounts = {};
    allPostsData.docs.forEach(post => {
      slugCounts[post.slug] = (slugCounts[post.slug] || 0) + 1;
    });

    console.log('Slug usage:');
    Object.entries(slugCounts).forEach(([slug, count]) => {
      console.log(`  ${slug}: ${count} ${count > 1 ? '❌ DUPLICATE!' : '✅'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSlugRouting();