const fetch = require('node-fetch');

async function testPortfolioDisplay() {
  try {
    // Fetch the portfolio page HTML
    const response = await fetch('http://localhost:3000/portfolio');
    const html = await response.text();
    
    // Check for key portfolio items
    const portfolioItems = [
      'HealthTrack Mobile App',
      'E-Commerce Marketplace',
      'Financial Analytics Dashboard',
      'Creative Portfolio Builder',
      'Educational Learning Platform',
      'Smart Home IoT Dashboard'
    ];
    
    console.log('Portfolio Page Test Results:');
    console.log('============================');
    
    let foundCount = 0;
    portfolioItems.forEach(item => {
      if (html.includes(item)) {
        console.log(`✓ Found: ${item}`);
        foundCount++;
      } else {
        console.log(`✗ Missing: ${item}`);
      }
    });
    
    console.log(`\nTotal: ${foundCount}/${portfolioItems.length} portfolio items found`);
    
    // Check for key sections
    const sections = [
      'Featured Projects',
      'More Projects',
      'Our Portfolio',
      'Ready to Start Your Project?'
    ];
    
    console.log('\nSection Check:');
    sections.forEach(section => {
      if (html.includes(section)) {
        console.log(`✓ ${section} section present`);
      } else {
        console.log(`✗ ${section} section missing`);
      }
    });
    
  } catch (error) {
    console.error('Error testing portfolio display:', error);
  }
}

testPortfolioDisplay();
