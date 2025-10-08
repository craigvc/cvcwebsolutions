const fetch = require('node-fetch');

async function checkCaseStudies() {
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  console.log('\nChecking case study lengths...\n');
  
  // Filter items with short or missing long_description
  const needsEnhancement = data.docs.filter(item => {
    const length = item.long_description?.length || 0;
    return length < 15000; // Less than 15k characters needs enhancement
  });
  
  console.log(`Found ${needsEnhancement.length} items needing case study enhancement:\n`);
  
  needsEnhancement.forEach((item, i) => {
    console.log(`${i + 1}. ${item.title}`);
    console.log(`   ID: ${item.id}`);
    console.log(`   Current length: ${item.long_description?.length || 0} characters`);
    console.log(`   URL: ${item.url || 'No URL'}`);
    console.log(`   Year: ${item.year}`);
    console.log('');
  });
  
  console.log('\nItems with comprehensive case studies (15k+ chars):\n');
  
  const comprehensive = data.docs.filter(item => {
    const length = item.long_description?.length || 0;
    return length >= 15000;
  });
  
  comprehensive.forEach((item, i) => {
    console.log(`${i + 1}. ${item.title} - ${item.long_description?.length} chars`);
  });
  
  console.log(`\nTotal: ${comprehensive.length} comprehensive, ${needsEnhancement.length} need enhancement`);
}

checkCaseStudies();
