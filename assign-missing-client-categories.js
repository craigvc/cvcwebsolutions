const assignMissingClientCategories = async () => {
  console.log('Assigning client categories to items without one...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      const itemsWithoutCategory = data.docs.filter(item => 
        !item.clientCategory || item.clientCategory === 'None'
      );
      
      console.log(`Found ${itemsWithoutCategory.length} items without client categories:\n`);
      
      itemsWithoutCategory.forEach(item => {
        console.log(`- ${item.title} (${item.category})`);
      });
      
      // You'll need to manually review these and assign appropriate categories
      // For now, let's show what we found
      console.log('\nPlease review these items and assign appropriate client industry categories.');
      console.log('\nAvailable client categories:');
      console.log('1. Healthcare');
      console.log('2. Financial Services');
      console.log('3. Professional Services');
      console.log('4. Education & Non-Profit');
      console.log('5. Real Estate & Hospitality');
      console.log('6. Home & Consumer Services');
      console.log('7. Industrial & Manufacturing');
      console.log('8. Arts & Media');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

assignMissingClientCategories().catch(console.error);
