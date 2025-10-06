const fetch = require('node-fetch');

async function testPayloadQuery() {
  try {
    console.log('🔍 Testing different Payload query approaches...\n');

    // Test 1: Basic query without filters
    console.log('--- Test 1: Basic query ---');
    let response = await fetch('http://localhost:3456/api/blog-posts?limit=3');
    let data = await response.json();
    console.log(`Results: ${data.docs?.length || 0}`);
    if (data.docs) {
      data.docs.forEach((post, i) => {
        console.log(`  ${i + 1}. ${post.title} (${post.slug})`);
      });
    }

    // Test 2: Try different filter syntax
    console.log('\n--- Test 2: Alternative filter syntax ---');
    const testSlug = 'welcome-to-cvc';

    // Try URL encoding
    const encodedQuery = encodeURIComponent(`{"slug": {"equals": "${testSlug}"}}`);
    response = await fetch(`http://localhost:3456/api/blog-posts?where=${encodedQuery}`);
    data = await response.json();
    console.log(`URL encoded where clause results: ${data.docs?.length || 0}`);

    // Test 3: Check if slug field exists in responses
    console.log('\n--- Test 3: Checking slug field ---');
    response = await fetch('http://localhost:3456/api/blog-posts?limit=1');
    data = await response.json();
    if (data.docs && data.docs[0]) {
      console.log('First post fields:', Object.keys(data.docs[0]));
      console.log('Slug value:', data.docs[0].slug);
      console.log('Slug type:', typeof data.docs[0].slug);
    }

    // Test 4: Try finding by ID instead
    console.log('\n--- Test 4: Get specific post by ID ---');
    const postId = '2'; // The Future of AI post should be ID 2
    response = await fetch(`http://localhost:3456/api/blog-posts/${postId}`);
    data = await response.json();
    if (data.doc) {
      console.log(`Post ID ${postId}: "${data.doc.title}" (slug: ${data.doc.slug})`);
    } else {
      console.log(`❌ No post found with ID ${postId}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPayloadQuery();