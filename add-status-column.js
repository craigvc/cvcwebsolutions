const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'content.db');
console.log('Updating database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Check if status column exists
  const columns = db.prepare("PRAGMA table_info(portfolio_projects)").all();
  const hasStatus = columns.some(col => col.name === 'status');
  
  if (!hasStatus) {
    console.log('Adding status column...');
    db.exec("ALTER TABLE portfolio_projects ADD COLUMN status TEXT DEFAULT 'published'");
    console.log('Status column added successfully');
    
    // Update existing rows to have published status
    db.exec("UPDATE portfolio_projects SET status = 'published' WHERE status IS NULL");
    console.log('Updated existing rows with published status');
  } else {
    console.log('Status column already exists');
  }
  
  db.close();
  console.log('Database update complete');
} catch (error) {
  console.error('Error:', error.message);
}