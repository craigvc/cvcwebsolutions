const fetch = require('node-fetch');

async function checkOrder() {
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  console.log('\nChecking portfolio item ordering...\n');
  
  // Sort the same way as the client
  const sorted = [...data.docs].sort((a, b) => {
    // Featured projects come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by published_at date (newest first)
    if (a.published_at && b.published_at) {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
    
    // Fallback to year if published_at not available
    return parseInt(b.year) - parseInt(a.year);
  });
  
  console.log('First 10 items in sorted order:\n');
  sorted.slice(0, 10).forEach((item, i) => {
    console.log(`${i + 1}. ${item.title}`);
    console.log(`   Year: ${item.year}`);
    console.log(`   Published: ${item.published_at || 'Not set'}`);
    console.log(`   Featured: ${item.featured || false}`);
    console.log('');
  });
  
  console.log('\nLast 5 items in sorted order:\n');
  sorted.slice(-5).forEach((item, i) => {
    console.log(`${sorted.length - 4 + i}. ${item.title}`);
    console.log(`   Year: ${item.year}`);
    console.log(`   Published: ${item.published_at || 'Not set'}`);
    console.log(`   Featured: ${item.featured || false}`);
    console.log('');
  });
}

checkOrder();
