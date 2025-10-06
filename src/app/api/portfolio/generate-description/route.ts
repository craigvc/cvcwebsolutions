import { NextRequest, NextResponse } from 'next/server';

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';

// Fallback function for when Ollama is unavailable
function generateFallbackDescription(title: string, technologies: string[], category: string): string {
  const techList = technologies.length > 0 ? technologies.slice(0, 3).join(', ') : 'modern technologies';
  
  const templates = [
    `A cutting-edge ${category.toLowerCase()} project built with ${techList}, delivering exceptional user experience and performance.`,
    `Professional ${category.toLowerCase()} solution leveraging ${techList} to create scalable and efficient applications.`,
    `Innovative ${category.toLowerCase()} platform utilizing ${techList} for optimal functionality and user engagement.`,
    `Modern ${category.toLowerCase()} application developed with ${techList}, focusing on performance and usability.`,
    `Comprehensive ${category.toLowerCase()} system built using ${techList} to meet business requirements effectively.`,
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  if (title) {
    return `${title}: ${template}`;
  }
  
  return template;
}

export async function POST(request: NextRequest) {
  try {
    const { title, technologies, category, longDescription } = await request.json();
    
    // Try to use Ollama first
    try {
      const prompt = `Generate a compelling, professional short description (max 150 characters) for a portfolio project.

Project Title: ${title || 'Untitled Project'}
Category: ${category || 'Web Development'}
Technologies: ${technologies?.join(', ') || 'Various technologies'}
${longDescription ? `Detailed Description: ${longDescription}` : ''}

Create a description that:
- Highlights the business value and impact
- Mentions key technologies used
- Sounds professional and compelling
- Is concise and engaging
- Focuses on results and benefits

Return only the description text, no quotes or extra formatting.`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 100
          }
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          // Clean up the response
          let description = data.response.trim().replace(/^["']|["']$/g, '');
          
          // Ensure it's not too long
          if (description.length > 150) {
            description = description.substring(0, 147) + '...';
          }
          
          return NextResponse.json({ 
            description,
            success: true,
            source: 'ollama'
          });
        }
      }
    } catch (ollamaError: any) {
      console.log('Ollama not available, using fallback:', ollamaError?.message || 'Unknown error');
    }
    
    // Fallback if Ollama fails
    let description = '';
    
    if (longDescription && longDescription.length > 100) {
      description = longDescription.substring(0, 150).trim();
      if (description.length === 150) {
        description = description.substring(0, description.lastIndexOf(' ')) + '...';
      }
    } else {
      description = generateFallbackDescription(
        title || '',
        technologies || [],
        category || 'Web Development'
      );
    }
    
    return NextResponse.json({ 
      description,
      success: true,
      source: 'fallback'
    });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
