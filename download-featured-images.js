const fs = require('fs');
const path = require('path');
const https = require('https');

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'blog');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Featured images from the live website
const imageUrls = [
  {
    url: 'https://cvcwebsolutions.com/wp-content/uploads/2024/10/Join-Us.jpg',
    filename: 'business-conservation-conference-postponed.jpg',
    title: 'Business of Conservation Conference Postponed'
  },
  {
    url: 'https://cvcwebsolutions.com/wp-content/uploads/2024/10/Join-Us.png',
    filename: 'join-us-conservation-conference.png',
    title: 'Join us at the Business of Conservation Conference with GCC'
  },
  {
    url: 'https://cvcwebsolutions.com/wp-content/uploads/2023/10/DALL%C2%B7E-2023-10-04-21.29.32.png',
    filename: 'user-experience-instant-gratification.png',
    title: 'The Art of User Experience in the Age of Instant Gratification'
  },
  {
    url: 'https://cvcwebsolutions.com/wp-content/uploads/2023/10/AI-in-Web-Design-e1696358572928.png',
    filename: 'ai-web-design-robots.png',
    title: 'AI in Web Design: Are Robots Taking Our Jobs or Just Making Coffee Runs Easier?'
  },
  {
    url: 'https://cvcwebsolutions.com/wp-content/uploads/2023/02/baby_cheetah-scaled-1.jpg',
    filename: 'cvc-global-conservation-corps.jpg',
    title: 'CVC Web Solutions is proud to Support the Global Conservation Corps'
  }
];

function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);

    console.log(`Downloading: ${imageUrl}`);

    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve(filePath);
        });

        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete incomplete file
          console.error(`✗ Error writing ${filename}:`, err.message);
          reject(err);
        });
      } else {
        console.error(`✗ Failed to download ${filename}: HTTP ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`✗ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting download of featured images from live website...');
  console.log(`Saving to: ${imagesDir}`);

  for (const image of imageUrls) {
    try {
      await downloadImage(image.url, image.filename);
      // Small delay between downloads to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to download image for "${image.title}":`, error.message);
    }
  }

  console.log('\n✅ Image download completed!');
  console.log('Images saved to: public/images/blog/');
  console.log('\nNext step: Update the blog template to use these local images.');
}

// Create a mapping for the blog template
function createImageMapping() {
  const mapping = {};

  imageUrls.forEach(image => {
    const slug = image.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    mapping[slug] = `/images/blog/${image.filename}`;
  });

  // Save mapping as JSON for easy reference
  fs.writeFileSync(
    path.join(__dirname, 'blog-image-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log('\n📝 Created blog-image-mapping.json with image paths');
  return mapping;
}

if (require.main === module) {
  downloadAllImages()
    .then(() => createImageMapping())
    .catch(console.error);
}

module.exports = { downloadAllImages, createImageMapping };