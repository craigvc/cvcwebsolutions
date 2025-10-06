'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { RichTextEditorWrapper } from '../ui/RichTextEditorWrapper';

interface PortfolioBasicInfoProps {
  title: string;
  subtitle: string;
  slug: string;
  liveUrl: string;
  githubUrl?: string;
  description: string;
  longDescription?: string;
  technologies?: string[];
  category?: string;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  onSlugChange: (slug: string) => void;
  onLiveUrlChange: (url: string) => void;
  onGithubUrlChange?: (url: string) => void;
  onDescriptionChange: (description: string) => void;
  onLongDescriptionChange?: (description: string) => void;
  onAIPopulate?: (data: any) => void;
}

export function PortfolioBasicInfo({
  title,
  subtitle,
  slug,
  liveUrl,
  githubUrl = '',
  description,
  longDescription,
  technologies = [],
  category,
  onTitleChange,
  onSubtitleChange,
  onSlugChange,
  onLiveUrlChange,
  onGithubUrlChange,
  onDescriptionChange,
  onLongDescriptionChange,
  onAIPopulate
}: PortfolioBasicInfoProps) {
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [shortDescRefinePrompt, setShortDescRefinePrompt] = useState('');
  const [longDescRefinePrompt, setLongDescRefinePrompt] = useState('');
  const [regeneratingField, setRegeneratingField] = useState<string | null>(null);
  const [showShortDescRefine, setShowShortDescRefine] = useState(false);
  const [showLongDescRefine, setShowLongDescRefine] = useState(false);

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    onSlugChange(newSlug);
  };

  const fetchWebsiteMetadata = async (useAI: boolean = true) => {
    if (!liveUrl) {
      alert('Please enter a URL first');
      return;
    }

    setFetchingMetadata(true);
    try {
      // Use AI analysis endpoint for comprehensive analysis
      const endpoint = useAI ? '/api/portfolio/analyze-website' : '/api/portfolio/fetch-metadata';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: liveUrl, refinePrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.metadata) {
          const { metadata } = data;

          // Update fields with AI-analyzed data
          onTitleChange(metadata.title || title);
          onSubtitleChange(metadata.subtitle || subtitle);
          onSlugChange(metadata.slug || slug);
          onDescriptionChange(metadata.description || description);

          // Update long description if handler provided
          if (onLongDescriptionChange && metadata.longDescription) {
            onLongDescriptionChange(metadata.longDescription);
          }

          // If parent component provided onAIPopulate, pass additional data
          if (onAIPopulate) {
            onAIPopulate({
              longDescription: metadata.longDescription,
              challenge: metadata.challenge,
              solution: metadata.solution,
              technologies: metadata.technologies,
              achievements: metadata.keyAchievements,
              categories: metadata.categories,
              clientCategories: metadata.clientCategories,
              image: metadata.image,
            });
          }

          // Show success message with AI context
          if (useAI && metadata.clientType) {
            alert(`✨ AI Analysis Complete!\n\nDetected: ${metadata.clientType}\n\nFields have been updated based on AI analysis of the website. Review and adjust as needed.`);
          } else {
            alert('Website information fetched successfully! Review and adjust the populated fields as needed.');
          }
        }
      } else {
        const error = await response.json();
        if (useAI && error.error?.includes('AI')) {
          // Fallback to basic fetch if AI fails
          console.log('AI analysis failed, falling back to basic metadata fetch');
          fetchWebsiteMetadata(false);
        } else {
          alert(`Failed to analyze website: ${error.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      if (useAI) {
        // Try fallback to basic fetch
        console.log('Error with AI analysis, trying basic fetch');
        fetchWebsiteMetadata(false);
      } else {
        alert('Error fetching website metadata. Please check the URL and try again.');
      }
    } finally {
      setFetchingMetadata(false);
    }
  };

  const regenerateField = async (fieldType: 'shortDescription' | 'longDescription', customPrompt: string) => {
    setRegeneratingField(fieldType);
    try {
      const response = await fetch('/api/portfolio/regenerate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldType,
          currentContext: {
            title,
            subtitle,
            url: liveUrl,
            technologies,
            category,
            shortDescription: description,
            longDescription: longDescription
          },
          refinePrompt: customPrompt
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          if (fieldType === 'shortDescription') {
            onDescriptionChange(data.content);
            setShowShortDescRefine(false);
            setShortDescRefinePrompt('');
          } else {
            if (onLongDescriptionChange) {
              onLongDescriptionChange(data.content);
            }
            setShowLongDescRefine(false);
            setLongDescRefinePrompt('');
          }
        }
      } else {
        const error = await response.json();
        alert(`Failed to regenerate ${fieldType}: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error regenerating ${fieldType}:`, error);
      alert(`Error regenerating ${fieldType}. Please try again.`);
    } finally {
      setRegeneratingField(null);
    }
  };

  return (
    <Card title="Project Information">
      <div className="space-y-4">
        {/* Live URL with AI analysis - full width */}
        <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <label className="block mb-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
            📌 Website URL
          </label>
          <div className="flex gap-2">
            <Input
              value={liveUrl}
              onChange={onLiveUrlChange}
              type="url"
              placeholder="https://example.com"
              helperText=""
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => fetchWebsiteMetadata(true)}
              disabled={fetchingMetadata || !liveUrl}
              variant="primary"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {fetchingMetadata ? (
                <>
                  <svg className="inline w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                '✨ AI Analyze'
              )}
            </Button>
          </div>
        </div>

        {/* Title and GitHub URL on same row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Project Title *"
            value={title}
            onChange={onTitleChange}
            placeholder="Will be auto-populated from website"
            required
          />
          
          {onGithubUrlChange && (
            <Input
              label="GitHub Repository URL"
              value={githubUrl}
              onChange={onGithubUrlChange}
              type="url"
              placeholder="https://github.com/username/repo"
              helperText="Optional: Link to the source code"
            />
          )}
        </div>

        {/* Subtitle and Slug on same row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Project Subtitle"
            value={subtitle}
            onChange={onSubtitleChange}
            placeholder="Will be auto-populated - compelling tagline"
            helperText="A short tagline that captures the essence"
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="URL Slug *"
                value={slug}
                onChange={onSlugChange}
                placeholder="auto-generated-from-title"
                required
              />
            </div>
            <Button
              type="button"
              onClick={generateSlug}
              variant="secondary"
              className="mt-6"
              disabled={!title}
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Refine Prompt Field */}
        <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <label className="block mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            🎯 Refine AI Prompt (Optional)
          </label>
          <Textarea
            value={refinePrompt}
            onChange={(value) => setRefinePrompt(value)}
            rows={2}
            placeholder="Add specific context to improve AI analysis. E.g., 'This is a nonprofit website for wildlife conservation. Focus on the environmental impact and donation features.'"
            helperText="Provide additional context about the client, special features, or specific aspects you want the AI to focus on."
          />
          {refinePrompt && (
            <Button
              type="button"
              onClick={() => fetchWebsiteMetadata(true)}
              disabled={fetchingMetadata || !liveUrl}
              variant="secondary"
              className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              🔄 Re-analyze with Context
            </Button>
          )}
        </div>

        {/* Short Description with Regenerate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description *
            </label>
            <Button
              type="button"
              onClick={() => setShowShortDescRefine(!showShortDescRefine)}
              variant="secondary"
              className="px-3 py-1 text-xs"
              disabled={regeneratingField === 'shortDescription'}
            >
              {regeneratingField === 'shortDescription' ? (
                <>
                  <svg className="inline w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating...
                </>
              ) : (
                '🔄 Refine Description'
              )}
            </Button>
          </div>

          {showShortDescRefine && (
            <div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <Textarea
                value={shortDescRefinePrompt}
                onChange={(value) => setShortDescRefinePrompt(value)}
                rows={2}
                placeholder="E.g., 'Make it more technical', 'Focus on ROI', 'Emphasize innovation', 'Make it client-focused'"
                helperText="Provide instructions on how to refine this specific description"
              />
              <Button
                type="button"
                onClick={() => regenerateField('shortDescription', shortDescRefinePrompt)}
                disabled={regeneratingField === 'shortDescription'}
                variant="primary"
                className="mt-2 text-sm bg-green-600 hover:bg-green-700"
              >
                ✨ Regenerate Short Description
              </Button>
            </div>
          )}

          <Textarea
            value={description}
            onChange={onDescriptionChange}
            rows={3}
            placeholder="Will be auto-populated from website"
            helperText="Brief 2-3 sentence description for portfolio listings"
            required
          />
        </div>

        {/* Long Description with WYSIWYG and Regenerate */}
        {onLongDescriptionChange && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Detailed Case Study Description
              </label>
              <Button
                type="button"
                onClick={() => setShowLongDescRefine(!showLongDescRefine)}
                variant="secondary"
                className="px-3 py-1 text-xs"
                disabled={regeneratingField === 'longDescription'}
              >
                {regeneratingField === 'longDescription' ? (
                  <>
                    <svg className="inline w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Regenerating...
                  </>
                ) : (
                  '🔄 Refine Case Study'
                )}
              </Button>
            </div>

            {showLongDescRefine && (
              <div className="p-3 border border-indigo-200 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800">
                <Textarea
                  value={longDescRefinePrompt}
                  onChange={(value) => setLongDescRefinePrompt(value)}
                  rows={2}
                  placeholder="E.g., 'Add more technical details', 'Include specific metrics', 'Focus on the challenges', 'Highlight team collaboration'"
                  helperText="Provide instructions on how to refine the case study"
                />
                <Button
                  type="button"
                  onClick={() => regenerateField('longDescription', longDescRefinePrompt)}
                  disabled={regeneratingField === 'longDescription'}
                  variant="primary"
                  className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-700"
                >
                  ✨ Regenerate Case Study
                </Button>
              </div>
            )}

            <RichTextEditorWrapper
              value={longDescription || ''}
              onChange={onLongDescriptionChange}
              placeholder="Will be auto-populated with comprehensive case study content"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Full case study with rich formatting. Use the editor toolbar to format text, add lists, and structure your content.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
