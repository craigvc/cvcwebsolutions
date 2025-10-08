const sharp = require('sharp');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./data/payload.db');

async function enhanceLogo() {
  const inputPath = './public/media/blog-mage-communications.png';
  const outputPath = './public/media/blog-mage-communications-enhanced.png';

  // Create a canvas with white rounded background and center the logo
  const padding = 350; // Much more padding to make logo significantly smaller
  const canvasSize = 1600; // Even larger canvas for better quality
  const borderRadius = 80; // Rounded corners

  try {
    // Read the original logo
    const logoBuffer = await sharp(inputPath)
      .resize(canvasSize - (padding * 2), canvasSize - (padding * 2), {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    // Create SVG with rounded rectangle background
    const svgBackground = `
      <svg width="${canvasSize}" height="${canvasSize}">
        <rect
          x="0"
          y="0"
          width="${canvasSize}"
          height="${canvasSize}"
          rx="${borderRadius}"
          ry="${borderRadius}"
          fill="white"
        />
      </svg>
    `;

    // Composite the logo on the white rounded background
    await sharp(Buffer.from(svgBackground))
      .composite([{
        input: logoBuffer,
        top: padding,
        left: padding
      }])
      .png()
      .toFile(outputPath);

    console.log('✓ Enhanced logo created:', outputPath);

    // Get file stats
    const stats = fs.statSync(outputPath);
    const now = new Date().toISOString();

    // Update existing media record or create new one
    const existingMedia = db.prepare('SELECT id FROM media WHERE filename = ?')
      .get('blog-mage-communications-enhanced.png');

    let mediaId;
    if (existingMedia) {
      // Update existing record
      const updateMedia = db.prepare(`
        UPDATE media SET filesize = ?, updated_at = ?
        WHERE filename = ?
      `);
      updateMedia.run(stats.size, now, 'blog-mage-communications-enhanced.png');
      mediaId = existingMedia.id;
      console.log('✓ Updated media record ID:', mediaId);
    } else {
      // Insert new record
      const mediaInsert = db.prepare(`
        INSERT INTO media (filename, mime_type, filesize, url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = mediaInsert.run(
        'blog-mage-communications-enhanced.png',
        'image/png',
        stats.size,
        '/media/blog-mage-communications-enhanced.png',
        now,
        now
      );
      mediaId = result.lastInsertRowid;
      console.log('✓ Media record created with ID:', mediaId);
    }

    // Update blog post 6
    const updateStmt = db.prepare('UPDATE blog_posts SET featured_image_id = ?, updated_at = ? WHERE id = 6');
    updateStmt.run(mediaId, now);
    console.log('✓ Updated blog post 6 with enhanced logo');

    db.close();
  } catch (error) {
    console.error('Error:', error.message);
    db.close();
    process.exit(1);
  }
}

enhanceLogo();
