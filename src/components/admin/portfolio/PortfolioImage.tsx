'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Upload, Camera, X, Loader2, Move, Check, RotateCw, Monitor, Grid, Star, Layout } from 'lucide-react';
import { useGenerateContent } from '@/hooks/useGenerateContent';

type PreviewMode = 'detail' | 'featured' | 'listing';

interface PortfolioImageProps {
  images: {
    detail?: string;
    featured?: string;
    listing?: string;
  };
  imageSettings?: {
    detail?: { x: number; y: number; scale: number };
    featured?: { x: number; y: number; scale: number };
    listing?: { x: number; y: number; scale: number };
  };
  liveUrl: string;
  onChange: (images: { detail?: string; featured?: string; listing?: string }) => void;
  onSettingsChange?: (settings: {
    detail?: { x: number; y: number; scale: number };
    featured?: { x: number; y: number; scale: number };
    listing?: { x: number; y: number; scale: number };
  }) => void;
}

export function PortfolioImage({
  images,
  imageSettings,
  liveUrl,
  onChange,
  onSettingsChange
}: PortfolioImageProps) {
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  // Initialize positions from saved settings
  const [imagePositions, setImagePositions] = useState({
    detail: imageSettings?.detail ? { x: imageSettings.detail.x, y: imageSettings.detail.y } : { x: 0, y: 0 },
    featured: imageSettings?.featured ? { x: imageSettings.featured.x, y: imageSettings.featured.y } : { x: 0, y: 0 },
    listing: imageSettings?.listing ? { x: imageSettings.listing.x, y: imageSettings.listing.y } : { x: 0, y: 0 }
  });
  // Initialize scales from saved settings
  const [scales, setScales] = useState({
    detail: imageSettings?.detail?.scale || 1,
    featured: imageSettings?.featured?.scale || 1,
    listing: imageSettings?.listing?.scale || 1
  });
  
  // Update state when imageSettings prop changes (e.g., after refresh)
  useEffect(() => {
    if (imageSettings) {
      setImagePositions({
        detail: imageSettings.detail ? { x: imageSettings.detail.x, y: imageSettings.detail.y } : { x: 0, y: 0 },
        featured: imageSettings.featured ? { x: imageSettings.featured.x, y: imageSettings.featured.y } : { x: 0, y: 0 },
        listing: imageSettings.listing ? { x: imageSettings.listing.x, y: imageSettings.listing.y } : { x: 0, y: 0 }
      });
      setScales({
        detail: imageSettings.detail?.scale || 1,
        featured: imageSettings.featured?.scale || 1,
        listing: imageSettings.listing?.scale || 1
      });
    }
  }, [imageSettings]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState<PreviewMode>('detail');
  const { generateScreenshot, isGenerating } = useGenerateContent();
  
  // Get current image for the active preview mode
  const getCurrentImage = () => {
    if (screenshotPreview) return screenshotPreview;
    return images[previewMode] || '';
  };
  
  const currentImage = getCurrentImage();
  const showEditMode = !!(images.detail || images.featured || images.listing);
  const imagePosition = imagePositions[previewMode];
  const scale = scales[previewMode];

  const handleRemoveImage = () => {
    const newImages = { ...images };
    delete newImages[previewMode];
    onChange(newImages);
  };

  const handleTakeScreenshot = async () => {
    if (!liveUrl) {
      alert('Please provide a live URL first');
      return;
    }

    const response = await generateScreenshot(liveUrl);
    if (response) {
      // Use the file URL instead of base64
      const imageUrl = response.fileUrl || response;
      // Save to current preview mode
      const newImages = { ...images, [previewMode]: imageUrl };
      onChange(newImages);
      // Update preview immediately without alert
      setScreenshotPreview(null);
    }
  };

  // Position and scale are automatically saved in state

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePositions[previewMode].x, y: e.clientY - imagePositions[previewMode].y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      setImagePositions(prev => ({
        ...prev,
        [previewMode]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        }
      }));
    }
  };

  const handleMouseUp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
  };

  // Global mouse event handlers for better dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setImagePositions(prev => {
          const newPositions = {
            ...prev,
            [previewMode]: {
              x: e.clientX - dragStart.x,
              y: e.clientY - dragStart.y
            }
          };
          return newPositions;
        });
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save position when dragging ends - use callback to get latest state
        setImagePositions(currentPositions => {
          setScales(currentScales => {
            if (onSettingsChange) {
              const settings = {
                detail: { ...currentPositions.detail, scale: currentScales.detail },
                featured: { ...currentPositions.featured, scale: currentScales.featured },
                listing: { ...currentPositions.listing, scale: currentScales.listing }
              };
              onSettingsChange(settings);
            }
            return currentScales;
          });
          return currentPositions;
        });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, previewMode, onSettingsChange]);

  return (
    <Card title="Page Screenshots">
      <div className="space-y-4">
        {/* Always show edit mode when there's an image */}
        {showEditMode ? (
          <div className="space-y-4">
            <div className="p-3 border rounded-lg bg-blue-500/20 border-blue-500/50">
              <p className="text-sm text-blue-300">
                <Move className="inline w-4 h-4 mr-1" />
                Drag to reposition. Use preview tabs to see how it looks in different contexts.
              </p>
            </div>

            {/* Preview Mode Tabs */}
            <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewMode('detail')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  previewMode === 'detail'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Detail Page
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('featured')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  previewMode === 'featured'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Star className="w-4 h-4" />
                Featured
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('listing')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  previewMode === 'listing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid Listing
              </button>
            </div>

            {/* Page Context Preview */}
            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Preview: {previewMode === 'detail' ? 'Detail Page Hero' :
                         previewMode === 'featured' ? 'Featured Portfolio Card' :
                         'Portfolio Grid Item'}
              </div>

              {/* Detail Page Preview - Full Page Mockup */}
              {previewMode === 'detail' && (
                <div className="max-w-4xl mx-auto overflow-hidden bg-gray-900 border-2 border-blue-500 rounded-lg">
                  {/* Mock Browser Chrome */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-xs text-gray-400">Portfolio Detail Page</div>
                  </div>

                  {/* Mock Navigation */}
                  <div className="px-6 py-3 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">CVC Web Solutions</div>
                      <div className="text-xs text-gray-400">← Back to Portfolio</div>
                    </div>
                  </div>

                  {/* Hero Section with Screenshot */}
                  <div className="relative overflow-hidden h-80 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                    {currentImage && (
                      <div
                        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                        onMouseDown={handleMouseDown}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale})`,
                          transition: isDragging ? 'none' : 'transform 0.1s'
                        }}
                      >
                        <img
                          src={currentImage}
                          alt="Screenshot preview"
                          className="w-full h-auto"
                          draggable={false}
                          style={{ maxWidth: 'none' }}
                        />
                      </div>
                    )}
                    {/* Hero Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
                      <div className="max-w-3xl px-6 text-center text-white">
                        <h1 className="mb-4 text-4xl font-bold">Conservation Education Platform</h1>
                        <p className="mb-6 text-xl text-purple-300">Connecting NGOs and Youth to Nature</p>
                        <div className="flex justify-center gap-2 mb-6">
                          <span className="px-4 py-2 text-sm text-green-300 border rounded-full bg-green-500/20 border-green-500/30">Education</span>
                          <span className="px-4 py-2 text-sm text-blue-300 border rounded-full bg-blue-500/20 border-blue-500/30">Non-Profit</span>
                        </div>
                        <div className="flex justify-center gap-4">
                          <div className="px-6 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">Visit Live Site</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Content Below */}
                  <div className="p-6 space-y-4">
                    <div className="text-xs text-center text-gray-500">Detail Page Hero Section (Above the fold content)</div>
                    <div className="h-8 rounded bg-gray-700/50 animate-pulse"></div>
                    <div className="h-4 rounded bg-gray-700/30 animate-pulse"></div>
                    <div className="w-3/4 h-4 rounded bg-gray-700/30 animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Featured Portfolio Card Preview - Page Section Mockup */}
              {previewMode === 'featured' && (
                <div className="max-w-2xl mx-auto overflow-hidden bg-gray-900 border-2 border-blue-500 rounded-lg">
                  {/* Mock Page Section Header */}
                  <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <div className="text-center">
                      <h2 className="mb-2 text-lg font-bold text-white">Featured Projects</h2>
                      <p className="text-sm text-gray-400">Our highlighted portfolio work</p>
                    </div>
                  </div>

                  {/* Featured Card */}
                  <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="max-w-lg mx-auto overflow-hidden bg-gray-800 shadow-2xl rounded-xl">
                      <div className="relative h-48 overflow-hidden">
                        {currentImage && (
                          <div
                            className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                            onMouseDown={handleMouseDown}
                            style={{
                              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale})`,
                              transition: isDragging ? 'none' : 'transform 0.1s'
                            }}
                          >
                            <img
                              src={currentImage}
                              alt="Screenshot preview"
                              className="w-full h-auto"
                              draggable={false}
                              style={{ maxWidth: 'none' }}
                            />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold text-white pointer-events-none">Conservation Education Platform</h3>
                        <p className="mb-4 leading-relaxed text-gray-400 pointer-events-none">We developed a comprehensive platform connecting NGOs and youth to nature conservation efforts through education and engagement.</p>
                        <div className="flex flex-wrap gap-2 mb-4 pointer-events-none">
                          <span className="px-3 py-1 text-xs font-medium text-purple-300 rounded-full bg-purple-500/20">React</span>
                          <span className="px-3 py-1 text-xs font-medium text-blue-300 rounded-full bg-blue-500/20">Next.js</span>
                          <span className="px-3 py-1 text-xs font-medium text-green-300 rounded-full bg-green-500/20">MongoDB</span>
                        </div>
                        <div className="w-full py-2 text-sm font-semibold text-center text-white rounded-lg pointer-events-none bg-gradient-to-r from-purple-500 to-pink-500">
                          View Project
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-center text-gray-500">Featured Portfolio Card (Homepage/Portfolio Section)</div>
                  </div>
                </div>
              )}

              {/* Grid Listing Preview - Portfolio Grid Page Mockup */}
              {previewMode === 'listing' && (
                <div className="max-w-5xl mx-auto overflow-hidden bg-gray-900 border-2 border-blue-500 rounded-lg">
                  {/* Mock Page Header */}
                  <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <div className="text-center">
                      <h2 className="mb-2 text-xl font-bold text-white">Our Portfolio</h2>
                      <p className="text-gray-400">Showcasing our web development projects</p>
                    </div>
                  </div>

                  {/* Portfolio Grid */}
                  <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {/* Main Portfolio Item (Your Screenshot) */}
                      <div className="overflow-hidden transition-colors bg-gray-800 rounded-lg shadow-lg hover:bg-gray-750">
                        <div className="relative h-40 overflow-hidden">
                          {currentImage && (
                            <div
                              className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                              onMouseDown={handleMouseDown}
                              style={{
                                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale})`,
                                transition: isDragging ? 'none' : 'transform 0.1s'
                              }}
                            >
                              <img
                                src={currentImage}
                                alt="Screenshot preview"
                                className="w-full h-auto"
                                draggable={false}
                                style={{ maxWidth: 'none' }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="mb-2 font-semibold text-white pointer-events-none">Conservation Platform</h3>
                          <p className="mb-3 text-sm text-gray-400 pointer-events-none line-clamp-2">Educational platform connecting NGOs and youth...</p>
                          <div className="flex flex-wrap gap-1 mb-3 pointer-events-none">
                            <span className="px-2 py-1 text-xs text-purple-300 rounded bg-purple-500/20">React</span>
                            <span className="px-2 py-1 text-xs text-blue-300 rounded bg-blue-500/20">Next.js</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 pointer-events-none">
                            <span>2024</span>
                            <span>Web Development</span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Portfolio Items */}
                      <div className="overflow-hidden bg-gray-800 rounded-lg opacity-50">
                        <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600"></div>
                        <div className="p-4">
                          <div className="h-5 mb-2 bg-gray-600 rounded"></div>
                          <div className="h-3 mb-3 bg-gray-700 rounded"></div>
                          <div className="flex gap-1 mb-3">
                            <div className="w-12 h-5 bg-gray-700 rounded"></div>
                            <div className="h-5 bg-gray-700 rounded w-14"></div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-hidden bg-gray-800 rounded-lg opacity-50">
                        <div className="h-40 bg-gradient-to-br from-green-600 to-blue-600"></div>
                        <div className="p-4">
                          <div className="h-5 mb-2 bg-gray-600 rounded"></div>
                          <div className="h-3 mb-3 bg-gray-700 rounded"></div>
                          <div className="flex gap-1 mb-3">
                            <div className="w-16 h-5 bg-gray-700 rounded"></div>
                            <div className="w-10 h-5 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-center text-gray-500">Portfolio Grid Layout (3-column desktop view)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Scale and Position Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Scale:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newScale = parseFloat(e.target.value);
                    setScales(prev => ({
                      ...prev,
                      [previewMode]: newScale
                    }));
                    // Save scale change
                    if (onSettingsChange) {
                      const settings = {
                        detail: { ...imagePositions.detail, scale: previewMode === 'detail' ? newScale : scales.detail },
                        featured: { ...imagePositions.featured, scale: previewMode === 'featured' ? newScale : scales.featured },
                        listing: { ...imagePositions.listing, scale: previewMode === 'listing' ? newScale : scales.listing }
                      };
                      onSettingsChange(settings);
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  className="flex-1 accent-blue-500"
                />
                <span className="w-12 text-sm text-gray-300">{Math.round(scale * 100)}%</span>
                <Button
                  type="button"
                  onClick={() => {
                    setScales(prev => ({
                      ...prev,
                      [previewMode]: 1
                    }));
                    setImagePositions(prev => ({
                      ...prev,
                      [previewMode]: { x: 0, y: 0 }
                    }));
                    // Save reset
                    if (onSettingsChange) {
                      const settings = {
                        detail: previewMode === 'detail' ? { x: 0, y: 0, scale: 1 } : { ...imagePositions.detail, scale: scales.detail },
                        featured: previewMode === 'featured' ? { x: 0, y: 0, scale: 1 } : { ...imagePositions.featured, scale: scales.featured },
                        listing: previewMode === 'listing' ? { x: 0, y: 0, scale: 1 } : { ...imagePositions.listing, scale: scales.listing }
                      };
                      onSettingsChange(settings);
                    }
                  }}
                  variant="secondary"
                  className="px-2 py-1 text-xs"
                >
                  Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Position: X: {Math.round(imagePosition.x)}px, Y: {Math.round(imagePosition.y)}px
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleTakeScreenshot}
                  disabled={isGenerating('screenshot') || !liveUrl}
                  variant="primary"
                  icon={isGenerating('screenshot') ?
                    <Loader2 className="w-4 h-4 animate-spin" /> :
                    <Camera className="w-4 h-4" />
                  }
                  className="flex-1"
                >
                  Take Screenshot for {previewMode === 'detail' ? 'Detail' : previewMode === 'featured' ? 'Featured' : 'Grid'} View
                </Button>
                {currentImage && (
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    variant="danger"
                    icon={<X className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              {/* Image status indicators */}
              <div className="flex gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${images.detail ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  Detail: {images.detail ? '✓' : 'No image'}
                </span>
                <span className={`px-2 py-1 rounded ${images.featured ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  Featured: {images.featured ? '✓' : 'No image'}
                </span>
                <span className={`px-2 py-1 rounded ${images.listing ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  Grid: {images.listing ? '✓' : 'No image'}
                </span>
              </div>
              
              <Input
                label={`Or enter image URL for ${previewMode === 'detail' ? 'Detail' : previewMode === 'featured' ? 'Featured' : 'Grid'} view`}
                value={images[previewMode] || ''}
                onChange={(url) => onChange({ ...images, [previewMode]: url })}
                type="text"
                placeholder="https://example.com/screenshot.jpg or /screenshots/image.png"
              />
            </div>
          </div>
        ) : (
          /* Show initial state when no image */
          <div className="space-y-4">
            <div className="p-6 text-center border-2 border-gray-700 border-dashed rounded-lg bg-gray-900/50">
              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="mb-4 text-gray-400">No screenshot yet. Take a screenshot from your live URL to get started.</p>
              <Button
                type="button"
                onClick={handleTakeScreenshot}
                disabled={isGenerating('screenshot') || !liveUrl}
                variant="primary"
                icon={isGenerating('screenshot') ?
                  <Loader2 className="w-4 h-4 animate-spin" /> :
                  <Camera className="w-4 h-4" />
                }
              >
                Take Screenshot from Live URL
              </Button>
            </div>
            
            <Input
              label="Or enter screenshot URL directly"
              value=""
              onChange={(url) => onChange({ [previewMode]: url })}
              type="text"
              placeholder="https://example.com/screenshot.jpg or /screenshots/image.png"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
