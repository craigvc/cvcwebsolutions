const checkPortfolio = async () => {
  console.log('Checking existing portfolio items...\n');
  
  const baseUrl = 'http://localhost:3456';
  
  try {
    // Payload CMS uses the /api/portfolio endpoint (plural) for the collection
    const response = await fetch(`${baseUrl}/api/portfolio`);
    
    if (!response.ok) {
      console.log(`API returned status: ${response.status}`);
      console.log('Response text:', await response.text());
      return;
    }
    
    const data = await response.json();
    
    if (data && data.docs) {
      console.log(`Total portfolio items: ${data.docs.length}\n`);
      
      if (data.docs.length > 0) {
        console.log('Existing portfolio items:');
        data.docs.forEach(item => {
          console.log(`- ${item.title} (slug: ${item.slug})`);
        });
      } else {
        console.log('No portfolio items found.');
      }
    } else {
      console.log('Unexpected response format:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error.message);
  }
};

// Run the check
checkPortfolio().catch(console.error);
