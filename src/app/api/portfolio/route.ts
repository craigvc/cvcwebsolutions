import { NextRequest, NextResponse } from 'next/server';
import getPayloadClient from '@/payload/payloadClient';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const result = await payload.find({
      collection: 'portfolio',
      limit,
      page,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const data = await request.json();

    const result = await payload.create({
      collection: 'portfolio',
      data,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}
