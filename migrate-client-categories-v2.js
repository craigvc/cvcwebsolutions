const migrateClientCategories = async () => {
  console.log('Further consolidating client categories to 8...\\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Ultra-simplified consolidation mapping (13 → 8 categories)
  const categoryMapping = {
    // Keep as-is (4 categories)
    'Healthcare': 'Healthcare',
    'Financial Services': 'Financial Services',
    'Professional Services': 'Professional Services',
    'Non-Profit & Education': 'Education & Non-Profit',
    
    // Consolidate Consumer/Hospitality (2 categories into 2)
    'Real Estate': 'Real Estate & Hospitality',
    'Travel & Hospitality': 'Real Estate & Hospitality',
    'Home Services': 'Home & Consumer Services',
    
    // Consolidate Industrial (4 categories into 1)
    'Manufacturing & Industrial': 'Industrial & Manufacturing',
    'Energy & Utilities': 'Industrial & Manufacturing',
    'Transportation': 'Industrial & Manufacturing',
    'Safety & Security': 'Industrial & Manufacturing',
    
    // Consolidate Creative (2 categories into 1)
    'Arts & Entertainment': 'Arts & Media',
    'Marketing & Communications': 'Arts & Media',
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items: ${data.docs.length}\\n`);
      
      let migratedCount = 0;
      const changes = [];
      
      for (const item of data.docs) {
        const oldCategory = item.clientCategory;
        
        if (!oldCategory || oldCategory === 'None') {
          continue;
        }
        
        const newCategory = categoryMapping[oldCategory];
        
        if (newCategory && oldCategory !== newCategory) {
          changes.push({
            id: item.id,
            title: item.title,
            oldCategory,
            newCategory
          });
        }
      }
      
      console.log(`Found ${changes.length} items to update:\\n`);
      
      // Show preview
      const categoryChanges = {};
      changes.forEach(change => {
        const key = `${change.oldCategory} → ${change.newCategory}`;
        if (!categoryChanges[key]) {
          categoryChanges[key] = [];
        }
        categoryChanges[key].push(change.title);
      });
      
      Object.entries(categoryChanges).forEach(([change, items]) => {
        console.log(`${change}:`);
        items.forEach(title => console.log(`  - ${title}`));
        console.log('');
      });
      
      // Execute updates
      console.log('Executing updates...\\n');
      
      for (const change of changes) {
        try {
          const updateResponse = await fetch(`${baseUrl}/api/portfolio/${change.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientCategory: change.newCategory
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✓ ${change.title}`);
            migratedCount++;
          } else {
            console.log(`✗ Failed to update ${change.title} (Status: ${updateResponse.status})`);
          }
        } catch (error) {
          console.log(`✗ Error updating ${change.title}:`, error.message);
        }
      }
      
      console.log(`\\nMigration complete! Updated ${migratedCount} items.`);
      console.log('\\n🎯 Final 8 Client Industry Categories:');
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

migrateClientCategories().catch(console.error);
