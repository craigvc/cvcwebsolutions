'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NewPagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    hero: {
      headline: '',
      subheadline: '',
      ctaText: '',
      ctaLink: '',
    },
    content: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
    sections: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/payload/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create page')
      
      const data = await response.json()
      router.push(`/admin/pages/edit/${data.doc.id}`)
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page')
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
          <p className="mt-2 text-gray-600">Create a new content page for your website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 space-y-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Page Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }}
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL Slug *
              </label>
              <div className="flex mt-1 rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  /
                </span>
                <input
                  type="text"
                  id="slug"
                  required
                  className="flex-1 block w-full border-gray-300 rounded-none rounded-r-md focus:border-blue-500 focus:ring-blue-500"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">The URL path for this page</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            
            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Headline
              </label>
              <input
                type="text"
                id="headline"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.hero.headline}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, headline: e.target.value }
                })}
              />
            </div>

            <div>
              <label htmlFor="subheadline" className="block text-sm font-medium text-gray-700">
                Subheadline
              </label>
              <textarea
                id="subheadline"
                rows={3}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.hero.subheadline}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, subheadline: e.target.value }
                })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  id="ctaText"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.hero.ctaText}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, ctaText: e.target.value }
                  })}
                />
              </div>

              <div>
                <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  id="ctaLink"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.hero.ctaLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, ctaLink: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Main Content</h2>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Page Content
              </label>
              <textarea
                id="content"
                rows={10}
                className="block w-full mt-1 font-mono text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your page content here. You can use markdown or HTML."
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be the main content of your page. You can add more sections after creating the page.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">SEO Settings</h2>
            
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.seo.metaTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaTitle: e.target.value }
                })}
                placeholder="SEO title (max 60 characters)"
                maxLength={60}
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                rows={3}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.seo.metaDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value }
                })}
                placeholder="SEO description (max 160 characters)"
                maxLength={160}
              />
            </div>

            <div>
              <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700">
                Meta Keywords
              </label>
              <input
                type="text"
                id="metaKeywords"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.seo.metaKeywords}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaKeywords: e.target.value }
                })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/pages')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
