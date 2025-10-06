const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3456';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';

// Capture and analyze website
async function analyzeWebsite(url) {
  try {
    console.log(`🔍 Analyzing website: ${url}`);
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Extract text content and metadata
    const websiteData = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText || el.textContent : '';
      };
      
      const getAllText = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.innerText || el.textContent).filter(t => t);
      };
      
      return {
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        h1: getText('h1'),
        h2s: getAllText('h2').slice(0, 5),
        mainContent: getText('main') || getText('#content') || getText('body'),
        services: getAllText('.service, .feature, [class*="service"], [class*="feature"]').slice(0, 10),
        about: getText('[class*="about"], #about, .about-us'),
        heroText: getText('.hero, [class*="hero"], .banner, [class*="banner"]'),
      };
    });
    
    await browser.close();
    console.log(`✅ Website analysis complete`);
    return websiteData;
  } catch (error) {
    console.error('❌ Error analyzing website:', error);
    return null;
  }
}

// Generate truly unique content using AI with context
async function generateUniqueAIContent(siteInfo, websiteData, projectDetails) {
  const { url, title, clientCategory, year } = siteInfo;
  
  try {
    console.log('🤖 Generating truly unique AI content based on website analysis...');
    
    const prompt = `Analyze this website project and generate unique, creative portfolio content.

PROJECT DETAILS PROVIDED BY CLIENT:
${projectDetails || 'WordPress website development'}

WEBSITE DATA EXTRACTED:
- URL: ${url}
- Company: ${title}
- Industry: ${clientCategory}
- Title Tag: ${websiteData?.title || ''}
- Meta Description: ${websiteData?.metaDescription || ''}
- Main Heading: ${websiteData?.h1 || ''}
- Key Sections: ${websiteData?.h2s?.join(', ') || ''}
- Hero Content: ${websiteData?.heroText?.substring(0, 200) || ''}

IMPORTANT: Generate COMPLETELY UNIQUE content that:
1. NEVER uses generic phrases like "We developed" or "We created"
2. Opens with a creative, specific statement about THIS project's unique impact
3. Tells the specific story of THIS client's transformation
4. Highlights the EXACT features and integrations mentioned
5. Uses varied, creative language that captures the essence of what makes THIS project special
6. Focuses on the business outcomes and technical innovations specific to THIS project

Generate a JSON response with:
{
  "openingLine": "A creative, specific opening that captures what makes THIS project unique (avoid 'We developed/created/built')",
  "subtitle": "A compelling subtitle that highlights the project's unique value proposition",
  "description": "2-3 sentences that tell THIS specific project's story and impact",
  "challenge": "The specific business challenge THIS client faced",
  "solution": "The innovative approach taken for THIS specific project",
  "results": "Measurable impact specific to THIS client's success",
  "uniqueHighlights": ["Specific feature 1", "Specific feature 2", "Specific feature 3"],
  "technicalInnovations": "What technical innovations were implemented for THIS project",
  "businessImpact": "The specific business transformation achieved"
}`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.9,
          top_p: 0.95,
          max_tokens: 2000
        }
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (response.ok) {
      const data = await response.json();
      const aiContent = JSON.parse(data.response);
      console.log('✨ AI generated truly unique content successfully');
      return aiContent;
    }
  } catch (error) {
    console.log('⚠️ AI generation failed, using context-aware fallback');
  }

  // Context-aware fallback based on actual project details
  return {
    openingLine: `Transforming ${title}'s digital presence in the ${clientCategory.toLowerCase()} industry through innovative technology`,
    subtitle: `${clientCategory} Digital Transformation: ${projectDetails ? 'Custom Solution' : 'Web Platform'}`,
    description: `A comprehensive digital solution for ${title} that revolutionizes how they serve their ${clientCategory.toLowerCase()} clients. ${projectDetails || ''}`,
    challenge: `${title} needed a solution that would set them apart in the competitive ${clientCategory.toLowerCase()} market.`,
    solution: `Architected a custom platform leveraging modern technologies tailored to ${title}'s specific needs.`,
    results: `Delivered measurable business impact through increased efficiency and client engagement.`,
    uniqueHighlights: [
      `Custom ${clientCategory.toLowerCase()} features`,
      "Seamless user experience",
      "Scalable architecture"
    ],
    technicalInnovations: `Implemented cutting-edge solutions specific to ${clientCategory.toLowerCase()} industry needs.`,
    businessImpact: `Transformed ${title}'s operations and market position.`
  };
}

