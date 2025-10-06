import { NextRequest, NextResponse } from 'next/server';

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';

// Fallback function for when Ollama is unavailable
function generateFallbackAchievements(title: string, technologies: string[], category: string): string[] {
  const achievements: string[] = [];
  
  // Performance achievements
  const performanceOptions = [
    'Improved application performance by 40% through optimized code structure',
    'Reduced page load time by 60% using lazy loading and code splitting',
    'Achieved 95+ Lighthouse performance score across all pages',
    'Implemented caching strategies resulting in 50% faster response times',
  ];
  
  // User experience achievements
  const uxOptions = [
    'Enhanced user engagement with intuitive UI/UX design',
    'Increased user retention by 35% through improved navigation',
    'Achieved 4.8/5 user satisfaction rating',
    'Reduced bounce rate by 45% with responsive design',
  ];
  
  // Technical achievements
  const technicalOptions = [
    `Successfully integrated ${technologies.length > 0 ? technologies[0] : 'modern technologies'} for scalable architecture`,
    'Implemented automated testing with 90% code coverage',
    'Established CI/CD pipeline for seamless deployments',
    'Built RESTful API with comprehensive documentation',
  ];
  
  // Business achievements
  const businessOptions = [
    'Delivered project 2 weeks ahead of schedule',
    'Reduced operational costs by 30% through automation',
    'Increased conversion rate by 25% with optimized user flow',
    'Successfully handled 10,000+ concurrent users',
  ];
  
  // Select one from each category
  achievements.push(performanceOptions[Math.floor(Math.random() * performanceOptions.length)]);
  achievements.push(uxOptions[Math.floor(Math.random() * uxOptions.length)]);
  achievements.push(technicalOptions[Math.floor(Math.random() * technicalOptions.length)]);
  achievements.push(businessOptions[Math.floor(Math.random() * businessOptions.length)]);
  
  // Add category-specific achievement
  if (category === 'E-Commerce') {
    achievements.push('Integrated secure payment gateway supporting multiple currencies');
  } else if (category === 'Mobile App') {
    achievements.push('Achieved 4.5+ star rating on app stores with 1000+ downloads');
  } else if (category === 'AI/ML') {
    achievements.push('Implemented machine learning model with 92% accuracy');
  } else {
    achievements.push('Deployed to production with 99.9% uptime SLA');
  }
  
  return achievements;
}

export async function POST(request: NextRequest) {
  try {
    const { title, technologies, category, description } = await request.json();
    
    // Try to use Ollama first
    try {
      const prompt = `Generate 5 key achievements for a portfolio project. Each achievement should be specific, measurable, and impressive.

Project Title: ${title || 'Untitled Project'}
Category: ${category || 'Web Development'}
Technologies: ${technologies?.join(', ') || 'Various technologies'}
${description ? `Description: ${description}` : ''}

Create achievements that cover:
1. Performance improvement (with specific percentage)
2. User experience enhancement (with measurable impact)
3. Technical accomplishment (implementation or integration)
4. Business value delivered (time/cost savings or revenue impact)
5. Category-specific achievement

Format as a JSON array of strings. Each achievement should be one clear sentence with specific metrics where possible.

Example format:
["Improved page load speed by 75% through optimization", "Increased user engagement by 40% with new UI", ...]

Return only the JSON array, no extra text.`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.8,
            max_tokens: 300
          }
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          try {
            // Try to parse as JSON array
            let achievements = JSON.parse(data.response);
            
            // Validate it's an array with strings
            if (Array.isArray(achievements) && achievements.length > 0) {
              // Take first 5 achievements and ensure they're strings
              achievements = achievements
                .slice(0, 5)
                .map(a => String(a).trim())
                .filter(a => a.length > 0);
              
              if (achievements.length > 0) {
                return NextResponse.json({ 
                  achievements,
                  success: true,
                  source: 'ollama'
                });
              }
            }
          } catch (parseError) {
            console.log('Failed to parse Ollama response as JSON, using fallback');
          }
        }
      }
    } catch (ollamaError: any) {
      console.log('Ollama not available, using fallback:', ollamaError?.message || 'Unknown error');
    }
    
    // Fallback if Ollama fails
    const achievements = generateFallbackAchievements(
      title || 'Project',
      technologies || [],
      category || 'Web Development'
    );
    
    return NextResponse.json({ 
      achievements,
      success: true,
      source: 'fallback'
    });
  } catch (error) {
    console.error('Error generating achievements:', error);
    return NextResponse.json(
      { error: 'Failed to generate achievements' },
      { status: 500 }
    );
  }
}
