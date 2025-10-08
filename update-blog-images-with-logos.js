const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const https = require('https');
const http = require('http');

const db = new Database('./data/payload.db');

// Blog posts that need updated images
const blogUpdates = {
  // Post 8 & 11: Hill Phoenix - use existing screenshot
  8: {
    title: "Hill Phoenix LMS",
    sourceFile: "./public/portfolio/hill-phoenix-screenshot.png",
    newFilename: "blog-hill-phoenix-lms.png"
  },
  11: {
    title: "Hill Phoenix Resource Management",
    sourceFile: "./public/portfolio/hill-phoenix-screenshot.png",
    newFilename: "blog-hill-phoenix-resource.png"
  },
  // Post 10: JDoc - fetch logo from their website
  10: {
    title: "JDoc Advertising Partnership",
    fetchUrl: "https://www.jdocadvertising.com/wp-content/uploads/2023/01/jdoc-logo.png",
    newFilename: "blog-jdoc-advertising.png"
  }
};

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadImage(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
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

async function updateBlogImage(postId, config) {
  try {
    console.log(`\n📝 Updating blog post ${postId}: ${config.title}`);

    const destPath = path.join('./public/media', config.newFilename);

    // Either copy existing file or download from URL
    if (config.sourceFile) {
      console.log(`  Copying from: ${config.sourceFile}`);
      fs.copyFileSync(config.sourceFile, destPath);
    } else if (config.fetchUrl) {
      console.log(`  Downloading from: ${config.fetchUrl}`);
      await downloadImage(config.fetchUrl, destPath);
    }

    console.log(`  ✓ Saved to: ${destPath}`);

    // Get file stats
    const stats = fs.statSync(destPath);
    const now = new Date().toISOString();

    // Insert into media table
    const mediaInsert = db.prepare(`
      INSERT INTO media (filename, mime_type, filesize, url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = mediaInsert.run(
      config.newFilename,
      'image/png',
      stats.size,
      `/media/${config.newFilename}`,
      now,
      now
    );

    const mediaId = result.lastInsertRowid;
    console.log(`  ✓ Media record created with ID: ${mediaId}`);

    // Update blog post
    const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = ?');
    updateStmt.run(mediaId, now, postId);
    console.log(`  ✓ Updated blog post ${postId}`);

    return mediaId;

  } catch (error) {
    console.error(`  ❌ Error updating post ${postId}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Updating blog images with client logos...\n');

  // Try common logo paths for JDoc
  const jdocLogoPaths = [
    'https://www.jdocadvertising.com/wp-content/uploads/2023/01/jdoc-logo.png',
    'https://jdocadvertising.com/wp-content/uploads/2023/01/jdoc-logo.png',
    'https://www.jdocadvertising.com/wp-content/themes/jdoc/images/logo.png',
    'https://jdocadvertising.com/images/logo.png'
  ];

  // Update Hill Phoenix posts first (using existing screenshot)
  for (const postId of [8, 11]) {
    await updateBlogImage(postId, blogUpdates[postId]);
  }

  // Try to fetch JDoc logo
  let jdocSuccess = false;
  for (const logoUrl of jdocLogoPaths) {
    console.log(`\nTrying JDoc logo: ${logoUrl}`);
    const config = {
      ...blogUpdates[10],
      fetchUrl: logoUrl
    };

    const result = await updateBlogImage(10, config);
    if (result) {
      jdocSuccess = true;
      break;
    }
  }

  if (!jdocSuccess) {
    console.log('\n⚠️  Could not fetch JDoc logo from common paths.');
    console.log('You may need to manually download it from jdocadvertising.com');
  }

  // Verify updates
  console.log('\n📊 Updated blog posts:');
  const verification = db.prepare(`
    SELECT bp.id, bp.title, bp.featured_image_id, m.filename
    FROM blog_posts bp
    LEFT JOIN media m ON bp.featured_image_id = m.id
    WHERE bp.id IN (8, 10, 11)
    ORDER BY bp.id
  `).all();

  verification.forEach(post => {
    console.log(`  ${post.id}. ${post.title.substring(0, 60)}...`);
    console.log(`     Image: ${post.filename || 'None'}`);
  });

  db.close();
  console.log('\n✅ Blog image updates complete!');
}

main().catch(console.error);
