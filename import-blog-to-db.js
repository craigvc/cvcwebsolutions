const fs = require('fs');
const Database = require('better-sqlite3');

// HTML to Lexical converter
function htmlToLexical(html) {
  if (!html) {
    return JSON.stringify({
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
    });
  }

  // Strip HTML tags and create paragraphs
  const text = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
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

  return JSON.stringify({
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
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importBlogPosts() {
  try {
    console.log('Opening database...');
    const db = new Database('./data/payload.db');

    console.log('Reading WordPress blog posts...');
    const wordpressPosts = JSON.parse(
      fs.readFileSync('wordpress-blog-posts.json', 'utf8')
    );

    console.log(`Found ${wordpressPosts.length} WordPress blog posts to import\n`);

    let imported = 0;
    let skipped = 0;

    for (const wpPost of wordpressPosts) {
      console.log(`Processing: ${wpPost.post_title}`);

      try {
        // Check if post already exists
        const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(wpPost.post_name);

        if (existing) {
          console.log(`  → Already exists, skipping...`);
          skipped++;
          continue;
        }

        // Convert content to Lexical format
        const lexicalContent = htmlToLexical(wpPost.post_content);
        const now = new Date().toISOString();
        const publishedDate = new Date(wpPost.post_date).toISOString();

        // Insert into database
        const insert = db.prepare(`
          INSERT INTO blog_posts (
            title, slug, content, excerpt, published_at, status,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insert.run(
          wpPost.post_title,
          wpPost.post_name,
          lexicalContent,
          wpPost.post_excerpt || '',
          publishedDate,
          wpPost.post_status === 'publish' ? 'published' : 'draft',
          now,
          now
        );

        console.log(`  ✓ Imported (ID: ${result.lastInsertRowid})`);
        imported++;
      } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
      }
    }

    db.close();

    console.log(`\n✓ Import completed!`);
    console.log(`  Imported: ${imported}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total: ${wordpressPosts.length}`);
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importBlogPosts();
