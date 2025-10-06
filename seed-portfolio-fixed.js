const seedPortfolio = async () => {
  console.log('Starting portfolio seeding via API...');
  
  const baseUrl = 'http://localhost:3000';
  
  const projects = [
    {
      title: 'HealthTrack Mobile App',
      slug: 'healthtrack-mobile-app',
      category: 'Mobile Apps',
      description: 'AI-powered health monitoring app with real-time analytics and personalized recommendations for wellness tracking',
      featured: true,
      status: 'published',
      year: '2024',
      url: 'https://healthtrack.example.com',
      challenge: 'Users needed a comprehensive health tracking solution that could integrate with multiple devices and provide actionable insights',
      solution: 'Developed a React Native app with AI-powered analytics, device integration, and personalized health recommendations',
      tags: [
        { tag: 'React Native' },
        { tag: 'TypeScript' },
        { tag: 'Node.js' },
        { tag: 'AI/ML' }
      ],
      achievements: [
        { achievement: '50,000+ active users' },
        { achievement: '4.8 star rating on app stores' },
        { achievement: '30% improvement in user health metrics' }
      ],
      technologies: [
        { technology: 'React Native' },
        { technology: 'TensorFlow' },
        { technology: 'Firebase' },
        { technology: 'Node.js' }
      ]
    },
    {
      title: 'E-Commerce Marketplace Platform',
      slug: 'e-commerce-marketplace-platform',
      category: 'E-Commerce',
      description: 'Multi-vendor marketplace with advanced inventory management, payment processing, and logistics integration',
      featured: true,
      status: 'published',
      year: '2023',
      url: 'https://marketplace.example.com',
      challenge: 'Client needed a scalable marketplace solution to handle thousands of vendors and millions of products',
      solution: 'Built a microservices-based architecture with Next.js frontend, supporting real-time inventory updates and multi-currency transactions',
      tags: [
        { tag: 'Next.js' },
        { tag: 'React' },
        { tag: 'Stripe' },
        { tag: 'PostgreSQL' }
      ],
      achievements: [
        { achievement: '$10M+ in transactions processed' },
        { achievement: '5,000+ active vendors' },
        { achievement: '99.9% uptime achieved' }
      ],
      technologies: [
        { technology: 'Next.js' },
        { technology: 'Node.js' },
        { technology: 'PostgreSQL' },
        { technology: 'Redis' }
      ]
    },
    {
      title: 'Financial Analytics Dashboard',
      slug: 'financial-analytics-dashboard',
      category: 'Financial Services',
      description: 'Real-time financial data visualization platform with predictive analytics and automated reporting',
      featured: false,
      status: 'published',
      year: '2024',
      url: 'https://finanalytics.example.com',
      challenge: 'Financial advisors needed a tool to visualize complex data and generate client reports efficiently',
      solution: 'Created an interactive dashboard with D3.js visualizations, real-time data streaming, and automated PDF report generation',
      tags: [
        { tag: 'React' },
        { tag: 'D3.js' },
        { tag: 'Python' },
        { tag: 'WebSockets' }
      ],
      achievements: [
        { achievement: '80% reduction in report generation time' },
        { achievement: 'Processing 1M+ data points daily' },
        { achievement: 'Used by 200+ financial advisors' }
      ],
      technologies: [
        { technology: 'React' },
        { technology: 'D3.js' },
        { technology: 'Python' },
        { technology: 'Apache Kafka' }
      ]
    },
    {
      title: 'Creative Portfolio Builder',
      slug: 'creative-portfolio-builder',
      category: 'Arts & Creative',
      description: 'Drag-and-drop portfolio website builder specifically designed for artists and creative professionals',
      featured: false,
      status: 'published',
      year: '2023',
      url: 'https://portfoliobuilder.example.com',
      challenge: 'Artists needed an easy way to showcase their work online without technical knowledge',
      solution: 'Developed a no-code platform with customizable templates, integrated e-commerce, and social media features',
      tags: [
        { tag: 'Vue.js' },
        { tag: 'Nuxt.js' },
        { tag: 'Tailwind CSS' },
        { tag: 'Cloudinary' }
      ],
      achievements: [
        { achievement: '10,000+ portfolios created' },
        { achievement: 'Average setup time under 30 minutes' },
        { achievement: 'Featured in Creative Tools Magazine' }
      ],
      technologies: [
        { technology: 'Vue.js' },
        { technology: 'Nuxt.js' },
        { technology: 'MongoDB' },
        { technology: 'AWS S3' }
      ]
    },
    {
      title: 'Educational Learning Platform',
      slug: 'educational-learning-platform',
      category: 'Education & Nonprofit',
      description: 'Interactive online learning platform with video courses, quizzes, and progress tracking for K-12 students',
      featured: true,
      status: 'published',
      year: '2024',
      url: 'https://edulearn.example.com',
      challenge: 'Schools needed a comprehensive remote learning solution during and after the pandemic',
      solution: 'Built a full-featured LMS with live classes, assignment management, and parent portals',
      tags: [
        { tag: 'React' },
        { tag: 'WebRTC' },
        { tag: 'Node.js' },
        { tag: 'MongoDB' }
      ],
      achievements: [
        { achievement: 'Supporting 100+ schools' },
        { achievement: '500,000+ students enrolled' },
        { achievement: '95% satisfaction rate' }
      ],
      technologies: [
        { technology: 'React' },
        { technology: 'WebRTC' },
        { technology: 'Socket.io' },
        { technology: 'AWS' }
      ]
    },
    {
      title: 'Smart Home IoT Dashboard',
      slug: 'smart-home-iot-dashboard',
      category: 'Web Development',
      description: 'Centralized control system for smart home devices with automation rules and energy monitoring',
      featured: false,
      status: 'published',
      year: '2023',
      url: 'https://smarthome.example.com',
      challenge: 'Homeowners wanted a single interface to control various smart home devices from different manufacturers',
      solution: 'Developed a universal dashboard with device integration APIs, automation engine, and mobile app',
      tags: [
        { tag: 'React' },
        { tag: 'MQTT' },
        { tag: 'Node-RED' },
        { tag: 'Docker' }
      ],
      achievements: [
        { achievement: '20% average energy savings' },
        { achievement: 'Supporting 50+ device types' },
        { achievement: 'Zero-downtime deployment' }
      ],
      technologies: [
        { technology: 'React' },
        { technology: 'MQTT' },
        { technology: 'InfluxDB' },
        { technology: 'Grafana' }
      ]
    }
  ];

  for (const project of projects) {
    try {
      const response = await fetch(`${baseUrl}/api/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      });

      const data = await response.text();
      
      if (response.ok) {
        const result = JSON.parse(data);
        console.log(`✓ Created project: ${project.title}`);
      } else {
        console.error(`✗ Failed to create ${project.title}: ${data}`);
      }
    } catch (error) {
      console.error(`✗ Error creating ${project.title}:`, error.message);
    }
  }

  console.log('\nPortfolio seeding completed!');
};

// Run the seeding
seedPortfolio().catch(console.error);
