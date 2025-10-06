import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, Folder, Tag, ChevronRight, Home } from 'lucide-react'

interface BlogPostDetail {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any // Rich text content from Lexical editor
  publishedAt: string
  updatedAt?: string
  status: 'draft' | 'published' | 'archived'
  featuredImage?: {
    url: string
    alt?: string
    width?: number
    height?: number
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
    socialLinks?: {
      platform: string
      url: string
    }[]
  }
  categories: Array<{
    id: string
    title: string
    slug: string
    color?: string
    description?: string
  }>
  tags?: string[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    image?: {
      url: string
      alt?: string
    }
  }
  readingTime?: number
}

async function getPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    // Use internal URL for server-side fetching
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    // Payload CMS filtering is broken, so fetch all posts and filter client-side
    const response = await fetch(
      `${baseUrl}/api/blog-posts?depth=2&limit=20`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      console.error('Failed to fetch posts')
      return null
    }

    const data = await response.json()
    const posts = data.docs || []

    // Filter client-side to find the correct post by slug
    const post = posts.find((p: any) => p.slug === slug)
    return post || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getAllCategories() {
  try {
    // Use internal URL for server-side fetching
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(
      `${baseUrl}/api/categories?limit=100`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getRecentPosts(limit: number = 5): Promise<BlogPostDetail[]> {
  try {
    // Use internal URL for server-side fetching
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(
      `${baseUrl}/api/blog-posts?where[status][equals]=published&limit=${limit}&sort=-publishedAt&depth=1`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const posts = data.docs || []

    // Sort posts by publishedAt date (newest first) in case API sorting doesn't work
    return posts.sort((a: any, b: any) => {
      const dateA = new Date(a.publishedAt)
      const dateB = new Date(b.publishedAt)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error fetching recent posts:', error)
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

// Component to render rich text content with proper styling
function RichTextContent({ content }: { content: any }) {
  if (!content || !content.root) return null

  // Convert Lexical content to HTML with proper styling
  const renderNode = (node: any): string => {
    if (!node) return ''

    switch (node.type) {
      case 'text':
        let text = node.text || ''
        // Apply formatting
        if (node.format & 1) text = `<strong class="font-semibold">${text}</strong>`
        if (node.format & 2) text = `<em class="italic">${text}</em>`
        if (node.format & 8) text = `<u class="underline">${text}</u>`
        if (node.format & 16) text = `<del class="line-through">${text}</del>`
        if (node.format & 32) text = `<code class="px-1 py-0.5 text-sm bg-gray-800 rounded text-purple-300">${text}</code>`
        return text

      case 'paragraph':
        const paragraphChildren = node.children?.map(renderNode).join('') || ''
        return `<p class="mb-6 text-gray-300 leading-relaxed">${paragraphChildren}</p>`

      case 'heading':
        const tag = node.tag || 'h2'
        const headingChildren = node.children?.map(renderNode).join('') || ''
        let headingClass = 'font-bold text-white mb-4 mt-8'

        switch (tag) {
          case 'h1':
            headingClass += ' text-3xl'
            break
          case 'h2':
            headingClass += ' text-2xl'
            break
          case 'h3':
            headingClass += ' text-xl'
            break
          case 'h4':
            headingClass += ' text-lg'
            break
          default:
            headingClass += ' text-lg'
        }

        return `<${tag} class="${headingClass}">${headingChildren}</${tag}>`

      case 'list':
        const listTag = node.listType === 'bullet' ? 'ul' : 'ol'
        const listChildren = node.children?.map(renderNode).join('') || ''
        const listClass = node.listType === 'bullet'
          ? 'list-disc list-inside mb-6 space-y-2 text-gray-300'
          : 'list-decimal list-inside mb-6 space-y-2 text-gray-300'
        return `<${listTag} class="${listClass}">${listChildren}</${listTag}>`

      case 'listitem':
        const listItemChildren = node.children?.map(renderNode).join('') || ''
        return `<li class="leading-relaxed">${listItemChildren}</li>`

      case 'root':
        const rootChildren = node.children?.map(renderNode).join('') || ''
        return rootChildren

      default:
        return node.children?.map(renderNode).join('') || ''
    }
  }

  const htmlContent = renderNode(content.root)

  return (
    <div
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

// Breadcrumbs component
function Breadcrumbs({ post }: { post: BlogPostDetail }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="hover:text-purple-400 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/blog" className="hover:text-purple-400 transition-colors">
        Blog
      </Link>
      {post.categories && post.categories.length > 0 && (
        <>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/blog/category/${post.categories[0].slug}`}
            className="hover:text-purple-400 transition-colors"
          >
            {post.categories[0].title}
          </Link>
        </>
      )}
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-300 truncate max-w-xs" title={post.title}>
        {post.title}
      </span>
    </nav>
  )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  // Get all categories for sidebar
  const allCategories = await getAllCategories()

  // Get recent posts for sidebar
  const recentPosts = await getRecentPosts(5)


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

            {/* Main Content */}
            <main className="lg:col-span-3">

              {/* Breadcrumbs */}
              <Breadcrumbs post={post} />

              {/* Article */}
              <article className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden">

                {/* Featured Image */}
                {post.featuredImage?.url && (
                  <div className="relative w-full h-80 bg-gradient-to-br from-purple-500 to-pink-500">
                    <Image
                      src={post.featuredImage.url.replace('/api/media/file/', '/media/')}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-8 lg:p-12">

                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full dark:text-purple-300 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex items-center gap-4 pb-8 mb-8 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">CVC</span>
                      </div>
                      <span className="font-medium">CVC Web Solutions</span>
                    </div>
                    <span>•</span>
                    <time className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publishedAt)}
                    </time>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.ceil((post.content?.root?.children?.length || 1) * 0.5)} min read
                    </span>
                  </div>

                  {/* Excerpt */}
                  {post.excerpt && post.excerpt !== '...' && (
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-l-4 border-purple-500">
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        {post.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose-custom text-gray-800 dark:text-gray-200">
                    <RichTextContent content={post.content} />
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="pt-8 mt-12 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        <Tag className="w-5 h-5 text-purple-500" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>

            </main>

            {/* Right Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">

                {/* Categories */}
                {allCategories.length > 0 && (
                  <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                      <Folder className="w-5 h-5 text-purple-400" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {allCategories.map((category: any) => {
                        const isActive = post.categories?.some(c => c.id === category.id)
                        return (
                          <Link
                            key={category.id}
                            href={`/blog/category/${category.slug}`}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-purple-600/30 text-purple-300 font-medium'
                                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                            }`}
                          >
                            {category.title}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Recent Posts
                    </h3>
                    <div className="space-y-3">
                      {recentPosts.filter((p: any) => p.id !== post.id).slice(0, 4).map((recentPost: any) => (
                        <Link
                          key={recentPost.id}
                          href={`/blog/${recentPost.slug}`}
                          className="block group"
                        >
                          <h4 className="text-sm font-medium text-gray-300 transition-colors group-hover:text-purple-400 line-clamp-2 mb-1">
                            {recentPost.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(recentPost.publishedAt)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords?.join(', '),
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    },
  }
}