'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Edit3,
  Trash2,
  Save,
  FileText,
  X,
  Upload,
  Star,
  Eye,
  Globe,
  Camera,
  Sparkles,
  Loader2
} from 'lucide-react';
import { PortfolioListingPreview, PortfolioDetailPreview } from './PortfolioPreview';

interface CaseStudy {
  id?: number;
  title: string;
  slug?: string;
  clientName?: string;
  clientCategory?: string;
  projectUrl?: string;
  screenshotId?: number;
  screenshotUrl?: string;
  image?: string;
  workType: string;
  technologies: string;
  year?: number;
  duration?: string;
  teamSize?: string;
  role?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  keyFeatures?: string;
  keyAchievements?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  status?: string;
  featured?: boolean | number;
  createdAt?: string;
}

type ViewMode = 'edit' | 'preview-listing' | 'preview-detail';

export default function PortfolioManagementPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'generate'>('manage');
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<CaseStudy | null>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [capturingScreenshot, setCapturingScreenshot] = useState<number | null>(null);
  const [viewModes, setViewModes] = useState<{ [key: number]: ViewMode }>({});
  const [newCaseStudy, setNewCaseStudy] = useState<Partial<CaseStudy>>({
    title: '',
    clientName: '',
    clientCategory: '',
    projectUrl: '',
    workType: '',
    technologies: '',
    year: new Date().getFullYear(),
    challenge: '',
    solution: '',
    results: ''
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setCaseStudies(data.projects || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (study: CaseStudy) => {
    setEditingId(study.id!);
    setEditingData({ ...study });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingData) return;

    try {
      const response = await fetch(`/api/portfolio/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData)
      });

      if (response.ok) {
        setCaseStudies(prev => 
          prev.map(s => s.id === editingId ? editingData : s)
        );
        setEditingId(null);
        setEditingData(null);
      }
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCaseStudies(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  const handlePublish = async (study: CaseStudy) => {
    const newStatus = study.status === 'published' ? 'draft' : 'published';
    
    try {
      const response = await fetch(`/api/portfolio/${study.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setCaseStudies(prev => 
          prev.map(s => s.id === study.id 
            ? { ...s, status: newStatus }
            : s
          )
        );
      }
    } catch (error) {
      console.error('Error publishing case study:', error);
    }
  };

  const handleFeatured = async (study: CaseStudy) => {
    const newFeatured = !study.featured;
    
    try {
      const response = await fetch(`/api/portfolio/${study.id}/featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured })
      });

      if (response.ok) {
        setCaseStudies(prev => 
          prev.map(s => s.id === study.id 
            ? { ...s, featured: newFeatured }
            : s
          )
        );
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const handleCaptureScreenshot = async (study: CaseStudy) => {
    if (!study.id || !study.projectUrl) {
      alert('Please save the project with a URL first');
      return;
    }

    setCapturingScreenshot(study.id);
    
    try {
      const response = await fetch(`/api/portfolio/${study.id}/screenshot`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the case study with the new screenshot
        setCaseStudies(prev => 
          prev.map(s => s.id === study.id 
            ? { ...s, screenshotUrl: data.screenshotUrl }
            : s
          )
        );
        
        // Also update editing data if this is being edited
        if (editingId === study.id && editingData) {
          setEditingData({ ...editingData, screenshotUrl: data.screenshotUrl });
        }
        
        alert('Screenshot captured successfully!');
      } else {
        alert('Failed to capture screenshot. Make sure the URL is accessible.');
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Error capturing screenshot');
    } finally {
      setCapturingScreenshot(null);
    }
  };

  const handleGenerateNew = async () => {
    if (!newCaseStudy.title || !newCaseStudy.clientName) {
      alert('Please fill in at least the title and client name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCaseStudy)
      });

      if (response.ok) {
        const result = await response.json();
        setCaseStudies(prev => [result, ...prev]);
        setShowGenerateForm(false);
        setNewCaseStudy({
          title: '',
          clientName: '',
          clientCategory: '',
          projectUrl: '',
          workType: '',
          technologies: '',
          year: new Date().getFullYear(),
          challenge: '',
          solution: '',
          results: ''
        });
      }
    } catch (error) {
      console.error('Error generating case study:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Portfolio Management</h1>
        <p className="text-gray-600">Manage your portfolio case studies and projects</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Edit3 className="inline w-4 h-4 mr-2" />
          Manage Studies ({caseStudies.length})
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'generate'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Plus className="inline w-4 h-4 mr-2" />
          Add New
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manage' ? (
          <motion.div
            key="manage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {caseStudies.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No case studies yet</p>
                <p className="text-gray-400 mt-2">Add your first case study to get started</p>
              </div>
            ) : (
              caseStudies.map(study => {
                const currentViewMode = viewModes[study.id!] || 'edit';
                
                return (
                <div key={study.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      <button
                        onClick={() => setViewModes({ ...viewModes, [study.id!]: 'edit' })}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          currentViewMode === 'edit'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Edit3 className="inline w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => setViewModes({ ...viewModes, [study.id!]: 'preview-listing' })}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          currentViewMode === 'preview-listing'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Eye className="inline w-4 h-4 mr-2" />
                        Preview Listing
                      </button>
                      <button
                        onClick={() => setViewModes({ ...viewModes, [study.id!]: 'preview-detail' })}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                          currentViewMode === 'preview-detail'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <FileText className="inline w-4 h-4 mr-2" />
                        Preview Detail
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    {currentViewMode === 'edit' && editingId === study.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editingData?.title}
                          onChange={(e) => setEditingData({ ...editingData!, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Title"
                        />
                        <input
                          type="url"
                          value={editingData?.projectUrl}
                          onChange={(e) => setEditingData({ ...editingData!, projectUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Project URL"
                        />
                      </div>
                      
                      {editingData?.screenshotUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={editingData.screenshotUrl} 
                            alt="Project screenshot"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleCaptureScreenshot(editingData as CaseStudy)}
                              disabled={capturingScreenshot === study.id}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                            >
                              {capturingScreenshot === study.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Capturing...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-4 h-4" />
                                  Retake
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-blue-900">Screenshot</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              {editingData?.screenshotUrl ? 'Click "Retake" to update' : 'Capture a screenshot of the project website'}
                            </p>
                          </div>
                          {!editingData?.screenshotUrl && (
                            <button
                              onClick={() => handleCaptureScreenshot(editingData as CaseStudy)}
                              disabled={!editingData?.projectUrl || capturingScreenshot === study.id}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {capturingScreenshot === study.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Capturing...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-4 h-4" />
                                  Capture Screenshot
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <textarea
                        value={editingData?.challenge}
                        onChange={(e) => setEditingData({ ...editingData!, challenge: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Challenge"
                      />
                      <textarea
                        value={editingData?.solution}
                        onChange={(e) => setEditingData({ ...editingData!, solution: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Solution"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingData(null);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : currentViewMode === 'preview-listing' ? (
                    <div className="max-w-md">
                      <h3 className="text-sm font-semibold text-gray-500 mb-4">How it appears on the portfolio page:</h3>
                      <PortfolioListingPreview study={study} />
                    </div>
                  ) : currentViewMode === 'preview-detail' ? (
                    <div className="overflow-auto max-h-[600px] border border-gray-200 rounded-lg p-8 bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-500 mb-4">How it appears on the detail page:</h3>
                      <PortfolioDetailPreview study={study} />
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{study.title}</h3>
                          <p className="text-gray-500 text-sm">
                            {study.clientName} • {study.year} • {study.clientCategory}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFeatured(study)}
                            className={`p-2 rounded-lg transition-colors ${
                              study.featured
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            title={study.featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            <Star className="w-4 h-4" fill={study.featured ? 'currentColor' : 'none'} />
                          </button>
                          
                          {study.projectUrl && (
                            <a
                              href={study.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              title="View live site"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                          
                          {study.status === 'published' && (
                            <a
                              href={`/portfolio/${study.slug || study.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                              title="View case study"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => handlePublish(study)}
                            className={`p-2 rounded-lg transition-colors ${
                              study.status === 'published'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                            title={study.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEdit(study)}
                            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(study.id!)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {study.challenge && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">Challenge</h4>
                          <p className="text-gray-700 text-sm">{study.challenge}</p>
                        </div>
                      )}
                      
                      {study.solution && (
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">Solution</h4>
                          <p className="text-gray-700 text-sm">{study.solution}</p>
                        </div>
                      )}
                      
                      {study.technologies && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {study.technologies.split(',').map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="generate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Case Study</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
                  <input
                    type="text"
                    value={newCaseStudy.title}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="E.g., E-commerce Platform Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name*</label>
                  <input
                    type="text"
                    value={newCaseStudy.clientName}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="E.g., Acme Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                  <input
                    type="url"
                    value={newCaseStudy.projectUrl}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, projectUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newCaseStudy.year}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                  <input
                    type="text"
                    value={newCaseStudy.workType}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, workType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="E.g., Web Development, UI/UX Design"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                  <input
                    type="text"
                    value={newCaseStudy.technologies}
                    onChange={(e) => setNewCaseStudy({ ...newCaseStudy, technologies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="E.g., React, Node.js, PostgreSQL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
                <textarea
                  value={newCaseStudy.challenge}
                  onChange={(e) => setNewCaseStudy({ ...newCaseStudy, challenge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe the main challenge or problem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  value={newCaseStudy.solution}
                  onChange={(e) => setNewCaseStudy({ ...newCaseStudy, solution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe your solution approach"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Results</label>
                <textarea
                  value={newCaseStudy.results}
                  onChange={(e) => setNewCaseStudy({ ...newCaseStudy, results: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe the outcomes and impact"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGenerateNew}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Case Study
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}