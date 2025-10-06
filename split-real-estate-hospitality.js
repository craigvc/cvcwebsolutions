const splitRealEstateHospitality = async () => {
  console.log('Splitting Real Estate & Hospitality into separate categories...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Items to move from "Real Estate & Hospitality" to "Travel & Tourism"
  const travelItems = [
    'Vumba',
    'Rancho Las Cascadas',
    'Caribbean-Wedding.com',
    'Honeymoons Inc'
  ];
  
  // Items to keep as "Real Estate"
  const realEstateItems = [
    'Urban Marco',
    'Seattle Condo Review'
  ];
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      let updatedCount = 0;
      
      // Update travel items
      for (const item of data.docs) {
        if (item.clientCategory === 'Real Estate & Hospitality') {
          let newCategory = null;
          
          if (travelItems.includes(item.title)) {
            newCategory = 'Travel & Tourism';
          } else if (realEstateItems.includes(item.title)) {
            newCategory = 'Real Estate';
          }
          
          if (newCategory) {
            try {
              const updateResponse = await fetch(`${baseUrl}/api/portfolio/${item.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  clientCategory: newCategory
                })
              });
              
              if (updateResponse.ok) {
                console.log(`✓ ${item.title} → ${newCategory}`);
                updatedCount++;
              } else {
                console.log(`✗ Failed to update ${item.title}`);
              }
            } catch (error) {
              console.log(`✗ Error updating ${item.title}:`, error.message);
            }
          }
        }
      }
      
      console.log(`\nComplete! Updated ${updatedCount} items.`);
      console.log('\nNew category structure:');
      console.log('- Professional Services');
      console.log('- Education & Non-Profit');
      console.log('- Healthcare');
      console.log('- Real Estate (2 items)');
      console.log('- Travel & Tourism (4 items)');
      console.log('- Industrial & Manufacturing');
      console.log('- Financial Services');
      console.log('- Arts & Media');
      console.log('- Home & Consumer Services');
      console.log('\nTotal: 9 categories');
      console.log('\nNote: Do you have any Leisure & Sport items to add?');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

splitRealEstateHospitality().catch(console.error);
