const puppeteer = require('puppeteer');
const fs = require('fs');

const blogPosts = [
  {
    url: 'https://cvcwebsolutions.com/blog/business-of-conservation-conference-postponed/',
    slug: 'business-of-conservation-conference-postponed',
    title: 'Business of Conservation Conference Postponed'
  },
  {
    url: 'https://cvcwebsolutions.com/blog/join-us-at-the-business-of-conservation-conference-with-gcc/',
    slug: 'join-us-at-the-business-of-conservation-conference-with-gcc',
    title: 'Join Us at the Business of Conservation Conference with GCC'
  },
  {
    url: 'https://cvcwebsolutions.com/blog/the-art-of-user-experience-in-the-age-of-instant-gratification/',
    slug: 'the-art-of-user-experience-in-the-age-of-instant-gratification',
    title: 'The Art of User Experience in the Age of Instant Gratification'
  },
  {
    url: 'https://cvcwebsolutions.com/blog/ai-in-web-design-are-robots-taking-our-jobs-or-just-making-coffee-runs-easier/',
    slug: 'ai-in-web-design-are-robots-taking-our-jobs-or-just-making-coffee-runs-easier',
    title: 'AI in Web Design: Are Robots Taking Our Jobs, or Just Making Coffee Runs Easier?'
  },
  {
    url: 'https://cvcwebsolutions.com/blog/cvc-web-solutions-is-proud-to-support-the-global-conservation-corps/',
    slug: 'cvc-web-solutions-is-proud-to-support-the-global-conservation-corps',
    title: 'CVC Web Solutions is Proud to Support the Global Conservation Corps'
  }
];

async function extractFullContent() {
  const browser = await puppeteer.launch({ headless: true });
  const allContent = {};

  for (const post of blogPosts) {
    try {
      console.log(`Extracting content from: ${post.title}`);
      const page = await browser.newPage();
      await page.goto(post.url, { waitUntil: 'networkidle0' });

      // Extract the main article content
      const content = await page.evaluate(() => {
        // Try different selectors to find the article content
        const selectors = [
          '.entry-content',
          '.post-content',
          '.content',
          'article .content',
          '.single-post-content',
          '[class*="content"]'
        ];

        let articleContent = '';

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            // Get all paragraphs and text content
            const paragraphs = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li');
            if (paragraphs.length > 0) {
              articleContent = Array.from(paragraphs)
                .map(p => p.innerText.trim())
                .filter(text => text.length > 0)
                .join('\n\n');
              break;
            }
          }
        }

        // Fallback: try to get all text from article or main content area
        if (!articleContent) {
          const article = document.querySelector('article') || document.querySelector('main') || document.querySelector('.content');
          if (article) {
            articleContent = article.innerText.trim();
          }
        }

        return articleContent;
      });

      // Extract date information
      const publishedDate = await page.evaluate(() => {
        const dateSelectors = [
          'time[datetime]',
          '.published',
          '.date',
          '.post-date',
          '[class*="date"]'
        ];

        for (const selector of dateSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            return element.getAttribute('datetime') || element.innerText.trim();
          }
        }
        return null;
      });

      allContent[post.slug] = {
        title: post.title,
        slug: post.slug,
        url: post.url,
        content: content,
        publishedDate: publishedDate,
        extractedAt: new Date().toISOString()
      };

      console.log(`✅ Extracted ${content.length} characters for: ${post.title}`);
      await page.close();

    } catch (error) {
      console.error(`❌ Error extracting ${post.title}:`, error.message);
    }
  }

  await browser.close();

  // Save to file
  fs.writeFileSync('blog-full-content.json', JSON.stringify(allContent, null, 2));
  console.log('\n✅ All content extracted and saved to blog-full-content.json');

  return allContent;
}

if (require.main === module) {
  extractFullContent().catch(console.error);
}

module.exports = extractFullContent;