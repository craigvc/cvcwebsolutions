const fetch = require('node-fetch');

async function getMediaAndAssign() {
  try {
    // First, get the media record we just created
    console.log('Getting media records...');
    const mediaResponse = await fetch('http://localhost:3456/api/media?limit=10');

    if (!mediaResponse.ok) {
      console.log('❌ Failed to get media');
      return;
    }

    const mediaData = await mediaResponse.json();
    console.log('Media records found:', mediaData.docs.length);

    if (mediaData.docs.length === 0) {
      console.log('❌ No media records found');
      return;
    }

    // Get the first media record (our test image)
    const media = mediaData.docs[0];
    console.log('Using media:', media.filename, 'ID:', media.id);

    // Get the "Welcome to CVC" blog post
    console.log('Getting blog post...');
    const postResponse = await fetch('http://localhost:3456/api/blog-posts?where[slug][equals]=welcome-to-cvc');

    if (!postResponse.ok) {
      console.log('❌ Failed to find blog post');
      return;
    }

    const postData = await postResponse.json();
    const post = postData.docs[0];

    if (!post) {
      console.log('❌ Blog post not found');
      return;
    }

    console.log('Found blog post:', post.title);

    // Update the blog post with the media ID
    console.log('Assigning image to blog post...');
    const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        featuredImage: media.id
      })
    });

    if (updateResponse.ok) {
      console.log('✅ Successfully assigned image to blog post!');
      console.log('The "Welcome to CVC Web Solutions" post now has a featured image.');
      console.log('Check your blog at http://localhost:3456/blog to see it.');
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ Failed to assign image:', updateResponse.status, errorText);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

getMediaAndAssign();