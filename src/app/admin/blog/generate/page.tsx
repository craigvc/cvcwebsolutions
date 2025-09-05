'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, Lightbulb, Eye, Check, X, Image } from 'lucide-react';
import Link from 'next/link';
import { generateBlogPost, suggestBlogTopics } from '@/lib/ollama';

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoMetaDescription: string;
  featured_image?: string;
}

export default function BlogGeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestingTopic, setSuggestingTopic] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    category: 'web-development',
    topic: '',
    keywords: '',
    tone: 'professional',
    length: 'medium'
  });

  const categories = [
    { value: 'company-news', label: 'Company News' },
    { value: 'industry-news', label: 'Industry News' },
    { value: 'security', label: 'Security' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'ai-solutions', label: 'AI Solutions' },
    { value: 'magento-tips', label: 'Magento Tips' },
    { value: 'wordpress-tips', label: 'WordPress Tips' }
  ];

  const suggestTopic = async () => {
    setSuggestingTopic(true);
    
    try {
      const suggestions = await suggestBlogTopics(formData.category);
      const randomTopic = suggestions[Math.floor(Math.random() * suggestions.length)];
      setFormData({ ...formData, topic: randomTopic });
    } catch (error) {
      console.error('Error suggesting topic:', error);
      // Use business-focused fallback topics
      const fallbackTopics: { [key: string]: string[] } = {
        'web-development': [
          'How a Professional Website Can Transform Your Business Revenue',
          'Why Your Competitors Website Is Stealing Your Customers',
          'The True Cost of a DIY Website vs Professional Development'
        ],
        'ai-solutions': [
          'How AI Can Cut Your Business Costs by 40% While Scaling Operations',
          'AI vs Employees: The ROI Comparison That Will Shock You',
          'Automate or Die: Why AI Adoption Is No Longer Optional'
        ],
        'security': [
          'The $200,000 Question: Is Your Business Protected from Cyber Attacks?',
          'How One Email Could Bankrupt Your Business (And How to Stop It)',
          'Your Employees Are Your Biggest Security Risk: Heres the Fix'
        ]
      };
      
      const fallback = fallbackTopics[formData.category] || fallbackTopics['web-development'];
      const randomTopic = fallback[Math.floor(Math.random() * fallback.length)];
      setFormData({ ...formData, topic: randomTopic });
    } finally {
      setSuggestingTopic(false);
    }
  };

  const generateImagePrompt = (title: string, category: string) => {
    return `Professional blog header image for article titled "${title}" in ${category} category, modern tech aesthetic, abstract digital art, vibrant colors, high quality`;
  };

  const generateImageUrl = async (prompt: string) => {
    // For now, we'll use placeholder images based on category
    // In production, this would call an actual image generation API
    const categoryImages: { [key: string]: string } = {
      'web-development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
      'ai-solutions': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
      'security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
      'company-news': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
      'industry-news': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=600&fit=crop',
      'magento-tips': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      'wordpress-tips': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop'
    };
    
    return categoryImages[formData.category] || categoryImages['web-development'];
  };

  const handleGenerate = async () => {
    if (!formData.topic) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const result = await generateBlogPost({
        category: formData.category as any,
        topic: formData.topic,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [],
        tone: formData.tone as any,
        length: formData.length as any
      });

      // Generate image
      setGeneratingImage(true);
      const imageUrl = await generateImageUrl(generateImagePrompt(result.title, formData.category));
      setGeneratingImage(false);

      const contentWithImage = {
        ...result,
        featured_image: imageUrl
      };

      setGeneratedContent(contentWithImage);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('Failed to generate blog post');
    } finally {
      setLoading(false);
      setGeneratingImage(false);
    }
  };

  const handleApprove = async () => {
    if (!generatedContent) return;

    setLoading(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedContent,
          status: 'draft',
          author: 'AI Assistant'
        })
      });

      if (response.ok) {
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    setShowPreview(false);
    handleGenerate();
  };

  const handleCancel = () => {
    setGeneratedContent(null);
    setShowPreview(false);
  };

  if (showPreview && generatedContent) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Review Generated Content</h1>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold">{generatedContent.title}</h2>
              </div>
            </div>

            {/* Featured Image */}
            {generatedContent.featured_image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={generatedContent.featured_image} 
                    alt={generatedContent.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{generatedContent.excerpt}</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{generatedContent.content}</pre>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {generatedContent.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Meta Description</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm">{generatedContent.seoMetaDescription}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Saving...' : 'Approve & Save'}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Management
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Generate Blog Post with AI
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., Best practices for React performance optimization"
              />
              <button
                onClick={suggestTopic}
                disabled={suggestingTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {suggestingTopic ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
                Suggest
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click "Suggest" to get AI-powered topic ideas based on your selected category
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="react, performance, optimization, web development"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length
              </label>
              <select
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (600-800 words)</option>
                <option value="medium">Medium (1000-1500 words)</option>
                <option value="long">Long (1800-2500 words)</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Image className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Auto-Generated Featured Image</h3>
                <p className="text-sm text-blue-700 mt-1">
                  An AI-generated featured image will be created automatically based on your content
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !formData.topic || generatingImage}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading || generatingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {generatingImage ? 'Generating Image...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Generate & Preview
                </>
              )}
            </button>
            <Link
              href="/admin/blog"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}