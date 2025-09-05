import { NextRequest, NextResponse } from 'next/server';
import { updatePortfolioProject } from '@/lib/db-sqlite';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const id = parseInt(params.id);
    
    const success = updatePortfolioProject(id, { status });
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update project status' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json(
      { error: 'Failed to update project status' },
      { status: 500 }
    );
  }
}