import { NextRequest, NextResponse } from 'next/server';
import getPayloadClient from '@/payload/payloadClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient();
    
    const result = await payload.findByID({
      collection: 'portfolio',
      id: params.id,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient();
    const data = await request.json();

    console.log('Received portfolio update data:', data);

    // Transform technologies array to match Payload schema
    const transformedData = {
      ...data,
      technologies: data.technologies?.map((tech: any) =>
        typeof tech === 'string' ? { technology: tech } : tech
      ) || [],
      achievements: data.achievements?.map((achievement: any) =>
        typeof achievement === 'string' ? { achievement: achievement } : achievement
      ) || []
    };

    console.log('Transformed data for Payload:', transformedData);

    const result = await payload.update({
      collection: 'portfolio',
      id: params.id,
      data: transformedData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient();
    const data = await request.json();

    console.log('Received portfolio patch data:', data);

    // Transform technologies array to match Payload schema
    const transformedData = {
      ...data,
      technologies: data.technologies?.map((tech: any) =>
        typeof tech === 'string' ? { technology: tech } : tech
      ) || [],
      achievements: data.achievements?.map((achievement: any) =>
        typeof achievement === 'string' ? { achievement: achievement } : achievement
      ) || []
    };

    const result = await payload.update({
      collection: 'portfolio',
      id: params.id,
      data: transformedData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient();

    await payload.delete({
      collection: 'portfolio',
      id: params.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}
