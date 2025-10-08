const Database = require('better-sqlite3');
const db = new Database('./data/payload.db');

const now = new Date().toISOString();

// Get all blog posts with their category_id
const posts = db.prepare(`
  SELECT id, category_id
  FROM blog_posts
  WHERE category_id IS NOT NULL
`).all();

console.log('Found', posts.length, 'posts with categories\n');

// Insert relationships into blog_posts_rels
const insertRel = db.prepare(`
  INSERT INTO blog_posts_rels (parent_id, path, categories_id, "order")
  VALUES (?, 'categories', ?, 1)
`);

posts.forEach(post => {
  insertRel.run(post.id, post.category_id);
  console.log(`✓ Linked post ${post.id} to category ${post.category_id}`);
});

// Verify
const rels = db.prepare('SELECT * FROM blog_posts_rels').all();
console.log('\nTotal relationships:', rels.length);
console.log('\nRelationships:', rels);

db.close();
console.log('\n✅ Category relationships created!');
