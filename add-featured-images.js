const fs = require('fs');

async function addFeaturedImagesToPosts() {
  console.log('Adding featured images to blog posts...');

  // First, let's upload some default featured images to the media collection
  const defaultImages = [
    {
      filename: 'conservation-conference.jpg',
      alt: 'Business of Conservation Conference',
      description: 'Conference focused on conservation business practices'
    },
    {
      filename: 'ux-design.jpg',
      alt: 'User Experience Design',
      description: 'Modern UX design illustration'
    },
    {
      filename: 'ai-web-design.jpg',
      alt: 'AI in Web Design',
      description: 'Artificial intelligence in web development'
    },
    {
      filename: 'conservation-tech.jpg',
      alt: 'Conservation Technology',
      description: 'Technology solutions for conservation'
    }
  ];

  // Get all blog posts
  try {
    const response = await fetch('http://localhost:3456/api/blog-posts');
    if (!response.ok) {
      console.error('Failed to fetch blog posts');
      return;
    }

    const data = await response.json();
    const posts = data.docs || [];

    console.log(`Found ${posts.length} blog posts to update`);

    // Update posts with featured images and author
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      // Create a simple featured image placeholder (we'll use external URLs for now)
      let featuredImageUrl = null;

      if (post.title.toLowerCase().includes('conservation')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop';
      } else if (post.title.toLowerCase().includes('ux') || post.title.toLowerCase().includes('user experience')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop';
      } else if (post.title.toLowerCase().includes('ai') || post.title.toLowerCase().includes('artificial intelligence')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop';
      } else {
        featuredImageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop';
      }

      const updateData = {
        featuredImage: featuredImageUrl,
        author: {
          name: 'CVC Web Solutions',
          email: 'info@cvcwebsolutions.com'
        }
      };

      console.log(`Updating post: ${post.title}...`);
      const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (updateResponse.ok) {
        console.log(`✓ Updated: ${post.title}`);
      } else {
        console.log(`✗ Failed to update: ${post.title}`);
      }

      // Small delay between updates
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Featured images update completed!');

  } catch (error) {
    console.error('Error updating posts:', error.message);
  }
}

// Run the update
if (require.main === module) {
  addFeaturedImagesToPosts().catch(console.error);
}

module.exports = { addFeaturedImagesToPosts };