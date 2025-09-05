'use client';

import { useState } from 'react';
import { Globe, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisResult {
  title?: string;
  description?: string;
  keywords?: string[];
  technologies?: string[];
  performance?: {
    loadTime?: string;
    mobileReady?: boolean;
    httpsEnabled?: boolean;
  };
}

export default function AnalyzerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeWebsite = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Mock analysis for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        title: 'Website Analysis Complete',
        description: 'This website appears to be built with modern web technologies.',
        keywords: ['web development', 'responsive design', 'SEO optimized'],
        technologies: ['Next.js', 'React', 'Tailwind CSS'],
        performance: {
          loadTime: '1.2s',
          mobileReady: true,
          httpsEnabled: url.startsWith('https://')
        }
      });
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Website Analyzer</h1>
        <p className="text-gray-600">Analyze any website for SEO, performance, and technology insights</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={analyzeWebsite}
                disabled={loading || !url}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {result && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Analysis Results</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">SEO Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm"><span className="font-medium">Title:</span> {result.title}</p>
                      <p className="text-sm"><span className="font-medium">Description:</span> {result.description}</p>
                      {result.keywords && (
                        <div>
                          <span className="font-medium text-sm">Keywords:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {result.keywords.map((keyword, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.technologies?.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Load Time</p>
                        <p className="text-lg font-semibold text-gray-800">{result.performance?.loadTime}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Mobile Ready</p>
                        <p className="text-lg font-semibold">
                          {result.performance?.mobileReady ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">HTTPS</p>
                        <p className="text-lg font-semibold">
                          {result.performance?.httpsEnabled ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}