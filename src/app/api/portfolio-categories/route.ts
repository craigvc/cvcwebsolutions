import { NextRequest, NextResponse } from 'next/server';
import getPayloadClient from '@/payload/payloadClient';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const result = await payload.find({
      collection: 'portfolio-categories',
      limit,
      page,
      sort: 'name',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient();
    const data = await request.json();

    // Generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const result = await payload.create({
      collection: 'portfolio-categories',
      data,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating portfolio category:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio category' },
      { status: 500 }
    );
  }
}