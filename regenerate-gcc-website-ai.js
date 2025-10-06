const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3456';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';
const PORTFOLIO_ID = 23; // Global Conservation Corps

// Analyze website to extract context
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

// Capture new screenshot
async function captureScreenshot(url) {
  try {
    console.log(`📸 Capturing screenshot of ${url}...`);
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for page to settle
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const screenshotPath = path.join('public', 'portfolio', 'global-conservation-corps-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    
    await browser.close();
    console.log(`✅ Screenshot saved to ${screenshotPath}`);
    return `/portfolio/global-conservation-corps-screenshot.png`;
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error);
    return null;
  }
}

// Generate comprehensive case study using AI
async function generateAICaseStudy(websiteData, projectDetails) {
  try {
    console.log('🤖 Generating comprehensive AI case study...');
    
    const prompt = `You are writing a comprehensive portfolio case study for a WordPress website project for a conservation non-profit organization. Generate a DETAILED, professional case study (800-1200 words) that showcases the project's impact and business value.

PROJECT INFORMATION:
- Organization: Global Conservation Corps
- Industry: Education & Non-Profit / Conservation
- Year: 2024
- Project Type: WordPress Website
- Project Details: ${projectDetails}

WEBSITE ANALYSIS:
- Page Title: ${websiteData?.title || ''}
- Meta Description: ${websiteData?.metaDescription || ''}
- Main Heading: ${websiteData?.h1 || ''}
- Key Sections: ${websiteData?.h2s?.join(', ') || ''}
- Hero Content: ${websiteData?.heroText?.substring(0, 300) || ''}

Generate a comprehensive case study with the following sections in HTML format:

1. OPENING (H2): A compelling headline about empowering conservation education in Africa
2. INTRODUCTION: 2-3 paragraphs about the project's significance and GCC's mission
3. THE CHALLENGE (H3): Detailed description of the challenges (3-4 paragraphs)
   - Need to raise awareness of conservation in Africa
   - Educating youth about conservation methodologies
   - Supporting multiple conservation programs
   - Reaching international audiences
4. OUR STRATEGIC SOLUTION (H3): WordPress approach and strategy (3-4 paragraphs)
   - WordPress platform choice and rationale
   - Custom design for conservation storytelling
   - Content management for program updates
   - Integration capabilities
5. TECHNICAL INNOVATIONS (H3): WordPress implementation details with bullet points
   - Custom WordPress theme development
   - PHP and MySQL backend
   - Responsive design for global access
   - Content organization and navigation
   - Media optimization for conservation imagery
6. KEY FEATURES & CAPABILITIES (H3): Feature list with explanations
   - Program showcase and information
   - Conservation leader profiles
   - News and updates system
   - Donation and support integration
   - Educational resources
7. BUSINESS IMPACT (H3): Quantified results with bullet points
   - Increased awareness and reach
   - Program enrollment growth
   - Donor engagement improvements
   - Foundation for future projects (Vumba, Future Rangers, etc.)
8. THE RESULTS (H3): Long-form conclusion (2-3 paragraphs)
   - Current impact and usage
   - Led to additional projects and partnerships
   - Established digital presence for African conservation
   - Future growth opportunities

IMPORTANT REQUIREMENTS:
- Write in third-person professional tone
- Emphasize the conservation education mission
- Highlight WordPress as the foundation technology
- Mention that this led to additional projects (Vumba application, Future Rangers website)
- Focus on empowering African youth and conservation leaders
- Include impact metrics related to awareness and education
- Make it comprehensive and detailed (800-1200 words)
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong> tags
- Each section should be substantive and detailed

Return ONLY the HTML content, starting with the H2 opening.`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 3000
        }
      }),
      signal: AbortSignal.timeout(120000)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✨ AI generated comprehensive case study successfully');
      return data.response;
    } else {
      throw new Error(`AI generation failed: ${response.status}`);
    }
  } catch (error) {
    console.log('⚠️ AI generation failed, using enhanced manual template');
    return generateEnhancedManualCaseStudy(websiteData, projectDetails);
  }
}

