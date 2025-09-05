'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  PenTool,
  Send,
  RefreshCw,
  FileText
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'published';
  author: string;
  createdAt: string;
  estimatedReadTime: number;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/blog${filter !== 'all' ? `?status=${filter}` : ''}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      fetchPosts();
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`/api/blog/${id}`, { method: 'DELETE' });
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });
      fetchPosts();
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft': return <PenTool className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'published': return <Send className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Blog Management</h1>
        <p className="text-gray-600">Manage your blog posts and articles</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'pending', 'approved', 'published'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Link 
            href="/admin/blog/generate"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate with AI
          </Link>
          <button 
            onClick={() => window.location.href='/admin/blog/new'}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No blog posts found</p>
          <p className="text-gray-400 mt-2">Create your first blog post to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className={`${getStatusColor(post.status)} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
                  {getStatusIcon(post.status)}
                  {post.status}
                </span>
                <span className="text-gray-500 text-xs">{post.estimatedReadTime} min read</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{post.category}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href=`/admin/blog/edit/${post.id}`}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded text-center transition-colors"
                >
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
                <Link
                  href={`/blog/${post.id}`}
                  target="_blank"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded text-center transition-colors"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </Link>
                
                {post.status === 'draft' && (
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 rounded transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mx-auto" />
                  </button>
                )}
                
                {(post.status === 'approved' || post.status === 'pending') && (
                  <button
                    onClick={() => handlePublish(post.id)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded transition-colors"
                  >
                    <Send className="w-4 h-4 mx-auto" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}