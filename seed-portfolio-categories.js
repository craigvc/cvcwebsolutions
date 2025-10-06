const fetch = require('node-fetch');

async function seedPortfolioCategories() {
  try {
    console.log('🌱 Seeding portfolio categories...\n');

    const categories = [
      {
        name: 'Web Development',
        icon: '💻',
        color: 'blue',
        description: 'Websites, web applications, and online platforms'
      },
      {
        name: 'Mobile Apps',
        icon: '📱',
        color: 'green',
        description: 'iOS and Android mobile applications'
      },
      {
        name: 'E-Commerce',
        icon: '🛒',
        color: 'purple',
        description: 'Online stores and e-commerce platforms'
      },
      {
        name: 'Education',
        icon: '🎓',
        color: 'orange',
        description: 'Educational platforms and learning management systems'
      },
      {
        name: 'Healthcare',
        icon: '🏥',
        color: 'red',
        description: 'Healthcare applications and medical platforms'
      },
      {
        name: 'Business & Consulting',
        icon: '💼',
        color: 'indigo',
        description: 'Business applications and consulting platforms'
      },
      {
        name: 'Arts & Creative',
        icon: '🎨',
        color: 'pink',
        description: 'Creative portfolios and artistic platforms'
      },
      {
        name: 'Financial Services',
        icon: '💰',
        color: 'teal',
        description: 'Financial applications and banking platforms'
      }
    ];

    for (const category of categories) {
      console.log(`Creating category: ${category.icon} ${category.name}`);

      const response = await fetch('http://localhost:3456/api/portfolio-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created: ${result.name} (ID: ${result.id})`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to create ${category.name}: ${error}`);
      }
    }

    console.log('\n🎉 Portfolio categories seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
  }
}

seedPortfolioCategories();