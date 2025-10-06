const fetch = require('node-fetch');
const fs = require('fs');

async function updateFeaturedImages() {
  try {
    // Read the image mapping
    const imageMapping = JSON.parse(fs.readFileSync('blog-image-mapping.json', 'utf8'));

    // Get all blog posts
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    const posts = data.docs || [];

    console.log('Updating blog posts with featured images in database...\n');

    for (const post of posts) {
      const imagePath = imageMapping[post.slug];

      if (imagePath) {
        console.log(`Updating ${post.title}...`);
        console.log(`  Adding featured image: ${imagePath}`);

        // Update the post with featured image
        const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            featuredImage: {
              url: imagePath,
              alt: post.title
            }
          })
        });

        if (updateResponse.ok) {
          console.log(`✅ Successfully updated: ${post.title}`);
        } else {
          const errorText = await updateResponse.text();
          console.log(`❌ Failed to update ${post.title}: ${updateResponse.status} - ${errorText}`);
        }
      } else {
        console.log(`⚠️ No image mapping found for: ${post.title} (${post.slug})`);
      }
      console.log('');
    }

    console.log('✅ Featured image update completed!');
    console.log('\nNow the blog components can use post.featuredImage.url instead of hardcoded mappings.');

  } catch (error) {
    console.error('❌ Error updating featured images:', error.message);
  }
}

updateFeaturedImages();