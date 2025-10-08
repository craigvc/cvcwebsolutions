const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');

const WP_BACKUP_PATH = 'E:\\Downloads\\backup-cvcwebsolutions.com-10-6-2025\\public_html\\wp-content\\uploads';

// Improved HTML to Lexical converter
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

  let cleaned = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\[vc_[^\]]*\]/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const paragraphs = cleaned.split('\n\n').filter(p => p.trim());
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

async function updateBlogContent() {
  try {
    console.log('Connecting to databases...');

    const mysqlConn = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'temppass123',
      database: 'wordpress'
    });

    const db = new Database('./data/payload.db');
    const featuredImages = JSON.parse(fs.readFileSync('blog-featured-images.json', 'utf8'));

    const [wpPosts] = await mysqlConn.execute(`
      SELECT ID, post_title, post_name, post_content
      FROM k8gbJ99R_posts
      WHERE post_type = 'post' AND post_status = 'publish'
      ORDER BY post_date DESC
    `);

    console.log(`\nProcessing ${wpPosts.length} blog posts...\n`);

    const mediaDir = './public/media';
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    for (const wpPost of wpPosts) {
      console.log(`Processing: ${wpPost.post_title}`);

      const localPost = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(wpPost.post_name);
      if (!localPost) {
        console.log('  → Not found locally, skipping...');
        continue;
      }

      const lexicalContent = htmlToLexical(wpPost.post_content);
      let featuredImageId = null;
      const imageInfo = featuredImages[wpPost.post_name];

      if (imageInfo) {
        const imageUrl = imageInfo.image_url;
        // Extract the relative path from URL: /wp-content/uploads/2024/10/image.jpg
        const urlMatch = imageUrl.match(/\/wp-content\/uploads\/(.+)/);

        if (urlMatch) {
          const relativePath = urlMatch[1];
          const sourceFile = path.join(WP_BACKUP_PATH, relativePath);
          const filename = path.basename(imageUrl);
          const destFile = path.join(mediaDir, filename);

          console.log(`  → Copying: ${filename}`);

          try {
            if (fs.existsSync(sourceFile)) {
              fs.copyFileSync(sourceFile, destFile);

              const mediaInsert = db.prepare(`
                INSERT OR IGNORE INTO media (filename, mime_type, filesize, url, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
              `);

              const now = new Date().toISOString();
              const stats = fs.statSync(destFile);
              const mediaResult = mediaInsert.run(
                filename,
                'image/' + path.extname(filename).substring(1).toLowerCase(),
                stats.size,
                `/media/${filename}`,
                now,
                now
              );

              featuredImageId = mediaResult.lastInsertRowid || db.prepare('SELECT id FROM media WHERE filename = ?').get(filename).id;
              console.log(`  → Media ID: ${featuredImageId}`);
            } else {
              console.log(`  → Source file not found: ${sourceFile}`);
            }
          } catch (err) {
            console.log(`  → Error: ${err.message}`);
          }
        }
      }

      db.prepare('UPDATE blog_posts SET content = ?, featured_image_id = ?, updated_at = ? WHERE id = ?').run(
        lexicalContent,
        featuredImageId,
        new Date().toISOString(),
        localPost.id
      );

      console.log(`  ✓ Updated`);
    }

    await mysqlConn.end();
    db.close();

    console.log('\n✓ Completed!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBlogContent();