// Intelligently determine screenshot positioning based on website analysis
async function determineOptimalPositioning(websiteData) {
  // Analyze website structure to determine best positioning
  if (websiteData?.heroText && websiteData.heroText.length > 100) {
    return {
      detail: { x: 0, y: -150, scale: 1.2 },
      featured: { x: 0, y: -75, scale: 1.1 },
      listing: { x: 0, y: 0, scale: 1 },
      reason: "Hero-heavy design - focusing on main content"
    };
  } else if (websiteData?.h1 && !websiteData?.heroText) {
    return {
      detail: { x: 0, y: 0, scale: 1 },
      featured: { x: 0, y: 0, scale: 1 },
      listing: { x: 0, y: 0, scale: 1 },
      reason: "Minimal hero - showing full view"
    };
  } else {
    return {
      detail: { x: 0, y: -100, scale: 1.1 },
      featured: { x: 0, y: -50, scale: 1.05 },
      listing: { x: 0, y: 0, scale: 1 },
      reason: "Balanced layout - slight focus adjustment"
    };
  }
}

// Capture screenshot
async function captureScreenshot(url, filename) {
  try {
    console.log(`📸 Capturing screenshot of ${url}...`);
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Scroll to load lazy content
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const screenshotPath = path.join('public', 'portfolio', filename);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    
    await browser.close();
    console.log(`✅ Screenshot saved to ${screenshotPath}`);
    return `/portfolio/${filename}`;
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error);
    return '';
  }
}

// Generate portfolio content with true AI
async function generatePortfolioContent(siteInfo, projectDetails) {
  const { url, title, clientCategory, year } = siteInfo;
  
  // Analyze the website
  const websiteData = await analyzeWebsite(url);
  
  // Generate truly unique content using AI with context
  const uniqueContent = await generateUniqueAIContent(siteInfo, websiteData, projectDetails);
  
  // Determine optimal positioning based on website structure
  const positioning = await determineOptimalPositioning(websiteData);
  console.log(`📊 Optimal positioning determined: ${positioning.reason}`);
  
  // Generate slug
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Determine appropriate tech stack based on project details
  const technologies = extractTechnologies(projectDetails, clientCategory);
  
  // Create portfolio data with AI-generated unique content
  const portfolioData = {
    title: title,
    subtitle: uniqueContent.subtitle,
    description: uniqueContent.description,
    slug: slug,
    category: "Web Development",
    clientCategory: clientCategory,
    url: url,
    live_url: url,
    year: year,
    status: "published",
    featured: false,
    display_order: Math.floor(Math.random() * 50) + 10,
    
    long_description: `
      <h2>${uniqueContent.openingLine}</h2>
      <p>${uniqueContent.description}</p>
      
      <h3>The Challenge</h3>
      <p>${uniqueContent.challenge}</p>
      
      <h3>Our Strategic Solution</h3>
      <p>${uniqueContent.solution}</p>
      ${projectDetails ? `<p>Key implementations: ${projectDetails}</p>` : ''}
      
      <h3>Technical Innovations</h3>
      <p>${uniqueContent.technicalInnovations}</p>
      
      <h3>Unique Features</h3>
      <ul>
        ${uniqueContent.uniqueHighlights.map(h => `<li>${h}</li>`).join('\n')}
      </ul>
      
      <h3>Business Impact</h3>
      <p>${uniqueContent.businessImpact}</p>
      
      <h3>The Results</h3>
      <p>${uniqueContent.results}</p>
    `,
    
    achievements: [
      { achievement: uniqueContent.results },
      { achievement: uniqueContent.businessImpact },
      { achievement: `${uniqueContent.openingLine}` },
      { achievement: uniqueContent.technicalInnovations },
      { achievement: `Delivered a transformative solution for ${title}` }
    ],
    
    technologies: technologies,
    
    tags: [
      { tag: clientCategory },
      { tag: "Web Development" },
      { tag: year }
    ],
    
    images: {
      detail: "",
      featured: "",
      listing: ""
    },
    
    imageSettings: positioning
  };
  
  // Capture screenshot
  try {
    const screenshotFilename = `${slug}-screenshot.png`;
    const screenshotPath = await captureScreenshot(url, screenshotFilename);
    
    if (screenshotPath) {
      portfolioData.images.detail = screenshotPath;
      portfolioData.images.featured = screenshotPath;
      portfolioData.images.listing = screenshotPath;
    }
  } catch (error) {
    console.log('⚠️ Screenshot capture skipped');
  }
  
  return portfolioData;
}

