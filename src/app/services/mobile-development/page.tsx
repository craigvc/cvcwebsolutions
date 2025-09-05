'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Smartphone, Zap, Shield, Users } from 'lucide-react'

const features = [
  'Native iOS Development',
  'Native Android Development',
  'Cross-Platform Apps',
  'Progressive Web Apps',
  'App Store Optimization',
  'Push Notifications',
  'Offline Functionality',
  'Real-time Updates'
]

const technologies = [
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'Objective-C', 'Java', 'Expo', 'Firebase',
  'Redux', 'MobX', 'GraphQL', 'REST APIs',
  'SQLite', 'Realm', 'AsyncStorage', 'Push Services'
]

const appTypes = [
  {
    title: 'E-Commerce Apps',
    description: 'Shopping apps with payment integration and inventory management',
    icon: '🛍️'
  },
  {
    title: 'Social Networking',
    description: 'Community platforms with real-time messaging and content sharing',
    icon: '👥'
  },
  {
    title: 'On-Demand Services',
    description: 'Booking and delivery apps with GPS tracking and scheduling',
    icon: '🚀'
  },
  {
    title: 'Healthcare Apps',
    description: 'Telemedicine, fitness tracking, and patient management solutions',
    icon: '🏥'
  },
  {
    title: 'Financial Apps',
    description: 'Banking, trading, and payment processing applications',
    icon: '💰'
  },
  {
    title: 'Entertainment',
    description: 'Streaming, gaming, and content consumption platforms',
    icon: '🎮'
  }
]

export default function MobileDevelopmentPage() {
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-8">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Mobile Apps
              <span className="block gradient-text">That Users Love</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Create stunning mobile experiences for iOS and Android. Native performance, 
              beautiful design, and seamless functionality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Your App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* App Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Apps We Build
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-xl hover:transform hover:scale-105 transition-all"
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-300">
                    {type.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Key Features We Implement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass p-6 rounded-xl flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Technologies & Frameworks
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
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

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Choose Our Mobile Development?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-xl text-center">
                <Zap className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Native Performance
                </h3>
                <p className="text-gray-300">
                  Optimized apps that run smoothly with minimal battery consumption.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl text-center">
                <Shield className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Secure & Scalable
                </h3>
                <p className="text-gray-300">
                  Enterprise-grade security with encryption and secure data storage.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl text-center">
                <Users className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  User Experience First
                </h3>
                <p className="text-gray-300">
                  Intuitive interfaces following iOS and Android design guidelines.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Choose Your Platform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-white mb-4">Native iOS</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Best performance on Apple devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Access to latest iOS features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Premium user experience</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-white mb-4">Native Android</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Largest mobile market share</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Material Design integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Flexible customization options</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass p-8 rounded-xl border-2 border-purple-500">
                <div className="text-xs text-purple-400 font-semibold mb-2">RECOMMENDED</div>
                <h3 className="text-2xl font-semibold text-white mb-4">Cross-Platform</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>One codebase for both platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Faster time to market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Cost-effective development</span>
                  </li>
                </ul>
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
              Ready to Launch Your Mobile App?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create an app that stands out in the app stores.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}