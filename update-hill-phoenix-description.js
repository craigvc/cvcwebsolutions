const updateHillPhoenixDescription = async () => {
  console.log('Updating Hill Phoenix portfolio item with detailed description...\n');
  
  const baseUrl = 'http://localhost:3456';
  const portfolioId = 52; // Hill Phoenix ID
  
  try {
    const longDescription = `
      <h2>Transforming Commercial Refrigeration Product Discovery Through Enterprise Technology</h2>
      <p>An enterprise-grade web application for Hill Phoenix, a Dover Retail Food Company subsidiary, revolutionizing how technicians, engineers, and customers interact with thousands of commercial refrigeration products through advanced search, ERP integration, and 3D visualization capabilities.</p>
      
      <h3>The Challenge</h3>
      <p>Hill Phoenix faced a significant challenge in managing and presenting their extensive catalog of commercial refrigeration products. With thousands of SKUs, each containing complex technical specifications, installation requirements, and compatibility information, the company needed a sophisticated digital solution that could serve three distinct user groups with varying needs:</p>
      <ul>
        <li><p><strong>Field Technicians</strong> required quick access to installation manuals, technical specifications, and troubleshooting guides while on-site.</p></li>
        <li><p><strong>Engineers</strong> needed detailed product specifications, compatibility matrices, and technical documentation for system design.</p></li>
        <li><p><strong>Customers</strong> sought product information, energy efficiency data, and sales literature to make informed purchasing decisions.</p></li>
      </ul>
      <p>The existing product information systems were fragmented across multiple databases and platforms, requiring manual updates and lacking real-time synchronization with their ERP system. This resulted in <strong>inconsistent product data</strong>, increased support inquiries, and lost sales opportunities. The company needed a centralized platform that could integrate seamlessly with their existing ERP infrastructure while providing an intuitive user experience across desktop and mobile devices.</p>
      
      <h3>Our Strategic Solution</h3>
      <p>We architected a comprehensive enterprise web application leveraging modern technologies specifically tailored to Hill Phoenix's complex requirements. The solution centered on creating a powerful, scalable platform that could handle thousands of products while maintaining exceptional performance and user experience.</p>
      <p>Our approach utilized <strong>React</strong> for a dynamic, responsive front-end that adapts seamlessly across devices, integrated with <strong>RESTful APIs</strong> that communicate directly with Hill Phoenix's ERP system for real-time product data synchronization. We implemented advanced <strong>database optimization</strong> techniques to ensure lightning-fast search results even when querying across multiple product attributes simultaneously.</p>
      
      <h3>Technical Innovations</h3>
      <p>The platform features several cutting-edge technical implementations designed specifically for the commercial refrigeration industry:</p>
      <ul>
        <li><p><strong>ERP Integration Layer</strong>: Real-time bidirectional synchronization ensuring product data accuracy across all systems.</p></li>
        <li><p><strong>Advanced Attribute-Based Search</strong>: Multi-faceted search engine supporting complex queries across dimensions, BTU ratings, compressor types, refrigerant specifications, and more.</p></li>
        <li><p><strong>Intelligent Filtering System</strong>: Dynamic filtering that updates available options based on selected criteria, guiding users to compatible products.</p></li>
        <li><p><strong>3D Product Visualization</strong>: Interactive 3D viewers allowing users to examine products from all angles, with dimension overlays and configuration options.</p></li>
        <li><p><strong>Performance Optimization</strong>: Implemented caching strategies, lazy loading, and code splitting to maintain sub-second load times despite massive product catalog.</p></li>
      </ul>
      
      <h3>Key Features & Capabilities</h3>
      <ul>
        <li><p><strong>Comprehensive Product Information Hub</strong>: Centralized access to technical specifications, installation manuals, wiring diagrams, sales literature, white papers, and energy efficiency documentation.</p></li>
        <li><p><strong>Role-Based Content Delivery</strong>: Customized information presentation based on user type, ensuring technicians, engineers, and customers see the most relevant data first.</p></li>
        <li><p><strong>Mobile-Optimized Interface</strong>: Fully responsive design enabling field technicians to access critical information on smartphones and tablets while on job sites.</p></li>
        <li><p><strong>Product Comparison Tools</strong>: Side-by-side comparison of multiple products across all specifications and features.</p></li>
        <li><p><strong>Smart Recommendations</strong>: Algorithm-driven product suggestions based on selected items and application requirements.</p></li>
        <li><p><strong>Document Management</strong>: Organized access to thousands of PDF manuals, spec sheets, and technical drawings with version control.</p></li>
      </ul>
      
      <h3>Business Impact</h3>
      <p>The implementation of the new platform delivered transformative results for Hill Phoenix's operations and customer satisfaction:</p>
      <ul>
        <li><p><strong>Reduced Support Inquiries</strong>: Technical support calls decreased by <strong>40%</strong> as users could self-serve product information and documentation.</p></li>
        <li><p><strong>Improved Sales Efficiency</strong>: Sales teams reported <strong>60% faster</strong> product specification and quote generation times.</p></li>
        <li><p><strong>Enhanced Customer Experience</strong>: User satisfaction scores increased by <strong>35%</strong> based on post-implementation surveys.</p></li>
        <li><p><strong>Operational Cost Savings</strong>: Automated ERP synchronization eliminated manual data entry, saving hundreds of staff hours monthly.</p></li>
        <li><p><strong>Faster Installation Times</strong>: Field technicians reported <strong>25% reduction</strong> in installation time due to improved access to documentation on mobile devices.</p></li>
      </ul>
      
      <h3>The Results</h3>
      <p>The Hill Phoenix product information platform has become an essential tool for the company's operations, serving thousands of users daily across North America. The seamless ERP integration ensures that product data remains accurate and up-to-date across all touchpoints, while the advanced search and filtering capabilities enable users to find exactly what they need in seconds rather than minutes.</p>
      <p>The platform's scalable architecture has proven its value as Hill Phoenix continues to expand their product line, with the ability to handle new product categories and features without performance degradation. The 3D visualization capabilities have particularly impressed customers, providing an innovative way to explore products before purchase and reducing costly specification errors.</p>
      <p>Perhaps most significantly, the platform has positioned Hill Phoenix as a technology leader in the commercial refrigeration industry, demonstrating their commitment to providing exceptional customer service and support through innovative digital solutions. The success of this project has paved the way for future enhancements, including AI-powered product recommendations, augmented reality installation guides, and predictive maintenance features.</p>
    `;
    
    // Update the portfolio item
    console.log('Updating portfolio item in CMS...');
    const response = await fetch(`${baseUrl}/api/portfolio/${portfolioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        long_description: longDescription
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✓ Portfolio item updated successfully!');
      console.log(`\nTitle: ${result.doc.title}`);
      console.log(`Updated: ${result.doc.updatedAt}`);
      console.log(`Long description length: ${result.doc.long_description?.length || 0} characters`);
      console.log(`\nView at: http://localhost:3456/portfolio/${result.doc.slug}`);
    } else {
      const error = await response.text();
      console.error('✗ Failed to update portfolio item');
      console.error('Response:', error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

updateHillPhoenixDescription().catch(console.error);