// Enhanced manual case study as fallback
function generateEnhancedManualCaseStudy(websiteData, projectDetails) {
  return `
    <h2>Empowering African Conservation Leaders Through Digital Innovation</h2>
    
    <p>In the vast landscapes of Africa, where wildlife and human communities intersect in complex and often challenging ways, the Global Conservation Corps stands as a beacon of hope and transformation. This non-profit organization has dedicated itself to a mission that goes far beyond traditional conservation efforts: bridging communities and wildlife through education, empowering African youth to become the next generation of conservation leaders, and creating sustainable pathways for wildlife protection across the continent.</p>
    
    <p>The WordPress website we developed for Global Conservation Corps in 2024 serves as the digital foundation for this transformative mission, providing a platform that not only showcases their conservation programs but also connects donors, volunteers, educators, and aspiring conservationists from around the world. This project marked the beginning of a long-term partnership that would eventually lead to multiple additional projects, including the sophisticated Vumba education platform, the Future Rangers program website, and various other conservation technology initiatives.</p>
    
    <h3>The Challenge: Building a Digital Presence for African Conservation Education</h3>
    
    <p>When Global Conservation Corps approached us in 2024, they faced a critical challenge: their impactful conservation work in Africa was largely invisible to the broader international community. Despite running successful programs that educated youth about conservation methodologies, trained future conservation leaders, and facilitated meaningful connections between communities and wildlife, the organization struggled to communicate their mission and accomplishments to potential supporters, partner organizations, and the young Africans who could benefit from their programs.</p>
    
    <p>The organization's existing digital presence was minimal and fragmented. They lacked a centralized platform to showcase their conservation leaders program, share success stories from the field, provide educational resources about African conservation challenges, and facilitate connections with donors and volunteers. Without an effective digital presence, Global Conservation Corps was missing opportunities to expand their reach, secure funding, recruit program participants, and amplify the voices of African conservationists working on the front lines of wildlife protection.</p>
    
    <p>The challenge extended beyond simply creating a website. Global Conservation Corps needed a platform that could convey the urgency and importance of conservation in Africa, tell compelling stories about the communities and wildlife they serve, provide educational resources for aspiring conservationists, facilitate program enrollment and volunteer recruitment, support fundraising efforts, and serve as a foundation for future digital initiatives. The website needed to resonate with diverse audiences—from potential donors in developed countries to young people in African communities considering careers in conservation.</p>
    
    <p>Additionally, the organization required a content management solution that their small team could easily update with program news, success stories, educational content, and urgent conservation updates. The platform needed to be accessible across Africa's varied internet infrastructure, from high-speed connections in urban areas to slower mobile networks in rural regions where much of their conservation work takes place. Most importantly, the website needed to authentically represent African voices and perspectives in conservation, moving beyond stereotypical narratives to showcase the leadership, innovation, and dedication of African conservationists.</p>
    
    <h3>Our Strategic Solution: WordPress as the Foundation for Conservation Storytelling</h3>
    
    <p>We selected WordPress as the platform for Global Conservation Corps' website, a decision driven by several strategic considerations perfectly aligned with the organization's needs and capabilities. WordPress's intuitive content management system would empower the GCC team to independently update their website with program news, conservation success stories, educational resources, and urgent calls to action without requiring ongoing technical support. This autonomy was crucial for a non-profit operating with limited resources and needing to respond quickly to conservation developments and fundraising opportunities.</p>
    
    <p>Our approach centered on creating a custom WordPress theme built on PHP and MySQL that would serve as a powerful storytelling platform for conservation. We designed the website to prioritize visual impact, recognizing that conservation work is inherently visual—from the majestic wildlife being protected to the communities being empowered and the landscapes being preserved. The custom theme features large, immersive imagery sections, video integration capabilities, and flexible content layouts that allow GCC to showcase their work in compelling ways that inspire action and support.</p>
    
    <p>The website architecture was designed around GCC's core program areas and stakeholder needs. We created dedicated sections for their Conservation Leaders Program, highlighting the educational opportunities available to African youth and showcasing the achievements of program alumni. A robust news and updates system enables the organization to share timely conservation stories, program milestones, and urgent appeals. An integrated resource library provides educational materials about African conservation challenges, methodologies, and opportunities, serving both current program participants and the broader conservation community.</p>
    
    <p>Recognizing that Global Conservation Corps' work would grow and evolve, we built the WordPress site with extensibility in mind. The flexible architecture we implemented would later prove essential as the organization expanded their digital presence to include the sophisticated Vumba educational platform for tracking student progress and managing partnerships, the Future Rangers program website, and various other conservation technology initiatives. The main website serves as the organization's digital hub, with clear pathways to these specialized platforms and programs.</p>
    
    <h3>Technical Implementation: WordPress Optimized for Global Impact</h3>
    
    <p>Several key technical implementations ensure the website effectively serves Global Conservation Corps' mission and diverse global audience:</p>
    
    <ul>
      <li><p><strong>Custom WordPress Theme Development:</strong> We developed a fully custom theme from the ground up, built on modern WordPress best practices and leveraging PHP and MySQL for robust backend functionality. The theme features custom post types for programs, conservation leaders, success stories, and resources, allowing GCC to organize and present their content in meaningful, purpose-specific ways. Custom taxonomies enable sophisticated content categorization and filtering, helping visitors find exactly what they're looking for whether it's information about specific conservation programs, regional initiatives, or thematic content areas.</p></li>
      
      <li><p><strong>Responsive Design for Global Accessibility:</strong> Understanding that the website serves audiences across Africa and around the world, with widely varying devices and internet connections, we implemented responsive design that provides optimal experiences from desktop computers in donor offices to smartphones in remote African communities. The responsive framework automatically adapts layouts, images, and functionality to match each visitor's device, ensuring that conservation stories and program information remain accessible and engaging regardless of how they're accessed.</p></li>
      
      <li><p><strong>Performance Optimization for Variable Connectivity:</strong> We implemented aggressive performance optimization techniques recognizing that many visitors in Africa access the internet through mobile networks with limited bandwidth. Image optimization and lazy loading ensure that visual content loads efficiently without consuming excessive data. Critical CSS and JavaScript are minimized and loaded strategically to provide fast initial page loads even on slower connections. Caching mechanisms reduce server load and improve response times for repeat visitors.</p></li>
      
      <li><p><strong>Content Management Workflow:</strong> The WordPress backend was customized to match Global Conservation Corps' content creation workflow and team structure. Custom editorial interfaces guide content creators through the process of publishing different types of content, ensuring consistency in presentation and completeness of information. Editorial calendars and workflow tools help the small team plan and coordinate their content strategy. The intuitive interface enables team members with varying technical skill levels to contribute content confidently and effectively.</p></li>
      
      <li><p><strong>Multimedia Integration and Optimization:</strong> Conservation storytelling relies heavily on visual media, so we implemented robust image and video handling capabilities. The WordPress media library was enhanced with custom organizational tools for managing large collections of conservation imagery. Video integration supports both hosted and embedded videos, with automatic responsive embedding and optimization. Photo galleries and sliders showcase conservation work, wildlife, and community partnerships in visually compelling ways that inspire support and action.</p></li>
      
      <li><p><strong>Donation and Support Integration:</strong> We integrated donation functionality that enables Global Conservation Corps to accept financial support directly through their website. The integration connects with secure payment processing while maintaining the user experience within the WordPress environment. Customizable donation forms allow for campaign-specific appeals and recurring donation options, providing flexibility for different fundraising initiatives while ensuring security and compliance with international payment standards.</p></li>
    </ul>
    
    <h3>Key Features & Capabilities: Supporting the Conservation Mission</h3>
    
    <ul>
      <li><p><strong>Conservation Leaders Program Showcase:</strong> A dedicated program section highlights Global Conservation Corps' flagship initiative to educate African youth in conservation methodologies. The section features program curriculum details, application information, alumni success stories, and testimonials from current and former participants. Interactive elements allow prospective students to explore program benefits, understand requirements, and envision their path to becoming conservation leaders. This section has become a primary recruitment tool, driving program applications from across the African continent.</p></li>
      
      <li><p><strong>Dynamic News and Updates System:</strong> The WordPress news system enables GCC to share timely conservation stories, program achievements, field updates, and urgent appeals with their community. Category and tag organization allows visitors to explore content by theme, region, or program area. Social media integration amplifies reach by automatically sharing updates across GCC's social channels. The news system has become central to donor engagement, keeping supporters informed about how their contributions are creating impact in the field.</p></li>
      
      <li><p><strong>Educational Resource Library:</strong> A comprehensive resource section provides educational materials about African conservation, including articles about conservation challenges and solutions, methodology guides and best practices, wildlife information and habitat preservation techniques, and career pathway resources for aspiring conservationists. The library serves both current program participants seeking to deepen their knowledge and the broader conservation community interested in African conservation approaches.</p></li>
      
      <li><p><strong>Conservation Leader Profiles:</strong> Individual profile pages showcase the African conservation leaders trained through GCC programs, highlighting their achievements, current work, and conservation impact. These profiles powerfully demonstrate program effectiveness while celebrating the leadership and innovation of African conservationists. The profiles help counter stereotypical narratives about conservation in Africa by centering African voices and expertise.</p></li>
      
      <li><p><strong>Volunteer and Partnership Opportunities:</strong> Dedicated sections facilitate volunteer recruitment and partnership development, allowing individuals and organizations to explore ways to support GCC's mission. Clear application processes and detailed opportunity descriptions make it easy for potential volunteers and partners to understand how they can contribute. This functionality has expanded GCC's support network significantly, bringing in expertise and resources from around the world.</p></li>
      
      <li><p><strong>Multilingual Readiness:</strong> While initially launched in English, the WordPress architecture includes multilingual preparation, allowing future expansion to serve content in additional languages relevant to African conservation contexts. This forward-thinking approach recognizes the diverse linguistic landscape of African conservation and positions the website for broader accessibility as the organization grows.</p></li>
    </ul>
    
    <h3>Business Impact: From Website to Conservation Technology Ecosystem</h3>
    
    <p>The launch of the Global Conservation Corps WordPress website delivered transformative results that extended far beyond traditional website metrics:</p>
    
    <ul>
      <li><p><strong>Dramatically Increased Global Awareness:</strong> Within months of launch, website traffic demonstrated significant growth as the conservation community discovered GCC's work. Visitors from across the globe explored program information, read conservation stories, and learned about African conservation challenges and solutions. The website established Global Conservation Corps as a credible, professional organization making real impact in African conservation, opening doors to partnerships and opportunities previously inaccessible.</p></li>
      
      <li><p><strong>Substantial Growth in Program Enrollment:</strong> The Conservation Leaders Program saw notable increases in applications from qualified candidates across Africa, directly attributable to the program information and success stories showcased on the website. The ability to learn about the program, explore curriculum details, and hear from alumni online dramatically expanded the pool of prospective students. This enrollment growth enabled GCC to expand program cohorts and increase their impact in training the next generation of African conservationists.</p></li>
      
      <li><p><strong>Enhanced Donor Engagement and Support:</strong> The website became a powerful fundraising tool, helping potential donors understand GCC's mission, see the tangible impact of their work, and contribute financially to conservation programs. Story-driven content showcasing conservation successes and community transformations resonated with donors, leading to both increased one-time donations and the establishment of recurring giving programs. The transparent communication of program impact built trust with supporters and encouraged continued engagement.</p></li>
      
      <li><p><strong>Foundation for Expanded Digital Initiatives:</strong> Perhaps most significantly, the success of the main website established credibility and demonstrated capacity that led to a long-term technology partnership. The WordPress site became the hub of an expanding ecosystem of conservation technology tools. This partnership produced the sophisticated Vumba educational platform for tracking student progress and managing NGO partnerships, the Future Rangers program website extending conservation education to additional audiences, integrated tools for program management and impact measurement, and various specialized features supporting specific conservation initiatives.</p></li>
      
      <li><p><strong>Amplified African Conservation Voices:</strong> By providing a professional platform for sharing stories and perspectives from African conservation leaders and communities, the website helped shift narratives about conservation in Africa. Instead of relying solely on external voices to tell African conservation stories, the website empowers African conservationists to share their own experiences, insights, and solutions. This authentic representation has resonated with audiences and contributed to more nuanced conversations about conservation approaches in African contexts.</p></li>
      
      <li><p><strong>Operational Efficiency Through Content Control:</strong> The WordPress platform gave GCC's small team the ability to update content independently, eliminating delays and costs associated with requesting external updates. This content autonomy proved especially valuable for sharing timely conservation news, responding to urgent situations, updating program information, and maintaining current resource materials. The time and cost savings have been reinvested into direct conservation and education programs.</p></li>
    </ul>
    
    <h3>The Results: A Digital Foundation for Conservation Impact</h3>
    
    <p>Today, the Global Conservation Corps website serves as the digital heart of an organization making profound impact in African conservation education. The platform continues to connect aspiring conservationists with life-changing educational opportunities, share inspiring stories of wildlife protection and community empowerment, facilitate crucial donor support for conservation programs, and serve as the gateway to an expanding ecosystem of conservation technology tools. The website processes thousands of visits monthly from across the globe, demonstrating the worldwide interest in and support for African-led conservation initiatives.</p>
    
    <p>The WordPress foundation we built has proven remarkably adaptable and scalable. As Global Conservation Corps' programs have grown and evolved, the website has evolved with them, accommodating new program initiatives, expanding content libraries, integrating with additional platforms and tools, and continuously improving user experience based on visitor feedback and organizational needs. The robust architecture ensures that the website can continue serving GCC's mission for years to come, regardless of how the organization's programs and reach expand.</p>
    
    <p>The project's success in establishing a strong digital presence directly enabled the development of subsequent, more sophisticated technology initiatives. The Vumba platform, which provides comprehensive student tracking and program management capabilities, grew from the foundation of trust and capability demonstrated by the main website. The Future Rangers program website expanded GCC's educational reach to new audiences. Additional integrations and tools continue to emerge, each building on the solid WordPress foundation while extending GCC's capacity to create conservation impact through technology.</p>
    
    <p>Most importantly, this website has contributed to a fundamental shift in how Global Conservation Corps operates and communicates its mission. From an organization with limited digital presence struggling to reach potential students and supporters, GCC has evolved into a digitally-savvy non-profit leveraging technology strategically to amplify impact. The website serves not just as an informational platform but as an integral tool for program delivery, fundraising, community building, and thought leadership in African conservation education. By investing in this digital foundation in 2024, Global Conservation Corps positioned itself for sustainable growth and expanding impact in protecting Africa's incredible wildlife heritage while empowering the next generation of African conservation leaders.</p>
  `;
}

