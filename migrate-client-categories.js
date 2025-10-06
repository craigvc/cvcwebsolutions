const migrateClientCategories = async () => {
  console.log('Consolidating client categories...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  // Comprehensive consolidation mapping
  const categoryMapping = {
    // Healthcare consolidation
    'Healthcare': 'Healthcare',
    'Healthcare Technology': 'Healthcare',
    'Healthcare Analytics': 'Healthcare',
    'Healthcare Franchise': 'Healthcare',
    'Clinigence Health': 'Healthcare',
    
    // Financial consolidation
    'Financial Services': 'Financial Services',
    'Financial Technology': 'Financial Services',
    'Financial Support Services': 'Financial Services',
    
    // Non-Profit & Education consolidation
    'Non-Profit': 'Non-Profit & Education',
    'Non-Profit Consulting': 'Non-Profit & Education',
    'Education': 'Non-Profit & Education',
    'Education & Training': 'Non-Profit & Education',
    
    // Professional Services consolidation
    'Business Consulting': 'Professional Services',
    'Legal Services': 'Professional Services',
    'Engineering Services': 'Professional Services',
    'Technology Services': 'Professional Services',
    'Global Consulting': 'Professional Services',
    'Diversity & Inclusion': 'Professional Services',
    
    // Arts & Entertainment consolidation
    'Arts & Theatre': 'Arts & Entertainment',
    'Arts & Entertainment': 'Arts & Entertainment',
    
    // Travel & Hospitality consolidation
    'Travel & Events': 'Travel & Hospitality',
    'Travel & Tourism': 'Travel & Hospitality',
    'Hospitality': 'Travel & Hospitality',
    'Media & Travel': 'Travel & Hospitality',
    
    // Manufacturing & Industrial consolidation
    'Chemical Manufacturing': 'Manufacturing & Industrial',
    'Industrial Services': 'Manufacturing & Industrial',
    
    // Keep as-is categories
    'Home Services': 'Home Services',
    'Real Estate': 'Real Estate',
    'Energy & Utilities': 'Energy & Utilities',
    'Transportation': 'Transportation',
    'Marketing & PR': 'Marketing & Communications',
    'Safety & Security': 'Safety & Security',
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items: ${data.docs.length}\n`);
      
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
      
      console.log(`Found ${changes.length} items to update:\n`);
      
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
      console.log('Executing updates...\n');
      
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
      
      console.log(`\nMigration complete! Updated ${migratedCount} items.`);
      console.log('\nNew category structure:');
      console.log('- Healthcare');
      console.log('- Financial Services');
      console.log('- Non-Profit & Education');
      console.log('- Professional Services');
      console.log('- Arts & Entertainment');
      console.log('- Travel & Hospitality');
      console.log('- Manufacturing & Industrial');
      console.log('- Home Services');
      console.log('- Real Estate');
      console.log('- Energy & Utilities');
      console.log('- Transportation');
      console.log('- Marketing & Communications');
      console.log('- Safety & Security');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

migrateClientCategories().catch(console.error);
