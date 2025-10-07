import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

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
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(`${baseUrl}/api/categories?where[slug][equals]=${slug}&limit=1`, {
      cache: 'no-store'
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(`${baseUrl}/api/blog-posts?where[status][equals]=published&depth=2&limit=100&sort=-publishedAt`, {
      cache: 'no-store'
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
}

async function getPosts(categoryId: string): Promise<BlogPost[]> {
  try {
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(
      `${baseUrl}/api/blog-posts?where[status][equals]=published&where[categories][in]=${categoryId}&depth=2&limit=100&sort=-publishedAt`,
      { cache: 'no-store' }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(`${baseUrl}/api/categories?limit=100`, {
      cache: 'no-store'
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found | CVC Web Solutions',
    }
  }

  return {
    title: `${category.title} | Blog | CVC Web Solutions`,
    description: category.description || `Browse ${category.title} articles from CVC Web Solutions`,
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const [posts, allPosts, categories] = await Promise.all([
    getPosts(category.id),
    getAllPosts(),
    getCategories()
  ])

  // Group posts by category for counting
  const categoryPostCount = allPosts.reduce((acc, post) => {
    post.categories?.forEach(cat => {
      acc[cat.id] = (acc[cat.id] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Get recent posts for sidebar
  const recentPosts = allPosts.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Breadcrumb */}
      <div className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white">{category.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-300">
              {category.description}
            </p>
          )}
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
                    No posts in this category yet
                  </h2>
                  <p className="text-gray-400">
                    Check back soon for new content!
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
                              {post.categories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:text-purple-300 dark:bg-purple-900/30"
                                >
                                  {cat.title}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h2 className="mb-4 text-lg md:text-xl font-bold leading-tight">
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
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/blog/category/${cat.slug}`}
                          className={`flex items-center justify-between p-2 transition-all rounded-lg hover:bg-gray-700/50 ${
                            cat.id === category.id ? 'bg-gray-700/50' : ''
                          }`}
                        >
                          <span className={`text-sm ${cat.id === category.id ? 'text-purple-400 font-medium' : 'text-gray-300'}`}>
                            {cat.title}
                          </span>
                          {categoryPostCount[cat.id] > 0 && (
                            <span className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded-full">
                              {categoryPostCount[cat.id]}
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

export const revalidate = 60
