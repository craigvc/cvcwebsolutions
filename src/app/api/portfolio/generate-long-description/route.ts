import { NextRequest, NextResponse } from 'next/server';

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:latest';

// Fallback function for when Ollama is unavailable
function generateFallbackLongDescription(
  title: string,
  category: string,
  clientCategory: string,
  technologies: string[],
  description: string,
  achievements: string[]
): string {
  const techList = technologies.length > 0 ? technologies.join(', ') : 'modern technologies';
  const achievementList = achievements && achievements.length > 0 
    ? achievements.map(a => `• ${a}`).join('\n')
    : '';
  
  const clientType = clientCategory || 'client';
  
  const template = `## Project Overview

${title} is a comprehensive ${category.toLowerCase()} solution developed for our ${clientType.toLowerCase()} client. This project showcases our expertise in delivering high-quality, scalable applications that meet and exceed business requirements.

## The Challenge

Our ${clientType.toLowerCase()} client approached us with the need for a modern ${category.toLowerCase()} solution that could handle their growing business demands. The existing system was outdated, inefficient, and unable to scale with their business growth. They needed a solution that would not only solve their immediate problems but also position them for future success.

## Our Solution

We developed a cutting-edge ${category.toLowerCase()} application using ${techList}. Our approach focused on:

1. **Performance Optimization**: Building a fast, responsive application that provides an exceptional user experience
2. **Scalability**: Ensuring the solution can grow with the client's business needs
3. **User Experience**: Creating an intuitive interface that users love
4. **Security**: Implementing robust security measures to protect sensitive data
5. **Integration**: Seamlessly connecting with existing systems and third-party services

## Technical Implementation

The project leverages ${techList} to create a robust and maintainable architecture. Key technical decisions included:

- **Frontend**: Modern, responsive UI with real-time updates and smooth interactions
- **Backend**: Scalable API architecture with efficient data processing
- **Database**: Optimized data structure for fast queries and reliable storage
- **Infrastructure**: Cloud-based deployment for reliability and scalability
- **Security**: Industry-standard encryption and authentication protocols

## Key Achievements

${achievementList || `• Successfully delivered the project on time and within budget
• Exceeded client expectations for performance and functionality
• Achieved significant improvements in user satisfaction
• Reduced operational costs through automation
• Established a scalable foundation for future growth`}

## Business Impact

This project has transformed our client's operations, enabling them to:
- Serve more customers efficiently
- Reduce operational costs
- Improve customer satisfaction
- Scale their business effectively
- Compete more effectively in their market

## Conclusion

${title} represents our commitment to delivering exceptional ${category.toLowerCase()} solutions that drive real business value. Through careful planning, expert execution, and close collaboration with our client, we've created a solution that not only meets today's needs but is also ready for tomorrow's challenges.`;

  return template;
}

export async function POST(request: NextRequest) {
  try {
    const { title, technologies, category, clientCategory, description, achievements } = await request.json();
    
    // Try to use Ollama first
    try {
      const prompt = `Generate a comprehensive, professional long description for a portfolio project. Write in markdown format.

Project Title: ${title || 'Untitled Project'}
Project Category: ${category || 'Web Development'}
Client Type: ${clientCategory || 'Business'}
Technologies Used: ${technologies?.join(', ') || 'Various technologies'}
Short Description: ${description || 'No description provided'}
Key Achievements: ${achievements?.join(', ') || 'Multiple achievements'}

Create a detailed project description that includes:
1. Project Overview - Brief introduction
2. The Challenge - What problem needed solving
3. Our Solution - How we approached it
4. Technical Implementation - Key technical decisions and architecture
5. Key Achievements - Specific accomplishments (use the provided achievements)
6. Business Impact - How it benefited the client
7. Conclusion - Wrap up the case study

Write in a professional, engaging tone that showcases expertise and results. Include specific details about the technologies used and the value delivered. Make it compelling for potential clients.

Format with markdown headers (##) and bullet points where appropriate. Aim for 400-600 words.`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: {
            temperature: 0.8,
            max_tokens: 1000
          }
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          return NextResponse.json({ 
            longDescription: data.response.trim(),
            success: true,
            source: 'ollama'
          });
        }
      }
    } catch (ollamaError: any) {
      console.log('Ollama not available, using fallback:', ollamaError?.message || 'Unknown error');
    }
    
    // Fallback if Ollama fails
    const longDescription = generateFallbackLongDescription(
      title || 'Project',
      category || 'Web Development',
      clientCategory || 'Business',
      technologies || [],
      description || '',
      achievements || []
    );
    
    return NextResponse.json({ 
      longDescription,
      success: true,
      source: 'fallback'
    });
  } catch (error) {
    console.error('Error generating long description:', error);
    return NextResponse.json(
      { error: 'Failed to generate long description' },
      { status: 500 }
    );
  }
}
