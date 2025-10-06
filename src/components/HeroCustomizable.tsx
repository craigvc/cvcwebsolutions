'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Server, Shield, Zap } from 'lucide-react'

interface HeroCustomizableProps {
  title?: string;
  subtitle?: string;
  showFeatures?: boolean;
  showButtons?: boolean;
}

export default function HeroCustomizable({ 
  title = "Managed Hosting Excellence",
  subtitle = "Fully managed WordPress & Magento hosting. We handle everything - servers, updates, security, backups - so you can focus on your business.",
  showFeatures = true,
  showButtons = true
}: HeroCustomizableProps) {
  return (
    <section className="relative overflow-hidden text-white bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl gradient-text">
            {title}
          </h1>
          <p className="max-w-3xl mx-auto mb-12 text-xl text-gray-300 sm:text-2xl">
            {subtitle}
          </p>
          
          {showButtons && (
            <div className="flex flex-col justify-center gap-4 mb-16 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20 animate-pulse-glow"
              >
                View Plans
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                Contact Sales
              </a>
            </div>
          )}

          {showFeatures && (
            <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center p-4 rounded-lg glass"
              >
                <Server className="w-8 h-8 mb-3 text-purple-400" />
                <span className="text-sm font-medium">Fully Managed</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center p-4 rounded-lg glass"
              >
                <Shield className="w-8 h-8 mb-3 text-purple-400" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center p-4 rounded-lg glass"
              >
                <Zap className="w-8 h-8 mb-3 text-purple-400" />
                <span className="text-sm font-medium">Blazing Fast</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
