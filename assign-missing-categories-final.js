const assignMissingCategories = async () => {
  console.log('Assigning client categories to remaining items...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Mapping for the 3 items without categories
  const assignments = {
    'Conservation Education Platform for Global Conservation Corps': 'Education & Non-Profit',
    'HealthTrack Mobile App': 'Healthcare',
    'Wildlife Conservation Platform': 'Education & Non-Profit'
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      const itemsToUpdate = data.docs.filter(item => 
        (!item.clientCategory || item.clientCategory === 'None') &&
        assignments[item.title]
      );
      
      console.log(`Found ${itemsToUpdate.length} items to update:\n`);
      
      let updatedCount = 0;
      
      for (const item of itemsToUpdate) {
        const newCategory = assignments[item.title];
        
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
            console.log(`✗ Failed to update ${item.title} (Status: ${updateResponse.status})`);
          }
        } catch (error) {
          console.log(`✗ Error updating ${item.title}:`, error.message);
        }
      }
      
      console.log(`\nComplete! Updated ${updatedCount} items.`);
      console.log('\nAll portfolio items now have client categories assigned!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

assignMissingCategories().catch(console.error);
