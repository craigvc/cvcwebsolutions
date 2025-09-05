'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Calendar, Users, Award } from 'lucide-react'

// Project interface for type safety
interface Project {
  title: string
  category: string
  clientCategory?: string // From marketing suite
  description: string
  image: string
  tags: string[]
  featured?: boolean
  url?: string
  year: string
  achievements: string[]
  challenge?: string
  solution?: string
  technologies?: string[]
}

const projects: Project[] = [
  {
    title: 'Vumba.io',
    category: 'EdTech Platform',
    description: 'Digital education delivery platform for conservation NGOs, connecting organizations with youth to drive environmental engagement and career opportunities.',
    image: '/portfolio/vumba.jpg',
    tags: ['WordPress', 'Custom Development', 'Student Tracking', 'NGO Tools'],
    featured: true,
    url: 'https://vumba.io',
    year: '2024',
    achievements: [
      '10,000+ Students Supported',
      'NGO Collaboration Tools',
      'Impact Measurement System',
      'Digital CV Generation',
      'Career Tracking Platform'
    ],
    challenge: 'Conservation NGOs needed a comprehensive platform to track student progress, measure educational impact, and facilitate collaboration between organizations.',
    solution: 'Built a full-featured educational platform with student tracking, digital CV generation, collaboration tools, and comprehensive impact measurement capabilities.',
    technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'Custom API Development']
  },
  {
    title: 'Global Conservation Corps',
    category: 'Nonprofit Website',
    description: 'Conservation education nonprofit website bridging communities and wildlife through education, technology, and partnerships.',
    image: '/portfolio/gcc.jpg',
    tags: ['WordPress', 'Multimedia Integration', 'Donation Platform', 'Content Management'],
    featured: true,
    url: 'https://globalconservationcorps.org',
    year: '2023',
    achievements: [
      '15,000+ Youth Impacted',
      'Documentary Production Platform',
      'Podcast Integration',
      'Future Rangers Program Portal',
      'Donor Impact Tracking'
    ],
    challenge: 'A growing conservation organization needed a professional website to showcase their programs, manage donations, and integrate multimedia content like documentaries and podcasts.',
    solution: 'Developed a comprehensive nonprofit website with donation management, program showcases, multimedia integration, and transparent impact reporting.',
    technologies: ['WordPress', 'WooCommerce', 'Custom Themes', 'Payment Integration', 'Media Management']
  },
  {
    title: 'Ludke Consulting',
    category: 'Sustainability Consulting',
    description: 'Professional consulting website specializing in sustainability strategy, ESG consulting, and market transformation for lasting societal value.',
    image: '/portfolio/ludke.jpg',
    tags: ['WordPress', 'Responsive Design', 'Book Integration', 'Analytics'],
    featured: true,
    url: 'https://ludkeconsulting.com',
    year: '2023',
    achievements: [
      'Published Book Integration',
      'ESG Strategy Tools',
      'Market Transformation Focus',
      'Thought Leadership Platform',
      'Strategic Consulting Portal'
    ],
    challenge: 'A sustainability consulting firm needed a professional platform to showcase expertise, promote published works, and attract clients focused on environmental and social governance.',
    solution: 'Created a sophisticated consulting website with integrated book promotion, thought leadership content, and strategic messaging for sustainability transformation.',
    technologies: ['WordPress', 'Revolution Slider', 'Google Analytics', 'Schema.org', 'Responsive Design']
  },
  {
    title: 'Head Rush Technologies',
    category: 'E-Commerce Platform',
    description: 'Advanced safety equipment e-commerce platform specializing in magnetic braking systems for adventure sports and professional safety.',
    image: '/portfolio/headrush.jpg',
    tags: ['Magento', 'E-Commerce', 'Multilingual', 'Product Management'],
    featured: true,
    url: 'https://headrushtech.com',
    year: '2023',
    achievements: [
      '#1 Auto Belay in the World',
      'Magnetic Braking Technology',
      'Multilingual Support',
      'Professional Safety Standards',
      'Global Market Reach'
    ],
    challenge: 'A technology company needed a sophisticated e-commerce platform to sell specialized safety equipment globally with complex product configurations and multilingual support.',
    solution: 'Built a comprehensive Magento-based e-commerce platform with advanced product management, multilingual capabilities, and specialized safety equipment categorization.',
    technologies: ['Magento', 'JavaScript', 'Google Tag Manager', 'WebFont', 'Responsive Design']
  },
  {
    title: 'Auto Air Con Parts',
    category: 'E-Commerce Platform',
    description: 'Specialized automotive parts e-commerce platform with over 70,000 air conditioning components and advanced search functionality.',
    image: '/portfolio/autoaircon.jpg',
    tags: ['Magento', 'E-Commerce', 'Search Integration', 'Automotive'],
    featured: true,
    url: 'https://autoairconparts.co.uk',
    year: '2022',
    achievements: [
      '70,000+ Parts Catalog',
      '4.8/5 Customer Rating',
      'Trading Since 1988',
      '10,000+ Compressors in Stock',
      'Next-Day Delivery Service'
    ],
    challenge: 'An established automotive parts supplier needed a robust e-commerce platform to manage a massive inventory of air conditioning parts with sophisticated search and filtering capabilities.',
    solution: 'Developed a comprehensive Magento e-commerce solution with Algolia search integration, advanced filtering, and streamlined purchasing for automotive professionals and consumers.',
    technologies: ['Magento', 'Algolia Search', 'Google Tag Manager', 'JavaScript', 'Responsive Design']
  },
  {
    title: 'Vumba Mobile App',
    category: 'Mobile Application',
    description: 'Native iOS application for educators to streamline program delivery, attendance tracking, and educational resource management.',
    image: '/portfolio/vumba-app.jpg',
    tags: ['iOS Development', 'Mobile App', 'Education Technology', 'Real-time Tracking'],
    featured: true,
    url: 'https://apps.apple.com/us/app/vumba/id6502340034',
    year: '2024',
    achievements: [
      'App Store Published',
      'Real-time Attendance Tracking',
      'Cloud Resource Integration',
      'Mobile-Optimized Interface',
      'Educator Workflow Tools'
    ],
    challenge: 'Educators needed a mobile solution to manage programs, track attendance, and access resources efficiently while away from desktop computers.',
    solution: 'Developed a comprehensive iOS application with real-time tracking capabilities, cloud integration, and intuitive mobile interface designed specifically for educational workflows.',
    technologies: ['iOS Development', 'Swift', 'Cloud Integration', 'Real-time Sync', 'Mobile UI/UX']
  },
  {
    title: 'Pyke Presley Associates App',
    category: 'Mobile Application',
    description: 'Professional client service app for estate planning and healthcare document management with secure client communication.',
    image: '/portfolio/pyke-app.jpg',
    tags: ['iOS Development', 'Document Management', 'Legal Tech', 'Client Portal'],
    featured: true,
    url: 'https://apps.apple.com/us/app/pyke-presley-associates-app/id1594080138',
    year: '2021',
    achievements: [
      'App Store Published',
      '24/7 Document Access',
      'Secure Client Communication',
      'Estate Planning Integration',
      'Healthcare Document Management'
    ],
    challenge: 'A law firm needed a secure mobile solution for clients to access estate planning documents, manage healthcare directives, and maintain communication with legal professionals.',
    solution: 'Developed a comprehensive client service app with secure document management, appointment scheduling, and direct communication features tailored for estate planning services.',
    technologies: ['iOS Development', 'Swift', 'Secure Document Storage', 'Client Portal', 'Legal Compliance']
  },
  {
    title: 'Iris Pricing Solutions',
    category: 'Business Consulting Website',
    description: 'Global pricing consultancy website delivering strategic pricing solutions with 30+ years of expertise and 1000+ completed projects.',
    image: '/portfolio/pricing-solutions.jpg',
    tags: ['WordPress', 'Business Intelligence', 'Analytics Integration', 'Global Consulting'],
    featured: true,
    url: 'https://www.pricingsolutions.com/',
    year: '2023',
    achievements: [
      '30+ Years of Expertise',
      '1000+ Completed Projects',
      '25+ Industries Served',
      '10:1 ROI on Solutions',
      'Global Market Presence'
    ],
    challenge: 'A leading pricing consultancy needed a sophisticated website to showcase their global expertise, industry-specific solutions, and proprietary pricing tools across multiple markets.',
    solution: 'Built a comprehensive WordPress-based consultancy website with detailed industry showcases, pricing tools integration, global presence mapping, and lead generation capabilities.',
    technologies: ['WordPress', 'Google Analytics', 'Google Tag Manager', 'Gravity Forms', 'Custom JavaScript']
  },
  {
    title: 'Vixen Capital Advisors',
    category: 'Financial Services Website',
    description: 'Venture capital firm website showcasing investment portfolio and founder expertise with 30+ years of financial experience.',
    image: '/portfolio/vixen-capital.jpg',
    tags: ['WordPress', 'Financial Services', 'Venture Capital', 'Professional Services'],
    featured: true,
    url: 'https://vixen-capital-advisors.com/',
    year: '2023',
    achievements: [
      '30+ Years Financial Experience',
      'Diverse Investment Portfolio',
      'Female Leadership Focus',
      'Startup Mentorship Platform',
      'Professional Recognition'
    ],
    challenge: 'A venture capital firm needed a professional website to showcase their investment approach, portfolio companies, and founder expertise while building credibility with potential startup partners.',
    solution: 'Created a sophisticated financial services website with detailed founder biography, portfolio showcase, investment philosophy presentation, and professional contact capabilities.',
    technologies: ['WordPress', 'JSON-LD Structured Data', 'Responsive Design', 'Mobile Optimization', 'SEO Integration']
  },
  {
    title: 'Tombstone Productions',
    category: 'Arts Education Website',
    description: 'Professional arts education organization website for performing arts programs, youth development, and theatrical productions.',
    image: '/portfolio/tombstone.jpg',
    tags: ['WordPress', 'Arts Education', 'Community Programs', 'Registration Systems'],
    featured: true,
    url: 'https://toombstoneproductions.com/',
    year: '2023',
    achievements: [
      'American Theatre Magazine Recognition',
      '40+ Productions Directed',
      '10+ Original Plays',
      'National Arts Recognition',
      'Youth Program Development'
    ],
    challenge: 'An arts education organization needed a professional website to showcase programs, facilitate registration, and highlight the founder\'s national recognition in theatre education.',
    solution: 'Built a comprehensive WordPress website with program showcases, registration integration, professional testimonials, and founder biography highlighting national recognition.',
    technologies: ['WordPress', 'Google Analytics', 'Google Forms Integration', 'Responsive Design', 'Mobile Optimization']
  },
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Full-stack e-commerce solution with advanced inventory management and multi-vendor capabilities.',
    image: '/portfolio/ecommerce.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    year: '2023',
    achievements: [
      'Multi-vendor Marketplace',
      'Advanced Inventory System',
      'Payment Gateway Integration',
      'Real-time Analytics Dashboard'
    ],
    challenge: 'Client needed a scalable e-commerce platform supporting multiple vendors with complex inventory management.',
    solution: 'Built a modern React-based e-commerce platform with Node.js backend, supporting multiple vendors and advanced inventory tracking.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redux', 'Express']
  },
  {
    title: 'Healthcare Management Portal',
    category: 'Web Application',
    description: 'Comprehensive patient management system with telemedicine features and appointment scheduling.',
    image: '/portfolio/healthcare.jpg',
    tags: ['Next.js', 'Python', 'PostgreSQL', 'HIPAA Compliant'],
    year: '2022',
    achievements: [
      'HIPAA Compliant Architecture',
      'Telemedicine Integration',
      'Automated Appointment System',
      'Patient Portal Dashboard'
    ],
    challenge: 'Healthcare provider needed a secure, compliant system for patient management and telemedicine consultations.',
    solution: 'Developed a HIPAA-compliant healthcare platform with secure patient portals, telemedicine capabilities, and comprehensive management tools.',
    technologies: ['Next.js', 'Python', 'PostgreSQL', 'WebRTC', 'HIPAA Security']
  },
  {
    title: 'Real Estate Platform',
    category: 'Full Stack Application',
    description: 'Property listing and management platform with advanced search and virtual tour capabilities.',
    image: '/portfolio/realestate.jpg',
    tags: ['Vue.js', 'Laravel', 'MySQL', 'Maps Integration'],
    year: '2022',
    achievements: [
      'Advanced Property Search',
      'Virtual Tour Integration',
      'Agent Management System',
      'Lead Generation Tools'
    ],
    challenge: 'Real estate agency needed a modern platform for property listings with advanced search and virtual tour capabilities.',
    solution: 'Built a comprehensive real estate platform with Vue.js frontend and Laravel backend, featuring advanced search and virtual tours.',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Google Maps API', 'Virtual Tour SDK']
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    description: 'Secure banking application for iOS and Android with biometric authentication and real-time transactions.',
    image: '/portfolio/banking.jpg',
    tags: ['React Native', 'TypeScript', 'AWS', 'Security'],
    year: '2021',
    achievements: [
      'Biometric Authentication',
      'Real-time Transactions',
      'Multi-factor Security',
      'Cross-platform Compatibility'
    ],
    challenge: 'Financial institution required a secure mobile banking solution with advanced security features and real-time capabilities.',
    solution: 'Developed a React Native banking app with biometric authentication, real-time transactions, and enterprise-grade security.',
    technologies: ['React Native', 'TypeScript', 'AWS', 'Biometric APIs', 'Encryption']
  }
]

