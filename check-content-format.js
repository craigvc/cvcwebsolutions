const PAYLOAD_API_URL = 'http://localhost:3456/api';

async function checkContentFormat() {
  try {
    console.log('🔍 Checking Impressum content format...\n');

    const url = new URL(`${PAYLOAD_API_URL}/pages`);
    url.searchParams.append('where[slug][equals]', 'impressum');
    
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.docs && data.docs.length > 0) {
      const page = data.docs[0];
      console.log('Page content preview:');
      console.log('Type:', typeof page.content);
      console.log('Length:', page.content?.length || 0);
      console.log('\nFirst 500 characters:');
      console.log(page.content?.substring(0, 500));
      console.log('\n\nIs it HTML?', page.content?.includes('<'));
      console.log('Is it JSON?', page.content?.startsWith('{') || page.content?.startsWith('['));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkContentFormat();
