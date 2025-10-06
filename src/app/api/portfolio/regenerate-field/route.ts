import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      fieldType,
      currentContext,
      refinePrompt
    } = await request.json();

    if (!fieldType) {
      return NextResponse.json(
        { error: 'Field type is required' },
        { status: 400 }
      );
    }

    // Build context from current form data
    const contextString = `
      Project Title: ${currentContext.title || 'Not specified'}
      Project Subtitle: ${currentContext.subtitle || 'Not specified'}
      Website URL: ${currentContext.url || 'Not specified'}
      Technologies: ${currentContext.technologies?.join(', ') || 'Not specified'}
      Category: ${currentContext.category || 'Not specified'}
      Current Short Description: ${currentContext.shortDescription || 'None'}
      Current Long Description: ${currentContext.longDescription ? currentContext.longDescription.substring(0, 500) + '...' : 'None'}
    `;

    // Build the appropriate prompt based on field type
    let aiPrompt = '';

    if (fieldType === 'shortDescription') {
      aiPrompt = `Based on the following project context, generate a compelling short description (2-3 sentences) for a portfolio case study.

${contextString}

${refinePrompt ? `ADDITIONAL REFINEMENT INSTRUCTIONS:\n${refinePrompt}\n` : ''}

Generate a brief, professional description that:
1. Starts with "We developed..." or "We created..." or "We built..."
2. Highlights the main value proposition
3. Mentions the key technology or approach used
4. Is suitable for a portfolio listing

Return ONLY the description text, no JSON or formatting.`;
    }
    else if (fieldType === 'longDescription') {
      aiPrompt = `Based on the following project context, generate a comprehensive portfolio case study (500-800 words).

${contextString}

${refinePrompt ? `ADDITIONAL REFINEMENT INSTRUCTIONS:\n${refinePrompt}\n` : ''}

Create a detailed case study with the following HTML structure:

<h3>The Problem</h3>
<p>Write 150-200 words describing the specific challenges the client faced. Include:
- Their pain points and frustrations with existing solutions
- Business challenges they were trying to overcome
- Technical limitations they were dealing with
- Market pressures or competitive disadvantages
- Why they needed a new approach urgently</p>

<h3>The Goal</h3>
<p>Write 100-150 words outlining what the client wanted to achieve:
- Their vision for the ideal solution
- Specific success metrics they defined
- Key requirements and must-have features
- Timeline and budget constraints
- Expected ROI or business outcomes</p>

<h3>The Solution</h3>
<p>Write 200-250 words detailing our technical approach:
- Technologies we chose and why (be specific about versions and frameworks)
- Architecture decisions and design patterns used
- Key features we implemented and how
- Integration with existing systems
- Innovation or unique approaches we took
- How we ensured scalability, security, and performance</p>

<h3>The Impact</h3>
<p>Write 150-200 words about the measurable results:
- Specific metrics that improved (percentages, numbers, time saved)
- Business value delivered (revenue increase, cost reduction, efficiency gains)
- User feedback and satisfaction improvements
- Long-term benefits and future scalability
- Awards, recognition, or competitive advantages gained</p>

Include relevant <strong> tags for emphasis on key points.
Add <ul> and <li> tags for any lists of features or achievements.
Write from CVC Web Solutions' perspective in a professional, results-oriented tone.
Make it engaging and specific, avoiding generic statements.

IMPORTANT: Output ONLY the HTML content. Do NOT include markdown code blocks, backticks, or any markdown syntax. Do NOT wrap the output in \`\`\`html or any other code block markers. Start directly with the HTML tags.`;
    }
    else {
      return NextResponse.json(
        { error: 'Invalid field type. Must be shortDescription or longDescription' },
        { status: 400 }
      );
    }

    // Call OpenAI API
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
            content: 'You are a professional web developer writing portfolio case studies for CVC Web Solutions. Write clear, engaging, and technical content that showcases expertise and results. CRITICAL: Output ONLY clean content without any markdown formatting. For HTML fields, output pure HTML without code blocks or backticks. Never use ```html or ``` markers.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: fieldType === 'shortDescription' ? 200 : 2500,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to generate content with AI');
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices[0].message.content.trim();

    return NextResponse.json({
      success: true,
      content: generatedContent,
      fieldType
    });

  } catch (error) {
    console.error('Error regenerating field:', error);
    return NextResponse.json(
      {
        error: 'Failed to regenerate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}