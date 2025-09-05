const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'content.db');
console.log('Checking database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Get table info
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('\nTables:', tables.map(t => t.name).join(', '));
  
  // Get portfolio_projects schema
  const columns = db.prepare("PRAGMA table_info(portfolio_projects)").all();
  console.log('\nportfolio_projects columns:');
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  // Get row count
  const count = db.prepare("SELECT COUNT(*) as count FROM portfolio_projects").get();
  console.log('\nTotal rows:', count.count);
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
}