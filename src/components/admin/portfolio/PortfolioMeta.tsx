'use client';

import { Card } from '../ui/Card';

interface PortfolioMetaProps {
  status: 'draft' | 'published';
  featured: boolean;
  displayOrder: number;
  onStatusChange: (status: 'draft' | 'published') => void;
  onFeaturedChange: (featured: boolean) => void;
  onDisplayOrderChange: (order: number) => void;
}

export function PortfolioMeta({
  status,
  featured,
  displayOrder,
  onStatusChange,
  onFeaturedChange,
  onDisplayOrderChange
}: PortfolioMetaProps) {
  return (
    <Card title="Status and Featured">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as 'draft' | 'published')}
            className="w-full px-4 py-2 text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Display Order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => onDisplayOrderChange(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => onFeaturedChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 border-gray-700 rounded bg-gray-900/50 focus:ring-purple-500"
        />
        <label htmlFor="featured" className="text-gray-300">
          Featured Project
        </label>
      </div>
    </Card>
  );
}
