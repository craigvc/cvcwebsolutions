// Simplified seed script - creates blog posts without auth requirements
async function seedSimple() {
  try {
    console.log('Starting simplified seed...');
    const baseUrl = 'http://localhost:3000/api';
    
    // Get categories that were already created
    const catResponse = await fetch(`${baseUrl}/categories`);
    const catData = await catResponse.json();
    const categories = catData.docs || [];
    console.log(`Found ${categories.length} categories`);
    
    // Create blog posts with minimal required fields
    const posts = [
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
                    text: 'At CVC Web Solutions, we are committed to delivering innovative digital solutions that help businesses thrive in the modern digital landscape. Our team of experts specializes in:',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              },
              {
                type: 'list',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 1,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Custom Web Development - Building responsive, performant websites',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 2,
                    children: [
                      {
                        mode: 'normal',
                        text: 'AI and Machine Learning Solutions - Integrating intelligent features',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 3,
                    children: [
                      {
                        mode: 'normal',
                        text: 'E-commerce Platforms - Creating scalable online stores',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 4,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Mobile App Development - Building cross-platform applications',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  }
                ],
                listType: 'bullet',
                start: 1,
                tag: 'ul'
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Contact us today to discuss how we can help transform your digital presence!',
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
        status: 'published',
        publishedAt: new Date().toISOString(),
        featured: true
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
                    text: 'Artificial Intelligence is no longer just a buzzword - it\'s actively transforming how we build and interact with web applications. From intelligent chatbots to personalized user experiences, AI is opening new frontiers in web development.',
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
                    text: 'Key AI Technologies in Web Development',
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
                    text: 'Modern web applications are leveraging various AI technologies to enhance user experience and functionality:',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              },
              {
                type: 'list',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 1,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Natural Language Processing (NLP) for intelligent search and chatbots',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 2,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Machine Learning for personalized recommendations',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 3,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Computer Vision for image recognition and AR features',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 4,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Predictive Analytics for user behavior analysis',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  }
                ],
                listType: 'bullet',
                start: 1,
                tag: 'ul'
              }
            ]
          }
        },
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        featured: false
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
                    text: 'In today\'s digital marketplace, having a scalable e-commerce solution is crucial for business growth. Whether you\'re starting small or already processing thousands of orders, your platform needs to handle growth seamlessly.',
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
                    text: 'Essential Components of Scalable E-commerce',
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
                    text: 'A truly scalable e-commerce platform requires careful consideration of:',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1
                  }
                ]
              },
              {
                type: 'list',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 1,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Cloud-native architecture for elastic scaling',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 2,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Microservices for modular functionality',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 3,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Efficient database design and caching strategies',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    value: 4,
                    children: [
                      {
                        mode: 'normal',
                        text: 'Modern payment gateway integrations',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1
                      }
                    ]
                  }
                ],
                listType: 'bullet',
                start: 1,
                tag: 'ul'
              }
            ]
          }
        },
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        featured: false
      }
    ];
    
    // Add categories to posts if they exist
    if (categories.length > 0) {
      posts[0].categories = categories.filter(c => c.slug === 'web-development' || c.slug === 'business-solutions').map(c => c.id);
      posts[1].categories = categories.filter(c => c.slug === 'ai-ml').map(c => c.id);
      posts[2].categories = categories.filter(c => c.slug === 'web-development' || c.slug === 'business-solutions').map(c => c.id);
    }
    
    // Try to create posts without author field
    for (const post of posts) {
      try {
        const response = await fetch(`${baseUrl}/blog-posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
        
        if (response.ok) {
          console.log(`✓ Created: ${post.title}`);
        } else {
          const error = await response.text();
          console.log(`✗ Failed to create ${post.title}: ${error.substring(0, 100)}`);
        }
      } catch (error) {
        console.log(`✗ Error creating ${post.title}:`, error.message);
      }
    }
    
    console.log('\nDone! Visit http://localhost:3000/blog to see the results.');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

seedSimple();