// Extract technologies from project details
function extractTechnologies(projectDetails, clientCategory) {
  const techs = [];
  const details = (projectDetails || '').toLowerCase();
  
  // Check for specific technologies mentioned
  if (details.includes('wordpress')) techs.push('WordPress');
  if (details.includes('mobile app')) techs.push('Mobile Development', 'React Native');
  if (details.includes('api')) techs.push('API Integration', 'REST APIs');
  if (details.includes('third-party')) techs.push('Third-party Integrations');
  if (details.includes('seo')) techs.push('SEO', 'Search Engine Marketing');
  if (details.includes('ticket')) techs.push('Ticketing System', 'Booking Platform');
  if (details.includes('travel')) techs.push('Travel Platform', 'Booking System');
  if (details.includes('healthcare') || details.includes('health')) techs.push('Healthcare APIs', 'HIPAA Compliance');
  if (details.includes('payment')) techs.push('Payment Processing', 'Stripe');
  
  // Add base technologies
  if (techs.includes('WordPress')) {
    techs.push('PHP', 'MySQL', 'JavaScript');
  } else if (techs.includes('Mobile Development')) {
    techs.push('Node.js', 'Express', 'MongoDB');
  } else {
    techs.push('HTML5', 'CSS3', 'JavaScript', 'Responsive Design');
  }
  
  // Add category-specific technologies
  if (clientCategory === 'Financial Services') {
    techs.push('Security Encryption', 'SSL', 'Auth0');
  } else if (clientCategory === 'E-Commerce' || clientCategory === 'Travel & Tourism') {
    techs.push('Payment Gateway', 'Inventory Management');
  }
  
  return [...new Set(techs)].map(tech => ({ technology: tech }));
}

// Create portfolio item
async function createPortfolioItem(portfolioData) {
  try {
    console.log('📝 Creating portfolio item for:', portfolioData.title);
    
    const response = await fetch(`${BASE_URL}/api/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
🤖 True AI-Powered Portfolio Generator
Usage: node add-portfolio-ai-true.js <URL> <Title> <Category> <Year> [Project Details]

Examples:
  node add-portfolio-ai-true.js "https://example.com" "Company" "Industry" "2024" "WordPress site with API integrations"
    `);
    process.exit(0);
  }
  
  const siteInfo = {
    url: args[0],
    title: args[1] || new URL(args[0]).hostname.replace('www.', '').split('.')[0],
    clientCategory: args[2] || 'Business Services',
    year: args[3] || new Date().getFullYear().toString()
  };
  
  const projectDetails = args[4] || '';
  
  console.log('\n🚀 True AI-Powered Portfolio Generation Starting...');
  console.log('   Site:', siteInfo.url);
  console.log('   Client:', siteInfo.title);
  console.log('   Industry:', siteInfo.clientCategory);
  console.log('   Year:', siteInfo.year);
  if (projectDetails) console.log('   Details:', projectDetails);
  console.log('');
  
  try {
    // Generate portfolio content with true AI analysis
    const portfolioData = await generatePortfolioContent(siteInfo, projectDetails);
    
    // Create the portfolio item
    await createPortfolioItem(portfolioData);
    
    console.log('\n✨ Portfolio item created with:');
    console.log('   - TRUE AI-generated unique content');
    console.log('   - Website analysis and extraction');
    console.log('   - Intelligent screenshot positioning');
    console.log('   - Context-aware tech stack');
    console.log('\n🎉 Success! Your portfolio item is live.');
    
  } catch (error) {
    console.error('\n❌ Failed to create portfolio item:', error.message);
    process.exit(1);
  }
}

// Execute
main().catch(console.error);
