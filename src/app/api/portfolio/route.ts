import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioProjects, addPortfolioProject } from '@/lib/db-sqlite';
import { generateCaseStudy } from '@/lib/ollama';

// This endpoint fetches portfolio items from the local SQLite database
export async function GET(request: NextRequest) {
  try {
    // Get projects from SQLite database
    const projects = getPortfolioProjects(100);
    
    // Return raw database records for admin panel
    // The admin panel expects the raw format with technologies as a string
    return NextResponse.json({
      success: true,
      projects: projects.map((project: any) => {
        // Process achievements - ALWAYS return as array
        const achievementsArray = typeof project.achievements === 'string' && project.achievements
          ? project.achievements.split(',').map((a: string) => a.trim()).filter((a: string) => a)
          : Array.isArray(project.achievements) 
            ? project.achievements
            : [];
        
        // Process technologies - ALWAYS return as array
        const technologiesArray = typeof project.technologies === 'string' && project.technologies
          ? project.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
          : Array.isArray(project.technologies)
            ? project.technologies
            : [];
        
        // Process tags - ALWAYS return as array  
        const tagsArray = typeof project.tags === 'string' && project.tags
          ? project.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
          : Array.isArray(project.tags)
            ? project.tags
            : [];
            
        return {
          ...project,
          // Always return arrays for the frontend
          technologies: technologiesArray,
          tags: tagsArray,
          achievements: achievementsArray,
          // Convert numeric featured to boolean
          featured: project.featured === 1 || project.featured === true,
          clientName: project.client_name,
          clientCategory: project.client_category,
          workType: project.work_type,
          teamSize: project.team_size,
          keyFeatures: project.key_features,
          keyAchievements: project.key_achievements,
          testimonialAuthor: project.testimonial_author,
          testimonialRole: project.testimonial_role,
          projectUrl: project.url
        };
      })
    });
    
  } catch (error: any) {
    console.error('Error fetching portfolio from marketing suite:', error);
    
    // Return empty array on error so the main site still works
    return NextResponse.json({
      success: true,
      projects: []
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate AI content if needed
    let enrichedData = { ...data };
    if (data.clientName && data.technologies && (!data.challenge || !data.solution)) {
      try {
        const aiContent = await generateCaseStudy(data);
        enrichedData = {
          ...data,
          challenge: data.challenge || aiContent.challenge,
          solution: data.solution || aiContent.solution,
          results: data.results || aiContent.results,
          keyFeatures: data.keyFeatures || aiContent.keyFeatures,
          keyAchievements: data.keyAchievements || aiContent.keyAchievements
        };
      } catch (aiError) {
        console.error('AI generation failed, using provided data:', aiError);
      }
    }
    
    // Generate slug from title
    const slug = enrichedData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add to database
    const projectData = {
      ...enrichedData,
      slug,
      client_name: enrichedData.clientName,
      client_category: enrichedData.clientCategory || 'Web Development',
      work_type: enrichedData.workType,
      status: 'draft',
      featured: false
    };
    
    const id = addPortfolioProject(projectData);
    
    return NextResponse.json({
      success: true,
      id,
      ...projectData
    });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}