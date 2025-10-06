const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testSingleUpload() {
  try {
    const imagePath = 'public/images/blog/welcome-to-cvc-web-solutions.jpg';

    if (!fs.existsSync(imagePath)) {
      console.log('❌ Test image not found');
      return;
    }

    console.log('Testing single image upload...');

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('alt', 'Welcome to CVC Web Solutions');

    console.log('Sending request...');

    const response = await fetch('http://localhost:3456/api/media', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });

    console.log(`Response status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Upload failed');
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSingleUpload();