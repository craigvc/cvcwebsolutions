const fetch = require('node-fetch');

async function deleteHealthTrack() {
  const itemToDelete = {
    id: 2,
    name: 'HealthTrack Mobile App'
  };
  
  console.log(`Deleting: ${itemToDelete.name} (ID: ${itemToDelete.id})`);
  
  try {
    const response = await fetch(`http://localhost:3456/api/portfolio/${itemToDelete.id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log(`✓ Deleted: ${itemToDelete.name}`);
    } else {
      console.error(`✗ Failed to delete: ${response.status}`);
    }
  } catch (error) {
    console.error(`✗ Error:`, error.message);
  }
}

deleteHealthTrack();
