'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioItem } from '@/types/portfolio';

export function usePortfolio(id?: string) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPortfolio = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${id}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio item');
      const data = await response.json();
      
      // Transform technologies and achievements if they're objects
      // Also map 'url' from Payload to 'live_url' for the form
      const transformedData = {
        ...data,
        live_url: data.url || data.live_url || '', // Map url to live_url
        images: data.images || {}, // Include images field
        imageSettings: data.imageSettings || {}, // Include imageSettings field
        technologies: data.technologies?.map((tech: any) =>
          typeof tech === 'object' && tech !== null && 'technology' in tech
            ? tech.technology
            : tech
        ) || [],
        achievements: data.achievements?.map((achievement: any) =>
          typeof achievement === 'object' && achievement !== null && 'achievement' in achievement
            ? achievement.achievement
            : achievement
        ) || []
      };
      
      setPortfolio(transformedData);
    } catch (err) {
      setError('Failed to load portfolio item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (data: Partial<PortfolioItem>) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Map live_url to url for Payload
      // Keep image_url (logo) and images (screenshots) completely separate
      const payloadData = {
        ...data,
        url: data.live_url, // Map live_url to url for Payload
        // Keep image_url as-is (logo), don't mix with screenshots
        image_url: data.image_url || '',
        images: data.images || {}, // Screenshots are stored here separately
        imageSettings: data.imageSettings || {}, // Position and scale settings
      };

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      });
      
      if (!response.ok) throw new Error('Failed to create portfolio item');
      
      const newPortfolio = await response.json();
      setSuccess('Portfolio item created successfully!');
      
      setTimeout(() => {
        router.push('/admin/portfolio');
      }, 1500);
      
      return newPortfolio;
    } catch (err) {
      setError('Failed to create portfolio item');
      console.error(err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updatePortfolio = async (data: PortfolioItem) => {
    if (!id) return null;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Map live_url back to url for Payload
      // Keep image_url (logo) and images (screenshots) completely separate
      const payloadData = {
        ...data,
        url: data.live_url, // Map live_url back to url for Payload
        // Keep image_url as-is (logo), don't mix with screenshots
        image_url: data.image_url || '',
        images: data.images || {}, // Screenshots are stored here separately
        imageSettings: data.imageSettings || {}, // Position and scale settings
      };

      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update failed:', errorData);
        throw new Error('Failed to update portfolio item');
      }

      const updatedData = await response.json();
      
      // Transform the response to match our interface
      const transformedUpdatedData = {
        ...updatedData,
        live_url: updatedData.url || updatedData.live_url || '', // Map url back to live_url
        images: updatedData.images || {}, // Include the images field in the response
        imageSettings: updatedData.imageSettings || {}, // Include imageSettings in the response
      };
      setPortfolio(transformedUpdatedData);
      setSuccess('Portfolio item updated successfully!');

      // Don't redirect - stay on the same page
      // setTimeout(() => {
      //   router.push('/admin/portfolio');
      // }, 1500);

      return updatedData;
    } catch (err) {
      setError('Failed to save portfolio item');
      console.error('Update error:', err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const deletePortfolio = async () => {
    if (!id) return false;
    
    if (!confirm('Are you sure you want to delete this portfolio item?')) return false;
    
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete portfolio item');
      
      router.push('/admin/portfolio');
      return true;
    } catch (err) {
      setError('Failed to delete portfolio item');
      console.error(err);
      return false;
    }
  };

  return {
    portfolio,
    loading,
    saving,
    error,
    success,
    fetchPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    setError,
    setSuccess
  };
}
