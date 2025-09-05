'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const projects = [
  {
    title: 'Vumba.io',
    category: 'EdTech Platform',
    description: 'Digital education delivery platform for conservation NGOs, connecting organizations with youth to drive environmental engagement and career opportunities.',
    image: '/portfolio/vumba.jpg',
    tags: ['WordPress', 'Custom Development', 'Student Tracking'],
    featured: true,
    url: 'https://vumba.io',
    achievements: ['10,000+ Students Supported', 'NGO Collaboration Tools', 'Impact Measurement System']
  },
  {
    title: 'Global Conservation Corps',
    category: 'Nonprofit Website',
    description: 'Conservation education nonprofit website bridging communities and wildlife through education, technology, and partnerships.',
    image: '/portfolio/gcc.jpg',
    tags: ['WordPress', 'Multimedia Integration', 'Donation Platform'],
    featured: true,
    url: 'https://globalconservationcorps.org',
    achievements: ['15,000+ Youth Impacted', 'Documentary Production', 'Podcast Integration']
  },
  {
    title: 'Ludke Consulting',
    category: 'Sustainability Consulting',
    description: 'Professional consulting website specializing in sustainability strategy, ESG consulting, and market transformation for lasting societal value.',
    image: '/portfolio/ludke.jpg',
    tags: ['WordPress', 'Responsive Design', 'Book Integration'],
    featured: true,
    url: 'https://ludkeconsulting.com',
    achievements: ['Published Book Integration', 'ESG Strategy Tools', 'Market Transformation Focus']
  },
  {
    title: 'Head Rush Technologies',
    category: 'E-Commerce Platform',
    description: 'Advanced safety equipment e-commerce platform specializing in magnetic braking systems',
    image: '/portfolio/headrush.jpg',
    tags: ['Magento', 'E-Commerce', 'Multilingual']
  },
  {
    title: 'Auto Air Con Parts',
    category: 'E-Commerce Platform',
    description: 'Specialized automotive parts platform with 70,000+ air conditioning components',
    image: '/portfolio/autoaircon.jpg',
    tags: ['Magento', 'Search Integration', 'Automotive']
  },
  {
    title: 'Vumba Mobile App',
    category: 'Mobile Application',
    description: 'Native iOS application for educators with real-time attendance tracking and resource management',
    image: '/portfolio/vumba-app.jpg',
    tags: ['iOS Development', 'Education Technology', 'Real-time Tracking'],
    url: 'https://apps.apple.com/us/app/vumba/id6502340034',
    achievements: ['App Store Published', 'Real-time Tracking', 'Cloud Integration']
  },
  {
    title: 'Pyke Presley Associates App',
    category: 'Mobile Application',
    description: 'Professional client service app for estate planning and healthcare document management',
    image: '/portfolio/pyke-app.jpg',
    tags: ['iOS Development', 'Legal Tech', 'Document Management'],
    url: 'https://apps.apple.com/us/app/pyke-presley-associates-app/id1594080138',
    achievements: ['App Store Published', '24/7 Document Access', 'Secure Communication']
  },
  {
    title: 'Iris Pricing Solutions',
    category: 'Business Consulting Website',
    description: 'Global pricing consultancy website with 30+ years expertise and 1000+ completed projects',
    image: '/portfolio/pricing-solutions.jpg',
    tags: ['WordPress', 'Business Intelligence', 'Global Consulting'],
    url: 'https://www.pricingsolutions.com/',
    achievements: ['1000+ Projects', '25+ Industries', '10:1 ROI Solutions']
  },
  {
    title: 'Vixen Capital Advisors',
    category: 'Financial Services Website',
    description: 'Venture capital firm website with 30+ years financial experience and diverse investment portfolio',
    image: '/portfolio/vixen-capital.jpg',
    tags: ['WordPress', 'Financial Services', 'Venture Capital'],
    url: 'https://vixen-capital-advisors.com/',
    achievements: ['30+ Years Experience', 'Diverse Portfolio', 'Female Leadership']
  },
  {
    title: 'Tombstone Productions',
    category: 'Arts Education Website',
    description: 'Professional arts education organization with national recognition and 40+ theatrical productions',
    image: '/portfolio/tombstone.jpg',
    tags: ['WordPress', 'Arts Education', 'Community Programs'],
    url: 'https://toombstoneproductions.com/',
    achievements: ['American Theatre Recognition', '40+ Productions', 'Youth Development']
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    description: 'Secure banking application for iOS and Android',
    image: '/portfolio/banking.jpg',
    tags: ['React Native', 'TypeScript', 'AWS']
  },
  {
    title: 'Healthcare Portal',
    category: 'Web Application',
    description: 'Patient management system with telemedicine features',
    image: '/portfolio/healthcare.jpg',
    tags: ['Next.js', 'Python', 'PostgreSQL']
  },
  {
    title: 'SaaS Dashboard',
    category: 'Web Application',
    description: 'Analytics dashboard for business intelligence',
    image: '/portfolio/saas.jpg',
    tags: ['React', 'D3.js', 'Node.js']
  }
]

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our expertise across various industries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`glass rounded-xl overflow-hidden group hover:transform hover:scale-105 transition-all ${
                project.featured ? 'border-2 border-purple-500/50 lg:col-span-1' : ''
              }`}
            >
              {project.featured && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 text-center">
                  FEATURED PROJECT
                </div>
              )}
              
              <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold text-center px-4">{project.title}</span>
                </div>
                {project.url && (
                  <div className="absolute top-4 right-4">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="text-purple-400 text-sm mb-2">{project.category}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {project.description}
                </p>
                
                {project.achievements && (
                  <div className="mb-4">
                    <h4 className="text-green-400 font-semibold text-sm mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {project.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white bg-opacity-10 text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium text-sm"
                  >
                    Visit Website
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all text-white"
          >
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}