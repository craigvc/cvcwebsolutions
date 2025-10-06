const fetch = require('node-fetch');

async function findItem() {
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  const item = data.docs.find(p => p.title.includes('All Seasons'));
  
  if (item) {
    console.log(`Found: ${item.title}`);
    console.log(`ID: ${item.id}`);
    console.log(`Slug: ${item.slug}`);
    console.log(`URL: ${item.url}`);
  } else {
    console.log('Item not found');
  }
}

findItem();
