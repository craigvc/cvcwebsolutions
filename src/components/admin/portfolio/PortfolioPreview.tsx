'use client';

import type { PortfolioItem } from '@/types/portfolio';

interface PortfolioPreviewProps {
  data: PortfolioItem;
}

// Helper to get screenshots from various possible fields
function getScreenshots(data: PortfolioItem) {
  // Check for images object (new format)
  if (data.images) {
    return {
      detail: data.images.detail || data.images.featured || data.images.listing || '',
      featured: data.images.featured || data.images.detail || data.images.listing || '',
      listing: data.images.listing || data.images.featured || data.images.detail || ''
    };
  }
  
  // Fallback to image_url
  return {
    detail: data.image_url || '',
    featured: data.image_url || '',
    listing: data.image_url || ''
  };
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const screenshots = getScreenshots(data);
  const imageSettings = data.imageSettings || {};

  return (
    <div className="text-white bg-gray-900">
      {/* Simulated Portfolio Page Layout */}
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          {screenshots.detail && (
            <div className="absolute inset-0">
              <img
                src={screenshots.detail}
                alt={data.title}
                className="object-cover w-full h-full opacity-30"
                style={{
                  objectPosition: `${imageSettings.detail?.x || 0}px ${imageSettings.detail?.y || 0}px`,
                  transform: `scale(${imageSettings.detail?.scale || 1})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </div>
          )}
          
          <div className="relative z-10 flex items-center h-full">
            <div className="container px-6 mx-auto">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{data.title || 'Project Title'}</h1>
              {data.subtitle && (
                <p className="mb-6 text-xl text-gray-300">{data.subtitle}</p>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {data.live_url && (
                  <a
                    href={data.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Visit Live Site
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {data.github_url && (
                  <a
                    href={data.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    View Source
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container px-6 py-12 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 md:col-span-2">
              {/* Screenshot with positioning */}
              {screenshots.detail && (
                <div className="relative overflow-hidden border border-gray-700 rounded-xl">
                  <div className="p-4 bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-4 text-xs text-gray-500">{data.live_url || 'https://example.com'}</span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden" style={{ height: '400px' }}>
                    <img
                      src={screenshots.detail}
                      alt={data.title}
                      className="absolute w-full"
                      style={{
                        left: `${imageSettings.detail?.x || 0}px`,
                        top: `${imageSettings.detail?.y || 0}px`,
                        transform: `scale(${imageSettings.detail?.scale || 1})`,
                        transformOrigin: 'top left'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300">{data.description || 'Project description will appear here.'}</p>
                {data.long_description && (
                  <div 
                    className="mt-6 text-gray-400"
                    dangerouslySetInnerHTML={{ __html: data.long_description }}
                  />
                )}
              </div>

              {/* Achievements */}
              {data.achievements && data.achievements.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Key Achievements</h2>
                  <ul className="space-y-2">
                    {data.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">
                          {typeof achievement === 'string' 
                            ? achievement 
                            : (achievement as any).achievement || achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technologies */}
              {data.technologies && data.technologies.length > 0 && (
                <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-purple-300 border rounded-lg bg-purple-900/30 border-purple-700/30"
                      >
                        {typeof tech === 'string' ? tech : (tech as any).technology || tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Info */}
              <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-white">Project Details</h3>
                <dl className="space-y-3">
                  {data.year && (
                    <>
                      <dt className="text-sm text-gray-400">Year</dt>
                      <dd className="font-medium text-white">{data.year}</dd>
                    </>
                  )}
                  {data.category && (
                    <>
                      <dt className="mt-3 text-sm text-gray-400">Category</dt>
                      <dd className="font-medium text-white">
                        {typeof data.category === 'string' ? data.category : data.category?.name}
                      </dd>
                    </>
                  )}
                  {data.status && (
                    <>
                      <dt className="mt-3 text-sm text-gray-400">Status</dt>
                      <dd>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          data.status === 'published' 
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}>
                          {data.status}
                        </span>
                      </dd>
                    </>
                  )}
                </dl>
              </div>

              {/* Additional Screenshots */}
              <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-white">Preview Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-xs text-gray-400">Featured View</label>
                    <div className="relative h-24 overflow-hidden bg-gray-900 rounded">
                      {screenshots.featured && (
                        <img
                          src={screenshots.featured}
                          alt="Featured"
                          className="absolute object-cover w-full h-full"
                          style={{
                            objectPosition: `${imageSettings.featured?.x || 0}px ${imageSettings.featured?.y || 0}px`,
                            transform: `scale(${imageSettings.featured?.scale || 1})`
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-400">Grid View</label>
                    <div className="relative h-24 overflow-hidden bg-gray-900 rounded">
                      {screenshots.listing && (
                        <img
                          src={screenshots.listing}
                          alt="Listing"
                          className="absolute object-cover w-full h-full"
                          style={{
                            objectPosition: `${imageSettings.listing?.x || 0}px ${imageSettings.listing?.y || 0}px`,
                            transform: `scale(${imageSettings.listing?.scale || 1})`
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
