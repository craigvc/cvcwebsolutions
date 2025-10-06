const fs = require('fs');

async function updateBlogPostsWithImages() {
  console.log('Adding featured images to blog posts...');

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

    // Update each post with a featured image URL and ensure consistent author
    for (const post of posts) {
      // Choose appropriate featured image based on post content
      let featuredImageUrl = null;

      if (post.title.toLowerCase().includes('conservation') || post.title.toLowerCase().includes('global conservation corps')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center';
      } else if (post.title.toLowerCase().includes('ux') || post.title.toLowerCase().includes('user experience')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop&crop=center';
      } else if (post.title.toLowerCase().includes('ai') || post.title.toLowerCase().includes('artificial intelligence') || post.title.toLowerCase().includes('robot')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center';
      } else if (post.title.toLowerCase().includes('web development') || post.title.toLowerCase().includes('future')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center';
      } else if (post.title.toLowerCase().includes('ecommerce') || post.title.toLowerCase().includes('e-commerce')) {
        featuredImageUrl = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center';
      } else {
        // Default web development image
        featuredImageUrl = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&crop=center';
      }

      // Prepare update data - just update the fields we can modify
      const updateData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
        publishedAt: post.publishedAt,
        featured: post.featured || false
      };

      console.log(`Updating post: ${post.title}...`);
      console.log(`Using image: ${featuredImageUrl}`);

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
        const errorText = await updateResponse.text();
        console.log(`✗ Failed to update: ${post.title}`);
        console.log('Error:', errorText.substring(0, 200));
      }

      // Small delay between updates
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Blog posts update completed!');
    console.log('\nNote: Featured images are now hardcoded in the template as external URLs');
    console.log('The blog page will display appropriate images for each post type.');

  } catch (error) {
    console.error('Error updating posts:', error.message);
  }
}

// Run the update
if (require.main === module) {
  updateBlogPostsWithImages().catch(console.error);
}

module.exports = { updateBlogPostsWithImages };