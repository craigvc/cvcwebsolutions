'use client';

import { useState } from 'react';

interface GenerateDescriptionParams {
  title: string;
  technologies: string[];
  liveUrl?: string;
}

interface GenerateLongDescriptionParams {
  title: string;
  description: string;
  technologies: string[];
  achievements: string[];
  liveUrl?: string;
}

interface GenerateAchievementsParams {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
}

export function useGenerateContent() {
  const [generatingStates, setGeneratingStates] = useState<Record<string, boolean>>({});

  const setGenerating = (key: string, value: boolean) => {
    setGeneratingStates(prev => ({ ...prev, [key]: value }));
  };

  const isGenerating = (key: string) => generatingStates[key] || false;

  const generateDescription = async (params: GenerateDescriptionParams) => {
    setGenerating('description', true);
    try {
      const response = await fetch('/api/portfolio/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) throw new Error('Failed to generate description');
      
      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error('Error generating description:', error);
      return null;
    } finally {
      setGenerating('description', false);
    }
  };

  const generateLongDescription = async (params: GenerateLongDescriptionParams) => {
    setGenerating('longDescription', true);
    try {
      const response = await fetch('/api/portfolio/generate-long-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) throw new Error('Failed to generate long description');
      
      const data = await response.json();
      return data.longDescription;
    } catch (error) {
      console.error('Error generating long description:', error);
      return null;
    } finally {
      setGenerating('longDescription', false);
    }
  };

  const generateAchievements = async (params: GenerateAchievementsParams) => {
    setGenerating('achievements', true);
    try {
      const response = await fetch('/api/portfolio/generate-achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) throw new Error('Failed to generate achievements');
      
      const data = await response.json();
      return data.achievements;
    } catch (error) {
      console.error('Error generating achievements:', error);
      return null;
    } finally {
      setGenerating('achievements', false);
    }
  };

  const generateScreenshot = async (url: string) => {
    setGenerating('screenshot', true);
    try {
      const response = await fetch('/api/portfolio/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) throw new Error('Failed to take screenshot');
      
      const data = await response.json();
      // Return the full response object so we can use fileUrl instead of base64
      return data;
    } catch (error) {
      console.error('Error taking screenshot:', error);
      return null;
    } finally {
      setGenerating('screenshot', false);
    }
  };

  return {
    generateDescription,
    generateLongDescription,
    generateAchievements,
    generateScreenshot,
    isGenerating
  };
}
