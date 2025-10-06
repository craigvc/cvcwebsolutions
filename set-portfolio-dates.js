const fetch = require('node-fetch');

const API_URL = 'http://localhost:3456/api/portfolio';

async function getAllPortfolioItems() {
  console.log('📋 Fetching all portfolio items...\n');
  
  const response = await fetch(`${API_URL}?limit=100`);
  const data = await response.json();
  
  return data.docs || [];
}

async function updatePortfolioDate(id, year, title) {
  // Create a date at the end of the year (Dec 31)
  // This way projects from the same year will be ordered by their creation order
  const published_at = new Date(`${year}-12-31T23:59:59.000Z`).toISOString();
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ published_at })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    console.log(`✅ Updated: ${title} (${year})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${title}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting portfolio dates based on year...\n');
  
  try {
    const items = await getAllPortfolioItems();
    console.log(`📊 Found ${items.length} portfolio items\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const item of items) {
      if (!item.year) {
        console.log(`⚠️  Skipping ${item.title} - no year set`);
        skipped++;
        continue;
      }
      
      // Update all items to ensure consistent date ordering
      const success = await updatePortfolioDate(item.id, item.year, item.title);
      if (success) {
        updated++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n✨ Date setting complete!');
    console.log(`📊 Updated: ${updated} items`);
    console.log(`⏭️  Skipped: ${skipped} items`);
    
  } catch (error) {
    console.error('\n❌ Process failed:', error);
    process.exit(1);
  }
}

main();
