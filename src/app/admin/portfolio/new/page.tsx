'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Select, { MultiValue } from 'react-select'

interface PortfolioItem {
  title: string
  slug: string
  description: string
  longDescription?: string
  category: string | string[]
  clientCategory?: string | string[]
  technologies: string[]
  featured: boolean
  status: string
  liveUrl?: string
  githubUrl?: string
  image?: string
  keyAchievements?: string[]
}

export default function NewPortfolioItem() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PortfolioItem>({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: [],
    clientCategory: [],
    technologies: [],
    featured: false,
    status: 'draft',
    liveUrl: '',
    githubUrl: '',
    image: '',
    keyAchievements: []
  })
  
  const [techInput, setTechInput] = useState('')
  const [achievementInput, setAchievementInput] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [refinePrompt, setRefinePrompt] = useState('')

  // Options for Select2 dropdowns
  const projectCategoryOptions = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'E-Commerce', label: 'E-Commerce' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Design', label: 'Design' },
    { value: 'SaaS', label: 'SaaS Platform' },
    { value: 'Enterprise', label: 'Enterprise Solution' },
    { value: 'API Development', label: 'API Development' },
    { value: 'Database Design', label: 'Database Design' },
    { value: 'Cloud Infrastructure', label: 'Cloud Infrastructure' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Security', label: 'Security' },
    { value: 'Blockchain', label: 'Blockchain' },
    { value: 'IoT', label: 'IoT' }
  ]

  const clientCategoryOptions = [
    { value: 'Startup', label: 'Startup' },
    { value: 'Small Business', label: 'Small Business' },
    { value: 'Medium Business', label: 'Medium Business' },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Non-Profit', label: 'Non-Profit' },
    { value: 'Government', label: 'Government' },
    { value: 'Education', label: 'Education' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'Media & Entertainment', label: 'Media & Entertainment' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Personal', label: 'Personal Project' }
  ]

  // Custom styles for react-select to match dark mode
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'rgb(243 244 246)',
      borderColor: state.isFocused ? 'rgb(34 197 94)' : 'transparent',
      boxShadow: state.isFocused ? '0 0 0 2px rgb(34 197 94)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'rgb(34 197 94)' : 'transparent'
      },
      '.dark &': {
        backgroundColor: 'rgb(55 65 81)',
        borderColor: state.isFocused ? 'rgb(34 197 94)' : 'transparent'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      '.dark &': {
        backgroundColor: 'rgb(55 65 81)'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? 'rgb(34 197 94)' : state.isFocused ? 'rgb(243 244 246)' : 'transparent',
      color: state.isSelected ? 'white' : 'rgb(17 24 39)',
      '.dark &': {
        backgroundColor: state.isSelected ? 'rgb(34 197 94)' : state.isFocused ? 'rgb(75 85 99)' : 'transparent',
        color: state.isSelected ? 'white' : 'rgb(243 244 246)'
      }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'rgb(220 252 231)',
      '.dark &': {
        backgroundColor: 'rgb(20 83 45)'
      }
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'rgb(22 101 52)',
      '.dark &': {
        color: 'rgb(187 247 208)'
      }
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'rgb(22 101 52)',
      '&:hover': {
        backgroundColor: 'rgb(187 247 208)',
        color: 'rgb(22 101 52)'
      },
      '.dark &': {
        color: 'rgb(187 247 208)',
        '&:hover': {
          backgroundColor: 'rgb(22 101 52)',
          color: 'rgb(187 247 208)'
        }
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'rgb(156 163 175)',
      '.dark &': {
        color: 'rgb(156 163 175)'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: 'rgb(17 24 39)',
      '.dark &': {
        color: 'rgb(243 244 246)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'rgb(17 24 39)',
      '.dark &': {
        color: 'rgb(243 244 246)'
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/portfolio')
      }
    } catch (error) {
      console.error('Error creating portfolio item:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    setFormData({ ...formData, slug })
  }

  const generateDescription = async () => {
    setGenerating('description')
    try {
      const response = await fetch('/api/portfolio/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          technologies: formData.technologies,
          category: formData.category,
          longDescription: formData.longDescription,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, description: data.description })
      }
    } catch (error) {
      console.error('Error generating description:', error)
    } finally {
      setGenerating(null)
    }
  }

  const generateLongDescription = async () => {
    setGenerating('longDescription')
    try {
      const response = await fetch('/api/portfolio/generate-long-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          technologies: formData.technologies,
          category: formData.category,
          clientCategory: formData.clientCategory,
          description: formData.description,
          achievements: formData.keyAchievements,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, longDescription: data.longDescription })
      }
    } catch (error) {
      console.error('Error generating long description:', error)
    } finally {
      setGenerating(null)
    }
  }

  const generateAchievements = async () => {
    setGenerating('achievements')
    try {
      const response = await fetch('/api/portfolio/generate-achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          technologies: formData.technologies,
          category: formData.category,
          description: formData.description,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, keyAchievements: data.achievements })
      }
    } catch (error) {
      console.error('Error generating achievements:', error)
    } finally {
      setGenerating(null)
    }
  }

  const fetchWebsiteMetadata = async (useAI: boolean = true) => {
    if (!formData.liveUrl) {
      alert('Please enter a URL first');
      return;
    }

    setFetchingMetadata(true);
    try {
      // Use AI analysis endpoint for comprehensive analysis
      const endpoint = useAI ? '/api/portfolio/analyze-website' : '/api/portfolio/fetch-metadata';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.liveUrl, refinePrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.metadata) {
          const { metadata } = data;

          // Auto-populate fields with AI-analyzed data
          setFormData(prev => ({
            ...prev,
            title: metadata.title || prev.title,
            custom_subtitle: metadata.subtitle || prev.custom_subtitle,
            slug: metadata.slug || prev.slug,
            description: metadata.description || prev.description,
            longDescription: metadata.longDescription || prev.longDescription,
            category: metadata.categories || prev.category,
            clientCategory: metadata.clientCategories || prev.clientCategory,
            technologies: metadata.technologies || prev.technologies,
            keyAchievements: metadata.keyAchievements || prev.keyAchievements,
            image: metadata.image || prev.image,
          }));

          // Show success message with AI context
          if (useAI && metadata.clientType) {
            alert(`✨ AI Analysis Complete!\n\nDetected: ${metadata.clientType}\n\nAll fields have been populated based on AI analysis of the website. Review and adjust as needed.`);
          } else {
            alert('Website information fetched successfully! Review and adjust the populated fields as needed.');
          }
        }
      } else {
        const error = await response.json();
        if (useAI && error.error?.includes('AI')) {
          // Fallback to basic fetch if AI fails
          console.log('AI analysis failed, falling back to basic metadata fetch');
          fetchWebsiteMetadata(false);
        } else {
          alert(`Failed to analyze website: ${error.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      if (useAI) {
        // Try fallback to basic fetch
        console.log('Error with AI analysis, trying basic fetch');
        fetchWebsiteMetadata(false);
      } else {
        alert('Error fetching website metadata. Please check the URL and try again.');
      }
    } finally {
      setFetchingMetadata(false);
    }
  };

  const generateScreenshot = async () => {
    if (!formData.liveUrl) {
      alert('Please enter a Live URL first')
      return
    }
    
    setGenerating('screenshot')
    try {
      const response = await fetch('/api/portfolio/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.liveUrl }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, image: data.screenshotUrl })
        
        // Only show message if it's a warning about placeholder
        if (data.service === 'placeholder' && data.message) {
          alert(data.message)
        } else if (data.service) {
          // Show success message for real screenshot
          console.log(`Screenshot captured successfully using ${data.service}`)
        }
      } else {
        alert('Failed to generate screenshot. Please try again.')
      }
    } catch (error) {
      console.error('Error generating screenshot:', error)
      alert('Error generating screenshot. Please check the URL and try again.')
    } finally {
      setGenerating(null)
    }
  }

  const handleAddAchievement = () => {
    if (achievementInput.trim() && (!formData.keyAchievements || !formData.keyAchievements.includes(achievementInput.trim()))) {
      setFormData({
        ...formData,
        keyAchievements: [...(formData.keyAchievements || []), achievementInput.trim()]
      })
      setAchievementInput('')
    }
  }

  const handleRemoveAchievement = (achievement: string) => {
    setFormData({
      ...formData,
      keyAchievements: formData.keyAchievements?.filter(a => a !== achievement) || []
    })
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Create New Portfolio Item
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add a new project to showcase your amazing work
          </p>
        </div>

        {/* Form with Sidebar Layout */}
        <form onSubmit={handleSubmit} className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
          {/* Basic Information Card */}
          <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Basic Information
            </h2>
            
            <div className="space-y-4">
              {/* Live URL - First field */}
              <div className="p-4 mb-4 border-2 border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                <label className="block mb-2 text-base font-semibold text-purple-700 dark:text-purple-300">
                  📌 Website URL - Start Here First!
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.liveUrl || ''}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="flex-1 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => fetchWebsiteMetadata(true)}
                      disabled={fetchingMetadata || !formData.liveUrl}
                      className="px-6 py-3 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {fetchingMetadata ? (
                        <>
                          <svg className="inline w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI Analyzing...
                        </>
                      ) : (
                        '✨ AI Analyze'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🤖 <strong>AI-Powered Analysis:</strong> Enter a website URL and click "AI Analyze" to automatically detect technologies, understand the business context, and generate a complete case study description. Perfect for websites you've built!
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Will be auto-populated from website"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Subtitle
                </label>
                <input
                  type="text"
                  value={formData.custom_subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, custom_subtitle: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Will be auto-populated from website - A compelling tagline"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-3 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Project Categories */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Categories * (Select two)
                </label>
                <Select
                  isMulti
                  options={projectCategoryOptions}
                  value={projectCategoryOptions.filter(option => 
                    Array.isArray(formData.category) && formData.category.includes(option.value)
                  )}
                  onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    if (values.length <= 2) {
                      setFormData({ ...formData, category: values });
                    }
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Search and select two project categories..."
                  noOptionsMessage={() => "No categories found"}
                  isOptionDisabled={() => Array.isArray(formData.category) && formData.category.length >= 2}
                  styles={selectStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    colors: {
                      ...theme.colors,
                      primary: 'rgb(34 197 94)',
                      primary25: 'rgb(220 252 231)',
                      primary50: 'rgb(187 247 208)',
                      primary75: 'rgb(134 239 172)'
                    }
                  })}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You can select up to 2 project categories
                </p>
              </div>

              {/* Client Categories */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Client Categories (Select two)
                </label>
                <Select
                  isMulti
                  options={clientCategoryOptions}
                  value={clientCategoryOptions.filter(option => 
                    Array.isArray(formData.clientCategory) && formData.clientCategory.includes(option.value)
                  )}
                  onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    if (values.length <= 2) {
                      setFormData({ ...formData, clientCategory: values });
                    }
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Search and select two client categories..."
                  noOptionsMessage={() => "No categories found"}
                  isOptionDisabled={() => Array.isArray(formData.clientCategory) && formData.clientCategory.length >= 2}
                  styles={selectStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 8,
                    colors: {
                      ...theme.colors,
                      primary: 'rgb(59 130 246)',
                      primary25: 'rgb(219 234 254)',
                      primary50: 'rgb(191 219 254)',
                      primary75: 'rgb(147 197 253)'
                    }
                  })}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You can select up to 2 client categories
                </p>
              </div>

            </div>
          </div>

          {/* Description Card */}
          <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Description
            </h2>

            <div className="space-y-4">
              {/* Refine Prompt Field */}
              <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <label className="block mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  🎯 Refine AI Prompt (Optional)
                </label>
                <textarea
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  rows={2}
                  placeholder="Add specific context to improve AI analysis. E.g., 'This is a nonprofit website for wildlife conservation. Focus on the environmental impact and donation features.'"
                  className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Provide additional context about the client, special features, or specific aspects you want the AI to focus on.
                </p>
                {refinePrompt && (
                  <button
                    type="button"
                    onClick={() => fetchWebsiteMetadata(true)}
                    disabled={fetchingMetadata || !formData.liveUrl}
                    className="px-4 py-2 mt-2 text-sm text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔄 Re-analyze with Context
                  </button>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Description *
                </label>
                <div className="space-y-2">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Will be auto-populated from website"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generating === 'description'}
                    className="px-4 py-2 text-sm text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating === 'description' ? '🤖 Generating...' : '✨ Generate AI Description'}
                  </button>
                </div>
              </div>

              {/* Long Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detailed Description
                </label>
                <div className="space-y-2">
                  <textarea
                    value={formData.longDescription || ''}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Provide a comprehensive description of the project, including the problem solved, approach taken, and impact delivered..."
                  />
                  <button
                    type="button"
                    onClick={generateLongDescription}
                    disabled={generating === 'longDescription'}
                    className="px-4 py-2 text-sm text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating === 'longDescription' ? '🤖 Generating...' : '📝 Generate Detailed Description'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technologies Card */}
          <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Technologies
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add Technology
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                    placeholder="e.g. React, Node.js, PostgreSQL"
                    className="flex-1 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnology}
                    className="px-6 py-3 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Achievements Card */}
          <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Key Achievements
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add Achievement
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                    placeholder="e.g. Improved performance by 50%"
                    className="flex-1 px-4 py-3 text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-6 py-3 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    Add
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generateAchievements}
                  disabled={generating === 'achievements'}
                  className="px-4 py-2 mt-2 text-sm text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating === 'achievements' ? '🤖 Generating...' : '🎯 Generate AI Achievements'}
                </button>
              </div>

              {/* Achievement List */}
              <div className="space-y-2">
                {formData.keyAchievements?.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <span className="flex-shrink-0 w-6 h-6 mt-0.5 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {achievement}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(achievement)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {(!formData.keyAchievements || formData.keyAchievements.length === 0) && (
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">
                    No achievements added yet. Add them manually or generate with AI.
                  </p>
                )}
              </div>
            </div>
          </div>

          </div>

          {/* Right Sidebar - Publishing Tools */}
          <div className="space-y-6 w-80">
            {/* Publish Card */}
            <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Publish
              </h2>
              
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formData.status === 'published' ? '🟢 Published' : formData.status === 'draft' ? '⚪ Draft' : '🔴 Archived'}
                  </span>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Change Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="py-3 border-t dark:border-gray-700">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Feature on homepage
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2 border-t dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push('/admin/portfolio')}
                    className="w-full px-4 py-2 text-sm text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Featured Image
              </h2>
              
              <div className="space-y-4">
                {formData.image ? (
                  <div className="relative">
                    <img 
                      src={formData.image} 
                      alt="Featured" 
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/4F46E5/ffffff?text=No+Image'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg dark:bg-gray-700">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No image set</p>
                    </div>
                  </div>
                )}

                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {formData.liveUrl && (
                  <button
                    type="button"
                    onClick={generateScreenshot}
                    disabled={generating === 'screenshot'}
                    className="w-full px-3 py-2 text-sm text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating === 'screenshot' ? '📸 Capturing...' : '📷 Generate from Live URL'}
                  </button>
                )}
              </div>
            </div>

            {/* Project Links Card */}
            <div className="p-6 bg-white shadow-xl rounded-xl dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Additional Links
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
