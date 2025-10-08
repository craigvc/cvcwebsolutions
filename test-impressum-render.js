const PAYLOAD_API_URL = 'http://localhost:3456/api';

async function testImpressumRender() {
  try {
    console.log('🧪 Testing Impressum page rendering...\n');

    // First, get the page data from API
    console.log('1. Fetching page data from Payload API...');
    const apiUrl = new URL(`${PAYLOAD_API_URL}/pages`);
    apiUrl.searchParams.append('where[slug][equals]', 'impressum');
    
    const apiResponse = await fetch(apiUrl.toString());
    const apiData = await apiResponse.json();

    if (apiData.docs && apiData.docs.length > 0) {
      const page = apiData.docs[0];
      console.log('✓ Page found in database');
      console.log(`  ID: ${page.id}`);
      console.log(`  Title: ${page.title}`);
      console.log(`  Status: ${page.status}`);
      console.log(`  Content type: ${typeof page.content}`);
      console.log(`  Content length: ${page.content?.length || 0} characters`);
      console.log(`  Hero: ${JSON.stringify(page.hero)}`);
      console.log(`  Sections: ${page.sections?.length || 0}`);
    } else {
      console.log('✗ Page not found in database');
      return;
    }

    // Now try to access the actual page URL
    console.log('\n2. Testing page URL accessibility...');
    console.log('   Attempting to fetch http://localhost:3456/impressum');
    
    const pageResponse = await fetch('http://localhost:3456/impressum', {
      headers: {
        'Accept': 'text/html',
      },
    });

    console.log(`   Response status: ${pageResponse.status} ${pageResponse.statusText}`);
    console.log(`   Content-Type: ${pageResponse.headers.get('content-type')}`);

    if (pageResponse.ok) {
      const html = await pageResponse.text();
      console.log(`   Response length: ${html.length} characters`);
      
      // Check if it contains the Impressum content
      if (html.includes('Impressum') || html.includes('TMG')) {
        console.log('✓ Page renders successfully with Impressum content!');
      } else {
        console.log('⚠ Page renders but may not contain expected content');
        console.log('   First 500 characters:', html.substring(0, 500));
      }
    } else {
      const errorText = await pageResponse.text();
      console.log('✗ Page failed to render');
      console.log('   Error:', errorText.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ Error testing page:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testImpressumRender();
