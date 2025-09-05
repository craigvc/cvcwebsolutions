import { NextRequest, NextResponse } from 'next/server';
import { updatePortfolioProject, getPortfolioProject } from '@/lib/db-sqlite';

// Dynamic imports to avoid build-time issues
async function captureScreenshot(url: string, id: number) {
  try {
    // Dynamic import puppeteer
    const puppeteer = await import('puppeteer');
    const sharp = await import('sharp');
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Launch browser with Docker-friendly options
    const browser = await puppeteer.default.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Set viewport for desktop screenshot
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      });

      // Navigate to the URL with error handling
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Try again with just load event
        await page.goto(url, {
          waitUntil: 'load',
          timeout: 30000
        });
      }

      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage: false
      });

      // Optimize the image
      const optimizedBuffer = await sharp.default(screenshotBuffer)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'top'
        })
        .png({ quality: 85 })
        .toBuffer();

      // Create screenshots directory if it doesn't exist
      const screenshotsDir = path.default.join(process.cwd(), 'public', 'screenshots');
      await fs.default.mkdir(screenshotsDir, { recursive: true });

      // Save the screenshot with a unique filename
      const filename = `portfolio-${id}-${Date.now()}.png`;
      const filepath = path.default.join(screenshotsDir, filename);
      await fs.default.writeFile(filepath, optimizedBuffer);

      return `/screenshots/${filename}`;
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Puppeteer error:', error);
    throw error;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Get the project to find its URL
    const project = getPortfolioProject(id);
    
    if (!project || !project.url) {
      return NextResponse.json(
        { error: 'Project not found or no URL specified' },
        { status: 404 }
      );
    }

    try {
      // Capture the screenshot
      const screenshotUrl = await captureScreenshot(project.url, id);
      
      // Update the database with the screenshot path
      // Try to update both fields, but continue if screenshot_url doesn't exist
      let success = false;
      try {
        success = updatePortfolioProject(id, { 
          image: screenshotUrl,
          screenshot_url: screenshotUrl 
        });
      } catch (err) {
        // If screenshot_url column doesn't exist, just update image
        console.log('Falling back to image field only');
        success = updatePortfolioProject(id, { 
          image: screenshotUrl
        });
      }

      if (success) {
        return NextResponse.json({ 
          success: true,
          screenshotUrl
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to update project with screenshot' },
          { status: 500 }
        );
      }
    } catch (screenshotError) {
      console.error('Screenshot capture failed:', screenshotError);
      
      // Return error but don't crash
      return NextResponse.json(
        { 
          error: 'Failed to capture screenshot. Make sure the URL is accessible.',
          details: screenshotError instanceof Error ? screenshotError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in screenshot endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process screenshot request' },
      { status: 500 }
    );
  }
}