const fetch = require('node-fetch');

async function fixVixenScreenshot() {
  const portfolioId = 6;
  const screenshotPath = '/portfolio/vixen-capital-advisors-screenshot.png';
  
  console.log('Updating Vixen Capital Advisors portfolio item with screenshot...');
  
  const updateData = {
    image_url: screenshotPath,
    images: {
      detail: screenshotPath,
      featured: screenshotPath,
      listing: screenshotPath
    }
  };
  
  try {
    const response = await fetch(`http://localhost:3456/api/portfolio/${portfolioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update failed:', response.status, errorText);
      return;
    }
    
    const result = await response.json();
    console.log('\n✓ Successfully updated Vixen Capital Advisors portfolio item');
    console.log('Featured Image:', result.doc?.featuredImage || result.featuredImage || 'Not set');
    console.log('Images Object:', JSON.stringify(result.doc?.images || result.images, null, 2));
  } catch (error) {
    console.error('Error updating portfolio item:', error.message);
  }
}

fixVixenScreenshot();
