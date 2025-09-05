'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Palette, Figma, PenTool, Layout, Eye, Heart } from 'lucide-react'

const services = [
  {
    title: 'User Experience (UX) Design',
    description: 'Research-driven design that puts users first',
    icon: '🎯',
    features: ['User Research', 'Information Architecture', 'User Journey Mapping', 'Usability Testing']
  },
  {
    title: 'User Interface (UI) Design',
    description: 'Beautiful interfaces that delight users',
    icon: '🎨',
    features: ['Visual Design', 'Component Libraries', 'Design Systems', 'Responsive Design']
  },
  {
    title: 'Brand Identity',
    description: 'Cohesive brand experiences across all touchpoints',
    icon: '✨',
    features: ['Logo Design', 'Brand Guidelines', 'Color Systems', 'Typography']
  },
  {
    title: 'Prototyping',
    description: 'Interactive prototypes to validate ideas',
    icon: '🚀',
    features: ['Wireframing', 'Interactive Prototypes', 'Animation Design', 'Micro-interactions']
  }
]

const process = [
  {
    title: 'Research',
    description: 'Understanding users, competitors, and market',
    icon: '🔍'
  },
  {
    title: 'Strategy',
    description: 'Defining goals and success metrics',
    icon: '📋'
  },
  {
    title: 'Design',
    description: 'Creating beautiful, functional interfaces',
    icon: '🎨'
  },
  {
    title: 'Prototype',
    description: 'Building interactive mockups',
    icon: '⚡'
  },
  {
    title: 'Test',
    description: 'Validating with real users',
    icon: '✅'
  },
  {
    title: 'Iterate',
    description: 'Refining based on feedback',
    icon: '🔄'
  }
]

const tools = [
  'Figma', 'Sketch', 'Adobe XD', 'Framer',
  'Photoshop', 'Illustrator', 'After Effects',
  'Principle', 'InVision', 'Maze', 'Hotjar'
]

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 mb-8">
              <Palette className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              UI/UX Design
              <span className="block gradient-text">That Converts</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Create exceptional user experiences with research-driven design. 
              Beautiful interfaces that users love and businesses thrive on.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                Start Your Design Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Design Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Design Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-xl hover:transform hover:scale-105 transition-all"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-gray-400">
                        <Check className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our Design Process
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-6 rounded-xl text-center"
                >
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Good Design Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Design Matters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass p-6 rounded-xl text-center">
                <Eye className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  First Impressions
                </h3>
                <p className="text-gray-300">
                  Users form opinions in 50ms - make them count
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <Heart className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  User Satisfaction
                </h3>
                <p className="text-gray-300">
                  88% of users won't return after bad UX
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <Layout className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Conversion Rates
                </h3>
                <p className="text-gray-300">
                  Good UX can increase conversions by 400%
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <PenTool className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Brand Trust
                </h3>
                <p className="text-gray-300">
                  75% judge credibility based on design
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Tools We Master
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="px-4 py-2 bg-white bg-opacity-10 text-gray-300 rounded-full hover:bg-opacity-20 transition-all"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Our Design Principles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">User-Centered</h3>
                <p className="text-gray-300">Every decision starts with user needs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Performance</h3>
                <p className="text-gray-300">Fast, responsive, and accessible designs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Consistency</h3>
                <p className="text-gray-300">Cohesive experiences across all touchpoints</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Something Beautiful?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's design experiences that users love and businesses thrive on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                Start Your Design Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}