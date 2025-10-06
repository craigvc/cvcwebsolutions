import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Web Development Blog | Tech Insights & Tutorials | CVC Web Solutions',
  description: 'Stay updated with the latest web development trends, tutorials, and insights. Expert articles on React, Next.js, AI, mobile development, and modern software engineering.',
  openGraph: {
    title: 'CVC Web Solutions Blog | Web Development Insights',
    description: 'Expert articles on web development, mobile apps, AI solutions, and modern software engineering practices.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/blog',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVC Web Solutions Blog | Web Development Insights',
    description: 'Expert articles on web development, mobile apps, AI, and modern software engineering.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/blog',
  },
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  status: 'draft' | 'published' | 'archived'
  featuredImage?: {
    url: string
    alt?: string
  }
  author: {
    id: string
    name: string
    email: string
    bio?: string
    avatar?: {
      url: string
      alt?: string
    }
  }
  categories: Array<{
    id: string
    title: string
    slug: string
    color?: string
  }>
  readingTime?: number
}

interface Category {
  id: string
  title: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3456'}/api/blog-posts?where[status][equals]=published&depth=2&limit=100&sort=-publishedAt`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch posts')
      return []
    }
    
    const data = await response.json()
    const posts = data.docs || []

    // Sort posts by publishedAt date (newest first) since API sorting might not be working
    return posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt)
      const dateB = new Date(b.publishedAt)
      return dateB.getTime() - dateA.getTime() // Descending order (newest first)
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3456'}/api/categories?limit=100`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch categories')
      return []
    }
    
    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])

  // Group posts by category for counting
  const categoryPostCount = posts.reduce((acc, post) => {
    post.categories?.forEach(cat => {
      acc[cat.id] = (acc[cat.id] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Get recent posts for sidebar
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-7xl">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Our Blog
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            Insights, tutorials, and updates from the CVC Web Solutions team
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {posts.length === 0 ? (
                <div className="py-20 text-center">
                  <h2 className="mb-4 text-2xl font-semibold text-white">
                    No blog posts yet
                  </h2>
                  <p className="text-gray-400">
                    Check back soon for our latest insights and updates!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="overflow-hidden transition-all duration-300 bg-white shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.02] dark:bg-gray-800/90"
                    >
                      <div className="md:flex">
                        {/* Featured Image */}
                        <div className="md:w-1/3">
                          <Link href={`/blog/${post.slug}`}>
                            <div className="relative w-full h-64 md:h-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                              {post.featuredImage?.url ? (
                                <Image
                                  src={post.featuredImage.url.replace('/api/media/file/', '/media/')}
                                  alt={post.featuredImage.alt || post.title}
                                  fill
                                  className="object-cover transition-transform duration-300 hover:scale-105"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-white text-lg font-medium">
                                  No Image
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Post Content */}
                        <div className="md:w-2/3 p-6 md:p-8">
                          {/* Categories */}
                          {post.categories && post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.categories.map((category) => (
                                <span
                                  key={category.id}
                                  className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:text-purple-300 dark:bg-purple-900/30"
                                >
                                  {category.title}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h2 className="mb-4 text-2xl font-bold leading-tight">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-gray-900 transition-colors hover:text-purple-600 dark:text-white dark:hover:text-purple-400"
                            >
                              {post.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          <p className="mb-6 text-gray-600 dark:text-gray-300 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">CVC</span>
                                </div>
                                <span>CVC Web Solutions</span>
                              </div>
                              <span>•</span>
                              <span>{formatDate(post.publishedAt)}</span>
                              {post.readingTime && (
                                <>
                                  <span>•</span>
                                  <span>{post.readingTime} min read</span>
                                </>
                              )}
                            </div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky space-y-8 top-8">
                {/* Categories Section */}
                <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Categories</h3>
                  <div className="space-y-2">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className="flex items-center justify-between p-2 transition-all rounded-lg hover:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-2">
                            {category.icon && <span className="text-purple-400">{category.icon}</span>}
                            <span className="text-sm text-gray-300">{category.title}</span>
                          </div>
                          {categoryPostCount[category.id] > 0 && (
                            <span className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded-full">
                              {categoryPostCount[category.id]}
                            </span>
                          )}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No categories yet</p>
                    )}
                  </div>
                </div>

                {/* Recent Posts Section */}
                <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Recent Posts</h3>
                  <div className="space-y-3">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="block group"
                        >
                          <h4 className="mb-1 text-sm font-medium text-gray-300 transition-colors group-hover:text-purple-400">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No posts yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href="/" className="block text-sm text-gray-300 transition-colors hover:text-purple-400">
                      ← Back to Home
                    </Link>
                    <Link href="/services" className="block text-sm text-gray-300 transition-colors hover:text-purple-400">
                      Our Services
                    </Link>
                    <Link href="/portfolio" className="block text-sm text-gray-300 transition-colors hover:text-purple-400">
                      Portfolio
                    </Link>
                    <Link href="/contact" className="block text-sm text-gray-300 transition-colors hover:text-purple-400">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  )
}

export const revalidate = 60 // Revalidate every 60 seconds
