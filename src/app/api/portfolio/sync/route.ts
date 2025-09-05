import { NextRequest, NextResponse } from 'next/server';
import { syncPortfolioProjects } from '@/lib/db-sqlite';

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();
    
    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    // Sync projects to SQLite database
    const count = syncPortfolioProjects(projects);
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${count} portfolio projects`,
      count
    });
    
  } catch (error: any) {
    console.error('Error syncing portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to sync portfolio', details: error.message },
      { status: 500 }
    );
  }
}