'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Loader2, Sparkles } from 'lucide-react';
import { useGenerateContent } from '@/hooks/useGenerateContent';

interface PortfolioDescriptionsProps {
  description: string;
  longDescription: string;
  onDescriptionChange: (value: string) => void;
  onLongDescriptionChange: (value: string) => void;
  title: string;
  technologies: string[];
  achievements: string[];
  liveUrl: string;
}

export function PortfolioDescriptions({
  description,
  longDescription,
  onDescriptionChange,
  onLongDescriptionChange,
  title,
  technologies,
  achievements,
  liveUrl
}: PortfolioDescriptionsProps) {
  const { generateDescription, generateLongDescription, isGenerating } = useGenerateContent();

  const handleGenerateDescription = async () => {
    const result = await generateDescription({ title, technologies, liveUrl });
    if (result) onDescriptionChange(result);
  };

  const handleGenerateLongDescription = async () => {
    const result = await generateLongDescription({ 
      title, 
      description, 
      technologies, 
      achievements, 
      liveUrl 
    });
    if (result) onLongDescriptionChange(result);
  };

  return (
    <Card title="Description">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Short Description *
            </label>
            <Button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating('description') || !title}
              variant="secondary"
              size="sm"
              icon={isGenerating('description') ? 
                <Loader2 className="w-4 h-4 animate-spin" /> : 
                <Sparkles className="w-4 h-4" />
              }
            >
              Generate with AI
            </Button>
          </div>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            placeholder="Brief overview of the project"
            required
            className="w-full px-4 py-2 text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
          />
          {!title && (
            <p className="mt-1 text-xs text-gray-400">Add a title to enable AI generation</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Long Description
            </label>
            <Button
              type="button"
              onClick={handleGenerateLongDescription}
              disabled={isGenerating('longDescription') || !description}
              variant="secondary"
              size="sm"
              icon={isGenerating('longDescription') ? 
                <Loader2 className="w-4 h-4 animate-spin" /> : 
                <Sparkles className="w-4 h-4" />
              }
            >
              Generate with AI
            </Button>
          </div>
          <textarea
            value={longDescription}
            onChange={(e) => onLongDescriptionChange(e.target.value)}
            rows={6}
            placeholder="Detailed project description including challenges, solutions, and impact"
            className="w-full px-4 py-2 text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
          />
          {!description && (
            <p className="mt-1 text-xs text-gray-400">Add a short description first to enable AI generation</p>
          )}
        </div>
      </div>
    </Card>
  );
}
