'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'

interface CollectionData {
  totalDocs: number
  docs: any[]
}

interface RecentActivity {
  id: string
  type: 'portfolio' | 'blog' | 'category'
  action: 'created' | 'updated' | 'deleted'
  title: string
  timestamp: string
}

export default function AdminDashboard() {
  const [collections, setCollections] = useState<Record<string, CollectionData>>({})
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const router = useRouter()

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      const collectionNames = ['portfolio', 'blog-posts', 'categories', 'authors']
      const data: Record<string, CollectionData> = {}

      for (const name of collectionNames) {
        try {
          const response = await fetch(`/api/${name}`)
          if (response.ok) {
            const result = await response.json()
            data[name] = result
          } else {
            // Set default empty data if endpoint doesn't exist
            data[name] = { totalDocs: 0, docs: [] }
          }
        } catch (err) {
          // Set default empty data if fetch fails
          console.log(`Note: ${name} API endpoint not available`)
          data[name] = { totalDocs: 0, docs: [] }
        }
      }

      setCollections(data)
      
      // Generate mock recent activities
      const activities: RecentActivity[] = []
      if (data.portfolio?.docs?.length > 0) {
        data.portfolio.docs.slice(0, 2).forEach((item: any) => {
          activities.push({
            id: item.id,
            type: 'portfolio',
            action: 'updated',
            title: item.title,
            timestamp: item.updatedAt || new Date().toISOString()
          })
        })
      }
      if (data['blog-posts']?.docs?.length > 0) {
        data['blog-posts'].docs.slice(0, 2).forEach((post: any) => {
          activities.push({
            id: post.id,
            type: 'blog',
            action: 'created',
            title: post.title,
            timestamp: post.createdAt || new Date().toISOString()
          })
        })
      }
      setRecentActivities(activities.slice(0, 5))
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading collections:', error)
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return '✨'
      case 'updated':
        return '📝'
      case 'deleted':
        return '🗑️'
      default:
        return '📌'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'portfolio':
        return 'from-green-500 to-teal-500'
      case 'blog':
        return 'from-purple-500 to-pink-500'
      case 'category':
        return 'from-orange-500 to-red-500'
      default:
        return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back to CVC Admin
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your content today
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-t-blue-600 animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Portfolio Projects"
                value={collections.portfolio?.totalDocs || 0}
                change="+12%"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                gradient="from-green-500 to-teal-500"
              />
              
              <StatsCard
                title="Blog Posts"
                value={collections['blog-posts']?.totalDocs || 0}
                change="+23%"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                gradient="from-purple-500 to-pink-500"
              />
              
              <StatsCard
                title="Categories"
                value={collections.categories?.totalDocs || 0}
                change="+5%"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                }
                gradient="from-orange-500 to-red-500"
              />
              
              <StatsCard
                title="Total Authors"
                value={collections.authors?.totalDocs || 0}
                change="+2"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                gradient="from-indigo-500 to-blue-500"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Activity
                    </h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      View all →
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start p-4 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className={`p-2 bg-gradient-to-r ${getTypeColor(activity.type)} rounded-lg shadow-md`}>
                            <span className="text-lg text-white">{getActionIcon(activity.action)}</span>
                          </div>
                          <div className="flex-1 ml-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.action} in {activity.type} • {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400">
                        No recent activity
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Quick Actions
                  </h2>
                  
                  <div className="space-y-3">
                    <Link 
                      href="/admin/portfolio/new"
                      className="flex items-center p-3 transition-all duration-200 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30 group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-gray-900 dark:text-white">
                        Add Portfolio Project
                      </span>
                    </Link>
                    
                    <Link 
                      href="/admin/blog/new"
                      className="flex items-center p-3 transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-gray-900 dark:text-white">
                        Create Blog Post
                      </span>
                    </Link>
                  </div>
                </div>

                {/* System Status */}
                <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    System Status
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                      <span className="flex items-center text-sm font-medium text-green-600">
                        <span className="w-2 h-2 mr-2 bg-green-600 rounded-full animate-pulse"></span>
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                      <span className="flex items-center text-sm font-medium text-green-600">
                        <span className="w-2 h-2 mr-2 bg-green-600 rounded-full animate-pulse"></span>
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
                      <span className="flex items-center text-sm font-medium text-yellow-600">
                        <span className="w-2 h-2 mr-2 bg-yellow-600 rounded-full"></span>
                        Warming
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Overview */}
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              {/* Portfolio Overview */}
              <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Latest Portfolio Projects
                  </h2>
                  <Link 
                    href="/admin/portfolio"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    View all →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {collections.portfolio?.docs?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="p-3 transition-colors rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                        </div>
                        <div className="flex gap-2">
                          {item.featured && (
                            <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                              Featured
                            </span>
                          )}
                          <Link 
                            href={`/admin/portfolio/edit/${item.id}`}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!collections.portfolio?.docs || collections.portfolio.docs.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400">No portfolio projects yet</p>
                  )}
                </div>
              </div>

              {/* Blog Overview */}
              <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Blog Posts
                  </h2>
                  <Link 
                    href="/admin/blog"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    View all →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {collections['blog-posts']?.docs?.slice(0, 3).map((post: any) => (
                    <div key={post.id} className="p-3 transition-colors rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {post.status === 'published' ? '✅ Published' : '📝 Draft'}
                          </p>
                        </div>
                        <Link 
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {(!collections['blog-posts']?.docs || collections['blog-posts'].docs.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400">No blog posts yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
