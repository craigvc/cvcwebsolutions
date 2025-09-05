'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Server, Shield, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 gradient-text">
            Managed Hosting Excellence
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Fully managed WordPress & Magento hosting. We handle everything - servers, updates, security, backups - so you can focus on your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all animate-pulse-glow"
            >
              View Plans
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all"
            >
              Contact Sales
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center glass p-4 rounded-lg"
            >
              <Server className="h-8 w-8 mb-3 text-purple-400" />
              <span className="text-sm font-medium">Fully Managed</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center glass p-4 rounded-lg"
            >
              <Shield className="h-8 w-8 mb-3 text-purple-400" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center glass p-4 rounded-lg"
            >
              <Zap className="h-8 w-8 mb-3 text-purple-400" />
              <span className="text-sm font-medium">Blazing Fast</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}