'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Globe, Zap, Shield, Users } from 'lucide-react'

const features = [
  'Custom Web Applications',
  'Progressive Web Apps (PWA)',
  'API Development & Integration',
  'Database Design & Optimization',
  'Real-time Applications',
  'Content Management Systems',
  'E-commerce Platforms',
  'Responsive Design'
]

const technologies = [
  'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Express', 'Django', 'Laravel',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
  'TypeScript', 'GraphQL', 'REST APIs', 'WebSockets'
]

const process = [
  {
    title: 'Requirements Analysis',
    description: 'We analyze your business needs and create a detailed project specification.'
  },
  {
    title: 'Design & Prototyping',
    description: 'Creating wireframes and interactive prototypes for your approval.'
  },
  {
    title: 'Development',
    description: 'Building your application with clean, maintainable code and best practices.'
  },
  {
    title: 'Testing & Deployment',
    description: 'Rigorous testing and smooth deployment to production servers.'
  }
]

export default function WebDevelopmentPageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-8">
              <Globe className="w-10 h-10 text-white" aria-hidden="true" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Professional Web Development Services
              <span className="block gradient-text">That Deliver Results</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Build powerful, scalable web applications with modern technologies and best practices.
              From simple websites to complex enterprise solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Portfolio
              </Link>
            </div>
          </motion.header>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 id="features-heading" className="text-4xl font-bold text-white text-center mb-12">
              What We Build
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass p-6 rounded-xl flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="technologies-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 id="technologies-heading" className="text-4xl font-bold text-white text-center mb-12">
              Technologies We Use
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="px-4 py-2 bg-white bg-opacity-10 text-gray-300 rounded-full hover:bg-opacity-20 transition-all"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 id="process-heading" className="text-4xl font-bold text-white text-center mb-12">
              Our Web Development Process
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-6 rounded-xl text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4" aria-hidden="true">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 id="benefits-heading" className="text-4xl font-bold text-white text-center mb-12">
              Why Choose Our Web Development Services?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="glass p-8 rounded-xl">
                <Zap className="w-12 h-12 text-purple-400 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Lightning Fast Performance
                </h3>
                <p className="text-gray-300">
                  Optimized for speed with modern performance techniques and CDN deployment.
                </p>
              </article>

              <article className="glass p-8 rounded-xl">
                <Shield className="w-12 h-12 text-purple-400 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Secure & Reliable
                </h3>
                <p className="text-gray-300">
                  Built with security best practices and regular updates to keep your data safe.
                </p>
              </article>

              <article className="glass p-8 rounded-xl">
                <Users className="w-12 h-12 text-purple-400 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  User-Centered Design
                </h3>
                <p className="text-gray-300">
                  Intuitive interfaces that provide exceptional user experiences across all devices.
                </p>
              </article>
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
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Web Application?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss your project and create something amazing together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
