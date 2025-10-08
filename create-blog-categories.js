const Database = require('better-sqlite3');
const db = new Database('./data/payload.db');

const now = new Date().toISOString();

// Create categories
const categories = [
  {
    title: 'CVC News',
    slug: 'cvc-news',
    description: 'Latest news and updates from CVC Web Solutions',
    color: '#65b73c'
  },
  {
    title: 'Industry News',
    slug: 'industry-news',
    description: 'News and trends from the web development and technology industry',
    color: '#3b82f6'
  },
  {
    title: 'Tips and Tricks',
    slug: 'tips-and-tricks',
    description: 'Helpful tips, tricks, and best practices for web development and design',
    color: '#8b5cf6'
  }
];

console.log('Creating categories...\n');

const insertCategory = db.prepare(`
  INSERT INTO categories (title, slug, description, color, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const categoryIds = {};

categories.forEach(cat => {
  const result = insertCategory.run(
    cat.title,
    cat.slug,
    cat.description,
    cat.color,
    now,
    now
  );
  categoryIds[cat.slug] = result.lastInsertRowid;
  console.log(`✓ Created category: ${cat.title} (ID: ${result.lastInsertRowid})`);
});

// Assign categories to blog posts
console.log('\n\nAssigning categories to blog posts...\n');

// Check if blog_posts table has a category column
const columns = db.prepare(`PRAGMA table_info(blog_posts)`).all();
const hasCategory = columns.some(c => c.name === 'category_id' || c.name === 'category');

if (!hasCategory) {
  console.log('Adding category_id column to blog_posts table...');
  db.prepare('ALTER TABLE blog_posts ADD COLUMN category_id INTEGER').run();
}

const updatePost = db.prepare('UPDATE blog_posts SET category_id = ?, updated_at = ? WHERE id = ?');

// CVC News posts (1, 2, 5, 6, 8, 10, 11)
const cvcNewsPosts = [1, 2, 5, 6, 8, 10, 11];
cvcNewsPosts.forEach(postId => {
  updatePost.run(categoryIds['cvc-news'], now, postId);
  const post = db.prepare('SELECT title FROM blog_posts WHERE id = ?').get(postId);
  console.log(`✓ Post ${postId}: "${post.title.substring(0, 50)}..." → CVC News`);
});

// Tips and Tricks posts (3, 4, 7, 9)
const tipsPosts = [3, 4, 7, 9];
tipsPosts.forEach(postId => {
  updatePost.run(categoryIds['tips-and-tricks'], now, postId);
  const post = db.prepare('SELECT title FROM blog_posts WHERE id = ?').get(postId);
  console.log(`✓ Post ${postId}: "${post.title.substring(0, 50)}..." → Tips and Tricks`);
});

// Verify
console.log('\n\nVerification:');
const verification = db.prepare(`
  SELECT bp.id, bp.title, c.title as category
  FROM blog_posts bp
  LEFT JOIN categories c ON bp.category_id = c.id
  ORDER BY bp.id
`).all();

verification.forEach(post => {
  console.log(`  ${post.id}. ${post.title.substring(0, 60)}... [${post.category || 'No category'}]`);
});

db.close();
console.log('\n✅ Categories created and assigned!');
