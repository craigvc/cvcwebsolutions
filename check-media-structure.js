const fetch = require('node-fetch');

async function checkMediaStructure() {
  try {
    const response = await fetch('http://localhost:3456/api/media?limit=5');
    const data = await response.json();

    console.log('Media API Response:');
    console.log(JSON.stringify(data, null, 2));

    if (data.docs && data.docs.length > 0) {
      console.log('\nFirst media record structure:');
      console.log(JSON.stringify(data.docs[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkMediaStructure();