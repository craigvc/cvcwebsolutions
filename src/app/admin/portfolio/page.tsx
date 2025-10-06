'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

interface Technology {
  technology: string
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  technologies: Technology[]
  featured: boolean
  status: string
  year: string
  createdAt: string
  updatedAt: string
}

export default function PortfolioManagement() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const router = useRouter()

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const data = await response.json()
        setItems(data.docs || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading portfolio:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadPortfolio()
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        loadPortfolio()
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all'
      ? true
      : filter === 'featured'
      ? item.featured
      : item.category === filter

    const matchesSearch = searchTerm === ''
      ? true
      : item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Portfolio Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and showcase your amazing projects
            </p>
          </div>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center px-6 py-3 text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="p-6 mb-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
          <div className="flex flex-col gap-4">
            {/* First Row: Search and View Toggle */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <svg className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden ml-2 sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="hidden ml-2 sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* Second Row: Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('featured')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'featured' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ⭐ Featured ({items.filter(i => i.featured).length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === category 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category} ({items.filter(i => i.category === category).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Items */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-t-green-600 animate-spin"></div>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No projects found matching your search' : 'No portfolio projects yet'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/portfolio/new"
                className="inline-flex items-center px-6 py-3 text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                Create Your First Project
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="overflow-hidden transition-all duration-300 bg-white shadow-xl rounded-xl dark:bg-gray-800 hover:shadow-2xl hover:scale-105">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => toggleFeatured(item.id, item.featured)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        item.featured 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={item.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Category and Tech */}
                  <div className="mb-4 space-y-2">
                    <div className="inline-block">
                      <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.technologies?.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tech.technology}
                        </span>
                      ))}
                      {item.technologies?.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          +{item.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/portfolio/${item.slug}`}
                      target="_blank"
                      className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <Link
                      href={`/admin/portfolio/edit/${item.id}`}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="overflow-hidden bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 min-w-[300px]">
                      Project
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 min-w-[180px]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 min-w-[200px]">
                      Technologies
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 min-w-[120px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 min-w-[100px]">
                      Featured
                    </th>
                    <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 min-w-[150px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        // Check if the click target is not a button or link
                        const target = e.target as HTMLElement;
                        const isButton = target.closest('button, a');
                        if (!isButton) {
                          router.push(`/admin/portfolio/edit/${item.id}`);
                        }
                      }}
                    >
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[280px]">
                            {item.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[180px]">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white rounded-full whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {item.technologies?.slice(0, 2).map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full whitespace-nowrap dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tech.technology}
                            </span>
                          ))}
                          {item.technologies?.length > 2 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium text-gray-500 whitespace-nowrap dark:text-gray-400">
                              +{item.technologies.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[120px]">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium whitespace-nowrap rounded-full ${
                          item.status === 'published' 
                            ? 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200' 
                            : item.status === 'draft'
                            ? 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                            : 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.status === 'published' ? '🟢 Published' : 
                           item.status === 'draft' ? '⚪ Draft' : 
                           '🔴 Archived'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center min-w-[100px]">
                        <button
                          onClick={() => toggleFeatured(item.id, item.featured)}
                          className={`inline-flex p-1.5 rounded-lg transition-all duration-200 ${
                            item.featured 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={item.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/portfolio/${item.slug}`}
                            target="_blank"
                            className="p-2 text-gray-600 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/portfolio/edit/${item.id}`}
                            className="p-2 text-white transition-colors rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-2 text-white transition-colors rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
