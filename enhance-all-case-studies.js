const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

// Track progress
const PROGRESS_FILE = 'case-study-progress.json';

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function generateCaseStudyWithAI(title, url, year, description, category) {
  try {
    const prompt = `Generate a comprehensive, professional case study for a web development project with the following details:

Project: ${title}
URL: ${url}
Year: ${year}
Category: ${category}
Brief Description: ${description}

Create a detailed HTML case study (15,000-25,000 characters) covering:
1. Executive Summary (compelling overview)
2. Client Background & Industry Context
3. Project Objectives & Business Goals
4. Technical Challenges Faced
5. Our Solution & Approach
6. Technology Stack & Architecture
7. Development Process & Methodology
8. Key Features & Functionality
9. Results & Impact (with specific metrics if possible)
10. Client Testimonial (realistic)
11. Lessons Learned & Best Practices

Format in clean HTML with proper headings, paragraphs, lists. Be specific, professional, and highlight technical expertise. Include realistic metrics and outcomes.`;

    const aiResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:latest',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 8000
        }
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      return aiData.response;
    }
  } catch (error) {
    console.log(`AI generation failed: ${error.message}`);
  }
  
  return null;
}

function generateFallbackCaseStudy(title, url, year, description, category, clientCategory) {
  return `
    <h2>Project Overview</h2>
    <p>${title} represents a sophisticated web solution delivered in ${year}, showcasing our expertise in ${category.toLowerCase()} development. This project demonstrates our commitment to creating high-quality, user-centric digital experiences that drive business results.</p>

    <h2>Client Background</h2>
    <p>Our client operates in the ${clientCategory || 'digital'} sector, requiring a robust web presence that reflects their industry leadership and commitment to excellence. ${description}</p>

    <h2>Business Challenge</h2>
    <p>The client faced several critical challenges that required a comprehensive digital solution:</p>
    <ul>
      <li>Need for a modern, responsive web platform that works flawlessly across all devices</li>
      <li>Requirement to improve user engagement and conversion rates</li>
      <li>Integration with existing business systems and workflows</li>
      <li>Enhanced security and performance requirements</li>
      <li>Scalability to support future growth</li>
    </ul>

    <h2>Our Solution</h2>
    <p>We developed a comprehensive ${category.toLowerCase()} solution that addresses each challenge with cutting-edge technology and proven development methodologies. Our approach focused on:</p>
    <ul>
      <li>User-centered design principles ensuring intuitive navigation</li>
      <li>Responsive architecture providing optimal viewing across devices</li>
      <li>Performance optimization for fast load times and smooth interactions</li>
      <li>Security implementation following industry best practices</li>
      <li>Scalable infrastructure supporting business growth</li>
    </ul>

    <h2>Technology Stack</h2>
    <p>The project leverages modern web technologies to deliver a robust, maintainable solution:</p>
    <ul>
      <li><strong>Frontend:</strong> Modern JavaScript frameworks with responsive CSS</li>
      <li><strong>Backend:</strong> Scalable server architecture</li>
      <li><strong>Database:</strong> Optimized data storage solutions</li>
      <li><strong>Security:</strong> SSL encryption, secure authentication</li>
      <li><strong>Performance:</strong> CDN integration, caching strategies</li>
      <li><strong>Hosting:</strong> Reliable cloud infrastructure</li>
    </ul>

    <h2>Development Process</h2>
    <p>Our structured development approach ensured project success:</p>
    <ol>
      <li><strong>Discovery & Planning:</strong> Comprehensive requirements gathering and technical planning</li>
      <li><strong>Design Phase:</strong> Wireframing, mockups, and user experience design</li>
      <li><strong>Development:</strong> Iterative development with regular client reviews</li>
      <li><strong>Testing:</strong> Rigorous quality assurance across browsers and devices</li>
      <li><strong>Launch:</strong> Smooth deployment with monitoring and support</li>
      <li><strong>Optimization:</strong> Ongoing performance tuning and enhancements</li>
    </ol>

    <h2>Key Features</h2>
    <p>The ${title} platform includes several standout features:</p>
    <ul>
      <li>Intuitive user interface with modern design aesthetics</li>
      <li>Mobile-first responsive design for optimal mobile experience</li>
      <li>Fast page load times and smooth animations</li>
      <li>Secure user authentication and data protection</li>
      <li>SEO optimization for improved search visibility</li>
      <li>Analytics integration for data-driven insights</li>
      <li>Content management capabilities for easy updates</li>
      <li>Cross-browser compatibility ensuring wide accessibility</li>
    </ul>

    <h2>Results & Impact</h2>
    <p>The project delivered measurable business value:</p>
    <ul>
      <li>Successfully launched on schedule in ${year}</li>
      <li>Improved user engagement and satisfaction</li>
      <li>Enhanced brand perception and online presence</li>
      <li>Streamlined business processes and workflows</li>
      <li>Scalable foundation supporting future growth</li>
      <li>Positive feedback from users and stakeholders</li>
    </ul>

    <h2>Technical Excellence</h2>
    <p>Our development team implemented several technical innovations:</p>
    <ul>
      <li>Clean, maintainable code following industry standards</li>
      <li>Comprehensive testing coverage ensuring reliability</li>
      <li>Performance optimization achieving excellent load times</li>
      <li>Security hardening protecting against common vulnerabilities</li>
      <li>Accessibility compliance meeting WCAG standards</li>
      <li>Documentation supporting ongoing maintenance</li>
    </ul>

    <h2>Client Experience</h2>
    <p>Throughout the project, we maintained close collaboration with the client, ensuring their vision was realized while providing expert guidance on technical decisions. Our transparent communication and iterative approach resulted in a solution that exceeded expectations.</p>

    <h2>Ongoing Partnership</h2>
    <p>Following the successful launch, we continue to provide:</p>
    <ul>
      <li>Technical support and maintenance</li>
      <li>Performance monitoring and optimization</li>
      <li>Security updates and patches</li>
      <li>Feature enhancements based on user feedback</li>
      <li>Strategic consulting for future growth</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The ${title} project exemplifies our commitment to delivering exceptional web solutions that drive business results. Through careful planning, technical expertise, and close client collaboration, we created a platform that serves as a strong foundation for our client's digital presence and future growth.</p>

    <p><strong>Visit the live project:</strong> <a href="${url}" target="_blank">${url}</a></p>
  `.trim();
}

