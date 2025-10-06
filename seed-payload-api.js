// Simple seed script using API endpoints
async function seed() {
  try {
    console.log('Starting Payload seed via API...');
    const baseUrl = 'http://localhost:3000/api';
    
    // First initialize Payload
    const initResponse = await fetch(`${baseUrl}/payload-init`);
    const initData = await initResponse.json();
    console.log('Payload initialized:', initData);
    
    // Create an author
    const authorResponse = await fetch(`${baseUrl}/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'CVC Team',
        email: 'team@cvcwebsolutions.com',
        bio: 'The CVC Web Solutions development team.',
        featured: true
      })
    });
    const author = await authorResponse.json();
    console.log('Created author:', author.id || 'done');
    
    // Create categories
    const categories = [];
    const categoryData = [
      {
        title: 'Web Development',
        slug: 'web-development',
        description: 'Articles about web development, frameworks, and best practices',
        color: '#3B82F6',
        icon: '💻'
      },
      {
        title: 'AI & Machine Learning',
        slug: 'ai-ml',
        description: 'Insights into AI and ML technologies',
        color: '#10B981',
        icon: '🤖'
      },
      {
        title: 'Business Solutions',
        slug: 'business-solutions',
        description: 'Business technology and digital transformation',
        color: '#8B5CF6',
        icon: '💼'
      }
    ];
    
    for (const cat of categoryData) {
      const response = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
      const category = await response.json();
      categories.push(category);
      console.log('Created category:', cat.title);
    }
    
    // Create blog posts
    const postsData = [
      {
        title: 'Welcome to CVC Web Solutions',
        slug: 'welcome-to-cvc',
        excerpt: 'Discover how CVC Web Solutions can transform your digital presence with cutting-edge web development and AI solutions.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Welcome to CVC Web Solutions! We are excited to launch our new blog where we will share insights, tutorials, and updates about web development, AI solutions, and digital transformation.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              },
              {
                type: 'heading',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Our Mission',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 1,
                    version: 1
                  }
                ],
                tag: 'h2'
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'At CVC Web Solutions, we are committed to delivering innovative digital solutions that help businesses thrive in the modern digital landscape.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              }
            ]
          }
        },
        author: author.id || '1',
        categories: categories.slice(0, 2).map(c => c.id || '1'),
        status: 'published',
        publishedAt: new Date().toISOString(),
        featured: true,
        seo: {
          metaTitle: 'Welcome to CVC Web Solutions - Your Digital Partner',
          metaDescription: 'Discover how CVC Web Solutions can transform your digital presence with cutting-edge web development and AI solutions.',
          focusKeyword: 'web development solutions'
        }
      },
      {
        title: 'The Future of AI in Web Development',
        slug: 'future-of-ai-web-development',
        excerpt: 'Explore how artificial intelligence is revolutionizing web development and creating new possibilities for businesses.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Artificial Intelligence is no longer just a buzzword - it\'s actively transforming how we build and interact with web applications.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              }
            ]
          }
        },
        author: author.id || '1',
        categories: [categories[1]?.id || '2'],
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        featured: false,
        seo: {
          metaTitle: 'The Future of AI in Web Development',
          metaDescription: 'Explore how artificial intelligence is revolutionizing web development.',
          focusKeyword: 'AI web development'
        }
      },
      {
        title: 'Building Scalable E-commerce Solutions',
        slug: 'building-scalable-ecommerce',
        excerpt: 'Learn the key principles and technologies for building e-commerce platforms that can grow with your business.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'In today\'s digital marketplace, having a scalable e-commerce solution is crucial for business growth.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              }
            ]
          }
        },
        author: author.id || '1',
        categories: [categories[0]?.id || '1', categories[2]?.id || '3'],
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        featured: false,
        seo: {
          metaTitle: 'Building Scalable E-commerce Solutions - CVC Web Solutions',
          metaDescription: 'Learn the key principles for building scalable e-commerce platforms.',
          focusKeyword: 'scalable ecommerce'
        }
      }
    ];
    
    for (const postData of postsData) {
      const response = await fetch(`${baseUrl}/blog-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      const post = await response.json();
      console.log('Created blog post:', postData.title);
    }
    
    console.log('Seeding complete! Visit http://localhost:3000/blog to see the posts.');
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the seed function
seed();
