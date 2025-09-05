import { NextRequest, NextResponse } from 'next/server';
import { updatePortfolioProject } from '@/lib/db-sqlite';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { featured } = await request.json();
    const id = parseInt(params.id);
    
    const success = updatePortfolioProject(id, { featured: featured ? 1 : 0 });
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update featured status' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 }
    );
  }
}