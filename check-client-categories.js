const checkClientCategories = async () => {
  console.log('Checking client categories usage...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items: ${data.docs.length}\n`);
      
      // Count client categories
      const clientCategoryCount = {};
      const itemsByCategory = {};
      
      data.docs.forEach(item => {
        const clientCategory = item.clientCategory || 'None';
        clientCategoryCount[clientCategory] = (clientCategoryCount[clientCategory] || 0) + 1;
        
        if (!itemsByCategory[clientCategory]) {
          itemsByCategory[clientCategory] = [];
        }
        itemsByCategory[clientCategory].push(item.title);
      });
      
      // Sort by count
      const sorted = Object.entries(clientCategoryCount)
        .sort((a, b) => b[1] - a[1]);
      
      console.log('Client Category usage:\n');
      sorted.forEach(([category, count]) => {
        console.log(`${category}: ${count} items`);
        if (category !== 'None') {
          itemsByCategory[category].forEach(title => {
            console.log(`  - ${title}`);
          });
          console.log('');
        }
      });
      
      console.log(`Total unique client categories: ${sorted.length}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkClientCategories().catch(console.error);
