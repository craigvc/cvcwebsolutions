const puppeteer = require('puppeteer');
const fs = require('fs');

// Blog post URLs from the live site
const blogPosts = [
  {
    title: "Business of Conservation Conference Postponed",
    url: "https://cvcwebsolutions.com/business-of-conservation-conference-postponed/",
    date: "2024-10-14"
  },
  {
    title: "Join us at the Business of Conservation Conference with GCC",
    url: "https://cvcwebsolutions.com/spotlight-on-vumba-io-with-the-global-conservation-corps/",
    date: "2024-10-03"
  },
  {
    title: "The Art of User Experience in the Age of Instant Gratification",
    url: "https://cvcwebsolutions.com/the-art-of-user-experience-in-the-age-of-instant-gratification/",
    date: "2023-10-04"
  },
  {
    title: "AI in Web Design: Are Robots Taking Our Jobs or Just Making Coffee Runs Easier?",
    url: "https://cvcwebsolutions.com/ai-in-web-design-are-robots-taking-our-jobs-or-just-making-coffee-runs-easier/",
    date: "2023-10-03"
  },
  {
    title: "CVC Web Solutions is proud to Support the Global Conservation Corps",
    url: "https://cvcwebsolutions.com/cvc-web-solutions-is-proud-to-support-the-global-conservation-corps/",
    date: "2023-02-04"
  }
];

async function scrapeBlogPost(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract content from the blog post
    const postData = await page.evaluate(() => {
      // Common selectors for blog content
      const contentSelectors = [
        'article .entry-content',
        '.post-content',
        '.content',
        'main article',
        '.blog-post-content',
        '[class*="content"]'
      ];

      let content = '';
      let excerpt = '';
      let featuredImage = '';

      // Try to find the main content
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          content = element.innerHTML;
          // Get first paragraph as excerpt
          const firstP = element.querySelector('p');
          if (firstP) {
            excerpt = firstP.textContent.trim().substring(0, 200) + '...';
          }
          break;
        }
      }

      // If no content found, try to get all paragraphs
      if (!content) {
        const paragraphs = Array.from(document.querySelectorAll('p')).slice(0, 10);
        content = paragraphs.map(p => p.outerHTML).join('');
        if (paragraphs.length > 0) {
          excerpt = paragraphs[0].textContent.trim().substring(0, 200) + '...';
        }
      }

      // Try to find featured image
      const imgSelectors = [
        '.featured-image img',
        'article img:first-of-type',
        '.post-thumbnail img',
        '.wp-post-image'
      ];

      for (const selector of imgSelectors) {
        const img = document.querySelector(selector);
        if (img && img.src) {
          featuredImage = img.src;
          break;
        }
      }

      return {
        content: content.trim(),
        excerpt: excerpt || 'No excerpt available',
        featuredImage
      };
    });

    await browser.close();
    return postData;

  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    await browser.close();
    return {
      content: '',
      excerpt: 'Error loading content',
      featuredImage: ''
    };
  }
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

async function migrateBlogPosts() {
  console.log('Starting blog post migration...');
  const migratedPosts = [];

  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    console.log(`\nProcessing ${i + 1}/${blogPosts.length}: ${post.title}`);

    const scrapedData = await scrapeBlogPost(post.url);

    const migratedPost = {
      title: post.title,
      slug: createSlug(post.title),
      excerpt: scrapedData.excerpt,
      content: scrapedData.content,
      status: 'published',
      publishedAt: new Date(post.date).toISOString(),
      author: {
        name: 'CVC Web Solutions',
        email: 'info@cvcwebsolutions.com'
      },
      categories: ['Web Development', 'Technology'], // Default categories
      featuredImage: scrapedData.featuredImage || null,
      createdAt: new Date(post.date).toISOString(),
      updatedAt: new Date().toISOString()
    };

    migratedPosts.push(migratedPost);
    console.log(`✓ Successfully processed: ${post.title}`);

    // Add a small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save the migrated posts to a JSON file
  const outputFile = 'migrated-blog-posts.json';
  fs.writeFileSync(outputFile, JSON.stringify(migratedPosts, null, 2));

  console.log(`\n✅ Migration complete! ${migratedPosts.length} posts saved to ${outputFile}`);
  console.log('\nNext steps:');
  console.log('1. Review the migrated-blog-posts.json file');
  console.log('2. Run the import script to add posts to your Payload CMS');
  console.log('3. Update any content formatting as needed');

  return migratedPosts;
}

// API import function
async function importToPayload(posts) {
  console.log('\nImporting posts to Payload CMS...');

  for (const post of posts) {
    try {
      const response = await fetch('http://localhost:3456/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✓ Imported: ${post.title}`);
      } else {
        console.error(`✗ Failed to import: ${post.title} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(`✗ Error importing ${post.title}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--scrape-only')) {
    // Just scrape and save to JSON
    await migrateBlogPosts();
  } else if (args.includes('--import-only')) {
    // Import from existing JSON file
    try {
      const posts = JSON.parse(fs.readFileSync('migrated-blog-posts.json', 'utf8'));
      await importToPayload(posts);
    } catch (error) {
      console.error('Error reading migrated-blog-posts.json:', error.message);
      console.log('Run with --scrape-only first to create the JSON file');
    }
  } else {
    // Do both: scrape and import
    const posts = await migrateBlogPosts();
    console.log('\nWaiting 5 seconds before importing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await importToPayload(posts);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrateBlogPosts, importToPayload };