const migrateCategories = async () => {
  console.log('Migrating portfolio categories...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Category mapping: old -> new
  const categoryMapping = {
    'Web Development': 'Websites',
    'Mobile Apps': 'Mobile Apps',
    'E-Commerce': 'E-Commerce',
    'Education & Nonprofit': 'Websites',
    'Healthcare': 'Web Applications',
    'Business & Consulting': 'Websites',
    'Arts & Creative': 'Websites',
    'Financial Services': 'Web Applications'
  };
  
  try {
    // Fetch all portfolio items
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items: ${data.docs.length}\n`);
      
      let migratedCount = 0;
      
      for (const item of data.docs) {
        const oldCategory = item.category;
        const newCategory = categoryMapping[oldCategory] || 'Websites';
        
        if (oldCategory !== newCategory) {
          try {
            const updateResponse = await fetch(`${baseUrl}/api/portfolio/${item.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                category: newCategory
              })
            });
            
            if (updateResponse.ok) {
              console.log(`✓ ${item.title}: "${oldCategory}" → "${newCategory}"`);
              migratedCount++;
            } else {
              console.log(`✗ Failed to update ${item.title} (Status: ${updateResponse.status})`);
            }
          } catch (error) {
            console.log(`✗ Error updating ${item.title}:`, error.message);
          }
        }
      }
      
      console.log(`\nMigration complete! Updated ${migratedCount} items.`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

migrateCategories().catch(console.error);
