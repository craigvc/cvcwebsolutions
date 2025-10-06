const checkCategories = async () => {
  console.log('Checking portfolio categories usage...\n');
  
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
      
      // Count categories
      const categoryCount = {};
      data.docs.forEach(item => {
        const category = item.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      // Sort by count
      const sorted = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1]);
      
      console.log('Category usage:\n');
      sorted.forEach(([category, count]) => {
        console.log(`${category}: ${count} items`);
      });
      
      console.log('\nTotal unique categories:', sorted.length);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkCategories().catch(console.error);
