import { notFound } from 'next/navigation'
import { getPortfolioProject } from '@/lib/db-sqlite'
import { ArrowLeft, ExternalLink, Calendar, Users, Clock, Award, Target, Lightbulb, TrendingUp, Quote } from 'lucide-react'
import Link from 'next/link'

export default async function PortfolioDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const project = getPortfolioProject(resolvedParams.slug) as any
  
  if (!project) {
    notFound()
  }

  // Parse comma-separated values
  const technologies = project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : []
  const achievements = project.achievements ? project.achievements.split(',').map((a: string) => a.trim()) : []
  const features = project.key_features ? project.key_features.split(',').map((f: string) => f.trim()) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/portfolio" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Portfolio
            </Link>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Visit Live Site
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {project.client_name && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Client</div>
                <div className="text-white font-semibold">{project.client_name}</div>
              </div>
            )}
            {project.year && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Year</div>
                <div className="text-white font-semibold">{project.year}</div>
              </div>
            )}
            {project.duration && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Duration</div>
                <div className="text-white font-semibold">{project.duration}</div>
              </div>
            )}
            {project.team_size && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Team Size</div>
                <div className="text-white font-semibold">{project.team_size}</div>
              </div>
            )}
          </div>

          {/* Screenshot/Image */}
          {project.image && (
            <div className="glass rounded-2xl overflow-hidden mb-12">
              <div className="h-96 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {project.category?.includes('Mobile') ? '📱' : 
                     project.category?.includes('E-Commerce') ? '🛒' : 
                     project.category?.includes('Education') ? '🎓' : 
                     project.category?.includes('Healthcare') ? '🏥' : 
                     project.category?.includes('Financial') ? '💼' : '💻'}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Challenge */}
          {project.challenge && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-red-400" />
                <h2 className="text-3xl font-bold text-white">The Challenge</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Our Solution</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {/* Results */}
          {project.results && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-white">The Results</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.results}
              </p>
            </div>
          )}

          {/* Key Features */}
          {features.length > 0 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="text-purple-400 mb-2">✓</div>
                    <div className="text-white">{feature}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Key Achievements</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300">{achievement}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white rounded-full font-medium border border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <div className="glass rounded-2xl p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Quote className="w-12 h-12 text-purple-400 mb-4" />
              <blockquote className="text-xl text-white italic mb-6">
                "{project.testimonial}"
              </blockquote>
              {(project.testimonial_author || project.testimonial_role) && (
                <div className="text-gray-300">
                  {project.testimonial_author && (
                    <div className="font-semibold">{project.testimonial_author}</div>
                  )}
                  {project.testimonial_role && (
                    <div className="text-sm">{project.testimonial_role}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create something amazing together. From concept to deployment, 
              we'll bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Your Project
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
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