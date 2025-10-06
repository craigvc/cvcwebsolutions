import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, refinePrompt } = await request.json();

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

    console.log('Analyzing website:', validUrl.toString());

    // First, fetch the webpage content
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Extract basic metadata
    const extractMetaContent = (name: string): string => {
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
    if (!title) {
      title = extractMetaContent('title') || extractMetaContent('site_name');
    }

    // Extract og:image
    const ogImage = extractMetaContent('image');

    // Clean HTML and extract text content for analysis
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000); // Limit for AI analysis

    // Detect technologies from HTML patterns
    const detectTechnologies = (htmlContent: string): string[] => {
      const technologies = new Set<string>();

      // Framework detection patterns
      const techPatterns = [
        { pattern: /(?:react|React)/i, tech: 'React' },
        { pattern: /(?:_next|__next|next\.js|nextjs)/i, tech: 'Next.js' },
        { pattern: /(?:vue|Vue)/i, tech: 'Vue.js' },
        { pattern: /(?:angular|Angular|ng-)/i, tech: 'Angular' },
        { pattern: /(?:svelte|Svelte)/i, tech: 'Svelte' },
        { pattern: /(?:gatsby|Gatsby)/i, tech: 'Gatsby' },
        { pattern: /(?:nuxt|Nuxt)/i, tech: 'Nuxt.js' },
        { pattern: /(?:wp-content|wordpress|WordPress)/i, tech: 'WordPress' },
        { pattern: /(?:drupal|Drupal)/i, tech: 'Drupal' },
        { pattern: /(?:shopify|Shopify)/i, tech: 'Shopify' },
        { pattern: /(?:woocommerce|WooCommerce)/i, tech: 'WooCommerce' },
        { pattern: /(?:tailwind|Tailwind)/i, tech: 'Tailwind CSS' },
        { pattern: /(?:bootstrap|Bootstrap)/i, tech: 'Bootstrap' },
        { pattern: /(?:mui|material-ui|Material)/i, tech: 'Material UI' },
        { pattern: /(?:chakra|Chakra)/i, tech: 'Chakra UI' },
        { pattern: /(?:framer-motion)/i, tech: 'Framer Motion' },
        { pattern: /(?:stripe|Stripe)/i, tech: 'Stripe' },
        { pattern: /(?:paypal|PayPal)/i, tech: 'PayPal' },
        { pattern: /(?:firebase|Firebase)/i, tech: 'Firebase' },
        { pattern: /(?:supabase|Supabase)/i, tech: 'Supabase' },
        { pattern: /(?:prisma|Prisma)/i, tech: 'Prisma' },
        { pattern: /(?:graphql|GraphQL)/i, tech: 'GraphQL' },
        { pattern: /(?:sanity|Sanity)/i, tech: 'Sanity CMS' },
        { pattern: /(?:contentful|Contentful)/i, tech: 'Contentful' },
        { pattern: /(?:strapi|Strapi)/i, tech: 'Strapi' },
      ];

      techPatterns.forEach(({ pattern, tech }) => {
        if (pattern.test(htmlContent)) {
          technologies.add(tech);
        }
      });

      // Check for specific meta tags or comments
      if (htmlContent.includes('generator') && htmlContent.includes('Next.js')) {
        technologies.add('Next.js');
        technologies.add('React');
      }

      return Array.from(technologies);
    };

    const detectedTech = detectTechnologies(html);

    // Include any custom refinements in the prompt
    const refinementInstructions = refinePrompt
      ? `\n\nADDITIONAL CONTEXT AND REQUIREMENTS:\n${refinePrompt}\n\nUse this additional context to refine your analysis and make the content more accurate and specific.`
      : '';

    // Now use AI to analyze the content
    const aiPrompt = `Analyze this website content and provide structured information for a portfolio case study.

Website URL: ${validUrl.toString()}
Website Title: ${title}
Detected Technologies: ${detectedTech.join(', ')}

Website Content (first 8000 chars):
${textContent}
${refinementInstructions}

Based on this content, provide a JSON response with the following structure:
{
  "clientType": "Identify the type of client/business (e.g., 'Law Firm', 'E-commerce Store', 'Healthcare Provider', 'Educational Platform', 'Non-Profit Organization', 'SaaS Company', etc.)",
  "projectTitle": "Create a professional project title that describes what we built (e.g., 'Modern Law Firm Website for Smith & Associates', 'E-commerce Platform for Organic Beauty Products')",
  "projectSubtitle": "Create a compelling subtitle/tagline that captures the essence of the project in 5-10 words (e.g., 'Transforming legal services with modern web technology', 'Where organic beauty meets seamless shopping')",
  "shortDescription": "Write a 2-3 sentence description suitable for a portfolio, focusing on what we built and the value delivered. Start with 'We developed...' or 'We created...' or 'We built...'",
  "challenge": "Write a detailed paragraph (100-150 words) describing the specific problem or challenge the client faced. Focus on pain points, limitations of their previous solution (if any), and why they needed a new approach. Be specific about business challenges, technical limitations, or market pressures they were facing.",
  "solution": "Write a detailed paragraph (150-200 words) explaining our technical solution and approach. Describe the technologies chosen and why, the architecture decisions, key features implemented, and any innovative approaches taken. Focus on HOW we solved the problem technically.",
  "longDescription": "Write a comprehensive case study (500-800 words) with proper HTML formatting. Structure it with these sections: <h3>The Problem</h3> (describe the client's challenges and pain points in detail), <h3>The Goal</h3> (what the client wanted to achieve and success metrics), <h3>The Solution</h3> (our technical approach, technologies used, and implementation details), <h3>The Impact</h3> (measurable results, improvements, and business value delivered). Use <p> tags for paragraphs, <strong> for emphasis, and <ul>/<li> for any lists. Make it engaging and results-focused. OUTPUT ONLY CLEAN HTML - no markdown syntax, no backticks, no code block markers.",
  "technologies": ["List 8-12 specific technologies likely used based on the site's functionality and the detected technologies. Be specific (e.g., 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel', etc.)"],
  "categories": ["Suggest 2 most relevant project categories from: 'Web Development', 'Mobile App', 'E-Commerce', 'AI/ML', 'SaaS', 'Enterprise', 'API Development', 'Database Design', 'Cloud Infrastructure', 'DevOps', 'Security', 'Blockchain', 'IoT'"],
  "clientCategories": ["Suggest 2 most relevant client categories from: 'Startup', 'Small Business', 'Medium Business', 'Enterprise', 'Non-Profit', 'Government', 'Education', 'Healthcare', 'Finance', 'Retail', 'Technology', 'Manufacturing', 'Real Estate', 'Legal', 'Hospitality', 'Media & Entertainment', 'Transportation', 'Agriculture', 'Energy'"],
  "keyAchievements": [
    "List 5-6 specific, measurable achievements or features delivered (e.g., 'Implemented secure payment processing with PCI compliance', 'Achieved 98% lighthouse performance score', 'Integrated with 3rd party APIs for real-time data sync')"
  ],
  "slug": "Generate a URL-friendly slug based on the project title"
}

Analyze the website as if CVC Web Solutions built it. Focus on technical implementation, business value, and professional achievements. Be specific and avoid generic statements.

CRITICAL: When generating any HTML content, output ONLY the HTML tags and content. Never include markdown code blocks (\`\`\`html), backticks, or any markdown formatting. The output should be ready to render directly as HTML.`;

    // Call OpenAI or another AI service to analyze
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional web developer creating portfolio case studies for CVC Web Solutions. Analyze websites and provide detailed, technical, and business-focused descriptions of web development projects. Always write from the perspective of the agency that built the website. IMPORTANT: When generating HTML content, output ONLY clean HTML without any markdown formatting, code blocks, or backticks. Never wrap HTML in ```html blocks.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3500,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to analyze website with AI');
    }

    const aiData = await aiResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Combine AI analysis with detected data
    const result = {
      success: true,
      metadata: {
        url: validUrl.toString(),
        title: analysis.projectTitle || title,
        subtitle: analysis.projectSubtitle || '',
        description: analysis.shortDescription,
        longDescription: analysis.longDescription,
        challenge: analysis.challenge,
        solution: analysis.solution,
        technologies: analysis.technologies || detectedTech,
        categories: analysis.categories || ['Web Development'],
        clientCategories: analysis.clientCategories || ['Small Business'],
        keyAchievements: analysis.keyAchievements || [],
        image: ogImage,
        slug: analysis.slug,
        clientType: analysis.clientType,
        year: new Date().getFullYear().toString(),
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error analyzing website:', error);

    // Fallback to basic metadata fetch if AI analysis fails
    if (error instanceof Error && error.message.includes('AI')) {
      return NextResponse.json(
        {
          error: 'AI analysis failed. Please try the basic fetch option or enter details manually.',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to analyze website',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}