// Extract unique categories and create simplified category groups
// These match the client categories in the marketing suite for consistency
const categories = [
  { value: 'all', label: 'Featured Projects' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Apps', label: 'Mobile Apps' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'Education & Nonprofit', label: 'Education & Nonprofit' },
  { value: 'Business & Consulting', label: 'Business & Consulting' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Financial Services', label: 'Financial Services' },
  { value: 'Arts & Creative', label: 'Arts & Creative' }
]

// Helper function to determine category group
// This maps various project categories to our standardized categories
const getCategoryGroup = (project: Project) => {
  const cat = project.category.toLowerCase()
  
  // Check for direct category matches first (for projects from marketing suite)
  if (project.clientCategory) {
    return project.clientCategory
  }
  
  // Otherwise map based on category field
  if (cat.includes('mobile')) return 'Mobile Apps'
  if (cat.includes('commerce')) return 'E-Commerce'
  if (cat.includes('edtech') || cat.includes('education') || cat.includes('nonprofit')) return 'Education & Nonprofit'
  if (cat.includes('business') || cat.includes('consulting') || cat.includes('sustainability')) return 'Business & Consulting'
  if (cat.includes('healthcare')) return 'Healthcare'
  if (cat.includes('financial') || cat.includes('banking')) return 'Financial Services'
  if (cat.includes('arts')) return 'Arts & Creative'
  if (cat.includes('web') || cat.includes('full stack')) return 'Web Development'
  return 'Web Development' // default
}

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [marketingSuiteProjects, setMarketingSuiteProjects] = useState<Project[]>([])
  
  // Fetch projects from marketing suite
  useEffect(() => {
    const fetchMarketingSuiteProjects = async () => {
      try {
        const response = await fetch('/api/portfolio')
        const data = await response.json()
        console.log('Marketing suite API response:', data)
        if (data.success && data.projects) {
          console.log('Setting marketing suite projects:', data.projects.length, 'projects')
          // Transform projects to ensure arrays for achievements, technologies, and tags
          const transformedProjects = data.projects.map((project: any) => ({
            ...project,
            achievements: Array.isArray(project.achievements) 
              ? project.achievements 
              : typeof project.achievements === 'string' && project.achievements
                ? project.achievements.split(',').map((a: string) => a.trim()).filter((a: string) => a)
                : [],
            technologies: Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === 'string' && project.technologies
                ? project.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                : [],
            tags: Array.isArray(project.tags)
              ? project.tags
              : typeof project.tags === 'string' && project.tags
                ? project.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
                : []
          }))
          setMarketingSuiteProjects(transformedProjects)
        }
      } catch (error) {
        console.error('Error fetching marketing suite projects:', error)
        // Silently fail - the hardcoded projects will still show
      }
    }
    
    fetchMarketingSuiteProjects()
  }, [])
  
  // Combine hardcoded projects with marketing suite projects
  // Helper function to ensure arrays
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value) {
      return value.split(',').map(v => v.trim()).filter(v => v);
    }
    return [];
  };

  // Ensure all projects have arrays for critical fields
  const normalizedProjects = [...projects, ...marketingSuiteProjects].map(project => ({
    ...project,
    achievements: ensureArray(project.achievements),
    technologies: ensureArray(project.technologies),
    tags: ensureArray(project.tags)
  }));
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'all' 
    ? normalizedProjects 
    : normalizedProjects.filter(project => getCategoryGroup(project) === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our
              <span className="block gradient-text">Portfolio</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Showcasing our expertise across diverse industries and technologies. 
              From conservation education platforms to enterprise applications.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center text-center">
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">25,000+</div>
                <div className="text-gray-300">Lives Impacted</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">50+</div>
                <div className="text-gray-300">Projects Delivered</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">20+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'glass text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.label}
                {category.value !== 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({normalizedProjects.filter(p => getCategoryGroup(p) === category.value).length})
                  </span>
                )}
                {category.value === 'all' && (
                  <span className="ml-2 text-xs opacity-70">
                    ({normalizedProjects.length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-300">
              Our most impactful work making a real difference
            </p>
          </motion.div>

          {filteredProjects.filter(project => project.featured).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">No featured projects in this category.</p>
            </motion.div>
          ) : (
            <div className="space-y-20">
              {filteredProjects.filter(project => project.featured).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full relative overflow-hidden bg-gray-800">
                      <div className="h-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                            <div className="text-4xl mb-4">
                              {project.category.includes('Mobile') ? '📱' : 
                               project.category.includes('E-Commerce') ? '🛒' : 
                               project.category.includes('Education') || project.category.includes('EdTech') ? '🎓' : 
                               project.category.includes('Nonprofit') ? '🌱' : 
                               project.category.includes('Healthcare') ? '🏥' : 
                               project.category.includes('Financial') ? '💼' : 
                               project.category.includes('Real Estate') ? '🏡' : 
                               project.category.includes('Arts') ? '🎭' : '💻'}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-white/80 text-sm mb-4">{project.category}</p>
                            {project.url && (
                              <div className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full">
                                Live Project
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      {project.url && (
                        <div className="absolute top-4 right-4">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        FEATURED
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.year}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Key Achievements
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {(Array.isArray(project.achievements) ? project.achievements : 
                          typeof project.achievements === 'string' && project.achievements 
                            ? project.achievements.split(',').map(a => a.trim()).filter(a => a)
                            : []
                        ).map((achievement, i) => (
                          <div key={i} className="flex items-start bg-green-500/10 border border-green-500/20 rounded-lg p-3 backdrop-blur-sm">
                            <span className="text-green-400 mr-3 mt-0.5 flex-shrink-0">
                              <Award className="w-4 h-4" />
                            </span>
                            <span className="text-gray-300 text-sm font-medium">{typeof achievement === 'string' ? achievement.trim() : achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(project.technologies) ? project.technologies : 
                          typeof project.technologies === 'string' && project.technologies 
                            ? project.technologies.split(',').map(t => t.trim()).filter(t => t)
                            : []
                        ).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-gray-200 rounded-full text-sm font-medium transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40 shadow-sm hover:shadow-md backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <a
                        href={`/portfolio/${project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium"
                      >
                        View Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                        >
                          Visit Live Site
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">More Projects</h2>
            <p className="text-xl text-gray-300">
              Additional work showcasing our versatility
            </p>
          </motion.div>

          {filteredProjects.filter(project => !project.featured).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">No additional projects in this category.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.filter(project => !project.featured).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all"
              >
                <div className="h-48 relative overflow-hidden bg-gray-800">
                  <div className="h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {project.category.includes('Mobile') ? '📱' : 
                         project.category.includes('E-Commerce') ? '🛒' : 
                         project.category.includes('Education') || project.category.includes('EdTech') ? '🎓' : 
                         project.category.includes('Nonprofit') ? '🌱' : 
                         project.category.includes('Healthcare') ? '🏥' : 
                         project.category.includes('Financial') || project.category.includes('Consulting') ? '💼' : 
                         project.category.includes('Real Estate') ? '🏡' : 
                         project.category.includes('Arts') ? '🎭' : '💻'}
                      </div>
                      <span className="text-white text-lg font-bold text-center px-4">{project.title}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {project.year}
                  </div>
                  {project.url && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        Live
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="text-purple-400 text-sm mb-2">{project.category}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    {project.description}
                  </p>
                  
                  {project.achievements && (
                    <div className="mb-4">
                      <h4 className="text-green-400 font-semibold text-sm mb-2">Highlights:</h4>
                      <ul className="space-y-1">
                        {(Array.isArray(project.achievements) ? project.achievements : 
                          typeof project.achievements === 'string' && project.achievements 
                            ? project.achievements.split(',').map(a => a.trim()).filter(a => a)
                            : []
                        ).slice(0, 3).map((achievement, i) => (
                          <li key={i} className="text-gray-400 text-xs flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {typeof achievement === 'string' ? achievement.trim() : achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-gray-300 rounded-full text-xs font-medium border border-purple-500/20 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/20 backdrop-blur-sm">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <a
                      href={`/portfolio/${project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="flex-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-white py-2 rounded-lg text-center transition-all text-sm font-medium"
                    >
                      View Details
                    </a>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white py-2 rounded-lg text-center transition-all text-sm font-medium"
                      >
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create something amazing together. From concept to deployment, 
              we'll bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}