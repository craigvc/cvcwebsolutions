'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Eye, Trash2, Loader2, Plus, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import type { PortfolioCategory } from '@/types/portfolio';

interface PortfolioSidebarProps {
  mode: 'create' | 'edit';
  status: 'draft' | 'published';
  featured: boolean;
  year: string;
  publishedAt?: string;
  category: string | PortfolioCategory;
  isLoading: boolean;
  slug?: string;
  onStatusChange: (status: 'draft' | 'published') => void;
  onFeaturedChange: (featured: boolean) => void;
  onYearChange: (year: string) => void;
  onPublishedAtChange: (publishedAt?: string) => void;
  onCategoryChange: (category: string) => void;
  onDelete?: () => Promise<void>;
}

export function PortfolioSidebar({
  mode,
  status,
  featured,
  year,
  publishedAt,
  category,
  isLoading,
  slug,
  imageUrl,
  onStatusChange,
  onFeaturedChange,
  onYearChange,
  onPublishedAtChange,
  onCategoryChange,
  onImageChange,
  onDelete
}: PortfolioSidebarProps & { imageUrl?: string; onImageChange?: (url: string) => void }) {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    icon: '',
    color: 'blue' as const
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('/api/portfolio-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.docs || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryData.name || !newCategoryData.icon) return;

    try {
      const response = await fetch('/api/portfolio-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoryData),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        onCategoryChange(newCategory.id);
        setNewCategoryData({ name: '', icon: '', color: 'blue' });
        setShowNewCategoryForm(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const getCategoryValue = () => {
    if (typeof category === 'object' && category) {
      return category.id;
    }
    return category || '';
  };
  return (
    <div className="space-y-6 w-80">
      {/* Logo/Image Section */}
      <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl">
        <h3 className="mb-4 text-lg font-bold text-white">Logo</h3>
        {imageUrl ? (
          <div className="relative overflow-hidden border border-gray-700 rounded-lg bg-gray-900/50">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <img
                src={imageUrl}
                alt="Portfolio logo"
                className="absolute inset-0 object-contain w-full h-full bg-gray-900"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg bg-gray-900/50">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-400">No logo uploaded</p>
            </div>
          </div>
        )}
        <div className="mt-3 space-y-2">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Convert to base64 for preview
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onImageChange?.(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition-colors bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
              <Upload className="w-4 h-4" />
              Upload Logo
            </div>
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageChange?.(e.target.value)}
            className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
            placeholder="Or enter logo URL"
          />
        </div>
      </div>

      <div className="p-6 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl">
        <h2 className="mb-4 text-lg font-bold text-white">
          Publish
        </h2>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
            <span className="text-sm text-gray-400">Status:</span>
            <span className="text-sm font-semibold text-white">
              {status === 'published' ? '🟢 Published' : '⚪ Draft'}
            </span>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Category
            </label>
            <div className="space-y-2">
              <select
                value={getCategoryValue()}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
                disabled={loadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-300 transition-colors border border-gray-700 rounded-lg bg-gray-900/50 hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                Add New Category
              </button>

              {showNewCategoryForm && (
                <div className="p-3 space-y-3 border border-gray-600 rounded-lg bg-gray-900/70">
                  <input
                    type="text"
                    placeholder="Category name (e.g., Education)"
                    value={newCategoryData.name}
                    onChange={(e) => setNewCategoryData({...newCategoryData, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm text-white border border-gray-700 rounded bg-gray-900/50"
                  />
                  <input
                    type="text"
                    placeholder="Icon (e.g., 🎓)"
                    value={newCategoryData.icon}
                    onChange={(e) => setNewCategoryData({...newCategoryData, icon: e.target.value})}
                    className="w-full px-3 py-2 text-sm text-white border border-gray-700 rounded bg-gray-900/50"
                  />
                  <select
                    value={newCategoryData.color}
                    onChange={(e) => setNewCategoryData({...newCategoryData, color: e.target.value as any})}
                    className="w-full px-3 py-2 text-sm text-white border border-gray-700 rounded bg-gray-900/50"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="pink">Pink</option>
                    <option value="indigo">Indigo</option>
                    <option value="teal">Teal</option>
                    <option value="yellow">Yellow</option>
                    <option value="gray">Gray</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryForm(false)}
                      className="flex-1 px-3 py-2 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Change Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Project Year */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Project Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
              placeholder={new Date().getFullYear().toString()}
              maxLength={4}
            />
            <p className="mt-1 text-xs text-gray-500">
              The year this project was completed
            </p>
          </div>

          {/* Publication Date */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Publication Date
            </label>
            <input
              type="date"
              value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
              onChange={(e) => onPublishedAtChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
              placeholder="dd/mm/yyyy"
            />
            <p className="mt-1 text-xs text-gray-500">
              When this project was/will be published (DD/MM/YYYY)
            </p>
          </div>

          {/* Featured */}
          <div className="py-3 border-t dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sidebar-featured"
                checked={featured}
                onChange={(e) => onFeaturedChange(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-700 rounded bg-gray-900/50 focus:ring-purple-500"
              />
              <label htmlFor="sidebar-featured" className="ml-2 text-sm font-medium text-gray-300">
                Feature on homepage
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2 border-t dark:border-gray-700">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
              icon={!isLoading && <Save className="w-5 h-5" />}
              className="w-full"
            >
              {mode === 'create' ? 'Create Project' : 'Save Changes'}
            </Button>
            
            {mode === 'edit' && slug && (
              <>
                <Link
                  href={`/portfolio/${slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-white transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </Link>
                
                {onDelete && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={onDelete}
                    icon={<Trash2 className="w-5 h-5" />}
                    className="w-full"
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
