'use client';

import { useState } from 'react';
import { PortfolioBasicInfo } from './PortfolioBasicInfo';
import { PortfolioDescriptions } from './PortfolioDescriptions';
import { PortfolioTechnologies } from './PortfolioTechnologies';
import { PortfolioAchievements } from './PortfolioAchievements';
import { PortfolioImage } from './PortfolioImage';
import { PortfolioLinks } from './PortfolioLinks';
import { PortfolioMeta } from './PortfolioMeta';
import { PortfolioSidebar } from './PortfolioSidebar';
import { PortfolioPreview } from './PortfolioPreview';
import type { PortfolioItem } from '@/types/portfolio';

interface PortfolioFormProps {
  initialData?: PortfolioItem;
  onSubmit: (data: PortfolioItem) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export function PortfolioForm({ 
  initialData, 
  onSubmit, 
  isLoading = false,
  mode 
}: PortfolioFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<PortfolioItem>(
    initialData || {
      id: '',
      title: '',
      subtitle: '',
      slug: '',
      description: '',
      long_description: '',
      technologies: [],
      image_url: '',
      images: {}, // Add images field
      imageSettings: {}, // Add imageSettings field
      live_url: '',
      github_url: '',
      category: '',
      featured: false,
      display_order: 0,
      achievements: [],
      status: 'draft',
      year: new Date().getFullYear().toString(),
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const updateField = <K extends keyof PortfolioItem>(
    field: K,
    value: PortfolioItem[K]
  ) => {
    setFormData((prev: PortfolioItem) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Project Details', icon: '📝' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'media', label: 'Media & Links', icon: '🖼️' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex gap-6">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Tab Navigation */}
        <div className="mb-6 overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl">
          <div className="flex overflow-x-auto border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-500 bg-purple-500/10'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'basic' && (
            <>
              <PortfolioBasicInfo
                title={formData.title}
                subtitle={formData.subtitle || ''}
                slug={formData.slug}
                liveUrl={formData.live_url}
                githubUrl={formData.github_url || ''}
                description={formData.description}
                longDescription={formData.long_description}
                technologies={formData.technologies}
                category={typeof formData.category === 'string' ? formData.category : formData.category?.name}
                onTitleChange={(title) => updateField('title', title)}
                onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
                onSlugChange={(slug) => updateField('slug', slug)}
                onLiveUrlChange={(url) => updateField('live_url', url)}
                onGithubUrlChange={(url) => updateField('github_url', url)}
                onDescriptionChange={(desc) => updateField('description', desc)}
                onLongDescriptionChange={(desc) => updateField('long_description', desc)}
                onAIPopulate={(data) => {
                  // Update additional fields from AI analysis
                  if (data.longDescription) updateField('long_description', data.longDescription);
                  if (data.challenge) updateField('challenge', data.challenge);
                  if (data.solution) updateField('solution', data.solution);
                  if (data.technologies) updateField('technologies', data.technologies);
                  if (data.achievements) updateField('achievements', data.achievements);
                  if (data.image) updateField('image_url', data.image);
                  // Handle categories if needed
                  if (data.categories && data.categories.length > 0) {
                    updateField('category', data.categories[0]);
                  }
                }}
              />
              <PortfolioTechnologies
                technologies={formData.technologies}
                onChange={(techs) => updateField('technologies', techs)}
              />
            </>
          )}



          {activeTab === 'achievements' && (
            <PortfolioAchievements
              achievements={formData.achievements}
              onChange={(achievements) => updateField('achievements', achievements)}
              title={formData.title}
              description={formData.description}
              technologies={formData.technologies}
              liveUrl={formData.live_url}
            />
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Left column - Edit controls */}
              <div className="space-y-6">
                <PortfolioImage
                  images={formData.images || {}}
                  imageSettings={formData.imageSettings || {}}
                  liveUrl={formData.live_url}
                  onChange={(images) => updateField('images', images)}
                  onSettingsChange={(settings) => updateField('imageSettings', settings)}
                />
                
                {/* Links section */}
                <PortfolioLinks
                  liveUrl={formData.live_url}
                  githubUrl={formData.github_url || ''}
                  onLiveUrlChange={(url) => updateField('live_url', url)}
                  onGithubUrlChange={(url) => updateField('github_url', url)}
                />
              </div>
              
              {/* Right column - Live preview */}
              <div className="sticky top-6 h-fit">
                <div className="overflow-hidden border border-gray-700 rounded-xl bg-gray-800/50">
                  <div className="px-4 py-3 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="text-sm font-medium text-gray-300">Live Preview</h3>
                  </div>
                  <div className="max-h-[80vh] overflow-y-auto">
                    <PortfolioPreview data={formData} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Sidebar */}
      <PortfolioSidebar
        mode={mode}
        status={formData.status}
        featured={formData.featured}
        year={formData.year}
        publishedAt={formData.published_at}
        category={formData.category}
        isLoading={isLoading}
        slug={formData.slug}
        imageUrl={formData.image_url}
        onStatusChange={(status) => updateField('status', status)}
        onFeaturedChange={(featured) => updateField('featured', featured)}
        onYearChange={(year) => updateField('year', year)}
        onPublishedAtChange={(publishedAt) => updateField('published_at', publishedAt)}
        onCategoryChange={(category) => updateField('category', category)}
        onImageChange={(url) => updateField('image_url', url)}
        onDelete={mode === 'edit' ? async () => {
          // Handle delete
        } : undefined}
      />
    </form>
  );
}
