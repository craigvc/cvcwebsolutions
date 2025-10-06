const fetch = require('node-fetch');

async function debugContentMismatch() {
  try {
    console.log('🔍 Debugging content mismatch issue...\n');

    // Check the specific post that has issues
    const response = await fetch('http://localhost:3456/api/blog-posts?where[slug][equals]=future-of-ai-web-development&depth=2');
    const data = await response.json();
    const post = data.docs[0];

    if (!post) {
      console.log('❌ Post not found');
      return;
    }

    console.log('📝 Post Details:');
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    console.log(`Published: ${post.publishedAt}`);
    console.log(`Excerpt: ${post.excerpt?.substring(0, 100)}...`);

    console.log('\n📄 Content Structure:');
    if (post.content) {
      console.log(JSON.stringify(post.content, null, 2));
    } else {
      console.log('❌ No content found');
    }

    // Also check what we have in our extracted content file
    console.log('\n📁 Checking extracted content file...');
    const fs = require('fs');
    try {
      const extractedContent = JSON.parse(fs.readFileSync('blog-full-content.json', 'utf8'));
      const expectedContent = extractedContent['future-of-ai-web-development'];

      if (expectedContent) {
        console.log('\n✅ Found extracted content:');
        console.log(`Title: ${expectedContent.title}`);
        console.log(`Content length: ${expectedContent.content?.length || 0} characters`);
        console.log(`Content preview: ${expectedContent.content?.substring(0, 200)}...`);
      } else {
        console.log('❌ No extracted content found for this slug');
      }
    } catch (error) {
      console.log('❌ Error reading extracted content:', error.message);
    }

    // Check all posts to see which ones have content vs which don't
    console.log('\n📊 All Posts Content Status:');
    const allPostsResponse = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    const allPostsData = await allPostsResponse.json();

    allPostsData.docs.forEach(p => {
      const hasContent = p.content && p.content.root && p.content.root.children && p.content.root.children.length > 0;
      const contentLength = hasContent ? p.content.root.children.length : 0;
      console.log(`- ${p.title} (${p.slug}): ${hasContent ? `✅ ${contentLength} blocks` : '❌ No content'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugContentMismatch();