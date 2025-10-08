const PAYLOAD_API_URL = 'http://localhost:3456/api';

async function checkImpressumPage() {
  try {
    console.log('🔍 Checking for Impressum page in database...\n');

    // Query pages with slug 'impressum'
    const url = new URL(`${PAYLOAD_API_URL}/pages`);
    url.searchParams.append('where[slug][equals]', 'impressum');
    
    const response = await fetch(url.toString());
    const data = await response.json();

    console.log('📊 API Response:', JSON.stringify(data, null, 2));

    if (data.docs && data.docs.length > 0) {
      const page = data.docs[0];
      console.log('\n✅ Impressum page found!');
      console.log(`   ID: ${page.id}`);
      console.log(`   Title: ${page.title}`);
      console.log(`   Slug: ${page.slug}`);
      console.log(`   Status: ${page.status}`);
      console.log(`   Created: ${page.createdAt}`);
      console.log(`   Updated: ${page.updatedAt}`);
    } else {
      console.log('\n❌ Impressum page NOT found in database');
      console.log('   Total pages found:', data.totalDocs);
    }

    // Also list all pages to see what exists
    console.log('\n📋 All pages in database:');
    const allPagesResponse = await fetch(`${PAYLOAD_API_URL}/pages`);
    const allPagesData = await allPagesResponse.json();
    allPagesData.docs.forEach(page => {
      console.log(`   - ${page.title} (slug: ${page.slug}, status: ${page.status})`);
    });

  } catch (error) {
    console.error('❌ Error checking page:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

checkImpressumPage();
