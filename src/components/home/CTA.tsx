'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block gradient-text">Digital Presence?</span>
          </h2>
          
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can help you build innovative solutions that drive growth and success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all text-white"
            >
              Explore Services
              <MessageCircle className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-gray-300"
          >
            <p className="mb-2">Or call us directly</p>
            <a 
              href="tel:+1234567890" 
              className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
            >
              +1 (234) 567-890
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}