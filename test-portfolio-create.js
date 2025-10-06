const fetch = require('node-fetch');

const testCreate = async () => {
  console.log('🧪 Testing portfolio item creation...');

  try {
    // First test: Get categories
    console.log('1. Fetching categories...');
    const categoriesResponse = await fetch('http://localhost:3456/api/portfolio-categories');
    console.log('Categories response status:', categoriesResponse.status);

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData.docs || [];
      console.log(`✅ Found ${categories.length} categories`);

      if (categories.length > 0) {
        const firstCategory = categories[0];
        console.log(`Using category: ${firstCategory.icon} ${firstCategory.name} (ID: ${firstCategory.id})`);

        // Test creating one simple portfolio item
        console.log('\n2. Creating test portfolio item...');
        const testProject = {
          title: 'Test Project',
          slug: 'test-project',
          category: firstCategory.id,
          description: 'A simple test project to verify the API works',
          featured: false,
          status: 'published',
          year: '2024',
          url: 'https://test.example.com',
          technologies: [
            { technology: 'React' },
            { technology: 'Node.js' }
          ],
          achievements: [
            { achievement: 'Successfully created via API' }
          ]
        };

        const createResponse = await fetch('http://localhost:3456/api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testProject)
        });

        console.log('Create response status:', createResponse.status);

        if (createResponse.ok) {
          const result = await createResponse.json();
          console.log('✅ Successfully created project:', result.title);
          console.log('   ID:', result.id);
        } else {
          const error = await createResponse.text();
          console.log('❌ Failed to create project:', error);
        }
      }
    } else {
      console.log('❌ Failed to fetch categories');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testCreate();