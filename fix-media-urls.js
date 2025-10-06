const fetch = require('node-fetch');

async function fixMediaUrls() {
  try {
    console.log('🔧 Fixing media URLs to use static file paths...\n');

    // Get all media records
    const response = await fetch('http://localhost:3456/api/media?limit=20');
    const data = await response.json();
    const mediaRecords = data.docs || [];

    console.log(`Found ${mediaRecords.length} media records to fix`);

    let successCount = 0;

    for (const media of mediaRecords) {
      console.log(`\n--- Fixing: ${media.filename} ---`);
      console.log(`Current URL: ${media.url}`);

      // Create the correct static URL
      const correctUrl = `/media/${media.filename}`;
      console.log(`New URL: ${correctUrl}`);

      // Update the media record
      const updateResponse = await fetch(`http://localhost:3456/api/media/${media.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: correctUrl
        })
      });

      if (updateResponse.ok) {
        console.log(`✅ Successfully updated URL for: ${media.filename}`);
        successCount++;
      } else {
        const errorText = await updateResponse.text();
        console.log(`❌ Failed to update ${media.filename}: ${updateResponse.status} - ${errorText}`);
      }
    }

    console.log(`\n🎉 URL fix completed!`);
    console.log(`✅ Successfully updated: ${successCount}/${mediaRecords.length} media records`);
    console.log('\nYour blog images should now display correctly!');
    console.log('Check your blog at: http://localhost:3456/blog');

  } catch (error) {
    console.error('❌ Error fixing URLs:', error.message);
  }
}

fixMediaUrls();