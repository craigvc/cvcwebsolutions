const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const https = require('https');
const http = require('http');

const db = new Database('./data/payload.db');

const logoDownloads = [
  {
    postId: 6,
    title: "Mage Communications Partnership",
    url: "https://www.magecommunications.com/wp-content/uploads/2013/12/logo-altz.png",
    filename: "blog-mage-communications.png"
  },
  {
    postId: 10,
    title: "JDoc Advertising Partnership",
    urls: [
      "https://www.jdocadvertising.com/wp-content/uploads/jdoc-logo.png",
      "https://jdocadvertising.com/wp-content/uploads/jdoc-logo.png",
      "https://www.jdocadvertising.com/images/logo.png"
    ],
    filename: "blog-jdoc-advertising.png"
  }
];

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    console.log(`  Trying: ${url}`);

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadImage(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    }).on('error', reject);
  });
}

async function processLogo(config) {
  console.log(`\n📝 ${config.title}`);

  const destPath = path.join('./public/media', config.filename);

  // Handle single URL or multiple URLs
  const urls = config.url ? [config.url] : config.urls;

  let success = false;
  for (const url of urls) {
    try {
      await downloadImage(url, destPath);
      console.log(`  ✓ Downloaded to: ${destPath}`);
      success = true;
      break;
    } catch (error) {
      console.log(`    ${error.message}`);
    }
  }

  if (!success) {
    console.log(`  ❌ Could not download logo`);
    return null;
  }

  // Get file stats
  const stats = fs.statSync(destPath);
  const now = new Date().toISOString();

  // Insert into media table
  const mediaInsert = db.prepare(`
    INSERT INTO media (filename, mime_type, filesize, url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = mediaInsert.run(
    config.filename,
    'image/png',
    stats.size,
    `/media/${config.filename}`,
    now,
    now
  );

  const mediaId = result.lastInsertRowid;
  console.log(`  ✓ Media record created with ID: ${mediaId}`);

  // Update blog post
  const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = ?');
  updateStmt.run(mediaId, now, config.postId);
  console.log(`  ✓ Updated blog post ${config.postId}`);

  return mediaId;
}

async function main() {
  console.log('🚀 Downloading partner logos for blog posts...\n');

  for (const config of logoDownloads) {
    await processLogo(config);
  }

  // Verify all blog posts
  console.log('\n📊 All blog posts with images:');
  const verification = db.prepare(`
    SELECT bp.id, bp.title, bp.featured_image_id, m.filename
    FROM blog_posts bp
    LEFT JOIN media m ON bp.featured_image_id = m.id
    ORDER BY bp.id
  `).all();

  verification.forEach(post => {
    console.log(`  ${post.id}. ${post.title.substring(0, 60)}...`);
    console.log(`     Image: ${post.filename || 'None'}`);
  });

  db.close();
  console.log('\n✅ Logo downloads complete!');
}

main().catch(console.error);