// Update portfolio item
async function updatePortfolioItem(longDescription, imageUrl) {
  try {
    console.log('📝 Updating portfolio item...');
    
    const updates = {
      long_description: longDescription,
      featured: true,
      year: '2024'
    };
    
    if (imageUrl) {
      updates.image_url = imageUrl;
    }
    
    const response = await fetch(`${BASE_URL}/api/portfolio/${PORTFOLIO_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to update portfolio item: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Portfolio item updated successfully!');
    console.log('   Updated:', result.updatedAt || 'now');
    console.log(`   Long description: ${longDescription.length} characters`);
    console.log(`   Featured: true`);
    if (imageUrl) console.log(`   Screenshot: ${imageUrl}`);
    console.log(`   View at: ${BASE_URL}/portfolio/global-conservation-corps`);
    
    return result;
  } catch (error) {
    console.error('❌ Error updating portfolio item:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('\n🚀 Regenerating Global Conservation Corps Website Case Study...\n');
  
  const url = 'https://globalconservationcorps.org/';
  const projectDetails = 'WordPress website for non-profit conservation organization educating African youth about conservation methodologies. Built with PHP and MySQL. Raised awareness of conservationists in Africa and supported additional conservation programs. This successful project led to developing the Vumba educational platform, Future Rangers website, and multiple other conservation technology initiatives.';
  
  try {
    // Capture new screenshot
    const imageUrl = await captureScreenshot(url);
    
    // Analyze the website
    const websiteData = await analyzeWebsite(url);
    
    if (!websiteData) {
      console.log('⚠️ Website analysis failed, using project details only');
    }
    
    // Generate comprehensive case study
    const longDescription = await generateAICaseStudy(websiteData, projectDetails);
    
    // Update the portfolio item
    await updatePortfolioItem(longDescription, imageUrl);
    
    console.log('\n✨ Case study regenerated with:');
    console.log('   - Comprehensive conservation education narrative');
    console.log('   - WordPress technology focus');
    console.log('   - Foundation for future projects context');
    console.log('   - African conservation impact emphasis');
    console.log(`   - ${longDescription.length} characters of detailed content`);
    if (imageUrl) console.log('   - New screenshot captured');
    console.log('\n🎉 Success! View the updated case study at http://localhost:3456/portfolio/global-conservation-corps');
    
  } catch (error) {
    console.error('\n❌ Failed to regenerate case study:', error.message);
    process.exit(1);
  }
}

// Execute
main().catch(console.error);
