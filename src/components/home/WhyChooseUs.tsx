'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle, Users, Zap, Shield, Clock, Award } from 'lucide-react'

const reasons = [
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled developers with years of experience in cutting-edge technologies'
  },
  {
    icon: Zap,
    title: 'Agile Development',
    description: 'Fast, iterative development with regular updates and feedback loops'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Rigorous testing and code reviews ensure bug-free, secure applications'
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We meet deadlines and deliver projects on schedule, every time'
  },
  {
    icon: Award,
    title: 'Cost-Effective',
    description: 'Competitive pricing without compromising on quality or features'
  },
  {
    icon: CheckCircle,
    title: '24/7 Support',
    description: 'Ongoing maintenance and support to keep your applications running smoothly'
  }
]

export default function WhyChooseUs() {
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
            Why Choose CVC Web Solutions?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We deliver excellence through innovation and dedication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 rounded-xl hover:transform hover:scale-105 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-gray-300">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="glass p-6 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
            <div className="text-gray-300">Projects Completed</div>
          </div>
          <div className="glass p-6 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-2">20+</div>
            <div className="text-gray-300">Years Experience</div>
          </div>
          <div className="glass p-6 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-gray-300">Client Satisfaction</div>
          </div>
          <div className="glass p-6 rounded-xl">
            <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-gray-300">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}