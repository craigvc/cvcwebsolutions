'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Calendar, Award, ChevronDown, ChevronUp, Star, ChevronRight, Home } from 'lucide-react'

// Project interface for type safety
interface Project {
  title: string
  category: string
  clientCategory?: string
  custom_subtitle?: string
  description: string
  image: string
  image_url?: string
  images?: {
    detail?: string
    featured?: string
    listing?: string
  }
  tags: string[]
  featured?: boolean
  url?: string
  year: string
  published_at?: string
  achievements: string[]
  challenge?: string
  solution?: string
  technologies?: string[]
  slug?: string
}

// Dynamic categories - will be generated from actual project data
const getAvailableCategories = (projects: Project[]) => {
  const categorySet = new Set<string>();
  
  projects.forEach(project => {
    const category = getCategoryGroup(project);
    if (category) {
      categorySet.add(category);
    }
  });
  
  const availableCategories = Array.from(categorySet).sort();
  
  return [
    { value: 'all', label: 'All Projects' },
    ...availableCategories.map(category => ({
      value: category,
      label: category
    }))
  ];
};

// Helper function to determine category group
// Uses clientCategory (client industry) for filtering
const getCategoryGroup = (project: Project) => {
  // Return the client industry category if set
  if (project.clientCategory && project.clientCategory !== 'None') {
    return project.clientCategory
  }
  
  // For projects without a client category, return null so they're excluded from category filters
  // but still shown in "All Projects"
  return null
}

