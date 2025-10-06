const fetch = require('node-fetch');
const fs = require('fs');

// Convert plain text to Lexical format for rich text editor
function convertToLexicalFormat(content) {
  if (!content) return null;

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  const children = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();

    // Check if it's a heading (starts with uppercase and is short)
    if (trimmed.length < 80 && /^[A-Z]/.test(trimmed) && !trimmed.includes('.') && !trimmed.includes(',')) {
      return {
        type: 'heading',
        tag: 'h2',
        children: [{
          type: 'text',
          text: trimmed,
          format: 0
        }]
      };
    }

    // Regular paragraph
    return {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: trimmed,
        format: 0
      }]
    };
  });

  return {
    root: {
      type: 'root',
      children: children
    }
  };
}

async function updateBlogPosts() {
  try {
    // Read the extracted content
    const contentData = JSON.parse(fs.readFileSync('blog-full-content.json', 'utf8'));

    // Get existing blog posts from API
    const response = await fetch('http://localhost:3456/api/blog-posts?limit=100');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    const existingPosts = data.docs || [];

    console.log(`Found ${existingPosts.length} existing posts in CMS`);

    for (const post of existingPosts) {
      const fullContent = contentData[post.slug];

      if (fullContent && fullContent.content && fullContent.content !== "Oops! That page can't be found.") {
        console.log(`\nUpdating: ${post.title}`);

        // Convert content to Lexical format
        const lexicalContent = convertToLexicalFormat(fullContent.content);

        // Update the post
        const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: lexicalContent,
            excerpt: fullContent.content.substring(0, 200) + '...',
            publishedAt: fullContent.publishedDate || post.publishedAt
          })
        });

        if (updateResponse.ok) {
          console.log(`✅ Successfully updated: ${post.title}`);
        } else {
          const errorText = await updateResponse.text();
          console.log(`❌ Failed to update ${post.title}: ${updateResponse.status} - ${errorText}`);
        }
      } else {
        console.log(`⚠️ Skipping ${post.title} - no full content available`);
      }
    }

    console.log('\n✅ Blog content update completed!');

  } catch (error) {
    console.error('❌ Error updating blog posts:', error.message);
  }
}

updateBlogPosts();