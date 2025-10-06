const fetch = require('node-fetch');

// Configuration
const DUPLICATE_ID = 11; // Vixen Capital Advisors AI
const API_URL = `http://localhost:3456/api/portfolio/${DUPLICATE_ID}`;

async function deleteDuplicate() {
  console.log('🗑️  Deleting duplicate Vixen Capital Advisors AI entry...\n');
  
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    console.log('✅ Duplicate entry deleted successfully');
    console.log(`🗑️  Removed: Vixen Capital Advisors AI (ID: ${DUPLICATE_ID})`);
    
  } catch (error) {
    console.error('❌ Error deleting duplicate:', error.message);
    throw error;
  }
}

deleteDuplicate();
