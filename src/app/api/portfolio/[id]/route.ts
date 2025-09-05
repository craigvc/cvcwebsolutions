import { NextRequest, NextResponse } from 'next/server';
import { updatePortfolioProject, deletePortfolioProject } from '@/lib/db-sqlite';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const id = parseInt(params.id);
    
    const success = updatePortfolioProject(id, data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const success = deletePortfolioProject(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}