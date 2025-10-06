import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      if (!validUrl.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Extract metadata using regex patterns
    const extractMetaContent = (name: string): string => {
      // Try various meta tag formats
      const patterns = [
        new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, 'i'),
        new RegExp(`<meta\\s+property=["']og:${name}["']\\s+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']og:${name}["']`, 'i'),
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      return '';
    };

    // Extract title
    let title = '';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    // Fallback to og:title or site_name
    if (!title) {
      title = extractMetaContent('title') || extractMetaContent('site_name');
    }

    // Extract description
    const description = extractMetaContent('description');

    // Extract site name (for subtitle)
    const siteName = extractMetaContent('site_name') || extractMetaContent('application-name');

    // Extract keywords (for technologies suggestion)
    const keywords = extractMetaContent('keywords');

    // Extract og:image for featured image
    const ogImage = extractMetaContent('image');

    // Try to extract main content for longer description
    let mainContent = '';

    // Try to find main content areas
    const contentPatterns = [
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<section[^>]*class=["'][^"']*hero[^"']*["'][^>]*>([\s\S]*?)<\/section>/i
    ];

    for (const pattern of contentPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        // Strip HTML tags and clean up
        mainContent = match[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 1000); // Limit to first 1000 characters
        if (mainContent.length > 100) break; // If we found substantial content, use it
      }
    }

    // Clean up the domain for a project title
    const domain = validUrl.hostname.replace(/^www\./, '');
    const cleanTitle = title || domain.charAt(0).toUpperCase() + domain.slice(1).replace(/\.[^.]+$/, '');

    // Generate a slug from the title
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return NextResponse.json({
      success: true,
      metadata: {
        title: cleanTitle,
        subtitle: siteName || domain,
        description: description || `Website for ${cleanTitle}`,
        longDescription: mainContent,
        url: validUrl.toString(),
        image: ogImage,
        keywords: keywords ? keywords.split(',').map(k => k.trim()).slice(0, 10) : [],
        slug: slug
      }
    });

  } catch (error) {
    console.error('Error fetching website metadata:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch website metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}