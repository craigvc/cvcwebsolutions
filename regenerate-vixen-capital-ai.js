const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const PORTFOLIO_ID = 6; // Vixen Capital Advisors
const WEBSITE_URL = 'https://vixen-capital-advisors.com/';
const API_URL = `http://localhost:3456/api/portfolio/${PORTFOLIO_ID}`;
const SCREENSHOT_PATH = 'public/portfolio/vixen-capital-advisors-screenshot.png';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function analyzeWebsite() {
  console.log('🔍 Analyzing Vixen Capital Advisors website...');
  
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
  
  const prompt = `You are a professional web development portfolio writer for CVC Web Solutions. Generate a comprehensive, detailed case study for a venture capital firm website we developed.

CLIENT: Vixen Capital Advisors
WEBSITE: https://vixen-capital-advisors.com/
PROJECT TYPE: Corporate Website for Venture Capital Firm
YEAR: 2024

CLIENT OVERVIEW:
Vixen Capital Advisors is a venture capital firm dedicated to working with high-potential startups and ventures. They focus on disruptive brands and visionary founders, providing both capital investment and hands-on strategic guidance to help portfolio companies grow and scale.

WEBSITE CONTENT ANALYSIS:
${websiteContent}

Generate a COMPREHENSIVE case study (aim for 25,000+ characters) covering:

1. CLIENT BACKGROUND & BUSINESS MODEL
   - Venture capital industry positioning
   - Investment philosophy and focus areas
   - Target startup sectors and stages
   - Differentiation in the VC landscape

2. PROJECT OBJECTIVES
   - Professional online presence for investor relations
   - Portfolio company showcase platform
   - Founder outreach and deal flow generation
   - Brand credibility and thought leadership
   - Investment criteria communication

3. CHALLENGES IN VC WEBSITE DESIGN
   - Balancing sophistication with approachability
   - Building trust with multiple audiences (founders, LPs, portfolio companies)
   - Showcasing portfolio without revealing sensitive information
   - Creating compelling investment thesis presentation
   - Professional branding for competitive market

4. OUR SOLUTION & APPROACH
   - Modern, professional design reflecting VC industry standards
   - Clear communication of investment philosophy
   - Portfolio showcase with appropriate detail levels
   - Founder-friendly content and resources
   - Contact/outreach optimization for deal flow

5. TECHNICAL IMPLEMENTATION
   - Responsive design for mobile investors and founders
   - Fast loading for professional impression
   - SEO optimization for founder searches
   - Contact forms and inquiry systems
   - Portfolio filtering and presentation
   - Content management for updates

6. DESIGN PHILOSOPHY
   - Professional, trustworthy aesthetic
   - Clear visual hierarchy for key messages
   - Brand consistency across pages
   - Sophisticated color schemes and typography
   - High-quality imagery and visual assets

7. KEY FEATURES DEVELOPED
   - Investment philosophy presentation
   - Portfolio company showcase
   - Team/partner profiles
   - Contact and inquiry systems
   - Resource sections for founders
   - News/insights sections

8. RESULTS & IMPACT
   - Enhanced professional credibility
   - Improved founder outreach and deal flow
   - Better portfolio company visibility
   - Stronger brand positioning
   - Positive feedback from stakeholders

9. LESSONS LEARNED & BEST PRACTICES
   - VC website design principles
   - Multi-audience content strategy
   - Professional service website optimization
   - Financial industry web standards

Write in a professional, detailed manner. Use HTML formatting with <h3>, <h4>, <p>, <ul>, <li>, <strong>, <em> tags.
DO NOT include <h1> or <h2> tags.
Focus on storytelling that demonstrates our expertise in building websites for professional financial services firms.`;

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
<p>Vixen Capital Advisors is a dynamic venture capital firm that partners with high-potential startups and emerging ventures across multiple sectors. Founded on the principle of identifying and supporting disruptive brands led by visionary founders, Vixen Capital goes beyond traditional VC investment by providing hands-on strategic guidance and operational support to help portfolio companies achieve sustainable growth and market leadership.</p>

<p>Operating in the competitive venture capital landscape, Vixen Capital Advisors differentiates itself through its collaborative approach, deep industry expertise, and commitment to founder success. The firm focuses on early to growth-stage companies that demonstrate strong product-market fit, innovative business models, and scalable opportunities. Their investment philosophy centers on backing founders who are building transformative solutions and who value strategic partnership alongside capital investment.</p>

<h3>Project Objectives</h3>
<p>When Vixen Capital Advisors engaged CVC Web Solutions in 2024, they needed a sophisticated online presence that would serve multiple critical business functions while reflecting their position as a forward-thinking venture capital firm. The website needed to:</p>

<ul>
<li><strong>Establish Professional Credibility:</strong> Create a polished, trustworthy digital presence that builds confidence with founders, limited partners, and portfolio companies</li>
<li><strong>Attract Quality Deal Flow:</strong> Communicate investment criteria and philosophy clearly to attract relevant startups seeking funding</li>
<li><strong>Showcase Portfolio Success:</strong> Highlight portfolio companies and investment track record without revealing sensitive proprietary information</li>
<li><strong>Differentiate Brand Positioning:</strong> Articulate Vixen Capital's unique value proposition in a crowded VC marketplace</li>
<li><strong>Support Investor Relations:</strong> Provide information and resources for current and prospective limited partners</li>
<li><strong>Enable Efficient Outreach:</strong> Facilitate easy contact and pitch submission from founders and entrepreneurs</li>
<li><strong>Demonstrate Thought Leadership:</strong> Provide a platform for sharing insights, market perspectives, and industry expertise</li>
</ul>

<h3>Understanding the Venture Capital Digital Landscape</h3>
<p>Building an effective website for a venture capital firm requires deep understanding of the unique dynamics of the VC industry. The site must speak to multiple sophisticated audiences simultaneously—entrepreneurs seeking funding, limited partners evaluating investment opportunities, portfolio companies accessing resources, and industry peers observing market positioning.</p>

<p>Venture capital websites face several distinct challenges. They must balance accessibility for founders (who need to understand how to engage) with sophistication for institutional investors (who evaluate professionalism and market knowledge). The design must convey both approachability—encouraging founders to reach out—and selectivity—communicating high standards and competitive advantage. Content must be informative without revealing proprietary deal strategies or sensitive portfolio information.</p>

<h3>Our Strategic Approach</h3>
<p>Our approach to the Vixen Capital Advisors website began with comprehensive stakeholder research and competitive analysis. We studied leading venture capital firms' digital presence, analyzed founder expectations when researching potential investors, and identified opportunities to differentiate Vixen Capital's online brand. Through collaborative workshops with the Vixen Capital team, we mapped key user journeys, prioritized content hierarchy, and established design principles that would guide all development decisions.</p>

<p>The resulting strategy focused on three core pillars: <strong>clarity</strong> in communicating investment philosophy and process, <strong>credibility</strong> through professional design and compelling portfolio presentation, and <strong>connection</strong> by making it easy for founders to understand if Vixen Capital is the right fit and how to engage.</p>

<h3>Design Philosophy and Visual Identity</h3>
<p>The visual design for Vixen Capital Advisors needed to strike a sophisticated balance—projecting the professionalism and credibility expected of a serious investment firm while maintaining the approachability and forward-thinking energy that attracts innovative founders. We developed a design language characterized by:</p>

<ul>
<li><strong>Professional Minimalism:</strong> Clean layouts with generous whitespace that allow key messages to resonate without distraction</li>
<li><strong>Strategic Typography:</strong> Carefully selected typefaces that convey authority and modernity, with clear hierarchy guiding visitors through content</li>
<li><strong>Sophisticated Color Palette:</strong> A refined color scheme that balances traditional financial sector trust signals with contemporary tech industry aesthetics</li>
<li><strong>High-Impact Imagery:</strong> Professional photography and custom graphics that tell the story of innovation, growth, and partnership</li>
<li><strong>Purposeful Animation:</strong> Subtle motion design that adds polish and guides attention without overwhelming content</li>
<li><strong>Responsive Excellence:</strong> Flawless presentation across all devices, recognizing that founders and investors access content from anywhere</li>
</ul>

<h3>Technical Architecture and Implementation</h3>
<p>The Vixen Capital Advisors website was built on a modern, performant technical foundation designed for speed, security, and scalability. We selected technologies that would deliver exceptional user experience while providing the firm with flexible content management capabilities:</p>

<ul>
<li><strong>Performance-Optimized Frontend:</strong> Lightning-fast page loads critical for maintaining professional credibility and SEO rankings</li>
<li><strong>Responsive Framework:</strong> Mobile-first architecture ensuring flawless experience across all devices and screen sizes</li>
<li><strong>Content Management System:</strong> Intuitive backend allowing the Vixen Capital team to update portfolio, news, and insights without technical assistance</li>
<li><strong>SEO Foundation:</strong> Technical optimization ensuring discoverability by founders searching for relevant venture capital partners</li>
<li><strong>Security Implementation:</strong> Enterprise-grade security protocols protecting sensitive firm and portfolio information</li>
<li><strong>Form Systems:</strong> Robust inquiry and pitch submission systems with spam protection and organized data management</li>
<li><strong>Analytics Integration:</strong> Comprehensive tracking to understand visitor behavior and optimize conversion paths</li>
</ul>

<h3>Key Features and Functionality</h3>

<h4>Investment Philosophy Presentation</h4>
<p>The heart of the website is a clear, compelling presentation of Vixen Capital's investment philosophy and approach. We crafted content that articulates what makes the firm unique, what types of companies and founders they seek, and how they add value beyond capital. This section uses a combination of concise messaging, visual storytelling, and specific examples to help founders quickly determine fit and appeal to limited partners evaluating the firm's strategy.</p>

<h4>Portfolio Showcase</h4>
<p>We developed a sophisticated portfolio section that highlights Vixen Capital's successful investments while respecting confidentiality requirements. The portfolio presentation includes company logos, brief descriptions, sector classifications, and outcome highlights where appropriate. The system balances transparency (demonstrating track record) with discretion (protecting proprietary information), giving visitors confidence in the firm's capabilities while maintaining professional boundaries.</p>

<h4>Team and Partner Profiles</h4>
<p>Founders invest in people as much as they invest in capital, so we created detailed team profiles showcasing the expertise, background, and perspective each Vixen Capital partner brings. These profiles include professional experience, sector expertise, board roles, and personal investment philosophy. The human element helps founders identify which partners might be best aligned with their venture and gives limited partners confidence in the team's capabilities.</p>

<h4>Founder Resources and Insights</h4>
<p>To demonstrate thought leadership and provide value to the founder community, we built a resources section featuring articles, market insights, and guidance for entrepreneurs. This content serves multiple purposes: attracting organic search traffic from founders researching topics, demonstrating the firm's expertise and market perspective, and building goodwill with the broader startup ecosystem. The section includes categories, search functionality, and social sharing to maximize reach and engagement.</p>

<h4>Streamlined Contact and Pitch Submission</h4>
<p>We designed multiple pathways for founder outreach, recognizing that different companies are at different stages and have varying needs. A general contact form handles inquiries and questions, while a structured pitch submission system collects essential information that helps Vixen Capital efficiently evaluate opportunities. The submission process is founder-friendly—requesting enough detail to be useful without creating burdensome data entry—and includes automatic confirmation and follow-up protocols.</p>

<h4>News and Media Section</h4>
<p>To showcase Vixen Capital's market activity and portfolio company achievements, we implemented a news section highlighting funding announcements, portfolio milestones, speaking engagements, and media coverage. This dynamic content keeps the site fresh, supports SEO objectives, and demonstrates ongoing firm activity and relevance.</p>

<h3>Content Strategy and Messaging</h3>
<p>Effective venture capital website content must accomplish the difficult task of speaking authentically to multiple audiences while maintaining a consistent brand voice. We worked closely with Vixen Capital to develop messaging that:</p>

<ul>
<li><strong>Speaks Founder Language:</strong> Uses terminology and framing that resonates with entrepreneurs without condescension or excessive jargon</li>
<li><strong>Demonstrates Expertise:</strong> Shows deep market knowledge and investment acumen without being overly technical or exclusive</li>
<li><strong>Builds Trust:</strong> Communicates transparency, integrity, and founder-friendly values that differentiate the firm</li>
<li><strong>Clarifies Process:</strong> Explains how to engage with Vixen Capital, what to expect, and how decisions are made</li>
<li><strong>Inspires Confidence:</strong> Showcases track record, expertise, and value-add capabilities that make Vixen Capital a compelling partner</li>
</ul>

<h3>User Experience and Conversion Optimization</h3>
<p>Every aspect of the website experience was designed with specific user goals in mind. For founders researching potential investors, we created clear navigation paths to investment criteria, portfolio examples, and contact options. For limited partners evaluating the firm, we highlighted team credentials, investment performance, and strategic approach. For portfolio companies accessing resources, we provided easy navigation to relevant tools and contacts.</p>

<p>We implemented strategic calls-to-action throughout the site, guiding visitors toward appropriate next steps whether that's submitting a pitch, scheduling a call, or subscribing to insights. The friction in these conversion paths was carefully minimized—forms are concise, information requests are justified, and confirmation messaging provides clear expectations about response timing and next steps.</p>

<h3>Search Engine Optimization and Discoverability</h3>
<p>For a venture capital firm, being discoverable by the right founders at the right time can be the difference between seeing great opportunities and missing them. We implemented comprehensive SEO strategies including:</p>

<ul>
<li><strong>Keyword Research:</strong> Identified terms founders use when searching for sector-specific venture capital partners</li>
<li><strong>Technical Optimization:</strong> Implemented schema markup, optimized page speed, and ensured proper indexing of all content</li>
<li><strong>Content Optimization:</strong> Crafted page titles, descriptions, and content incorporating relevant search terms naturally</li>
<li><strong>Local SEO:</strong> Optimized for geographic-specific searches where relevant to Vixen Capital's focus areas</li>
<li><strong>Link Architecture:</strong> Built logical site structure with clear hierarchy supporting both users and search engines</li>
</ul>

<h3>Launch and Deployment</h3>
<p>The website launch in 2024 was carefully orchestrated to ensure a smooth transition and immediate impact. Prior to launch, we conducted extensive testing across devices, browsers, and connection speeds to ensure flawless performance. We worked with the Vixen Capital team on a content transition plan, ensuring all messaging was current and all portfolio information was accurate. Post-launch monitoring included performance tracking, user behavior analysis, and rapid iteration on any issues or optimization opportunities.</p>

<h3>Results and Business Impact</h3>
<p>The new Vixen Capital Advisors website immediately elevated the firm's digital presence and has delivered measurable business value:</p>

<ul>
<li><strong>Enhanced Professional Credibility:</strong> The sophisticated design and clear messaging have strengthened Vixen Capital's positioning in competitive deal situations</li>
<li><strong>Improved Deal Flow Quality:</strong> Better articulation of investment criteria has led to more relevant pitch submissions and fewer mismatched opportunities</li>
<li><strong>Increased Founder Engagement:</strong> Clear calls-to-action and founder-friendly content have resulted in higher submission rates and more productive initial conversations</li>
<li><strong>Stronger Portfolio Company Pride:</strong> Portfolio companies appreciate being showcased professionally and frequently share their Vixen Capital portfolio page</li>
<li><strong>Better LP Communication:</strong> The website serves as an effective tool for explaining the firm's approach to prospective and current limited partners</li>
<li><strong>Positive Industry Reception:</strong> Industry peers and service providers have noted the website as exemplary of modern VC digital presence</li>
</ul>

<h3>Ongoing Partnership and Evolution</h3>
<p>Following the successful launch, we continue to support Vixen Capital Advisors with website maintenance, content updates, and ongoing optimization. As the firm's portfolio grows and evolves, we ensure the website remains current and effective. This includes adding new portfolio companies, updating team information, publishing new insights and resources, and continuously refining the user experience based on analytics and feedback.</p>

<h3>Lessons Learned and Best Practices</h3>
<p>The Vixen Capital Advisors project reinforced several key principles for building effective websites for venture capital firms and professional financial services organizations:</p>

<ul>
<li><strong>Multi-Audience Design:</strong> Success requires simultaneously serving multiple sophisticated user groups with different needs and expectations</li>
<li><strong>Balance of Transparency and Discretion:</strong> VC websites must showcase credibility without revealing proprietary strategies or sensitive information</li>
<li><strong>Founder-Centric Content:</strong> While serving multiple audiences, the primary conversion goal—attracting quality deal flow—should guide content and UX decisions</li>
<li><strong>Professional Aesthetics Matter:</strong> In the VC industry, design quality directly impacts credibility and competitive positioning</li>
<li><strong>Clear Differentiation:</strong> With many VC firms competing for attention, unique value proposition must be immediately evident</li>
<li><strong>Conversion Path Optimization:</strong> Make it exceptionally easy for founders to determine fit and take the next step in engagement</li>
<li><strong>Content as Marketing:</strong> Thought leadership content attracts organic traffic and builds reputation beyond paid acquisition</li>
<li><strong>Mobile-First Necessity:</strong> Founders and investors increasingly access content from mobile devices during travel and meetings</li>
</ul>

<h3>Technical Excellence for Financial Services</h3>
<p>Building websites for venture capital firms requires attention to technical details that may not be as critical in other industries:</p>

<ul>
<li><strong>Enterprise-Grade Security:</strong> Protecting firm data, portfolio information, and submission details is paramount</li>
<li><strong>Performance Optimization:</strong> Slow sites undermine professional credibility—every millisecond of load time matters</li>
<li><strong>Data Privacy Compliance:</strong> Proper handling of personal information submitted through forms and tracked through analytics</li>
<li><strong>Accessibility Standards:</strong> Professional services websites must be accessible to all users regardless of ability</li>
<li><strong>Cross-Browser Compatibility:</strong> Flawless function across all browsers and devices without exception</li>
<li><strong>Scalable Architecture:</strong> Systems must accommodate growth in portfolio size, content volume, and traffic</li>
</ul>

<h3>Why This Project Matters to Us</h3>
<p>The Vixen Capital Advisors website represents the type of sophisticated professional services work we excel at—projects requiring deep understanding of industry dynamics, multi-stakeholder communication, and technical excellence. Venture capital firms operate at the intersection of finance, technology, and innovation, making them ideal clients for our full-service approach combining strategic thinking, exceptional design, and robust technical implementation.</p>

<p>This project showcases our ability to translate complex business models and value propositions into clear, compelling digital experiences that drive real business results. We're proud to partner with forward-thinking firms like Vixen Capital Advisors who understand that their website is not just a digital brochure but a critical business tool that attracts opportunities, builds relationships, and establishes market position.</p>

<h3>Conclusion</h3>
<p>The Vixen Capital Advisors website exemplifies what's possible when strategic thinking, professional design, and technical execution come together in service of a sophisticated business goal. By deeply understanding the venture capital industry, the needs of multiple stakeholder groups, and the importance of digital presence in competitive deal flow, we created a website that not only looks exceptional but delivers measurable business value.</p>

<p>For venture capital firms, professional services organizations, and financial institutions looking to elevate their digital presence, the Vixen Capital Advisors project demonstrates our capabilities and approach. We bring more than technical skills—we bring strategic partnership, industry understanding, and commitment to delivering solutions that drive business growth.</p>

<p>If your organization needs a digital presence that matches your professional standards and business ambitions, we'd welcome the opportunity to discuss how we can help you achieve your goals.</p>
`;
}

async function updatePortfolio(content) {
  console.log('📤 Updating portfolio item...');
  
  const updateData = {
    long_description: content,
    featured: true,
    featuredImage: '/portfolio/vixen-capital-advisors-screenshot.png'
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
    
    // Handle different response structures
    if (result.doc) {
      console.log(`🌟 Featured: ${result.doc.featured}`);
      return result;
    } else {
      console.log('📄 Response:', JSON.stringify(result, null, 2));
      return result;
    }
    
  } catch (error) {
    console.error('❌ Error updating portfolio:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Vixen Capital Advisors case study regeneration...\n');
  
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
    console.log(`📄 Portfolio item: ${result.doc.title}`);
    console.log(`🔗 Website: ${result.doc.website_url}`);
    console.log(`📸 Screenshot: ${result.doc.featuredImage}`);
    
  } catch (error) {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  }
}

main();
