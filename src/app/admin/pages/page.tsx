'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

interface Page {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  updatedAt: string
  hero?: {
    headline?: string
    subheadline?: string
  }
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages?limit=100')
      if (!response.ok) throw new Error('Failed to fetch pages')
      const data = await response.json()
      setPages(data.docs || data.pages || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
      setError('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const deletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete page')
      
      // Refresh the list
      await fetchPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update page status')
      
      // Refresh the list
      await fetchPages()
    } catch (error) {
      console.error('Error updating page status:', error)
      alert('Failed to update page status')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
            <p className="mt-2 text-gray-600">Manage your website content pages</p>
          </div>
          <Link
            href="/admin/pages/new"
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create New Page
          </Link>
        </div>

        {loading ? (
          <div className="p-8 bg-white rounded-lg shadow">
            <div className="text-center">Loading pages...</div>
          </div>
        ) : error ? (
          <div className="px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50">
            {error}
          </div>
        ) : pages.length === 0 ? (
          <div className="p-8 bg-white rounded-lg shadow">
            <div className="text-center">
              <p className="mb-4 text-gray-500">No pages found</p>
              <Link
                href="/admin/pages/new"
                className="text-blue-600 hover:text-blue-800"
              >
                Create your first page
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        {page.hero?.headline && (
                          <div className="text-sm text-gray-500">
                            {page.hero.headline}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(page.id, page.status)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {page.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/${page.slug}`}
                        className="mr-4 text-blue-600 hover:text-blue-900"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/pages/edit/${page.id}`}
                        className="mr-4 text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePage(page.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
