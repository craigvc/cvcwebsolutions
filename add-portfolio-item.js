const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3456';

// Portfolio item data
const portfolioData = {
  title: "Vixen Capital Advisors",
  subtitle: "Professional WordPress website for financial advisory firm",
  description: "We developed a sophisticated WordPress website for Vixen Capital Advisors, establishing their professional online presence to attract high-net-worth clients and showcase their financial advisory expertise.",
  slug: "vixen-capital-advisors",
  category: "Web Development",
  clientCategory: "Financial Services",
  url: "https://vixen-capital-advisors.com/",
  live_url: "https://vixen-capital-advisors.com/",
  year: "2024",
  status: "published",
  featured: true,
  display_order: 10,
  
  // Long description with HTML formatting
  long_description: `
    <h2>The Problem</h2>
    <p>Vixen Capital Advisors needed a professional web presence that would effectively communicate their expertise in financial advisory services and build trust with potential high-net-worth clients. Their lack of online presence was limiting their ability to reach new clients and showcase their financial expertise in an increasingly digital marketplace.</p>
    
    <h3>The Goal</h3>
    <p>Create a professional WordPress website that would:</p>
    <ul>
      <li>Establish trust and credibility with high-net-worth individuals</li>
      <li>Clearly communicate their financial advisory services</li>
      <li>Provide easy ways for potential clients to get in touch</li>
      <li>Showcase their expertise through content and resources</li>
    </ul>
    
    <h3>The Solution</h3>
    <p>We built a custom <strong>WordPress</strong> website with a professional design that reflects the sophistication of their financial services. The site features a custom theme optimized for performance, integrated contact forms, and a content management system that allows them to easily update their market insights and resources.</p>
    <p>Key features implemented:</p>
    <ul>
      <li>Custom WordPress theme with professional financial services design</li>
      <li>Mobile-responsive layout for optimal viewing on all devices</li>
      <li>SEO optimization for improved search visibility</li>
      <li>Secure contact forms with spam protection</li>
      <li>Easy-to-manage content system for market updates</li>
    </ul>
    
    <h3>The Impact</h3>
    <p>The new WordPress website has established Vixen Capital Advisors' professional online presence, resulting in increased credibility and lead generation. The site effectively communicates their expertise and has become a valuable tool for attracting and converting high-net-worth clients.</p>
  `,
  
  achievements: [
    { achievement: "Delivered a professional WordPress website that establishes strong brand credibility" },
    { achievement: "Implemented responsive design achieving excellent mobile performance scores" },
    { achievement: "Created SEO-optimized content structure improving search rankings" },
    { achievement: "Built user-friendly contact systems increasing lead generation" },
    { achievement: "Established scalable content management for easy updates and maintenance" }
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
    { technology: "SSL Certificate" },
    { technology: "Google Analytics" },
    { technology: "Cloudflare" }
  ],
  
  tags: [
    { tag: "WordPress" },
    { tag: "Financial Services" },
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

async function createPortfolioItem() {
  try {
    console.log('Creating portfolio item for:', portfolioData.title);
    console.log('API URL:', `${BASE_URL}/api/portfolio`);
    
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
    console.log('ID:', result.id);
    console.log('Slug:', result.slug);
    console.log('View at:', `${BASE_URL}/portfolio/${result.slug}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating portfolio item:', error);
    process.exit(1);
  }
}

// Execute the script
createPortfolioItem().then(() => {
  console.log('\n✨ Done! Portfolio item has been added to the database.');
  process.exit(0);
});
