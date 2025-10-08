import { MetadataRoute } from 'next'
import path from 'path'
import Database from 'better-sqlite3'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cvcwebsolutions.com'

  // Initialize database
  const dbPath = path.join(process.cwd(), 'data', 'payload.db')
  const db = new Database(dbPath)

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Get blog posts
  const blogPosts = db.prepare(`
    SELECT slug, updated_at, published_at
    FROM blog_posts
    WHERE status = 'published'
    ORDER BY published_at DESC
  `).all() as Array<{ slug: string; updated_at: string; published_at: string }>

  const blogPages = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Get blog categories
  const categories = db.prepare(`
    SELECT slug, updated_at
    FROM categories
  `).all() as Array<{ slug: string; updated_at: string }>

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Get portfolio items
  const portfolioItems = db.prepare(`
    SELECT slug, updated_at
    FROM portfolio
    WHERE status = 'published'
  `).all() as Array<{ slug: string; updated_at: string }>

  const portfolioPages = portfolioItems.map(item => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  db.close()

  return [...staticPages, ...blogPages, ...categoryPages, ...portfolioPages]
}
