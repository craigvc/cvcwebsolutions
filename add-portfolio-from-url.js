const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3456';

// Portfolio sites to add
const SITES = [
  {
    url: 'https://www.duilady.com/',
    title: 'DUI Lady',
    clientCategory: 'Legal Services',
    year: '2024'
  }
];

async function captureScreenshot(url, filename) {
  try {
    console.log(`📸 Capturing screenshot of ${url}...`);
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport for desktop screenshot
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait a bit for any animations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    const screenshotPath = path.join('public', 'portfolio', filename);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false 
    });
    
    await browser.close();
    console.log(`✅ Screenshot saved to ${screenshotPath}`);
    return `/portfolio/${filename}`;
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error);
    return '';
  }
}

async function generatePortfolioContent(siteInfo) {
  const { url, title, clientCategory, year } = siteInfo;
  
  // Generate slug from title
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Create portfolio data based on the site
  const portfolioData = {
    title: title,
    subtitle: `Professional WordPress website for ${clientCategory.toLowerCase()} firm`,
    description: `We developed a professional WordPress website for ${title}, creating a strong online presence that effectively communicates their ${clientCategory.toLowerCase()} expertise and attracts new clients through strategic design and SEO optimization.`,
    slug: slug,
    category: "Web Development",
    clientCategory: clientCategory,
    url: url,
    live_url: url,
    year: year,
    status: "published",
    featured: false,
    display_order: 20,
    
    long_description: `
      <h2>The Challenge</h2>
      <p>${title} needed a professional website that would effectively communicate their expertise in ${clientCategory.toLowerCase()} while building trust with potential clients. They required a platform that would not only showcase their services but also provide valuable resources and easy ways for clients to get in touch.</p>
      
      <h3>Project Goals</h3>
      <p>We set out to create a WordPress website that would:</p>
      <ul>
        <li>Establish immediate trust and credibility with visitors</li>
        <li>Clearly communicate their ${clientCategory.toLowerCase()} services and expertise</li>
        <li>Provide easy-to-use contact and consultation booking systems</li>
        <li>Optimize for local SEO to attract clients in their service area</li>
        <li>Ensure mobile responsiveness for users on all devices</li>
      </ul>
      
      <h3>Our Approach</h3>
      <p>We developed a custom <strong>WordPress</strong> solution tailored specifically for ${title}'s needs. The website features a professional design that instills confidence, streamlined navigation for easy access to information, and strategic call-to-action placement to maximize conversions.</p>
      <p>Key implementations included:</p>
      <ul>
        <li>Custom WordPress theme designed for ${clientCategory.toLowerCase()} professionals</li>
        <li>Mobile-first responsive design ensuring perfect display on all devices</li>
        <li>SEO optimization including schema markup for local search</li>
        <li>Secure contact forms with appointment scheduling capabilities</li>
        <li>Content management system for easy updates and blog posting</li>
        <li>Performance optimization for fast page load times</li>
      </ul>
      
      <h3>The Results</h3>
      <p>The new WordPress website has successfully established ${title}'s professional online presence. The site effectively communicates their expertise, builds trust with potential clients, and has become a powerful tool for generating leads and growing their practice.</p>
    `,
    
    achievements: [
      { achievement: `Built a professional WordPress website that establishes ${title} as a trusted authority in ${clientCategory.toLowerCase()}` },
      { achievement: "Implemented responsive design ensuring excellent user experience across all devices" },
      { achievement: "Created SEO-optimized structure improving local search visibility and rankings" },
      { achievement: "Developed intuitive navigation and contact systems increasing client inquiries" },
      { achievement: "Established a scalable platform allowing for easy content updates and growth" }
    ],
    
    technologies: [
      { technology: "WordPress" },
      { technology: "PHP" },
      { technology: "MySQL" },
      { technology: "JavaScript" },
      { technology: "HTML5" },
      { technology: "CSS3" },
      { technology: "Elementor" },
      { technology: "Contact Form 7" },
      { technology: "Yoast SEO" },
      { technology: "SSL Security" },
      { technology: "Google Analytics" },
      { technology: "Mobile Optimization" }
    ],
    
    tags: [
      { tag: "WordPress" },
      { tag: clientCategory },
      { tag: "Web Development" }
    ],
    
    images: {
      detail: "",
      featured: "",
      listing: ""
    },
    
    imageSettings: {
      detail: { x: 0, y: 0, scale: 1 },
      featured: { x: 0, y: 0, scale: 1 },
      listing: { x: 0, y: 0, scale: 1 }
    }
  };
  
  // Capture screenshot if puppeteer is available
  try {
    const screenshotFilename = `${slug}-screenshot.png`;
    const screenshotPath = await captureScreenshot(url, screenshotFilename);
    if (screenshotPath) {
      portfolioData.images.detail = screenshotPath;
      portfolioData.images.featured = screenshotPath;
      portfolioData.images.listing = screenshotPath;
    }
  } catch (error) {
    console.log('⚠️ Puppeteer not installed. Skipping screenshot capture.');
    console.log('To enable screenshots, run: npm install puppeteer');
  }
  
  return portfolioData;
}

async function createPortfolioItem(portfolioData) {
  try {
    console.log('📝 Creating portfolio item for:', portfolioData.title);
    
    const response = await fetch(`${BASE_URL}/api/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create portfolio item: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Portfolio item created successfully!');
    console.log('   ID:', result.id);
    console.log('   Slug:', result.slug);
    console.log('   View at:', `${BASE_URL}/portfolio/${result.slug}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating portfolio item:', error);
    throw error;
  }
}

async function processAllSites() {
  console.log('🚀 Starting portfolio item creation...\n');
  
  for (const site of SITES) {
    try {
      console.log(`\n📋 Processing ${site.title}...`);
      console.log('   URL:', site.url);
      
      // Generate portfolio content
      const portfolioData = await generatePortfolioContent(site);
      
      // Create the portfolio item
      await createPortfolioItem(portfolioData);
      
      console.log(`✨ ${site.title} added successfully!\n`);
    } catch (error) {
      console.error(`❌ Failed to process ${site.title}:`, error.message);
    }
  }
  
  console.log('\n🎉 All done! Portfolio items have been processed.');
}

// Check if we have a URL argument
const urlArg = process.argv[2];
if (urlArg) {
  // Process single URL from command line
  const titleArg = process.argv[3] || 'Website';
  const categoryArg = process.argv[4] || 'Business';
  const yearArg = process.argv[5] || new Date().getFullYear().toString();
  
  SITES.length = 0;
  SITES.push({
    url: urlArg,
    title: titleArg,
    clientCategory: categoryArg,
    year: yearArg
  });
  
  console.log(`\n📌 Processing custom site: ${titleArg}`);
}

// Execute the script
processAllSites().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
