const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database('./data/payload.db');

// Copy CVC logo to media folder as default blog image
const logoSource = './public/cvc-logo.png';
const logoDest = './public/media/cvc-blog-default.png';
fs.copyFileSync(logoSource, logoDest);

// Insert logo into media table
const now = new Date().toISOString();
const stats = fs.statSync(logoDest);
const mediaInsert = db.prepare(`
  INSERT OR IGNORE INTO media (filename, mime_type, filesize, url, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const result = mediaInsert.run(
  'cvc-blog-default.png',
  'image/png',
  stats.size,
  '/media/cvc-blog-default.png',
  now,
  now
);

const defaultImageId = result.lastInsertRowid || db.prepare('SELECT id FROM media WHERE filename = ?').get('cvc-blog-default.png').id;

console.log('Default blog image created with ID:', defaultImageId);

// Get posts without featured images
const postsWithoutImages = db.prepare(`
  SELECT id, title, slug
  FROM blog_posts
  WHERE featured_image_id IS NULL
`).all();

console.log(`\nFound ${postsWithoutImages.length} posts without featured images`);

// Update them with the default image
const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = ?');

for (const post of postsWithoutImages) {
  updateStmt.run(defaultImageId, now, post.id);
  console.log(`  ✓ Updated: ${post.title}`);
}

db.close();
console.log(`\n✓ All blog posts now have featured images!`);
