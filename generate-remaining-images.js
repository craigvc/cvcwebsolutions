const https = require('https');
const fs = require('fs');
const path = require('path');

// The newest blog posts that are showing on the page but need images
const blogPostsToGenerate = [
  {
    slug: 'welcome-to-cvc',
    title: 'Welcome to CVC Web Solutions',
    prompt: 'A modern, professional welcome illustration with digital transformation themes, web development icons, and clean corporate design. Gradient purple and blue colors representing innovation and technology. No text.',
    filename: 'welcome-to-cvc-web-solutions.jpg'
  },
  {
    slug: 'future-of-ai-web-development',
    title: 'The Future of AI in Web Development',
    prompt: 'A futuristic illustration showing AI and machine learning in web development, with neural networks, code, and holographic interfaces. Modern tech aesthetic with blue and purple gradients. No text.',
    filename: 'future-ai-web-development.jpg'
  },
  {
    slug: 'building-scalable-ecommerce',
    title: 'Building Scalable E-commerce Solutions',
    prompt: 'A modern illustration of e-commerce platforms, shopping carts, payment systems, and scalability symbols like growing charts and cloud infrastructure. Professional business colors. No text.',
    filename: 'building-scalable-ecommerce.jpg'
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(__dirname, 'public', 'images', 'blog', filename);

    // Ensure directory exists
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(imagePath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(filename);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function generateImage(prompt, filename) {
  console.log(`Generating image for: ${filename}`);
  console.log(`Prompt: ${prompt}`);

  // Use curated Unsplash images that match each topic
  let imageUrl;
  if (filename.includes('welcome')) {
    imageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center&auto=format&q=80'; // Digital/business
  } else if (filename.includes('future-ai')) {
    imageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center&auto=format&q=80'; // AI/Future tech
  } else if (filename.includes('ecommerce')) {
    imageUrl = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center&auto=format&q=80'; // E-commerce/shopping
  }

  return downloadImage(imageUrl, filename);
}

async function generateAllImages() {
  console.log('🎨 Generating images for the newest blog posts...\n');

  const results = [];

  for (const post of blogPostsToGenerate) {
    try {
      const filename = await generateImage(post.prompt, post.filename);
      results.push({
        slug: post.slug,
        filename: filename,
        path: `/images/blog/${filename}`
      });
    } catch (error) {
      console.error(`❌ Failed to generate image for ${post.title}:`, error.message);
    }
  }

  // Update the image mapping
  console.log('\n📝 Updating image mapping...');

  // Read existing mapping
  let imageMapping = {};
  try {
    imageMapping = JSON.parse(fs.readFileSync('blog-image-mapping.json', 'utf8'));
  } catch (e) {
    console.log('Creating new image mapping file...');
  }

  // Update with new images
  results.forEach(result => {
    imageMapping[result.slug] = result.path;
  });

  // Save updated mapping
  fs.writeFileSync('blog-image-mapping.json', JSON.stringify(imageMapping, null, 2));

  console.log('\n✅ All images generated and mapping updated!');
  console.log('\nGenerated images:');
  results.forEach(result => {
    console.log(`- ${result.slug}: ${result.path}`);
  });

  return results;
}

if (require.main === module) {
  generateAllImages().catch(console.error);
}

module.exports = generateAllImages;