export function PortfolioPageClient({ initialProjects }: { initialProjects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedTechDropdowns, setExpandedTechDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleTechDropdown = (projectTitle: string) => {
    setExpandedTechDropdowns(prev => ({
      ...prev,
      [projectTitle]: !prev[projectTitle]
    }))
  }
  
  // Helper function to ensure arrays
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value) {
      return value.split(',').map(v => v.trim()).filter(v => v);
    }
    return [];
  };

  // Ensure all projects have arrays for critical fields
  const normalizedProjects = initialProjects.map((project: Project) => ({
    ...project,
    achievements: ensureArray(project.achievements),
    technologies: ensureArray(project.technologies),
    tags: ensureArray(project.tags)
  }));
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'all' 
    ? normalizedProjects 
    : normalizedProjects.filter(project => getCategoryGroup(project) === selectedCategory)

  // Sort projects - featured first, then by published date (newest first)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    // Featured projects come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by published_at date (newest first)
    if (a.published_at && b.published_at) {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
    
    // Fallback to year if published_at not available
    return parseInt(b.year) - parseInt(a.year);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header with Breadcrumbs */}
      <div className="sticky top-0 z-50 border-b bg-gray-900/80 backdrop-blur-sm border-white/10">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="flex items-center transition-colors hover:text-white">
              <Home className="w-4 h-4" />
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-purple-400">Portfolio</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              Our
              <span className="block gradient-text">Portfolio</span>
            </h1>
            
            <p className="max-w-3xl mx-auto mb-12 text-xl text-gray-300">
              Showcasing our expertise across diverse industries and technologies. 
              From conservation education platforms to enterprise applications.
            </p>
            
            <div className="flex flex-col justify-center gap-8 text-center sm:flex-row">
              <div className="p-6 glass rounded-xl">
                <div className="mb-2 text-3xl font-bold gradient-text">25,000+</div>
                <div className="text-gray-300">Lives Impacted</div>
              </div>
              <div className="p-6 glass rounded-xl">
                <div className="mb-2 text-3xl font-bold gradient-text">50+</div>
                <div className="text-gray-300">Projects Delivered</div>
              </div>
              <div className="p-6 glass rounded-xl">
                <div className="mb-2 text-3xl font-bold gradient-text">20+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {getAvailableCategories(normalizedProjects).map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'glass text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.label}
                {category.value !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({normalizedProjects.filter(p => getCategoryGroup(p) === category.value).length})
                  </span>
                )}
                {category.value === 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({normalizedProjects.length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          {sortedProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-lg text-gray-400">No projects found in this category.</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden transition-all group glass rounded-xl hover:transform hover:scale-105"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs font-bold text-white rounded-full top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Star className="w-3 h-3" />
                    FEATURED
                  </div>
                )}
                
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  {/* Use listing screenshot if available, otherwise fallback to image_url or gradient */}
                  {(project.images?.listing || project.image_url || project.image) ? (
                    <>
                      <img 
                        src={project.images?.listing || project.image_url || project.image}
                        alt={project.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // If image fails to load, show gradient fallback
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                                <div class="text-center">
                                  <div class="mb-2 text-3xl">
                                    ${project.category.includes('Mobile') ? '📱' : 
                                     project.category.includes('E-Commerce') ? '🛒' : 
                                     project.category.includes('Education') || project.category.includes('EdTech') ? '🎓' : 
                                     project.category.includes('Nonprofit') ? '🌱' : 
                                     project.category.includes('Healthcare') ? '🏥' : 
                                     project.category.includes('Financial') || project.category.includes('Consulting') ? '💼' : 
                                     project.category.includes('Real Estate') ? '🏡' : 
                                     project.category.includes('Arts') ? '🎭' : '💻'}
                                  </div>
                                  <span class="px-4 text-lg font-bold text-center text-white">${project.title}</span>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                        <div className="text-center">
                          <div className="mb-2 text-3xl">
                            {project.category.includes('Mobile') ? '📱' : 
                             project.category.includes('E-Commerce') ? '🛒' : 
                             project.category.includes('Education') || project.category.includes('EdTech') ? '🎓' : 
                             project.category.includes('Nonprofit') ? '🌱' : 
                             project.category.includes('Healthcare') ? '🏥' : 
                             project.category.includes('Financial') || project.category.includes('Consulting') ? '💼' : 
                             project.category.includes('Real Estate') ? '🏡' : 
                             project.category.includes('Arts') ? '🎭' : '💻'}
                          </div>
                          <span className="px-4 text-lg font-bold text-center text-white">{project.title}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </>
                  )}
                  <div className="absolute px-3 py-1 text-xs text-white rounded-full top-4 left-4 bg-black/30 backdrop-blur-sm">
                    {project.year}
                  </div>
                  {project.url && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 text-xs text-white rounded-full bg-white/20 backdrop-blur-sm">
                        Live
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-2 text-sm text-purple-400">{project.category}</div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-300">
                    {project.description}
                  </p>
                  
                  {project.achievements && project.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-green-400">Highlights:</h4>
                      <ul className="space-y-1">
                        {project.achievements.slice(0, 3).map((achievement, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-400">
                            <span className="mr-2 text-green-400">•</span>
                            {typeof achievement === 'string' ? achievement.trim() : achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium text-gray-300 border rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/20 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-400 border rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/20 backdrop-blur-sm">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Technologies Dropdown for Grid Cards */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleTechDropdown(`grid-${project.title}`)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-gray-300 transition-colors duration-200 hover:text-purple-400"
                      >
                        <span className="flex items-center">
                          Technologies
                          <span className="ml-1 text-gray-500">({project.technologies.length})</span>
                        </span>
                        <span className="transition-transform duration-200 transform">
                          {expandedTechDropdowns[`grid-${project.title}`] ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedTechDropdowns[`grid-${project.title}`] ? 'auto' : 0,
                          opacity: expandedTechDropdowns[`grid-${project.title}`] ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.map((tech) => (
                            <motion.span
                              key={tech}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-200 transition-all duration-300 border rounded-full shadow-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-purple-500/20 hover:border-purple-400/40 hover:shadow-md backdrop-blur-sm"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <a
                      href={`/portfolio/${project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="flex-1 py-2 text-sm font-medium text-center text-white transition-all rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30"
                    >
                      View Details
                    </a>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 text-sm font-medium text-center text-white transition-all rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
                      >
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 glass rounded-2xl"
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-xl text-gray-300">
              Let's create something amazing together. From concept to deployment, 
              we'll bring your vision to life.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                View Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
