const fetch = require('node-fetch');

async function assignExistingMediaToPosts() {
  try {
    console.log('🔗 Assigning existing media records to blog posts...\n');

    // Get all media records
    const mediaResponse = await fetch('http://localhost:3456/api/media?limit=20');
    const mediaData = await mediaResponse.json();
    const mediaRecords = mediaData.docs || [];

    // Get all blog posts
    const postsResponse = await fetch('http://localhost:3456/api/blog-posts?limit=20');
    const postsData = await postsResponse.json();
    const posts = postsData.docs || [];

    console.log(`Found ${mediaRecords.length} media records and ${posts.length} blog posts`);

    // Create mapping based on filenames
    const assignments = [
      {
        postSlug: 'welcome-to-cvc',
        filename: 'welcome-to-cvc-web-solutions.jpg',
        postTitle: 'Welcome to CVC Web Solutions'
      },
      {
        postSlug: 'future-of-ai-web-development',
        filename: 'future-ai-web-development.jpg',
        postTitle: 'The Future of AI in Web Development'
      },
      {
        postSlug: 'building-scalable-ecommerce',
        filename: 'building-scalable-ecommerce.jpg',
        postTitle: 'Building Scalable E-commerce Solutions'
      },
      {
        postSlug: 'business-of-conservation-conference-postponed',
        filename: 'business-conservation-conference-postponed.jpg',
        postTitle: 'Business of Conservation Conference Postponed'
      },
      {
        postSlug: 'join-us-at-the-business-of-conservation-conference-with-gcc',
        filename: 'join-us-conservation-conference.png',
        postTitle: 'Join us at the Business of Conservation Conference with GCC'
      },
      {
        postSlug: 'the-art-of-user-experience-in-the-age-of-instant-gratification',
        filename: 'user-experience-instant-gratification-ai.jpg',
        postTitle: 'The Art of User Experience in the Age of Instant Gratification'
      },
      {
        postSlug: 'ai-in-web-design-are-robots-taking-our-jobs-or-just-making-coffee-runs-easier',
        filename: 'ai-web-design-robots-ai.jpg',
        postTitle: 'AI in Web Design: Are Robots Taking Our Jobs or Just Making Coffee Runs Easier?'
      },
      {
        postSlug: 'cvc-web-solutions-is-proud-to-support-the-global-conservation-corps',
        filename: 'cvc-global-conservation-corps-ai.jpg',
        postTitle: 'CVC Web Solutions is proud to Support the Global Conservation Corps'
      }
    ];

    let successCount = 0;

    for (const assignment of assignments) {
      console.log(`\\n--- Processing: ${assignment.postTitle} ---`);

      // Find the media record by filename
      const mediaRecord = mediaRecords.find(m => m.filename === assignment.filename);
      if (!mediaRecord) {
        console.log(`❌ Media record not found for: ${assignment.filename}`);
        continue;
      }

      console.log(`📷 Found media: ${mediaRecord.filename} (ID: ${mediaRecord.id})`);

      // Find the blog post by slug
      const post = posts.find(p => p.slug === assignment.postSlug);
      if (!post) {
        console.log(`❌ Blog post not found for slug: ${assignment.postSlug}`);
        continue;
      }

      console.log(`📝 Found post: ${post.title} (ID: ${post.id})`);

      // Assign media to post
      console.log(`🔗 Assigning image to post...`);

      const updateResponse = await fetch(`http://localhost:3456/api/blog-posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          featuredImage: mediaRecord.id
        })
      });

      if (updateResponse.ok) {
        console.log(`✅ Successfully assigned image to: ${assignment.postTitle}`);
        successCount++;
      } else {
        const errorText = await updateResponse.text();
        console.log(`❌ Failed to assign image: ${updateResponse.status} - ${errorText}`);
      }
    }

    console.log(`\\n🎉 Assignment completed!`);
    console.log(`✅ Successfully assigned: ${successCount}/${assignments.length} images`);
    console.log('\\nYour blog should now display all featured images!');
    console.log('Check your blog at: http://localhost:3456/blog');

  } catch (error) {
    console.error('❌ Error in assignment process:', error.message);
  }
}

assignExistingMediaToPosts();