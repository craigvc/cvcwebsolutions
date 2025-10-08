const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database('./data/payload.db');

// Usage: node assign-manual-blog-image.js <post_id> <filename>
// Example: node assign-manual-blog-image.js 10 blog-jdoc-logo.png

const postId = process.argv[2];
const filename = process.argv[3];

if (!postId || !filename) {
  console.log('Usage: node assign-manual-blog-image.js <post_id> <filename>');
  console.log('Example: node assign-manual-blog-image.js 10 blog-jdoc-logo.png');
  console.log('\nAvailable posts needing images:');

  const posts = db.prepare(`
    SELECT id, title
    FROM blog_posts
    WHERE id IN (6, 10)
    ORDER BY id
  `).all();

  posts.forEach(post => {
    console.log(`  ${post.id}: ${post.title}`);
  });

  db.close();
  process.exit(1);
}

const filePath = path.join('./public/media', filename);

if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: File not found at ${filePath}`);
  console.log('\nMake sure the image is saved in the public/media/ folder first.');
  db.close();
  process.exit(1);
}

const stats = fs.statSync(filePath);
const now = new Date().toISOString();

// Insert into media table
const mediaInsert = db.prepare(`
  INSERT INTO media (filename, mime_type, filesize, url, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const result = mediaInsert.run(
  filename,
  stats.isFile() ? 'image/' + path.extname(filename).slice(1) : 'image/png',
  stats.size,
  `/media/${filename}`,
  now,
  now
);

const mediaId = result.lastInsertRowid;
console.log(`✓ Media record created with ID: ${mediaId}`);

// Update blog post
const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = ?');
updateStmt.run(mediaId, now, postId);

const post = db.prepare('SELECT title FROM blog_posts WHERE id = ?').get(postId);
console.log(`✓ Updated blog post ${postId}: ${post.title}`);
console.log(`  Image: ${filename}`);

db.close();
