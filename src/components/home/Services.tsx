'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { 
  Globe, Smartphone, ShoppingCart, Code2, 
  Palette, Server, Zap, Shield, Brain 
} from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks. From corporate sites to complex web platforms.',
    features: ['React/Next.js', 'Node.js', 'Full-Stack Solutions'],
    href: '/services/web-development',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-900/20 to-blue-800/10'
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile apps for iOS and Android that deliver exceptional user experiences.',
    features: ['React Native', 'Flutter', 'Progressive Web Apps'],
    href: '/services/mobile-development',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-900/20 to-purple-800/10'
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Solutions',
    description: 'Complete online stores with payment integration, inventory management, and seamless checkout.',
    features: ['WooCommerce', 'Shopify', 'Custom Solutions'],
    href: '/services/ecommerce',
    color: 'from-pink-500 to-red-500',
    bgColor: 'from-pink-900/20 to-red-800/10'
  },
  {
    icon: Code2,
    title: 'Custom Software',
    description: 'Tailored software solutions designed to solve your specific business challenges.',
    features: ['API Development', 'System Integration', 'Automation'],
    href: '/services/software-development',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-900/20 to-emerald-800/10'
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    description: 'Intelligent automation and AI-powered solutions including chatbots, knowledge management, and custom AI models.',
    features: ['Chatbots & Virtual Assistants', 'Knowledge Management', 'Custom AI Models'],
    href: '/services/ai-solutions',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'from-orange-900/20 to-amber-800/10'
  },
  {
    icon: Server,
    title: 'Managed Hosting',
    description: 'Enterprise-grade hosting with 24/7 monitoring, backups, and expert support.',
    features: ['WordPress/Magento', 'Cloud Hosting', 'Maintenance'],
    href: '/services/hosting',
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'from-cyan-900/20 to-teal-800/10'
  }
]

export default function Services() {
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
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive digital solutions to transform your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={service.href}>
                  <div className={`glass p-8 rounded-xl hover:transform hover:scale-105 transition-all h-full group relative overflow-hidden`}>
                    {/* Background gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.color} p-3 mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                    
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-400 text-sm">
                          <Zap className="w-4 h-4 mr-2 text-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}