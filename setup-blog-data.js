// First, let's create the necessary authors and categories for the blog posts
const fs = require('fs');

async function setupBlogData() {
  const baseUrl = 'http://localhost:3456/api';

  console.log('Setting up blog data for migration...');

  // Create author first
  let authorId;
  try {
    console.log('Creating default author...');
    const authorResponse = await fetch(`${baseUrl}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'CVC Web Solutions',
        email: 'info@cvcwebsolutions.com',
        bio: 'CVC Web Solutions is a full-service web development agency specializing in modern web technologies and conservation technology.',
      })
    });

    if (authorResponse.ok) {
      const authorData = await authorResponse.json();
      authorId = authorData.doc.id;
      console.log(`✓ Author created with ID: ${authorId}`);
    } else {
      console.log('Author might already exist, fetching...');
      const existingAuthorsResponse = await fetch(`${baseUrl}/authors?where[email][equals]=info@cvcwebsolutions.com`);
      if (existingAuthorsResponse.ok) {
        const authorsData = await existingAuthorsResponse.json();
        if (authorsData.docs && authorsData.docs.length > 0) {
          authorId = authorsData.docs[0].id;
          console.log(`✓ Using existing author with ID: ${authorId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error creating/fetching author:', error.message);
  }

  // Create categories
  const categories = [
    { title: 'Web Development', slug: 'web-development', description: 'Posts about web development, programming, and technical topics' },
    { title: 'Conservation', slug: 'conservation', description: 'Posts about conservation, environmental technology, and sustainability' },
    { title: 'Technology', slug: 'technology', description: 'General technology news, trends, and insights' },
    { title: 'UX/UI Design', slug: 'ux-ui-design', description: 'User experience and interface design topics' },
    { title: 'AI & Machine Learning', slug: 'ai-machine-learning', description: 'Artificial intelligence and machine learning developments' }
  ];

  const categoryIds = {};

  for (const category of categories) {
    try {
      console.log(`Creating category: ${category.title}...`);
      const categoryResponse = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      });

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        categoryIds[category.slug] = categoryData.doc.id;
        console.log(`✓ Category "${category.title}" created with ID: ${categoryData.doc.id}`);
      } else {
        // Category might already exist
        console.log(`Category "${category.title}" might already exist, fetching...`);
        const existingCategoryResponse = await fetch(`${baseUrl}/categories?where[slug][equals]=${category.slug}`);
        if (existingCategoryResponse.ok) {
          const categoryData = await existingCategoryResponse.json();
          if (categoryData.docs && categoryData.docs.length > 0) {
            categoryIds[category.slug] = categoryData.docs[0].id;
            console.log(`✓ Using existing category "${category.title}" with ID: ${categoryData.docs[0].id}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error creating category ${category.title}:`, error.message);
    }
  }

  return { authorId, categoryIds };
}

async function importBlogPosts() {
  console.log('\nStarting blog post import process...');

  // First setup required data
  const { authorId, categoryIds } = await setupBlogData();

  if (!authorId) {
    console.error('Failed to create/find author. Cannot proceed with blog import.');
    return;
  }

  // Read the migrated posts
  const migratedPosts = JSON.parse(fs.readFileSync('migrated-blog-posts.json', 'utf8'));

  console.log('\nImporting blog posts...');

  for (const post of migratedPosts) {
    try {
      // Convert HTML content to a simple rich text structure for Lexical
      const lexicalContent = {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1
        }
      };

      // Categorize posts based on content
      let postCategories = [];
      const content = post.title.toLowerCase() + ' ' + post.excerpt.toLowerCase();

      if (content.includes('conservation') || content.includes('environment')) {
        postCategories.push(categoryIds['conservation']);
      }
      if (content.includes('ux') || content.includes('user experience') || content.includes('design')) {
        postCategories.push(categoryIds['ux-ui-design']);
      }
      if (content.includes('ai') || content.includes('artificial intelligence') || content.includes('robot')) {
        postCategories.push(categoryIds['ai-machine-learning']);
      }

      // Default to web development and technology
      if (postCategories.length === 0) {
        postCategories = [categoryIds['web-development'], categoryIds['technology']];
      }

      const payloadPost = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: lexicalContent,
        author: authorId,
        categories: postCategories.filter(Boolean), // Remove any undefined categories
        status: 'published',
        publishedAt: post.publishedAt,
        featured: false,
        seo: {
          metaTitle: post.title,
          metaDescription: post.excerpt.substring(0, 160),
          focusKeyword: post.title.split(' ')[0].toLowerCase()
        }
      };

      console.log(`Importing: ${post.title}...`);
      const response = await fetch('http://localhost:3456/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadPost)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✓ Successfully imported: ${post.title}`);
      } else {
        const errorText = await response.text();
        console.error(`✗ Failed to import "${post.title}":`, response.status, errorText);
      }

    } catch (error) {
      console.error(`✗ Error importing "${post.title}":`, error.message);
    }

    // Small delay between imports
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Blog post import process completed!');
}

// Run the import
if (require.main === module) {
  importBlogPosts().catch(console.error);
}

module.exports = { setupBlogData, importBlogPosts };