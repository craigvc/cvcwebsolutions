import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/db-sqlite';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = getBlogPost(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const updates = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map((t: string) => t.trim()) || [],
      featured_image: data.featured_image,
      meta_description: data.seoMetaDescription || data.metaDescription || data.excerpt,
      published: data.status === 'published'
    };
    
    const success = updateBlogPost(params.id, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteBlogPost(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}