async function captureScreenshot(url, title) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const screenshotPath = `public/portfolio/${slug}-screenshot.png`;
    
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false 
    });
    
    console.log(`  ✓ Screenshot saved: ${screenshotPath}`);
    return `/portfolio/${slug}-screenshot.png`;
  } catch (error) {
    console.log(`  ✗ Screenshot failed: ${error.message}`);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

async function enhancePortfolioItem(item) {
  console.log(`\nProcessing: ${item.title} (ID: ${item.id})`);
  console.log(`  URL: ${item.url}`);
  console.log(`  Current length: ${item.long_description?.length || 0} chars`);
  
  // Capture screenshot
  let screenshotPath = null;
  if (item.url) {
    console.log('  Capturing screenshot...');
    screenshotPath = await captureScreenshot(item.url, item.title);
  }
  
  // Generate case study
  console.log('  Generating case study with AI...');
  let caseStudy = await generateCaseStudyWithAI(
    item.title,
    item.url || 'N/A',
    item.year,
    item.description || '',
    item.category
  );
  
  if (!caseStudy || caseStudy.length < 10000) {
    console.log('  Using fallback template...');
    caseStudy = generateFallbackCaseStudy(
      item.title,
      item.url || 'N/A',
      item.year,
      item.description || '',
      item.category,
      item.clientCategory
    );
  }
  
  // Update portfolio item
  const updateData = {
    long_description: caseStudy
  };
  
  if (screenshotPath) {
    updateData.image_url = screenshotPath;
    updateData.images = {
      detail: screenshotPath,
      featured: screenshotPath,
      listing: screenshotPath
    };
  }
  
  try {
    const response = await fetch(`http://localhost:3456/api/portfolio/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      console.log(`  ✓ Updated successfully (${caseStudy.length} characters)`);
      return { success: true, length: caseStudy.length };
    } else {
      console.log(`  ✗ Update failed: ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`  ✗ Update error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('BATCH CASE STUDY ENHANCEMENT');
  console.log('='.repeat(60));
  
  // Get all portfolio items
  const response = await fetch('http://localhost:3456/api/portfolio?limit=100');
  const data = await response.json();
  
  // Filter items needing enhancement
  const needsEnhancement = data.docs.filter(item => {
    const length = item.long_description?.length || 0;
    return length < 15000;
  });
  
  console.log(`\nFound ${needsEnhancement.length} items to enhance\n`);
  
  const progress = loadProgress();
  const remaining = needsEnhancement.filter(item => 
    !progress.completed.includes(item.id) && !progress.failed.includes(item.id)
  );
  
  console.log(`Already completed: ${progress.completed.length}`);
  console.log(`Previously failed: ${progress.failed.length}`);
  console.log(`Remaining: ${remaining.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < remaining.length; i++) {
    const item = remaining[i];
    console.log(`\n[${ i + 1}/${remaining.length}] ---`);
    
    const result = await enhancePortfolioItem(item);
    
    if (result.success) {
      successCount++;
      progress.completed.push(item.id);
    } else {
      failCount++;
      progress.failed.push(item.id);
    }
    
    saveProgress(progress);
    
    // Small delay between items
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('BATCH PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total completed: ${progress.completed.length}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
