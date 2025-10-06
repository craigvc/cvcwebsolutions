const fetch = require('node-fetch');

async function deleteItems() {
  const itemsToDelete = [
    { id: 1, name: 'Wildlife Conservation Platform' },
    { id: 50, name: 'FloCO2' }
  ];
  
  console.log('Deleting unwanted portfolio items...\n');
  
  for (const item of itemsToDelete) {
    try {
      const response = await fetch(`http://localhost:3456/api/portfolio/${item.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log(`✓ Deleted: ${item.name} (ID: ${item.id})`);
      } else {
        console.error(`✗ Failed to delete ${item.name} (ID: ${item.id}): ${response.status}`);
      }
    } catch (error) {
      console.error(`✗ Error deleting ${item.name}:`, error.message);
    }
  }
  
  console.log('\nDeletion complete.');
}

deleteItems();
