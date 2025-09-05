'use client';

import { useState } from 'react';
import { Camera, Loader2, Download, ExternalLink } from 'lucide-react';

export default function ScreenshotPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const captureScreenshot = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setScreenshot(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to capture screenshot');
      }

      const data = await response.json();
      setScreenshot(data.screenshot);
    } catch (err) {
      setError('Failed to capture screenshot. Please try again.');
      console.error('Screenshot error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Screenshot Tool</h1>
        <p className="text-gray-600">Capture screenshots of any website for portfolio or documentation</p>
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
                onClick={captureScreenshot}
                disabled={loading || !url}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Capture
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {screenshot && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={screenshot} 
                  alt="Website screenshot" 
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <a
                  href={screenshot}
                  download="screenshot.png"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <a
                  href={screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make sure the URL includes http:// or https://</li>
          <li>• Screenshots are captured at 1920x1080 resolution</li>
          <li>• Some websites may block screenshot capture</li>
          <li>• Screenshots are saved to the /public/screenshots folder</li>
        </ul>
      </div>
    </div>
  );
}