const { getPayload } = require('payload');
require('dotenv').config();
const path = require('path');

const seedPortfolioProjects = async () => {
  try {
    console.log('Starting Portfolio seed...');
    
    // Import the config (CommonJS style)
    const configModule = await import('./src/payload.config.ts');
    const config = configModule.default;
    
    // Initialize Payload
    const payload = await getPayload({ config });

    // Sample portfolio projects
    const projects = [
      {
        title: 'Wildlife Conservation Platform',
        slug: 'wildlife-conservation-platform',
        category: 'Education & Nonprofit',
        description: 'A comprehensive digital platform connecting wildlife enthusiasts with conservation efforts worldwide, featuring real-time wildlife tracking and educational resources.',
        featured: true,
        status: 'published',
        year: '2024',
        url: 'https://wildlifeconserve.org',
        tags: [
          { tag: 'React' },
          { tag: 'Node.js' },
          { tag: 'MongoDB' },
          { tag: 'AWS' },
          { tag: 'Real-time tracking' }
        ],
        achievements: [
          { achievement: '25,000+ active conservation volunteers connected' },
          { achievement: '500+ endangered species tracked in real-time' },
          { achievement: '85% increase in donation conversions' },
          { achievement: 'Featured in National Geographic Tech' }
        ],
        technologies: [
          { technology: 'React' },
          { technology: 'Node.js' },
          { technology: 'MongoDB' },
          { technology: 'WebSockets' },
          { technology: 'MapBox' }
        ],
        challenge: 'Wildlife organizations struggled to coordinate volunteers and track conservation efforts across multiple regions.',
        solution: 'Built a unified platform with real-time tracking, volunteer management, and educational resources.'
      },
      {
        title: 'HealthTrack Mobile App',
        slug: 'healthtrack-mobile-app',
        category: 'Mobile Apps',
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
          { technology: 'Firebase' },
          { technology: 'Node.js' }
        ]
      },
      {
        title: 'E-Commerce Marketplace',
        slug: 'ecommerce-marketplace',
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
          { technology: 'PostgreSQL' },
          { technology: 'Redis' }
        ]
      },
      {
        title: 'Financial Analytics Dashboard',
        slug: 'financial-analytics-dashboard',
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
        slug: 'creative-portfolio-builder',
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

    // Create projects
    for (const project of projects) {
      await payload.create({
        collection: 'portfolio',
        data: project,
      });
      console.log(`Created project: ${project.title}`);
    }

    console.log('Portfolio seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding portfolio:', error);
    process.exit(1);
  }
};

seedPortfolioProjects();
