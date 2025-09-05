'use client';

import React from 'react';
import { ExternalLink, Calendar, Award, Target, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

// Exact copy of the listing card from portfolio page
export function PortfolioListingPreview({ study }: { study: any }) {
  const screenshot = study.screenshotUrl || study.image || '/portfolio/placeholder.jpg';
  
  // Ensure tags is an array
  const tags = typeof study.technologies === 'string' 
    ? study.technologies.split(',').map(t => t.trim()).filter(t => t)
    : (Array.isArray(study.technologies) ? study.technologies : []);

  // Ensure achievements is an array
  const achievements = typeof study.achievements === 'string'
    ? study.achievements.split(',').map(a => a.trim()).filter(a => a)
    : (Array.isArray(study.achievements) ? study.achievements : []);

  const getIcon = () => {
    const cat = (study.category || study.clientCategory || '').toLowerCase();
    if (cat.includes('mobile')) return '📱';
    if (cat.includes('commerce')) return '🛒';
    if (cat.includes('education') || cat.includes('edtech')) return '🎓';
    if (cat.includes('nonprofit')) return '🌱';
    if (cat.includes('healthcare')) return '🏥';
    if (cat.includes('financial') || cat.includes('consulting')) return '💼';
    if (cat.includes('real estate')) return '🏡';
    if (cat.includes('arts')) return '🎭';
    return '💻';
  };

  // Non-featured card style (from the portfolio grid)
  if (!study.featured) {
    return (
      <div className="glass rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all">
        <div className="h-48 relative overflow-hidden bg-gray-800">
          <div className="h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">{getIcon()}</div>
              <span className="text-white text-lg font-bold text-center px-4">{study.title}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            {study.year || new Date().getFullYear()}
          </div>
          {study.projectUrl && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                Live
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="text-purple-400 text-sm mb-2">{study.category || study.clientCategory || 'Web Development'}</div>
          <h3 className="text-xl font-semibold text-white mb-3">
            {study.title}
          </h3>
          <p className="text-gray-300 mb-4 text-sm">
            {study.challenge || study.solution || 'Case study description.'}
          </p>
          
          {achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-green-400 font-semibold text-sm mb-2">Highlights:</h4>
              <ul className="space-y-1">
                {achievements.slice(0, 3).map((achievement, i) => (
                  <li key={i} className="text-gray-400 text-xs flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-gray-300 rounded-full text-xs font-medium border border-purple-500/20 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/20 backdrop-blur-sm">
                +{tags.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <a
              href={`/portfolio/${study.slug || study.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="flex-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-white py-2 rounded-lg text-center transition-all text-sm font-medium"
            >
              View Details
            </a>
            {study.projectUrl && (
              <a
                href={study.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white py-2 rounded-lg text-center transition-all text-sm font-medium"
              >
                Visit Site
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Featured card style (from the portfolio page)
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="h-64 md:h-full relative overflow-hidden bg-gray-800">
            <div className="h-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="text-4xl mb-4">{getIcon()}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{study.category || study.clientCategory || 'Web Development'}</p>
                  {study.projectUrl && (
                    <div className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full">
                      Live Project
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            {study.projectUrl && (
              <div className="absolute top-4 right-4">
                <a
                  href={study.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-1/2 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {study.year || new Date().getFullYear()}
            </div>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {study.challenge || study.solution || 'Case study description.'}
          </p>
          
          {achievements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Key Achievements
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement, i) => (
                  <div key={i} className="flex items-start bg-green-500/10 border border-green-500/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-green-400 mr-3 mt-0.5 flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </span>
                    <span className="text-gray-300 text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-gray-200 rounded-full text-sm font-medium transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40 shadow-sm hover:shadow-md backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <a
              href={`/portfolio/${study.slug || study.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium"
            >
              View Case Study
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            {study.projectUrl && (
              <a
                href={study.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                Visit Live Site
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Exact copy of the detail page from portfolio/[slug]
export function PortfolioDetailPreview({ study }: { study: any }) {
  // Parse comma-separated values
  const technologies = typeof study.technologies === 'string' 
    ? study.technologies.split(',').map(t => t.trim()).filter(t => t)
    : (Array.isArray(study.technologies) ? study.technologies : []);
    
  const achievements = typeof study.achievements === 'string'
    ? study.achievements.split(',').map(a => a.trim()).filter(a => a)
    : (Array.isArray(study.achievements) ? study.achievements : []);
    
  const features = typeof study.keyFeatures === 'string'
    ? study.keyFeatures.split(',').map(f => f.trim()).filter(f => f)
    : (Array.isArray(study.keyFeatures) ? study.keyFeatures : []);

  const getIcon = () => {
    const cat = (study.category || study.clientCategory || '').toLowerCase();
    if (cat.includes('mobile')) return '📱';
    if (cat.includes('commerce')) return '🛒';
    if (cat.includes('education')) return '🎓';
    if (cat.includes('healthcare')) return '🏥';
    if (cat.includes('financial')) return '💼';
    return '💻';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {study.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {study.description || study.challenge || 'Project description'}
            </p>
          </div>

          {/* Project Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {study.clientName && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Client</div>
                <div className="text-white font-semibold">{study.clientName}</div>
              </div>
            )}
            {study.year && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Year</div>
                <div className="text-white font-semibold">{study.year}</div>
              </div>
            )}
            {study.duration && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Duration</div>
                <div className="text-white font-semibold">{study.duration}</div>
              </div>
            )}
            {study.teamSize && (
              <div className="glass px-6 py-3 rounded-lg">
                <div className="text-purple-400 text-sm">Team Size</div>
                <div className="text-white font-semibold">{study.teamSize}</div>
              </div>
            )}
          </div>

          {/* Screenshot/Image */}
          {(study.screenshotUrl || study.image) ? (
            <div className="glass rounded-2xl overflow-hidden mb-12">
              <img 
                src={study.screenshotUrl || study.image}
                alt={study.title}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden mb-12">
              <div className="h-96 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">{getIcon()}</div>
                  <h3 className="text-2xl font-bold text-white">{study.title}</h3>
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
          {study.challenge && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-red-400" />
                <h2 className="text-3xl font-bold text-white">The Challenge</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {study.challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {study.solution && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Our Solution</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {study.solution}
              </p>
            </div>
          )}

          {/* Results */}
          {study.results && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-white">The Results</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {study.results}
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
          {study.testimonial && (
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-xl text-gray-300 italic mb-6">
                "{study.testimonial}"
              </blockquote>
              {(study.testimonialAuthor || study.testimonialRole) && (
                <cite className="text-gray-400 not-italic">
                  — {study.testimonialAuthor}
                  {study.testimonialRole && `, ${study.testimonialRole}`}
                </cite>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Project Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {study.clientCategory && (
                <div>
                  <span className="text-purple-400">Industry</span>
                  <p className="text-white font-semibold">{study.clientCategory}</p>
                </div>
              )}
              {study.workType && (
                <div>
                  <span className="text-purple-400">Work Type</span>
                  <p className="text-white font-semibold">{study.workType}</p>
                </div>
              )}
              {study.role && (
                <div>
                  <span className="text-purple-400">Our Role</span>
                  <p className="text-white font-semibold">{study.role}</p>
                </div>
              )}
              {study.status && (
                <div>
                  <span className="text-purple-400">Status</span>
                  <p className="text-white font-semibold capitalize">{study.status}</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          {study.projectUrl && (
            <div className="text-center">
              <a
                href={study.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium text-lg"
              >
                Visit Live Site
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}