const fetch = require('node-fetch');

async function checkVixen() {
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  const vixen = data.docs.filter(p => p.title.toLowerCase().includes('vixen'));
  
  console.log(`\nVixen Capital Advisors items found: ${vixen.length}\n`);
  
  vixen.forEach(v => {
    console.log(`ID: ${v.id}`);
    console.log(`Title: ${v.title}`);
    console.log(`Long Description Length: ${v.long_description?.length || 0} characters`);
    console.log(`Featured: ${v.featured}`);
    console.log(`URL: ${v.url || 'N/A'}`);
    console.log(`Image URL: ${v.image_url || 'N/A'}`);
    console.log(`Image (upload): ${v.image || 'N/A'}`);
    console.log(`Images Object:`, JSON.stringify(v.images, null, 2));
    console.log('---');
  });
}

checkVixen();
