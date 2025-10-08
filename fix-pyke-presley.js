const fetch = require('node-fetch');

async function fixPykePresley() {
  console.log('Fetching portfolio items...\n');
  
  try {
    // Get all portfolio items
    const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
    const data = await response.json();
    
    // Find both Pyke Presley items
    const pykePresleyAI = data.docs.find(item => item.slug === 'pyke-presley-law-ai');
    const pykePresley = data.docs.find(item => item.slug === 'pyke-presley-law');
    
    if (!pykePresleyAI) {
      console.error('✗ Could not find "Pyke Presley Law AI"');
      return;
    }
    
    if (!pykePresley) {
      console.error('✗ Could not find "Pyke Presley Law"');
      return;
    }
    
    console.log(`Found "Pyke Presley Law AI" (ID: ${pykePresleyAI.id})`);
    console.log(`Found "Pyke Presley Law" (ID: ${pykePresley.id})\n`);
    
    // Step 1: Delete the non-AI version
    console.log('Step 1: Deleting "Pyke Presley Law"...');
    const deleteResponse = await fetch(`http://localhost:3456/api/portfolio/${pykePresley.id}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log('✓ Deleted "Pyke Presley Law"\n');
    } else {
      console.error(`✗ Failed to delete: ${deleteResponse.status}`);
      return;
    }
    
    // Step 2: Rename the AI version to "Pyke Presley Law"
    console.log('Step 2: Renaming "Pyke Presley Law AI" to "Pyke Presley Law"...');
    const updateResponse = await fetch(`http://localhost:3456/api/portfolio/${pykePresleyAI.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Pyke Presley Law',
        slug: 'pyke-presley-law'
      })
    });
    
    if (updateResponse.ok) {
      console.log('✓ Renamed to "Pyke Presley Law"\n');
      console.log('✓ All changes completed successfully!');
    } else {
      const errorText = await updateResponse.text();
      console.error(`✗ Failed to rename: ${updateResponse.status}`);
      console.error(errorText);
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

fixPykePresley();
