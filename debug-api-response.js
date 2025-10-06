// Let's test different sorting approaches to see what works

async function testSortingOptions() {
  const baseUrl = 'http://localhost:3456/api/blog-posts?where[status][equals]=published';

  const testCases = [
    { name: 'No sorting', url: baseUrl },
    { name: 'Sort -publishedAt', url: `${baseUrl}&sort=-publishedAt` },
    { name: 'Sort publishedAt desc', url: `${baseUrl}&sort=publishedAt&order=desc` },
    { name: 'Sort -createdAt', url: `${baseUrl}&sort=-createdAt` },
    { name: 'Sort -updatedAt', url: `${baseUrl}&sort=-updatedAt` }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing: ${testCase.name} ---`);
      console.log(`URL: ${testCase.url}`);

      const response = await fetch(testCase.url);
      if (!response.ok) {
        console.log(`❌ Failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const posts = data.docs || [];

      console.log(`✅ Success: ${posts.length} posts returned`);

      if (posts.length > 0) {
        console.log('Post order:');
        posts.forEach((post, index) => {
          const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString();
          console.log(`  ${index + 1}. ${post.title.substring(0, 50)}... (${date})`);
        });
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

if (typeof fetch === 'undefined') {
  // For Node.js environment
  global.fetch = require('node-fetch');
}

testSortingOptions();