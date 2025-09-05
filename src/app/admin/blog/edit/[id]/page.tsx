'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'web-development',
    author: 'CVC Team',
    tags: '',
    status: 'draft',
    featured_image: ''
  });

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`);
      if (response.ok) {
        const post = await response.json();
        setFormData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          category: post.category || 'web-development',
          author: post.author || 'CVC Team',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
          status: post.published ? 'published' : 'draft',
          featured_image: post.featured_image || ''
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert('Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating blog post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Blog Post</h1>
          <p className="text-gray-600">Update your blog article</p>
        </div>
        <button
          onClick={() => router.push('/admin/blog')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Post Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Brief description of the post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={15}
                placeholder="Write your post content here... (Markdown supported)"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Post Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="ai-solutions">AI Solutions</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="design">Design</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="nextjs, react, typescript"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image URL
              </label>
              <input
                type="text"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}