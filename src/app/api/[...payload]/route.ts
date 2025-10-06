/* Custom Payload API handler */
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Handle GET requests
export async function GET(
  request: Request,
  context: { params: Promise<{ payload: string[] }> }
) {
  try {
    const params = await context.params
    const segments = params.payload || []
    const collection = segments[0]
    const id = segments[1]
    
    // Initialize Payload
    const payload = await getPayload({ config })
    
    // Handle different endpoints
    if (!collection) {
    // Return API info
    return NextResponse.json({ 
      message: 'Payload CMS API',
      collections: ['blog-posts', 'categories', 'authors', 'media', 'portfolio']
    })
    }
    
    // Handle specific collection requests
    if (collection === 'blogposts' || collection === 'blog-posts') {
      if (id) {
        // Get specific blog post
        const post = await payload.findByID({
          collection: 'blog-posts',
          id: id
        })
        return NextResponse.json(post)
      } else {
        // Get all blog posts
        const posts = await payload.find({
          collection: 'blog-posts',
          limit: 100
        })
        return NextResponse.json(posts)
      }
    }
    
    if (collection === 'categories') {
      if (id) {
        const category = await payload.findByID({
          collection: 'categories',
          id: id
        })
        return NextResponse.json(category)
      } else {
        const categories = await payload.find({
          collection: 'categories',
          limit: 100
        })
        return NextResponse.json(categories)
      }
    }
    
    if (collection === 'authors') {
      if (id) {
        const author = await payload.findByID({
          collection: 'authors',
          id: id
        })
        return NextResponse.json(author)
      } else {
        const authors = await payload.find({
          collection: 'authors',
          limit: 100
        })
        return NextResponse.json(authors)
      }
    }
    
    if (collection === 'media') {
      if (id) {
        const media = await payload.findByID({
          collection: 'media',
          id: id
        })
        return NextResponse.json(media)
      } else {
        const mediaItems = await payload.find({
          collection: 'media',
          limit: 100
        })
        return NextResponse.json(mediaItems)
      }
    }
    
    if (collection === 'portfolio') {
      if (id) {
        const item = await payload.findByID({
          collection: 'portfolio',
          id: id
        })
        return NextResponse.json(item)
      } else {
        const items = await payload.find({
          collection: 'portfolio',
          limit: 100
        })
        return NextResponse.json(items)
      }
    }
    
    // Handle admin routes
    if (collection === 'admin') {
      return NextResponse.json({ 
        message: 'Admin panel is available at /api/admin',
        note: 'This is a placeholder. Payload admin should be configured separately.'
      })
    }
    
    // Unknown collection
    return NextResponse.json({ 
      error: `Unknown collection: ${collection}` 
    }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 })
  }
}

// Handle POST requests
export async function POST(
  request: Request,
  context: { params: Promise<{ payload: string[] }> }
) {
  try {
    const params = await context.params
    const segments = params.payload || []
    const collection = segments[0]
    const body = await request.json()
    
    // Initialize Payload
    const payload = await getPayload({ config })
    
    // Create new document in collection
    const result = await payload.create({
      collection: collection as any,
      data: body
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 })
  }
}

// Handle PATCH requests
export async function PATCH(
  request: Request,
  context: { params: Promise<{ payload: string[] }> }
) {
  try {
    const params = await context.params
    const segments = params.payload || []
    const collection = segments[0]
    const id = segments[1]
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'ID required for update' }, { status: 400 })
    }
    
    // Initialize Payload
    const payload = await getPayload({ config })
    
    // Update document
    const result = await payload.update({
      collection: collection as any,
      id: id,
      data: body
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('PATCH Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 })
  }
}

// Handle DELETE requests
export async function DELETE(
  request: Request,
  context: { params: Promise<{ payload: string[] }> }
) {
  try {
    const params = await context.params
    const segments = params.payload || []
    const collection = segments[0]
    const id = segments[1]
    
    if (!id) {
      return NextResponse.json({ error: 'ID required for delete' }, { status: 400 })
    }
    
    // Initialize Payload
    const payload = await getPayload({ config })
    
    // Delete document
    await payload.delete({
      collection: collection as any,
      id: id
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 })
  }
}

// Handle PUT requests (same as PATCH for now)
export async function PUT(
  request: Request,
  context: { params: Promise<{ payload: string[] }> }
) {
  return PATCH(request, context)
}

// Handle OPTIONS requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
