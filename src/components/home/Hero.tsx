'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Code2, Smartphone, ShoppingCart, Globe, Brain, Palette, Server } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Building Solutions that{' '}
            <span className="gradient-text">Bring Results</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            A comprehensive digital solutions company specializing in Web & Mobile Applications, 
            AI Solutions, E-Commerce Platforms, and Digital Transformation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all animate-pulse-glow"
            >
              Talk to Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all"
            >
              View Our Work
            </Link>
          </div>

          {/* Service icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/services/web-development" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <span className="text-xs font-medium">Web Development</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/services/mobile-development" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <Smartphone className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <span className="text-xs font-medium">Mobile Apps</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/services/ecommerce" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <ShoppingCart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <span className="text-xs font-medium">E-Commerce</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/services/ai-solutions" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <Brain className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <span className="text-xs font-medium">AI Solutions</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/services/software-development" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <Code2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <span className="text-xs font-medium">Custom Software</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Link href="/services/hosting" className="block glass p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer">
                <Server className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <span className="text-xs font-medium">Managed Hosting</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <ArrowRight className="h-6 w-6 rotate-90 text-purple-400" />
        </div>
      </motion.div>
    </section>
  )
}