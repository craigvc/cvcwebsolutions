const deletePortfolioItems = async () => {
  console.log('Deleting specified portfolio items...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Items to delete (by title or slug pattern)
  const itemsToDelete = [
    'e-commerce marketplace',
    'financial analytics dashboard',
    'cvc web solutions test',
    'dui lady with screenshot',
    'dui lady ai enhanced',
    'dui-lady'
  ];
  
  try {
    // First, fetch all portfolio items
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      console.log('Response text:', await response.text());
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items found: ${data.docs.length}\n`);
      
      // Find items to delete
      const toDelete = data.docs.filter(item => {
        const titleLower = (item.title || '').toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();
        
        return itemsToDelete.some(searchTerm => 
          titleLower.includes(searchTerm.toLowerCase()) || 
          slugLower.includes(searchTerm.toLowerCase())
        );
      });
      
      console.log(`Found ${toDelete.length} items to delete:\n`);
      toDelete.forEach(item => {
        console.log(`- ${item.title} (ID: ${item.id}, slug: ${item.slug})`);
      });
      
      // Delete each item
      if (toDelete.length > 0) {
        console.log('\nDeleting items...\n');
        
        for (const item of toDelete) {
          try {
            const deleteResponse = await fetch(`${baseUrl}/api/portfolio/${item.id}`, {
              method: 'DELETE'
            });
            
            if (deleteResponse.ok) {
              console.log(`✓ Deleted: ${item.title}`);
            } else {
              console.log(`✗ Failed to delete: ${item.title} (Status: ${deleteResponse.status})`);
            }
          } catch (error) {
            console.log(`✗ Error deleting ${item.title}:`, error.message);
          }
        }
        
        console.log('\nDeletion complete!');
      } else {
        console.log('\nNo matching items found to delete.');
      }
    } else {
      console.log('Unexpected response format:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the deletion
deletePortfolioItems().catch(console.error);
