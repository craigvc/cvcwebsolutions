'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Smartphone, ShoppingCart, Palette, Server, Cog, Brain } from 'lucide-react'

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies and best practices.',
    features: ['WordPress Development', 'Custom Web Applications', 'API Development', 'Database Design'],
    href: '/services/web-development',
    gradient: 'from-blue-600 via-blue-800 to-cyan-900',
    iconColor: 'text-blue-400'
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Native iOS and Android applications that deliver exceptional user experiences.',
    features: ['iOS App Development', 'Android Development', 'App Store Publishing', 'Mobile UI/UX'],
    href: '/services/mobile-development',
    gradient: 'from-purple-600 via-purple-800 to-indigo-900',
    iconColor: 'text-purple-400'
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Solutions',
    description: 'Powerful online stores and marketplace platforms that drive sales and growth.',
    features: ['Magento Development', 'WooCommerce', 'Payment Integration', 'Inventory Management'],
    href: '/services/ecommerce',
    gradient: 'from-pink-600 via-rose-800 to-red-900',
    iconColor: 'text-pink-400'
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    description: 'Intelligent automation and AI-powered solutions including chatbots, knowledge management, and custom AI models.',
    features: ['Chatbots & Virtual Assistants', 'Knowledge Management Systems', 'Custom AI Models', 'Process Automation'],
    href: '/services/ai-solutions',
    gradient: 'from-orange-600 via-amber-800 to-yellow-900',
    iconColor: 'text-orange-400'
  },
  {
    icon: Server,
    title: 'Managed Hosting',
    description: 'Reliable, secure hosting solutions with 24/7 monitoring and expert support.',
    features: ['WordPress Hosting', 'Magento Hosting', 'SSL Certificates', 'Daily Backups'],
    href: '/services/hosting',
    gradient: 'from-cyan-600 via-teal-800 to-emerald-900',
    iconColor: 'text-cyan-400'
  },
  {
    icon: Cog,
    title: 'Custom Software',
    description: 'Tailored software solutions designed to solve your unique business challenges.',
    features: ['Business Applications', 'Integration Solutions', 'Automation Tools', 'Data Analytics'],
    href: '/services/software-development',
    gradient: 'from-green-600 via-emerald-800 to-teal-900',
    iconColor: 'text-green-400'
  }
]

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Strategy',
    description: 'We start by understanding your goals, challenges, and requirements through detailed consultation and research.'
  },
  {
    step: '02',
    title: 'Design & Planning',
    description: 'Our team creates comprehensive designs and project plans that align with your vision and objectives.'
  },
  {
    step: '03',
    title: 'Development & Testing',
    description: 'We build your solution using best practices, with rigorous testing throughout the development process.'
  },
  {
    step: '04',
    title: 'Launch & Support',
    description: 'We handle the launch and provide ongoing support to ensure your project continues to succeed.'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-gray-900 to-blue-900/50" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Our
              <span className="block gradient-text">Services</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Comprehensive digital solutions designed to help your organization achieve its mission 
              and make a meaningful impact. From web development to mobile apps, we deliver 
              technology that works.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center text-center">
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">20+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">10+</div>
                <div className="text-gray-300">Industries Served</div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold gradient-text mb-2">50+</div>
                <div className="text-gray-300">Projects Delivered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-xl text-gray-300">
              Full-stack digital solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={service.href}>
                  <div className="glass rounded-xl p-8 h-full hover:transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <service.icon className={`w-12 h-12 ${service.iconColor} mb-6`} />
                    
                    <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-400 text-sm">
                          <span className={`${service.iconColor} mr-2`}>•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center text-purple-400 group-hover:text-white transition-colors">
                      <span className="font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-xl text-gray-300">
              How we bring your vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss your project and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all text-white"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}