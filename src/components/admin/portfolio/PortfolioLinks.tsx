'use client';

import { useState } from 'react';

interface PortfolioLinksProps {
  liveUrl?: string;
  githubUrl?: string;
  onLiveUrlChange: (url: string) => void;
  onGithubUrlChange: (url: string) => void;
}

export function PortfolioLinks({
  liveUrl = '',
  githubUrl = '',
  onLiveUrlChange,
  onGithubUrlChange,
}: PortfolioLinksProps) {
  const [errors, setErrors] = useState({ live: '', github: '' });

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are valid (optional)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLiveUrlChange = (url: string) => {
    onLiveUrlChange(url);
    if (!validateUrl(url)) {
      setErrors(prev => ({ ...prev, live: 'Please enter a valid URL' }));
    } else {
      setErrors(prev => ({ ...prev, live: '' }));
    }
  };

  const handleGithubUrlChange = (url: string) => {
    onGithubUrlChange(url);
    if (!validateUrl(url)) {
      setErrors(prev => ({ ...prev, github: 'Please enter a valid URL' }));
    } else {
      setErrors(prev => ({ ...prev, github: '' }));
    }
  };

  return (
    <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl">
      <h3 className="flex items-center mb-4 text-lg font-medium text-white">
        <span className="mr-2">🔗</span>
        Project Links
      </h3>
      
      <div className="space-y-4">
        {/* Live URL */}
        <div>
          <label htmlFor="live-url" className="block mb-2 text-sm font-medium text-gray-300">
            Live Website URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="live-url"
              value={liveUrl}
              onChange={(e) => handleLiveUrlChange(e.target.value)}
              placeholder="https://example.com"
              className={`w-full px-4 py-2 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.live ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute text-purple-400 -translate-y-1/2 right-2 top-1/2 hover:text-purple-300"
                title="Open in new tab"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          {errors.live && (
            <p className="mt-1 text-sm text-red-400">{errors.live}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="github-url" className="block mb-2 text-sm font-medium text-gray-300">
            GitHub Repository URL (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              id="github-url"
              value={githubUrl}
              onChange={(e) => handleGithubUrlChange(e.target.value)}
              placeholder="https://github.com/username/repo"
              className={`w-full px-4 py-2 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.github ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute text-purple-400 -translate-y-1/2 right-2 top-1/2 hover:text-purple-300"
                title="Open in new tab"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          {errors.github && (
            <p className="mt-1 text-sm text-red-400">{errors.github}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 mt-4 border-t border-gray-700">
        <div className="flex items-center gap-4 text-sm">
          {liveUrl && (
            <button
              type="button"
              onClick={() => window.open(liveUrl, '_blank')}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Live Site
            </button>
          )}
          {githubUrl && (
            <button
              type="button"
              onClick={() => window.open(githubUrl, '_blank')}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View Repository
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
