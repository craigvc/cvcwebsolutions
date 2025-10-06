import { getPayload } from 'payload'
import config from '../../../payload.config'

async function seed() {
  // For seeding, we'll use the API endpoints instead of direct database access
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
  console.log('🌱 Starting Payload seed...')
  console.log('📍 API URL:', baseUrl)

  try {
    // First, let's just test if the API is working
    console.log('🔍 Testing API connection...')
    
    const testResponse = await fetch(`${baseUrl}/api/categories`)
    if (!testResponse.ok) {
      console.log('⚠️ API not available yet. Please ensure the Next.js server is running.')
      console.log('Run: npm run dev')
      return
    }
    
    // Create Authors using API
    console.log('Creating authors...')
    const author1Response = await fetch(`${baseUrl}/api/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Craig Vuletich',
        email: 'craig@cvcwebsolutions.com',
        password: 'Admin123!',
        bio: 'Founder and Lead Developer at CVC Web Solutions. Passionate about creating innovative web solutions and helping businesses grow their digital presence.',
        featured: true,
        socialLinks: [
          { platform: 'Twitter', url: 'https://twitter.com/cvcwebsolutions' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/cvcwebsolutions' },
          { platform: 'GitHub', url: 'https://github.com/cvcwebsolutions' },
        ],
      }),
    })
    const author1 = await author1Response.json()

    const author2Response = await fetch(`${baseUrl}/api/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Johnson',
        email: 'sarah@cvcwebsolutions.com',
        password: 'Author123!',
        bio: 'Senior Content Strategist specializing in technical writing and digital marketing.',
        featured: false,
        socialLinks: [
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahjohnson' },
        ],
      }),
    })
    const author2 = await author2Response.json()

    console.log('✅ Authors created')

    // Create Categories
    console.log('Creating categories...')
    const categoryWebResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Web Development',
        slug: 'web-development',
        description: 'Articles about modern web development techniques, frameworks, and best practices.',
        color: '#3B82F6',
        icon: '🌐',
      }),
    })
    const categoryWeb = await categoryWebResponse.json()

    const categoryAIResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'Exploring artificial intelligence, machine learning, and their practical applications.',
        color: '#8B5CF6',
        icon: '🤖',
      }),
    })
    const categoryAI = await categoryAIResponse.json()

    const categoryBusinessResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Business Strategy',
        slug: 'business-strategy',
        description: 'Insights on digital transformation, business growth, and strategic planning.',
        color: '#10B981',
        icon: '📈',
      }),
    })
    const categoryBusiness = await categoryBusinessResponse.json()

    const categoryDesignResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'Best practices in user interface and user experience design.',
        color: '#F59E0B',
        icon: '🎨',
      }),
    })
    const categoryDesign = await categoryDesignResponse.json()

    console.log('✅ Categories created')

    // Create Blog Posts
    console.log('Creating blog posts...')
    const post1Response = await fetch(`${baseUrl}/api/blogposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Getting Started with Next.js 14 and Payload CMS',
        slug: 'nextjs-14-payload-cms-guide',
        excerpt: 'Learn how to build a modern, scalable content management system using Next.js 14 and Payload CMS. This comprehensive guide covers setup, configuration, and best practices.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Introduction' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'Next.js 14 brings exciting new features including the App Router, Server Components, and improved performance. When combined with Payload CMS, you get a powerful, type-safe content management solution that scales with your needs.' },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Why Choose Payload CMS?' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'Payload CMS offers several advantages over traditional CMS solutions:' },
                ],
              },
              {
                type: 'list',
                listType: 'bullet',
                children: [
                  {
                    type: 'listitem',
                    children: [{ text: 'Full TypeScript support out of the box' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Self-hosted with complete data ownership' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Powerful access control and authentication' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Built-in REST and GraphQL APIs' }],
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Getting Started' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'Follow these steps to set up your Next.js 14 application with Payload CMS...' },
                ],
              },
            ],
          },
        },
        status: 'published',
        author: author1.doc?.id || author1.id,
        categories: [categoryWeb.doc?.id || categoryWeb.id],
        tags: ['Next.js', 'Payload CMS', 'TypeScript', 'Web Development'],
        readingTime: 8,
        seo: {
          title: 'Next.js 14 & Payload CMS: Complete Setup Guide',
          description: 'Learn how to integrate Payload CMS with Next.js 14 for a powerful, type-safe content management solution.',
          keywords: ['Next.js 14', 'Payload CMS', 'TypeScript', 'CMS', 'Content Management'],
        },
      }),
    })
    const post1 = await post1Response.json()

    const post2Response = await fetch(`${baseUrl}/api/blogposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'The Future of AI in Web Development',
        slug: 'ai-web-development-future',
        excerpt: 'Explore how artificial intelligence is revolutionizing web development, from code generation to automated testing and beyond.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'AI is Transforming Development' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'Artificial Intelligence is no longer just a buzzword in the tech industry. It has become an integral part of modern web development workflows, offering developers powerful tools to increase productivity and code quality.' },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Key Areas of Impact' }],
              },
              {
                type: 'list',
                listType: 'bullet',
                children: [
                  {
                    type: 'listitem',
                    children: [{ text: 'Code completion and generation with tools like GitHub Copilot' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Automated testing and bug detection' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Performance optimization suggestions' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Accessibility improvements' }],
                  },
                ],
              },
            ],
          },
        },
        status: 'published',
        author: author2.doc?.id || author2.id,
        categories: [categoryAI.doc?.id || categoryAI.id, categoryWeb.doc?.id || categoryWeb.id],
        tags: ['AI', 'Machine Learning', 'Web Development', 'Innovation'],
        readingTime: 6,
        seo: {
          title: 'How AI is Revolutionizing Web Development in 2025',
          description: 'Discover the transformative impact of AI on modern web development practices and what it means for developers.',
          keywords: ['AI', 'Web Development', 'Machine Learning', 'Automation', 'Developer Tools'],
        },
      }),
    })
    const post2 = await post2Response.json()

    const post3Response = await fetch(`${baseUrl}/api/blogposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Building Scalable E-Commerce Solutions',
        slug: 'scalable-ecommerce-solutions',
        excerpt: 'A comprehensive guide to architecting and implementing e-commerce platforms that can handle growth from startup to enterprise scale.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'The Challenge of Scale' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'Building an e-commerce platform that can grow with your business requires careful planning and the right technology stack. From handling thousands of concurrent users to managing complex inventory systems, scalability must be built in from day one.' },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Key Considerations' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'When building for scale, consider these critical factors:' },
                ],
              },
              {
                type: 'list',
                listType: 'bullet',
                children: [
                  {
                    type: 'listitem',
                    children: [{ text: 'Database architecture and optimization' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Caching strategies at multiple levels' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'CDN integration for global performance' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Microservices vs monolithic architecture' }],
                  },
                ],
              },
            ],
          },
        },
        status: 'published',
        author: author1.doc?.id || author1.id,
        categories: [categoryBusiness.doc?.id || categoryBusiness.id, categoryWeb.doc?.id || categoryWeb.id],
        tags: ['E-commerce', 'Scalability', 'Architecture', 'Business'],
        readingTime: 10,
        seo: {
          title: 'E-Commerce Architecture: Building for Scale',
          description: 'Learn how to build e-commerce platforms that scale from startup to enterprise with proven architectural patterns.',
          keywords: ['E-commerce', 'Scalability', 'Architecture', 'Performance', 'Growth'],
        },
      }),
    })
    const post3 = await post3Response.json()

    const post4Response = await fetch(`${baseUrl}/api/blogposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Modern UI/UX Design Principles for 2025',
        slug: 'modern-ui-ux-design-2025',
        excerpt: 'Discover the latest trends and best practices in user interface and experience design that are shaping digital products in 2025.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Design Trends Shaping 2025' }],
              },
              {
                type: 'paragraph',
                children: [
                  { text: 'As we move through 2025, design trends continue to evolve, influenced by technological advances and changing user expectations. The focus has shifted towards creating more inclusive, accessible, and emotionally intelligent interfaces.' },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                children: [{ text: 'Key Design Principles' }],
              },
              {
                type: 'list',
                listType: 'bullet',
                children: [
                  {
                    type: 'listitem',
                    children: [{ text: 'Adaptive and responsive design for all devices' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Accessibility-first approach' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Micro-interactions and animations' }],
                  },
                  {
                    type: 'listitem',
                    children: [{ text: 'Dark mode and theme customization' }],
                  },
                ],
              },
            ],
          },
        },
        status: 'published',
        author: author2.doc?.id || author2.id,
        categories: [categoryDesign.doc?.id || categoryDesign.id],
        tags: ['Design', 'UI', 'UX', 'Trends', '2025'],
        readingTime: 7,
        seo: {
          title: 'UI/UX Design Trends and Best Practices for 2025',
          description: 'Stay ahead of the curve with the latest UI/UX design trends and principles shaping digital experiences in 2025.',
          keywords: ['UI Design', 'UX Design', 'Design Trends', '2025', 'User Experience'],
        },
      }),
    })
    const post4 = await post4Response.json()

    console.log('✅ Blog posts created')

    console.log('🎉 Seed completed successfully!')
    console.log('\nCreated:')
    console.log('- 2 Authors')
    console.log('- 4 Categories')
    console.log('- 4 Blog Posts')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed
seed()
  .then(() => {
    console.log('\n✅ Database seeded successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed to seed database:', error)
    process.exit(1)
  })
