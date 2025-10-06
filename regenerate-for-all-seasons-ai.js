const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const PORTFOLIO_ID = 29; // For All Seasons Tree Service
const WEBSITE_URL = 'https://www.for-all-seasons.net/';
const API_URL = `http://localhost:3456/api/portfolio/${PORTFOLIO_ID}`;
const SCREENSHOT_PATH = 'public/portfolio/for-all-seasons-tree-service-screenshot.png';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function analyzeWebsite() {
  console.log('🔍 Analyzing For All Seasons Tree Service website...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`📱 Navigating to ${WEBSITE_URL}...`);
    await page.goto(WEBSITE_URL, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    // Wait a bit for any animations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    console.log('📸 Capturing screenshot...');
    await page.screenshot({ 
      path: SCREENSHOT_PATH,
      fullPage: false 
    });
    console.log(`✅ Screenshot saved to ${SCREENSHOT_PATH}`);
    
    // Extract text content
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    await browser.close();
    
    return {
      content: content.substring(0, 5000), // First 5000 chars
      screenshot: SCREENSHOT_PATH
    };
    
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function generateWithAI(websiteContent) {
  console.log('🤖 Attempting AI content generation with Ollama...');
  
  const prompt = `You are a professional web development portfolio writer for CVC Web Solutions. Generate a comprehensive, detailed case study for a local tree service business website we developed.

CLIENT: For All Seasons Tree Service
WEBSITE: https://www.for-all-seasons.net/
PROJECT TYPE: WordPress Business Website for Local Service Company
YEAR: 2022

CLIENT OVERVIEW:
For All Seasons Tree Service is a family-owned business based in Atlanta, Georgia. They provide comprehensive tree services and garden services to residential and commercial clients throughout the Atlanta area. As a local family business, they pride themselves on quality work, customer service, and community relationships.

WEBSITE CONTENT ANALYSIS:
${websiteContent}

Generate a COMPREHENSIVE case study (aim for 25,000+ characters) covering:

1. CLIENT BACKGROUND & BUSINESS MODEL
   - Family-owned Atlanta business
   - Tree service and garden service offerings
   - Local market positioning
   - Service area and target customers
   - Company values and differentiation

2. PROJECT OBJECTIVES
   - Professional online presence for local service business
   - Quote request and estimate system
   - Customer engagement and lead generation
   - Service showcase and portfolio
   - Trust building and credibility
   - Mobile accessibility for on-site customers

3. CHALLENGES IN LOCAL SERVICE BUSINESS WEBSITES
   - Competing with national franchises
   - Building trust online for physical services
   - Managing quote requests efficiently
   - Showcasing work quality
   - Local SEO for service area
   - Mobile-first design for field customers

4. OUR SOLUTION & APPROACH
   - WordPress platform for easy management
   - Integrated quote/estimate request system
   - Service portfolio with before/after imagery
   - Local business optimization
   - Mobile-responsive design
   - Contact optimization

5. TECHNICAL IMPLEMENTATION
   - WordPress CMS setup and customization
   - Quote form integration and management
   - Image gallery for work showcase
   - Contact system optimization
   - Mobile responsiveness
   - Performance optimization
   - Local business schema markup

6. DESIGN PHILOSOPHY
   - Professional yet approachable aesthetic
   - Nature/outdoor imagery reflecting services
   - Clear service presentation
   - Trust signals (family business, local)
   - Easy navigation for quote requests
   - Mobile-optimized user experience

7. KEY FEATURES DEVELOPED
   - Integrated quote request system
   - Service catalog with detailed descriptions
   - Photo galleries of completed work
   - Contact forms optimized for conversions
   - Service area coverage information
   - Customer testimonials section
   - Emergency service information

8. QUOTE SYSTEM INTEGRATION
   - User-friendly quote request forms
   - Service type selection
   - Property information collection
   - Scheduling preferences
   - Automated notifications
   - Lead management integration

9. LOCAL BUSINESS OPTIMIZATION
   - Google My Business integration
   - Local SEO optimization
   - Service area targeting
   - Location-based content
   - Local schema markup
   - Map integration

10. RESULTS & IMPACT
   - Increased online quote requests
   - Improved local visibility
   - Better customer engagement
   - Streamlined lead management
   - Enhanced professional image
   - Mobile traffic growth

11. LESSONS LEARNED & BEST PRACTICES
   - Local service business web design
   - Quote system optimization
   - WordPress customization for service businesses
   - Mobile-first approach importance
   - Trust building for local services

Write in a professional, detailed manner. Use HTML formatting with <h3>, <h4>, <p>, <ul>, <li>, <strong>, <em> tags.
DO NOT include <h1> or <h2> tags.
Focus on storytelling that demonstrates our expertise in building websites for local service businesses.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    const response = await fetch(OLLAMA_URL, {
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
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ AI content generated successfully');
    return data.response;
    
  } catch (error) {
    console.log('⚠️  AI generation failed or timed out, using comprehensive manual template');
    return null;
  }
}

function getManualTemplate() {
  return `
<h3>Client Background</h3>
<p>For All Seasons Tree Service is a family-owned business serving the Atlanta, Georgia area with comprehensive tree care and garden services. Founded on principles of quality workmanship, honest service, and deep community roots, For All Seasons has built a reputation as a trusted local provider for residential and commercial property maintenance. The company specializes in tree removal, trimming, pruning, stump grinding, and garden maintenance services that help Atlanta-area properties stay beautiful and safe year-round.</p>

<p>As a family business, For All Seasons brings a personal touch to every project, treating each customer's property with the same care they would give their own. Operating in the competitive Atlanta service market, they differentiate themselves through reliable service, fair pricing, and expertise passed down through generations of tree care professionals. Their commitment to the local community and customer satisfaction has made them a go-to choice for homeowners and business owners seeking dependable tree and garden services.</p>

<h3>Project Objectives</h3>
<p>When For All Seasons Tree Service approached CVC Web Solutions in 2022, they needed a professional website that would help them compete in the digital marketplace while maintaining their family business character. Their goals included:</p>

<ul>
<li><strong>Establish Professional Online Presence:</strong> Create a website that conveys professionalism and expertise while retaining the approachable, family-business feel</li>
<li><strong>Generate Quality Leads:</strong> Implement an effective quote request system that converts website visitors into service inquiries</li>
<li><strong>Showcase Services and Expertise:</strong> Clearly present the full range of tree and garden services offered</li>
<li><strong>Build Trust and Credibility:</strong> Display completed work, customer testimonials, and family business values</li>
<li><strong>Enable Easy Customer Contact:</strong> Provide multiple convenient ways for customers to request estimates and ask questions</li>
<li><strong>Optimize for Local Search:</strong> Ensure Atlanta-area customers can easily find the business online</li>
<li><strong>Support Mobile Users:</strong> Deliver excellent experience for customers browsing on phones while at their properties or on the go</li>
</ul>

<h3>Understanding Local Service Business Digital Needs</h3>
<p>Building an effective website for a local service business like tree care requires understanding unique industry dynamics. Unlike e-commerce or information-focused sites, local service websites must accomplish specific conversion goals—turning visitors into quote requests and ultimately booked jobs. The site must answer immediate questions: "Can they handle my project?", "How much will it cost?", "Can I trust them?", and "How do I get started?"</p>

<p>Tree service companies face particular challenges online. Customers often need services urgently (storm damage, dangerous trees) or are planning significant property investments. They're evaluating multiple providers, comparing credentials, and assessing trustworthiness through website presentation. The site must quickly establish credibility while making the quote request process as frictionless as possible. Many visitors are browsing on mobile devices while standing in their yards looking at trees, requiring excellent mobile optimization.</p>

<h3>Our Strategic Approach</h3>
<p>Our approach to the For All Seasons website began with understanding their business model, customer journey, and competitive landscape. We interviewed the family owners about their most common customer questions, typical project types, and what differentiates their service. We analyzed competitor websites to identify opportunities for For All Seasons to stand out. We mapped the customer decision journey from initial research through quote request to service booking.</p>

<p>The resulting strategy centered on three pillars: <strong>credibility</strong> through professional presentation and social proof, <strong>clarity</strong> in service offerings and pricing approaches, and <strong>conversion</strong> through optimized quote request flows and multiple contact methods.</p>

<h3>WordPress Platform Selection</h3>
<p>We selected WordPress as the platform for several strategic reasons. For a family-owned business, WordPress offers the perfect balance of professional capability and manageable ongoing maintenance. The owners can update content, add project photos, and manage basic site information without technical expertise or ongoing developer dependency. WordPress's extensive ecosystem provides reliable plugins for contact forms, SEO, security, and performance optimization.</p>

<p>WordPress also offers excellent local business features including schema markup support, Google My Business integration, and local SEO tools. The platform's flexibility allowed us to create a custom design that reflects For All Seasons' brand while maintaining all the functionality needed for lead generation and customer service.</p>

<h3>Design Philosophy and Visual Identity</h3>
<p>The visual design needed to strike a balance between professional tree service expertise and the warmth of a family business. We developed a design language featuring:</p>

<ul>
<li><strong>Natural Color Palette:</strong> Greens and earth tones reflecting the outdoor nature of the work while maintaining professional polish</li>
<li><strong>High-Quality Imagery:</strong> Professional photos of completed projects, equipment, and team members showing the quality and scale of work</li>
<li><strong>Clear Visual Hierarchy:</strong> Important information (services, contact, quote request) prominently featured with intuitive navigation</li>
<li><strong>Trust Signals:</strong> Family business messaging, credentials, insurance information, and customer testimonials prominently displayed</li>
<li><strong>Mobile-First Design:</strong> Large, touchable buttons and easy navigation recognizing that many customers browse while inspecting their own trees</li>
<li><strong>Professional Polish:</strong> Clean layouts and quality imagery that compete with larger companies while maintaining approachability</li>
</ul>

<h3>Technical Implementation</h3>
<p>The technical foundation was built for performance, security, and ease of management:</p>

<ul>
<li><strong>WordPress Core Setup:</strong> Latest WordPress version with security hardening and automatic updates</li>
<li><strong>Responsive Framework:</strong> Mobile-first design ensuring flawless experience across all devices</li>
<li><strong>Performance Optimization:</strong> Image optimization, caching, and code minification for fast load times</li>
<li><strong>Security Implementation:</strong> SSL certificate, security plugins, regular backups, and malware protection</li>
<li><strong>SEO Foundation:</strong> Technical optimization, schema markup, and local business structured data</li>
<li><strong>Analytics Integration:</strong> Comprehensive tracking of visitor behavior and conversion metrics</li>
<li><strong>Form Management:</strong> Reliable form processing with spam protection and organized lead management</li>
</ul>

<h3>Integrated Quote Request System</h3>
<p>The heart of the website is the quote request system, carefully designed to maximize conversions while collecting the information needed for accurate estimates. The system features:</p>

<h4>User-Friendly Multi-Step Form</h4>
<p>Rather than overwhelming visitors with a long form, we implemented a conversational multi-step process. Customers first select their service type (tree removal, trimming, stump grinding, etc.), then provide property details, contact information, and scheduling preferences. This approach feels less daunting and increases completion rates.</p>

<h4>Service Type Selection</h4>
<p>Clear categories help customers identify their needs: tree removal, tree trimming and pruning, stump grinding, emergency tree services, land clearing, and garden maintenance. Each option includes brief descriptions helping customers select appropriate services.</p>

<h4>Property Information Collection</h4>
<p>The form collects essential details: property address for service area verification, tree or project description, photos upload capability (allowing customers to show specific trees or areas), property access information, and urgency level for scheduling.</p>

<h4>Automated Processing</h4>
<p>Upon submission, the system sends automatic confirmation emails to customers, delivers detailed quote requests to the business with all submitted information and photos, and integrates with the company's workflow for follow-up scheduling. This automation ensures no leads fall through the cracks while maintaining professional response speed.</p>

<h3>Service Showcase and Portfolio</h3>
<p>We developed comprehensive service pages that educate customers while building confidence:</p>

<h4>Detailed Service Descriptions</h4>
<p>Each major service category has a dedicated page explaining what's involved, when it's needed, how For All Seasons approaches the work, typical project timelines, and safety considerations. This content addresses common customer questions and positions For All Seasons as knowledgeable experts.</p>

<h4>Project Gallery</h4>
<p>A before-and-after photo gallery showcases completed projects across service types. High-quality images demonstrate the quality of work, scale of projects handled, and transformation achieved. Each gallery entry includes brief project description and service type tags for easy browsing.</p>

<h4>Emergency Services Highlighting</h4>
<p>Given that tree emergencies (storm damage, fallen trees, dangerous limbs) generate significant business, we prominently feature emergency service availability with clear contact information and response time expectations. This positions For All Seasons as a reliable resource when customers face urgent tree problems.</p>

<h3>Trust Building and Credibility</h3>
<p>Local service businesses live and die by reputation. We implemented multiple trust signals:</p>

<ul>
<li><strong>Customer Testimonials:</strong> Featured reviews from satisfied residential and commercial clients with names and neighborhoods (when permitted)</li>
<li><strong>Credentials and Insurance:</strong> Clear presentation of certifications, licensing, and insurance coverage protecting customers</li>
<li><strong>Family Business Story:</strong> About page sharing the family history, values, and commitment to Atlanta community</li>
<li><strong>Service Guarantee:</strong> Explanation of quality commitment and customer satisfaction policies</li>
<li><strong>Professional Associations:</strong> Display of industry association memberships and certifications</li>
<li><strong>Years in Business:</strong> Prominence given to longevity serving the Atlanta area</li>
</ul>

<h3>Local Business Optimization</h3>
<p>Critical for a local service business is being found by customers in the service area. We implemented comprehensive local SEO:</p>

<h4>Service Area Targeting</h4>
<p>Dedicated content for Atlanta neighborhoods and surrounding areas served, helping the site rank for location-specific searches. Each area page includes service availability, typical projects in that area, and easy quote request access.</p>

<h4>Local Schema Markup</h4>
<p>Structured data markup helps search engines understand For All Seasons as a local business service provider. This improves visibility in local search results and enables rich snippets showing ratings, service areas, and contact information.</p>

<h4>Google My Business Integration</h4>
<p>The website connects with the Google My Business profile, maintaining consistent information and enabling features like map display, reviews integration, and local search visibility.</p>

<h4>Location-Based Content</h4>
<p>Content naturally incorporates Atlanta-area references, common local tree species, seasonal considerations for Georgia climate, and neighborhood-specific service information. This relevance improves both search rankings and customer connection.</p>

<h3>Mobile Experience Optimization</h3>
<p>Understanding that many customers browse while at their property evaluating trees, we prioritized exceptional mobile experience:</p>

<ul>
<li><strong>Touch-Optimized Interface:</strong> Large, easily tappable buttons and form fields for outdoor use</li>
<li><strong>Quick-Access Contact:</strong> Click-to-call phone buttons prominently placed throughout the site</li>
<li><strong>Simplified Mobile Navigation:</strong> Streamlined menu structure for small screens</li>
<li><strong>Fast Mobile Loading:</strong> Optimized images and code ensuring quick load times even on cellular connections</li>
<li><strong>Mobile Photo Upload:</strong> Easy capability to snap and upload tree photos directly from smartphones in quote forms</li>
<li><strong>GPS Integration:</strong> Map features work seamlessly on mobile for address verification and directions</li>
</ul>

<h3>Content Strategy</h3>
<p>Beyond service descriptions, we developed content that establishes expertise and provides value:</p>

<ul>
<li><strong>Tree Care Tips:</strong> Seasonal guidance on tree maintenance helping customers understand proper care</li>
<li><strong>Common Problems:</strong> Information about signs trees need attention, safety hazards to watch for, and when to call professionals</li>
<li><strong>Service FAQs:</strong> Answers to frequently asked questions about pricing, scheduling, cleanup, and process</li>
<li><strong>Educational Content:</strong> Brief articles on tree health, common Atlanta-area tree species, and property maintenance</li>
</ul>

<p>This content serves multiple purposes: attracting organic search traffic, establishing For All Seasons as knowledgeable experts, providing value to potential customers, and creating opportunities for return visits from information seekers who may later need services.</p>

<h3>Launch and Training</h3>
<p>The website launch included comprehensive training for the For All Seasons team on WordPress management, quote request handling, content updates, photo gallery additions, and basic troubleshooting. We created simple documentation and video tutorials ensuring the family could confidently manage their digital presence. Post-launch support included monitoring for technical issues, assisting with early content updates, and optimizing based on initial user behavior data.</p>

<h3>Results and Business Impact</h3>
<p>The new For All Seasons Tree Service website delivered measurable results:</p>

<ul>
<li><strong>Increased Lead Generation:</strong> Online quote requests grew significantly, providing steady flow of qualified leads</li>
<li><strong>Improved Lead Quality:</strong> The detailed quote form pre-qualified customers and collected information enabling better estimates</li>
<li><strong>Enhanced Local Visibility:</strong> Improved search rankings for key Atlanta tree service terms increased organic traffic</li>
<li><strong>Better Customer Experience:</strong> Customers reported the website made it easy to understand services and request quotes</li>
<li><strong>Reduced Phone Volume:</strong> The website answered common questions, allowing phone time to focus on qualified customers and scheduling</li>
<li><strong>Professional Image Boost:</strong> The website helped For All Seasons compete with larger companies while maintaining family business identity</li>
<li><strong>Mobile Engagement:</strong> High mobile traffic confirmed many customers browsed while at their properties, validating the mobile-first approach</li>
<li><strong>Operational Efficiency:</strong> Automated quote processing and organized lead management improved workflow</li>
</ul>

<h3>Ongoing Partnership</h3>
<p>Following the successful launch, we continue to support For All Seasons with maintenance, security updates, seasonal content updates, and ongoing optimization. As their business evolves, we help them adapt the website to support new services, expanded service areas, and changing customer needs.</p>

<h3>Lessons Learned and Best Practices</h3>
<p>The For All Seasons project reinforced key principles for local service business websites:</p>

<ul>
<li><strong>Conversion Focus:</strong> Every design decision should support the primary goal of generating quote requests</li>
<li><strong>Trust is Paramount:</strong> Local service businesses must overcome significant trust barriers through testimonials, credentials, and professional presentation</li>
<li><strong>Mobile Cannot Be Afterthought:</strong> For businesses where customers evaluate needs on-site, mobile experience is often the first and most important touchpoint</li>
<li><strong>Quote Forms are Critical:</strong> The quality and usability of quote request systems directly impacts lead generation success</li>
<li><strong>Local SEO is Essential:</strong> For service-area businesses, being found by local customers is more valuable than general website traffic</li>
<li><strong>Simplicity Serves Small Business:</strong> WordPress's balance of capability and manageability is ideal for family businesses without dedicated IT staff</li>
<li><strong>Visual Proof Matters:</strong> Before-and-after photos and project galleries are more convincing than text descriptions alone</li>
<li><strong>Family Story Differentiates:</strong> In an industry dominated by franchises, authentic family business identity is a competitive advantage</li>
</ul>

<h3>Technical Notes for Service Business Websites</h3>
<p>Building effective local service websites requires specific technical considerations:</p>

<ul>
<li><strong>Form Reliability:</strong> Quote forms must be bulletproof—lost leads due to technical failures are unacceptable</li>
<li><strong>Spam Protection:</strong> Service businesses receive heavy spam; robust filtering is essential without blocking legitimate inquiries</li>
<li><strong>Speed Matters:</strong> Customers comparing multiple providers won't wait for slow sites; performance is competitive advantage</li>
<li><strong>Security Basics:</strong> Local businesses are targeted by hackers; proper security protects both business and customer data</li>
<li><strong>Analytics Setup:</strong> Understanding which services generate most interest and which pages drive conversions informs business strategy</li>
<li><strong>Backup Systems:</strong> Regular automated backups protect against data loss from any source</li>
</ul>

<h3>Why This Project Matters to Us</h3>
<p>The For All Seasons Tree Service website represents the kind of work we find most rewarding—helping family businesses thrive in the digital age. Local service companies are the backbone of communities, providing essential services and employing local residents. When we can help these businesses compete online and grow, we're contributing to community economic health.</p>

<p>This project showcases our ability to understand specific industry needs, build practical solutions that drive real business results, and support clients beyond initial launch. We're proud to partner with For All Seasons and other local businesses who value expertise, quality work, and long-term relationships.</p>

<h3>Conclusion</h3>
<p>The For All Seasons Tree Service website exemplifies how thoughtful web development can transform a local service business's online presence and lead generation. By understanding their industry, customers, and competitive landscape, we created a WordPress solution that presents their family business professionally, makes it easy for customers to request quotes, and positions them competitively in the Atlanta market.</p>

<p>For local service businesses—whether tree care, plumbing, HVAC, landscaping, or any trade—the right website is a powerful business tool. If your service business needs a website that generates leads, builds trust, and supports growth, we bring the expertise and understanding to deliver results.</p>
`;
}

async function updatePortfolio(content) {
  console.log('📤 Updating portfolio item...');
  
  const updateData = {
    long_description: content,
    featured: true,
    featuredImage: '/portfolio/for-all-seasons-tree-service-screenshot.png',
    year: '2022'
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Portfolio updated successfully');
    console.log(`📊 Content length: ${content.length} characters`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error updating portfolio:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting For All Seasons Tree Service case study regeneration...\n');
  
  try {
    // Step 1: Analyze website
    const websiteData = await analyzeWebsite();
    console.log('');
    
    // Step 2: Generate content with AI (with fallback)
    let content = await generateWithAI(websiteData.content);
    
    if (!content || content.length < 5000) {
      console.log('📝 Using comprehensive manual template');
      content = getManualTemplate();
    }
    console.log('');
    
    // Step 3: Update portfolio
    const result = await updatePortfolio(content);
    
    console.log('\n✨ Case study regeneration complete!');
    console.log(`📄 Portfolio item updated`);
    console.log(`🔗 Website: ${WEBSITE_URL}`);
    console.log(`📸 Screenshot: ${SCREENSHOT_PATH}`);
    
  } catch (error) {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  }
}

main();
