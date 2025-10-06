const fetch = require('node-fetch');

async function findItems() {
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  const searchTerms = ['health track', 'wildlife conservation', 'floco2'];
  
  console.log('\nSearching for items to delete...\n');
  
  searchTerms.forEach(term => {
    const matches = data.docs.filter(p => 
      p.title.toLowerCase().includes(term.toLowerCase())
    );
    
    if (matches.length > 0) {
      console.log(`\n"${term}" matches:`);
      matches.forEach(m => {
        console.log(`  ID: ${m.id} - ${m.title}`);
      });
    } else {
      console.log(`\n"${term}" - No matches found`);
    }
  });
}

findItems();
