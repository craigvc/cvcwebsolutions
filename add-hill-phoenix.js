const puppeteer = require('puppeteer');

const addHillPhoenix = async () => {
  console.log('Adding Hill Phoenix portfolio item...\n');
  
  const baseUrl = 'http://localhost:3456';
  const portfolioUrl = 'https://www.hillphoenix.com/';
  
  let browser;
  try {
    // Launch browser to capture screenshot
    console.log('Launching browser to capture screenshot...');
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the website
    console.log('Navigating to Hill Phoenix website...');
    await page.goto(portfolioUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait a bit for any animations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    const screenshotPath = `public/portfolio/hill-phoenix-screenshot.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false 
    });
    console.log(`✓ Screenshot saved to ${screenshotPath}\n`);
    
    await browser.close();
    
    // Create the portfolio item
    const portfolioItem = {
      url: portfolioUrl,
      title: 'Hill Phoenix',
      slug: 'hill-phoenix',
      category: 'Web Applications',
      clientCategory: 'Industrial & Manufacturing',
      description: 'Enterprise web application for commercial refrigeration systems, enabling technicians, engineers, and customers to search and access comprehensive product information, technical specifications, installation guides, and 3D visualizations.',
      year: '2023',
      featured: true,
      status: 'published',
      image_url: `/portfolio/hill-phoenix-screenshot.png`,
      tags: [
        { tag: 'Enterprise Application' },
        { tag: 'Product Catalog' },
        { tag: 'API Integration' },
        { tag: 'ERP Integration' },
        { tag: '3D Visualization' }
      ],
      technologies: [
        { technology: 'React' },
        { technology: 'RESTful APIs' },
        { technology: 'ERP Integration' },
        { technology: 'Advanced Search' },
        { technology: 'Attribute Filtering' },
        { technology: 'Database Optimization' },
        { technology: '3D Viewers' },
        { technology: 'Responsive Design' }
      ],
      achievements: [
        { achievement: 'Built comprehensive product information platform for thousands of commercial refrigeration products' },
        { achievement: 'Integrated seamlessly with ERP system for real-time product data synchronization' },
        { achievement: 'Implemented advanced search and filtering across multiple product attributes' },
        { achievement: 'Developed 3D product visualization capabilities for enhanced user experience' },
        { achievement: 'Created scalable architecture serving technicians, engineers, and customers' },
        { achievement: 'Delivered complete technical documentation and sales literature access' }
      ],
      challenge: 'Hill Phoenix, a subsidiary of Dover Retail Food Company, needed a sophisticated web application to manage and present thousands of commercial refrigeration products with complex technical specifications. The platform had to serve multiple user types (technicians, engineers, customers) while integrating with their ERP system and providing advanced search, filtering, comprehensive documentation, and 3D visualizations.',
      solution: 'We developed an enterprise-grade web application featuring powerful API integration with their ERP system, advanced attribute-based search and filtering, comprehensive product information access (technical specs, installation manuals, sales literature, white papers), interactive 3D product viewers, and a modern responsive interface. The solution streamlined product discovery, reduced support inquiries, and enhanced the customer experience.'
    };
    
    // Send to API
    console.log('Creating portfolio item in CMS...');
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioItem)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✓ Portfolio item created successfully!');
      console.log(`\nTitle: ${result.doc.title}`);
      console.log(`Slug: ${result.doc.slug}`);
      console.log(`Category: ${result.doc.category}`);
      console.log(`Client Category: ${result.doc.clientCategory}`);
      console.log(`Featured: ${result.doc.featured}`);
      console.log(`\nView at: http://localhost:3456/portfolio/${result.doc.slug}`);
    } else {
      const error = await response.text();
      console.error('✗ Failed to create portfolio item');
      console.error('Response:', error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (browser) {
      await browser.close();
    }
  }
};

addHillPhoenix().catch(console.error);
