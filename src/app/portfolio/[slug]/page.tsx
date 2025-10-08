'use client';

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Calendar, Users, Clock, Award, Target, Lightbulb, TrendingUp, Quote, Github, Briefcase, CalendarDays, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

async function getPortfolioBySlug(slug: string) {
  try {
    // Use window.location for client-side to get correct port
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3456')

    const response = await fetch(`${baseUrl}/api/portfolio`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch portfolio:', response.status)
      return null
    }

    const data = await response.json()
    // Handle Payload CMS response structure
    const projects = data.docs || data
    const project = projects.find((p: any) => p.slug === slug)
    console.log('Found project:', project?.title, 'Status:', project?.status)
    return project || null
  } catch (error) {
    console.error('Error fetching portfolio project:', error)
    return null
  }
}

export default function PortfolioDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      const resolvedParams = await params
      const data = await getPortfolioBySlug(resolvedParams.slug)
      if (!data || data.status !== 'published') {
        setProject(null)
      } else {
        setProject(data)
      }
      setLoading(false)
    }
    loadProject()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return notFound()
  }

  // Handle the new data structure and field mapping
  const technologies = Array.isArray(project.technologies)
    ? project.technologies.map((t: any) => typeof t === 'object' && t.technology ? t.technology : t)
    : []
  const achievements = Array.isArray(project.achievements)
    ? project.achievements.map((a: any) => typeof a === 'object' && a.achievement ? a.achievement : a)
    : project.keyAchievements || []
  const categories = Array.isArray(project.category) ? project.category : [project.category].filter(Boolean)
  const clientCategories = Array.isArray(project.clientCategory) ? project.clientCategory : [project.clientCategory].filter(Boolean)

  // Map snake_case to camelCase for compatibility
  const liveUrl = project.live_url || project.liveUrl || project.url
  const githubUrl = project.github_url || project.githubUrl
  const longDescription = project.long_description || project.longDescription
  // Use detail screenshot if available, otherwise fall back to image_url
  const imageUrl = project.images?.detail || project.image_url || project.image
  const imageSettings = project.imageSettings?.detail || { x: 0, y: 0, scale: 1 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header with Breadcrumbs */}
      <div className="sticky top-0 z-50 border-b bg-gray-900/80 backdrop-blur-sm border-white/10">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="flex items-center transition-colors hover:text-white">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/portfolio" className="transition-colors hover:text-white">
                Portfolio
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="max-w-xs font-medium text-purple-400 truncate">
                {project.title}
              </span>
            </div>
            
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Visit Site</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section with Screenshot */}
      <section className="relative">
        {/* Hero Screenshot/Image - Full Width */}
        {imageUrl ? (
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${imageUrl.startsWith('http') ? imageUrl : imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`})`,
                transform: `translate(${imageSettings.x}px, ${imageSettings.y}px) scale(${imageSettings.scale})`,
                transformOrigin: 'center center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mb-6 text-xl text-purple-300 md:text-2xl">
                    {project.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6 text-8xl">
                  {categories.some((c: string) => c.includes('Mobile')) ? '📱' : 
                   categories.some((c: string) => c.includes('E-Commerce')) ? '🛒' : 
                   categories.some((c: string) => c.includes('AI')) ? '🤖' : 
                   categories.some((c: string) => c.includes('Design')) ? '🎨' : 
                   categories.some((c: string) => c.includes('SaaS')) ? '☁️' : '💻'}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mb-6 text-xl text-purple-300 md:text-2xl">
                    {project.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Project Details Section */}
      <section className="px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Short Description with Year */}
          <div className="max-w-4xl mx-auto">
            <div className="p-8 glass rounded-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-300 border rounded-full bg-purple-500/20 border-purple-500/30">
                  <Calendar className="w-4 h-4" />
                  {project.year}
                </div>
                {clientCategories.length > 0 ? clientCategories.map((cat: string) => (
                  <span key={cat} className="px-4 py-2 text-sm font-medium text-blue-300 border rounded-full bg-blue-500/20 border-blue-500/30">
                    {cat}
                  </span>
                )) : categories.map((cat: string) => (
                  <span key={cat} className="px-4 py-2 text-sm font-medium text-green-300 border rounded-full bg-green-500/20 border-green-500/30">
                    {cat}
                  </span>
                ))}
              </div>
              <p className="text-xl leading-relaxed text-center text-gray-300">
                {project.description}
              </p>
              {liveUrl && (
                <div className="flex justify-center mt-6">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit Live Site
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto space-y-12 max-w-7xl">
          {/* Challenge */}
          {project.challenge && (
            <div className="p-8 glass rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-red-400" />
                <h2 className="text-3xl font-bold text-white">The Challenge</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                {project.challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="p-8 glass rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Our Solution</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                {project.solution}
              </p>
            </div>
          )}

          {/* Long Description / Case Study */}
          {longDescription && (
            <div className="p-8 glass rounded-2xl">
              <h2 className="mb-6 text-3xl font-bold text-white">Case Study</h2>
              <div
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:text-white
                  prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-4 prose-h3:mt-8 prose-h3:first:mt-0
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-purple-300 prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:space-y-3
                  prose-ol:my-6 prose-ol:space-y-3
                  prose-li:text-gray-300 prose-li:leading-relaxed
                  prose-li:marker:text-purple-400
                  [&_ul]:list-disc [&_ul]:ml-6
                  [&_ol]:list-decimal [&_ol]:ml-6
                  [&_ul_ul]:list-[circle] [&_ul_ul]:ml-6 [&_ul_ul]:mt-3
                  [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:ml-6 [&_ol_ol]:mt-3
                  [&_li]:pl-2
                  [&_ul>li]:relative [&_ul>li]:pl-2
                  [&_ol>li]:relative [&_ol>li]:pl-2"
                dangerouslySetInnerHTML={{ __html: longDescription }}
              />
            </div>
          )}

          {/* Results */}
          {project.results && (
            <div className="p-8 glass rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-white">The Results</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                {project.results}
              </p>
            </div>
          )}

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="p-8 glass rounded-2xl">
              <h2 className="mb-6 text-3xl font-bold text-white">Key Features</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {project.keyFeatures.map((feature: string, index: number) => (
                  <div key={index} className="p-4 rounded-lg bg-white/10">
                    <div className="mb-2 text-purple-400">✓</div>
                    <div className="text-white">{feature}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="p-8 glass rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Key Achievements</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="flex-shrink-0 w-5 h-5 mt-1 text-green-400" />
                    <div className="text-gray-300">{achievement}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="p-8 glass rounded-2xl">
              <h2 className="mb-6 text-3xl font-bold text-white">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-4 py-2 font-medium text-white border rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <div className="p-8 rounded-2xl glass bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Quote className="w-12 h-12 mb-4 text-purple-400" />
              <blockquote className="mb-6 text-xl italic text-white">
                "{project.testimonial}"
              </blockquote>
              {(project.testimonialAuthor || project.testimonialRole) && (
                <div className="text-gray-300">
                  {project.testimonialAuthor && (
                    <div className="font-semibold">{project.testimonialAuthor}</div>
                  )}
                  {project.testimonialRole && (
                    <div className="text-sm">{project.testimonialRole}</div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 glass rounded-2xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-xl text-gray-300">
              Let's create something amazing together. From concept to deployment, 
              we'll bring your vision to life.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Start Your Project
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
