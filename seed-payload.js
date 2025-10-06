const { getPayload } = require('payload');
const path = require('path');
const { fileURLToPath } = require('url');

async function seed() {
  try {
    console.log('Starting Payload seed...');
    
    // Import the config (CommonJS style)
    const configModule = await import('./src/payload.config.ts');
    const config = configModule.default;
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Create an author first
    const author = await payload.create({
      collection: 'authors',
      data: {
        name: 'CVC Team',
        email: 'team@cvcwebsolutions.com',
        bio: 'The CVC Web Solutions development team.',
      }
    });
    console.log('Created author:', author.id);
    
    // Create categories
    const categories = await Promise.all([
      payload.create({
        collection: 'categories',
        data: {
          title: 'Web Development',
          slug: 'web-development',
          description: 'Articles about web development, frameworks, and best practices',
          color: '#3B82F6'
        }
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'AI & Machine Learning',
          slug: 'ai-ml',
          description: 'Insights into AI and ML technologies',
          color: '#10B981'
        }
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Business Solutions',
          slug: 'business-solutions',
          description: 'Business technology and digital transformation',
          color: '#8B5CF6'
        }
      })
    ]);
    console.log('Created categories:', categories.map(c => c.id));
    
    // Create blog posts
    const posts = await Promise.all([
      payload.create({
        collection: 'blog-posts',
        data: {
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
                          text: 'Custom Web Development',
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
                          text: 'AI and Machine Learning Solutions',
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
                          text: 'E-commerce Platforms',
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
                          text: 'Mobile App Development',
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
          author: author.id,
          categories: [categories[0].id, categories[2].id],
          status: 'published',
          publishedAt: new Date().toISOString(),
          featured: true,
          seo: {
            metaTitle: 'Welcome to CVC Web Solutions - Your Digital Partner',
            metaDescription: 'Discover how CVC Web Solutions can transform your digital presence with cutting-edge web development and AI solutions.',
            focusKeyword: 'web development solutions'
          }
        }
      }),
      payload.create({
        collection: 'blog-posts',
        data: {
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
                      text: 'Modern web applications are leveraging various AI technologies to enhance user experience and functionality. Machine learning algorithms power recommendation systems, natural language processing enables intelligent search, and computer vision brings new interactive capabilities.',
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
          author: author.id,
          categories: [categories[1].id],
          status: 'published',
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          featured: false,
          seo: {
            metaTitle: 'The Future of AI in Web Development',
            metaDescription: 'Explore how artificial intelligence is revolutionizing web development and creating new possibilities.',
            focusKeyword: 'AI web development'
          }
        }
      }),
      payload.create({
        collection: 'blog-posts',
        data: {
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
                      text: 'A truly scalable e-commerce platform requires careful consideration of architecture, database design, caching strategies, and infrastructure. Cloud-native solutions, microservices architecture, and modern payment gateways are essential building blocks.',
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
          author: author.id,
          categories: [categories[0].id, categories[2].id],
          status: 'published',
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          featured: false,
          seo: {
            metaTitle: 'Building Scalable E-commerce Solutions - CVC Web Solutions',
            metaDescription: 'Learn the key principles and technologies for building e-commerce platforms that can grow with your business.',
            focusKeyword: 'scalable ecommerce'
          }
        }
      })
    ]);
    
    console.log('Created blog posts:', posts.map(p => p.id));
    console.log('Seeding complete!');
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
