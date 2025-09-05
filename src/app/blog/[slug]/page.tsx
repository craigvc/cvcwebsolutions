import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
            <span className="bg-blue-800 px-3 py-1 rounded">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">
            Experience truly managed hosting with our hands-off approach.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </article>
  )
}