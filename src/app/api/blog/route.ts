import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, addBlogPost } from '@/lib/db-sqlite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    // Get all posts (including drafts) for admin
    const posts = getBlogPosts(limit, false);
    
    let filteredPosts = posts;
    
    if (status && status !== 'all') {
      // Map status to database values
      const statusMap: any = {
        'draft': 0,
        'published': 1,
        'pending': 0, // We'll use published flag for simplicity
        'approved': 1
      };
      
      filteredPosts = posts.filter((post: any) => {
        const postPublished = post.published === 1;
        const filterPublished = statusMap[status] === 1;
        return postPublished === filterPublished;
      });
    }
    
    // Transform posts for frontend
    const transformedPosts = filteredPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.content?.substring(0, 200) + '...',
      category: post.category || 'web-development',
      status: post.published ? 'published' : 'draft',
      author: post.author || 'CVC Team',
      createdAt: post.created_at,
      estimatedReadTime: Math.ceil((post.content?.split(' ').length || 0) / 200)
    }));
    
    return NextResponse.json({
      posts: transformedPosts,
      total: transformedPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate slug from title
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const post = {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author || 'CVC Team',
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : data.tags?.split(',').map((t: string) => t.trim()) || [],
      featured_image: data.featured_image || null,
      meta_description: data.seoMetaDescription || data.metaDescription || data.excerpt,
      published: data.status === 'published'
    };
    
    const id = addBlogPost(post);
    
    return NextResponse.json({
      success: true,
      post: { ...post, id }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}