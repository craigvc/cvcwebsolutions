'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Lightbulb, Users, Code, Rocket } from 'lucide-react'

const steps = [
  {
    icon: Lightbulb,
    title: 'Discovery',
    description: 'We understand your business needs, goals, and challenges through detailed consultation.'
  },
  {
    icon: Users,
    title: 'Strategy',
    description: 'Our team creates a comprehensive plan with clear milestones and deliverables.'
  },
  {
    icon: Code,
    title: 'Development',
    description: 'Agile development with regular updates, ensuring quality at every step.'
  },
  {
    icon: Rocket,
    title: 'Launch & Support',
    description: 'Smooth deployment with ongoing maintenance and support for your success.'
  }
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Process
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A proven approach that delivers results
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <React.Fragment key={step.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="w-full md:w-80 lg:w-64"
                >
                  <div className="glass p-6 rounded-xl text-center h-full">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-5">
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    key={`arrow-${index}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    className="hidden lg:flex items-center justify-center px-2"
                  >
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}