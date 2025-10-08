const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');

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

  // Clean and parse HTML
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

// Download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed: ${response.statusCode}`));
      }
    }).on('error', reject);
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
      if (!localPost) continue;

      const lexicalContent = htmlToLexical(wpPost.post_content);
      let featuredImageId = null;
      const imageInfo = featuredImages[wpPost.post_name];

      if (imageInfo) {
        const imageUrl = imageInfo.image_url;
        const filename = path.basename(imageUrl);
        const filepath = path.join(mediaDir, filename);

        console.log(`  → Downloading: ${filename}`);

        try {
          await downloadImage(imageUrl, filepath);

          const mediaInsert = db.prepare(`
            INSERT OR IGNORE INTO media (filename, mime_type, filesize, url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          const now = new Date().toISOString();
          const mediaResult = mediaInsert.run(
            filename,
            'image/' + path.extname(filename).substring(1),
            fs.statSync(filepath).size,
            `/media/${filename}`,
            now,
            now
          );

          featuredImageId = mediaResult.lastInsertRowid;
          console.log(`  → Media ID: ${featuredImageId}`);
        } catch (err) {
          console.log(`  → Error: ${err.message}`);
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
