const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFile = 'C:\\Users\\craig\\Desktop\\cvcwebsolutions_wp_jdqla.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Extract the INSERT statement for posts
const postsMatch = sqlContent.match(/INSERT INTO `k8gbJ99R_posts`[^;]+;/s);
if (!postsMatch) {
  console.error('Could not find posts INSERT statement');
  process.exit(1);
}

const postsInsert = postsMatch[0];

// Extract column names
const columnsMatch = postsInsert.match(/INSERT INTO `k8gbJ99R_posts` \(([^)]+)\)/);
const columns = columnsMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));

console.log('Columns found:', columns);

// Extract VALUES section
const valuesMatch = postsInsert.match(/VALUES (.+);$/s);
if (!valuesMatch) {
  console.error('Could not find VALUES section');
  process.exit(1);
}

// Parse the VALUES - this is tricky because content contains commas
// We'll use a simple regex to match each row between parentheses
const valuesText = valuesMatch[1];
const rows = [];

// Split by '),(' to get individual rows
let currentPos = 0;
let depth = 0;
let currentRow = '';
let inString = false;
let stringChar = null;
let escaped = false;

for (let i = 0; i < valuesText.length; i++) {
  const char = valuesText[i];

  if (escaped) {
    currentRow += char;
    escaped = false;
    continue;
  }

  if (char === '\\') {
    escaped = true;
    currentRow += char;
    continue;
  }

  if ((char === '"' || char === "'") && !escaped) {
    if (!inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar) {
      inString = false;
      stringChar = null;
    }
  }

  if (!inString) {
    if (char === '(') {
      if (depth === 0) {
        currentRow = '';
      } else {
        currentRow += char;
      }
      depth++;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        rows.push(currentRow);
      } else {
        currentRow += char;
      }
    } else {
      currentRow += char;
    }
  } else {
    currentRow += char;
  }
}

console.log(`Found ${rows.length} rows`);

// Parse each row into an object
const posts = rows.map(row => {
  const values = [];
  let current = '';
  let inString = false;
  let stringChar = null;
  let escaped = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      current += char;
      continue;
    }

    if ((char === '"' || char === "'") && !escaped) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue; // Don't include the quote itself
    }

    if (!inString && char === ',') {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last value
  if (current) {
    values.push(current.trim());
  }

  const post = {};
  columns.forEach((col, idx) => {
    let value = values[idx];
    // Handle NULL
    if (value === 'NULL') {
      value = null;
    }
    post[col] = value;
  });

  return post;
});

// Filter for published blog posts only
const blogPosts = posts.filter(p =>
  p.post_type === 'post' &&
  p.post_status === 'publish'
);

console.log(`Found ${blogPosts.length} published blog posts`);

// Convert to Payload format and save
const payloadPosts = blogPosts.map(post => ({
  title: post.post_title,
  slug: post.post_name,
  content: convertWordPressContent(post.post_content),
  excerpt: post.post_excerpt || generateExcerpt(post.post_content),
  publishedAt: post.post_date,
  status: 'published',
  author: {
    name: 'CVC Web Solutions',
    email: 'info@cvcwebsolutions.com'
  },
  categories: [], // We'll need to extract these from wp_term_relationships
  readingTime: estimateReadingTime(post.post_content)
}));

fs.writeFileSync('wordpress-blogs.json', JSON.stringify(payloadPosts, null, 2));
console.log(`Exported ${payloadPosts.length} blog posts to wordpress-blogs.json`);

// Helper functions
function convertWordPressContent(html) {
  if (!html) return [];

  // For now, create a simple rich text structure
  // In production, you'd want to properly convert HTML to Lexical format
  return [
    {
      children: [
        {
          text: stripHtml(html)
        }
      ]
    }
  ];
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function generateExcerpt(content, length = 160) {
  const text = stripHtml(content);
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function estimateReadingTime(content) {
  const text = stripHtml(content);
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average reading speed
  return minutes;
}
