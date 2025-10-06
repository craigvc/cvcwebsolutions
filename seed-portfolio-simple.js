const fetch = require('node-fetch');

const seedPortfolio = async () => {
  console.log('🌱 Starting portfolio seeding with simple categories...');

  const baseUrl = 'http://localhost:3456';

  const projects = [
    {
      title: 'HealthTrack Mobile App',
      category: 'mobile-apps',
      description: 'AI-powered health monitoring app with personalized wellness recommendations and telemedicine integration.',
      featured: true,
      status: 'published',
      year: '2024',
      url: 'https://healthtrack.app',
      tags: [
        { tag: 'React Native' },
        { tag: 'AI/ML' },
        { tag: 'Healthcare' }
      ],
      achievements: [
        { achievement: '100,000+ downloads in first 6 months' },
        { achievement: '4.8/5 App Store rating' },
        { achievement: '40% reduction in unnecessary doctor visits' }
      ],
      technologies: [
        { technology: 'React Native' },
        { technology: 'TensorFlow' },
        { technology: 'Firebase' }
      ]
    },
    {
      title: 'E-Commerce Marketplace Platform',
      category: 'E-Commerce',
      description: 'Multi-vendor marketplace platform with AI-driven product recommendations and seamless payment integration.',
      featured: false,
      status: 'published',
      year: '2023',
      url: 'https://marketplace.example.com',
      tags: [
        { tag: 'Next.js' },
        { tag: 'Stripe' },
        { tag: 'PostgreSQL' }
      ],
      achievements: [
        { achievement: '$2M+ in transactions processed' },
        { achievement: '500+ active vendors' },
        { achievement: '35% increase in average order value' }
      ],
      technologies: [
        { technology: 'Next.js' },
        { technology: 'Stripe API' },
        { technology: 'PostgreSQL' }
      ]
    },
    {
      title: 'Financial Analytics Dashboard',
      category: 'Financial Services',
      description: 'Real-time financial analytics platform for investment firms with advanced data visualization.',
      featured: false,
      status: 'published',
      year: '2023',
      tags: [
        { tag: 'Vue.js' },
        { tag: 'D3.js' },
        { tag: 'Python' }
      ],
      achievements: [
        { achievement: '50% faster decision making' },
        { achievement: 'Processing 1M+ transactions daily' },
        { achievement: '99.9% uptime SLA achieved' }
      ],
      technologies: [
        { technology: 'Vue.js' },
        { technology: 'D3.js' },
        { technology: 'Python' },
        { technology: 'Apache Kafka' }
      ]
    },
    {
      title: 'Creative Portfolio Builder',
      category: 'Arts & Creative',
      description: 'Drag-and-drop portfolio builder for artists and designers with integrated e-commerce capabilities.',
      featured: false,
      status: 'published',
      year: '2024',
      tags: [
        { tag: 'React' },
        { tag: 'Tailwind CSS' },
        { tag: 'Cloudinary' }
      ],
      achievements: [
        { achievement: '10,000+ portfolios created' },
        { achievement: '200% increase in artist inquiries' },
        { achievement: 'Award-winning design interface' }
      ],
      technologies: [
        { technology: 'React' },
        { technology: 'Tailwind CSS' },
        { technology: 'Cloudinary' },
        { technology: 'Vercel' }
      ]
    }
  ];

  console.log('Starting portfolio seeding via API...');
  
  for (const project of projects) {
    try {
      // Don't include slug - let Payload auto-generate it
      const response = await fetch('http://localhost:3000/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to create ${project.title}:`, error);
      } else {
        const result = await response.json();
        console.log(`Created project: ${project.title}`);
      }
    } catch (error) {
      console.error(`Error creating ${project.title}:`, error.message);
    }
  }

  console.log('Portfolio seeding completed!');
}

seedPortfolio();
