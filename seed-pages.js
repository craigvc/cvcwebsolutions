const fetch = require('node-fetch');

async function seedPages() {
  console.log('🌱 Starting to seed pages...');
  
  const pages = [
    {
      title: 'About Us',
      slug: 'about',
      heroTitle: 'About CVC Web Solutions',
      heroSubtitle: 'Your Partner in Digital Excellence',
      content: `
        <h2>Who We Are</h2>
        <p>CVC Web Solutions is a full-service digital agency specializing in web development, hosting, and digital transformation. With years of experience in the industry, we've helped countless businesses establish and grow their online presence.</p>
        
        <h2>Our Mission</h2>
        <p>To provide innovative, reliable, and scalable digital solutions that help businesses thrive in the modern digital landscape.</p>
        
        <h2>Our Values</h2>
        <ul>
          <li><strong>Excellence:</strong> We strive for perfection in every project</li>
          <li><strong>Innovation:</strong> Always staying ahead with the latest technologies</li>
          <li><strong>Reliability:</strong> Your success is our commitment</li>
          <li><strong>Partnership:</strong> We grow together with our clients</li>
        </ul>
        
        <h2>Why Choose Us?</h2>
        <p>We combine technical expertise with creative vision to deliver solutions that not only meet but exceed expectations. Our managed hosting services ensure your website is always fast, secure, and available.</p>
      `,
      seoTitle: 'About Us - CVC Web Solutions',
      seoDescription: 'Learn about CVC Web Solutions, your trusted partner for web development, managed hosting, and digital transformation.',
      seoKeywords: 'about CVC, web development company, managed hosting provider, digital agency',
      status: 'published'
    },
    {
      title: 'Services',
      slug: 'services',
      heroTitle: 'Our Services',
      heroSubtitle: 'Comprehensive Digital Solutions for Your Business',
      content: `
        <h2>What We Offer</h2>
        <p>From web development to managed hosting, we provide end-to-end digital solutions tailored to your business needs.</p>
      `,
      sections: [
        {
          type: 'features',
          title: 'Our Core Services',
          subtitle: 'Everything you need for digital success',
          items: [
            {
              title: 'Web Development',
              description: 'Custom websites and web applications built with modern technologies'
            },
            {
              title: 'Managed Hosting',
              description: 'Fully managed WordPress and Magento hosting with 24/7 support'
            },
            {
              title: 'E-commerce Solutions',
              description: 'Complete online store setup and management'
            },
            {
              title: 'Mobile Development',
              description: 'Native and cross-platform mobile applications'
            },
            {
              title: 'AI Solutions',
              description: 'Leverage AI to automate and enhance your business processes'
            },
            {
              title: 'Design Services',
              description: 'UI/UX design, branding, and graphic design'
            }
          ]
        },
        {
          type: 'cta',
          title: 'Ready to Transform Your Business?',
          subtitle: 'Let us help you build your digital future'
        }
      ],
      seoTitle: 'Services - CVC Web Solutions',
      seoDescription: 'Explore our comprehensive range of digital services including web development, managed hosting, e-commerce, and more.',
      seoKeywords: 'web development services, managed hosting, e-commerce solutions, mobile development',
      status: 'published'
    },
    {
      title: 'Contact',
      slug: 'contact',
      heroTitle: 'Get in Touch',
      heroSubtitle: 'We\'d love to hear from you',
      content: `
        <h2>Contact Information</h2>
        <p>Ready to start your project or have questions? Reach out to us through any of the following channels:</p>
        
        <h3>Email</h3>
        <p><a href="mailto:info@cvcwebsolutions.com">info@cvcwebsolutions.com</a></p>
        
        <h3>Phone</h3>
        <p><a href="tel:1800HOSTING">1-800-HOSTING</a></p>
        
        <h3>Business Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM EST<br/>
        Saturday - Sunday: Emergency Support Only</p>
        
        <h2>Get a Free Consultation</h2>
        <p>Schedule a free consultation to discuss your project requirements and get expert advice on the best solutions for your business.</p>
      `,
      seoTitle: 'Contact Us - CVC Web Solutions',
      seoDescription: 'Get in touch with CVC Web Solutions for web development, hosting, and digital solutions. Free consultation available.',
      seoKeywords: 'contact CVC, web development inquiry, hosting support, free consultation',
      status: 'published'
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy',
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'Your privacy is important to us',
      content: `
        <p><strong>Last Updated: January 2024</strong></p>
        
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h2>Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@cvcwebsolutions.com.</p>
      `,
      seoTitle: 'Privacy Policy - CVC Web Solutions',
      seoDescription: 'Read our privacy policy to understand how CVC Web Solutions collects, uses, and protects your information.',
      seoKeywords: 'privacy policy, data protection, information security',
      status: 'published'
    },
    {
      title: 'Terms of Service',
      slug: 'terms',
      heroTitle: 'Terms of Service',
      heroSubtitle: 'Please read these terms carefully',
      content: `
        <p><strong>Effective Date: January 2024</strong></p>
        
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        
        <h2>Use of Services</h2>
        <p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates any applicable federal, state, local, or international law or regulation.</p>
        
        <h2>Intellectual Property</h2>
        <p>All content, features, and functionality on our website are owned by CVC Web Solutions and are protected by international copyright, trademark, and other intellectual property laws.</p>
        
        <h2>Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, CVC Web Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
        
        <h2>Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.</p>
        
        <h2>Contact Information</h2>
        <p>For questions about these Terms, please contact us at legal@cvcwebsolutions.com.</p>
      `,
      seoTitle: 'Terms of Service - CVC Web Solutions',
      seoDescription: 'Read the terms of service for using CVC Web Solutions services and website.',
      seoKeywords: 'terms of service, legal terms, service agreement',
      status: 'published'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const page of pages) {
    try {
      const response = await fetch('http://localhost:3000/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(page)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created page: ${page.title} (${page.slug})`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create page ${page.title}:`, error);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating page ${page.title}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding complete!');
  console.log(`✅ Successfully created: ${successCount} pages`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} pages`);
  }
}

// Run the seed function
seedPages().catch(console.error);
