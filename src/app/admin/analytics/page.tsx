'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, Users, FileText, PenTool } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    portfolioViews: 0,
    blogViews: 0,
    totalProjects: 0,
    totalPosts: 0,
    publishedProjects: 0,
    publishedPosts: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [portfolioRes, blogRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/blog')
      ]);
      
      const portfolioData = await portfolioRes.json();
      const blogData = await blogRes.json();
      
      setStats({
        portfolioViews: Math.floor(Math.random() * 5000) + 1000, // Mock data
        blogViews: Math.floor(Math.random() * 3000) + 500,
        totalProjects: portfolioData.projects?.length || 0,
        totalPosts: blogData.posts?.length || 0,
        publishedProjects: portfolioData.projects?.filter((p: any) => p.status === 'published').length || 0,
        publishedPosts: blogData.posts?.filter((p: any) => p.status === 'published').length || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Analytics</h1>
        <p className="text-gray-600">Track performance and engagement metrics for your content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm">Portfolio Views</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.portfolioViews.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm">Blog Readers</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.blogViews.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-500">Total Engagement</span>
          </div>
          <h3 className="text-gray-600 text-sm">Total Views</h3>
          <p className="text-2xl font-bold text-gray-800">
            {(stats.portfolioViews + stats.blogViews).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Portfolio Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Projects</span>
              <span className="font-semibold text-gray-800">{stats.totalProjects}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Published</span>
              <span className="font-semibold text-gray-800">{stats.publishedProjects}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Draft</span>
              <span className="font-semibold text-gray-800">
                {stats.totalProjects - stats.publishedProjects}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-purple-500" />
            Blog Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Posts</span>
              <span className="font-semibold text-gray-800">{stats.totalPosts}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Published</span>
              <span className="font-semibold text-gray-800">{stats.publishedPosts}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Draft</span>
              <span className="font-semibold text-gray-800">
                {stats.totalPosts - stats.publishedPosts}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}