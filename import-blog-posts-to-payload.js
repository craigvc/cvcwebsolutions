const fs = require('fs');
const path = require('path');
const payload = require('payload');

// HTML to Lexical converter helper
function htmlToLexical(html) {
  if (!html) {
    return {
      root: {
        type: 'root',
        children: [{
          type: 'paragraph',
          children: []
        }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1
      }
    };
  }

  // Basic HTML to Lexical conversion
  // Strip HTML tags and create paragraphs
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\r\n/g, '\n')
    .trim();

  const paragraphs = text.split('\n\n').filter(p => p.trim());

  const children = paragraphs.map(para => ({
    type: 'paragraph',
    children: [{
      type: 'text',
      text: para.trim(),
      format: 0,
      mode: 'normal',
      style: '',
      detail: 0,
      version: 1
    }],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1
  }));

  return {
    root: {
      type: 'root',
      children: children.length > 0 ? children : [{
        type: 'paragraph',
        children: []
      }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1
    }
  };
}

async function importBlogPosts() {
  try {
    console.log('Initializing Payload...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      local: true,
    });

    console.log('Reading WordPress blog posts...');
    const wordpressPosts = JSON.parse(
      fs.readFileSync('wordpress-blog-posts.json', 'utf8')
    );

    console.log(`Found ${wordpressPosts.length} WordPress blog posts to import`);

    for (const wpPost of wordpressPosts) {
      console.log(`\nProcessing: ${wpPost.post_title}`);

      try {
        // Check if post already exists
        const existing = await payload.find({
          collection: 'blog-posts',
          where: {
            slug: {
              equals: wpPost.post_name
            }
          }
        });

        if (existing.docs.length > 0) {
          console.log(`  ✓ Post already exists, skipping...`);
          continue;
        }

        // Convert WordPress content to Lexical format
        const lexicalContent = htmlToLexical(wpPost.post_content);

        // Create the blog post
        const result = await payload.create({
          collection: 'blog-posts',
          data: {
            title: wpPost.post_title,
            slug: wpPost.post_name,
            content: lexicalContent,
            excerpt: wpPost.post_excerpt || '',
            publishedDate: new Date(wpPost.post_date),
            status: wpPost.post_status === 'publish' ? 'published' : 'draft',
            author: 'CVC Web Solutions',
          }
        });

        console.log(`  ✓ Imported: ${result.title}`);
      } catch (error) {
        console.error(`  ✗ Error importing post: ${error.message}`);
      }
    }

    console.log('\n✓ Blog post import completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importBlogPosts();
