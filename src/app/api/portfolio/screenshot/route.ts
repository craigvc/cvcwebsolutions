import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  let browser;
  let cleanUrl = '';
  
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Clean and validate the URL
    cleanUrl = url;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    console.log(`Capturing screenshot for: ${cleanUrl}`);
    
    // Launch Puppeteer browser (Windows-friendly configuration)
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
      ],
      // Don't use single-process on Windows
    });
    
    const page = await browser.newPage();
    
    // Set viewport for better screenshots
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Navigate to the URL with timeout
    try {
      await page.goto(cleanUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
    } catch (navigationError) {
      console.log('Navigation timeout, trying with domcontentloaded...');
      await page.goto(cleanUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
    }

    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to trigger lazy-loaded content
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Take screenshot with clipping to avoid overly long screenshots
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
      }
    });
    
    // Close browser
    await browser.close();
    browser = null;
    
    // Convert to base64
    const base64 = Buffer.from(screenshot).toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;
    
    // Optionally save to public directory for permanent storage
    try {
      const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
      await fs.mkdir(screenshotsDir, { recursive: true } as any);
      
      // Generate filename based on domain and timestamp
      const domain = new URL(cleanUrl).hostname.replace(/[^a-z0-9]/gi, '-');
      const timestamp = Date.now();
      const filename = `${domain}-${timestamp}.png`;
      const filepath = path.join(screenshotsDir, filename);
      
      // Save screenshot
      await fs.writeFile(filepath, screenshot);
      
      // Return both base64 and file path
      return NextResponse.json({ 
        screenshotUrl: dataUri,
        fileUrl: `/screenshots/${filename}`,
        success: true,
        service: 'puppeteer-local',
        message: 'Screenshot captured successfully'
      });
    } catch (saveError) {
      console.log('Could not save screenshot to disk:', saveError);
      // Still return the base64 version
      return NextResponse.json({ 
        screenshotUrl: dataUri,
        success: true,
        service: 'puppeteer-local',
        message: 'Screenshot captured successfully (in memory only)'
      });
    }
    
  } catch (error: any) {
    console.error('Error generating screenshot:', error);
    
    // Clean up browser if it's still open
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    // Provide helpful error message
    let errorMessage = error?.message || 'Unknown error';
    let helpMessage = '';
    
    if (errorMessage.includes('Failed to launch')) {
      helpMessage = 'Puppeteer failed to launch Chrome. Try: npm rebuild puppeteer';
    } else if (errorMessage.includes('net::ERR')) {
      helpMessage = 'Could not reach the URL. Please check if the URL is accessible.';
    } else if (errorMessage.includes('Timeout')) {
      helpMessage = 'The page took too long to load. The site might be slow or down.';
    }
    
    // Try using a website screenshot service as fallback
    const encodedUrl = cleanUrl ? encodeURIComponent(cleanUrl) : '';
    
    // Use a simple screenshot API or placeholder
    let screenshotUrl = '';
    if (encodedUrl) {
      // Use the free WordPress mshots service with better dimensions
      screenshotUrl = `https://s0.wp.com/mshots/v1/${encodedUrl}?w=1920&h=1080`;
    } else {
      // Final fallback placeholder
      screenshotUrl = `https://dummyimage.com/1920x1080/6366f1/ffffff.png&text=Screenshot+Service+Unavailable`;
    }
    
    return NextResponse.json({ 
      screenshotUrl,
      success: false,
      service: 'fallback-mshots',
      message: helpMessage || `Screenshot failed: ${errorMessage}. Using fallback service.`,
      error: errorMessage
    });
  }
}
