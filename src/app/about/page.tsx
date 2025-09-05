'use client'

import { motion } from 'framer-motion'
import { Users, Award, Clock, Target, Globe, Code, Heart, Lightbulb } from 'lucide-react'

const stats = [
  { icon: Globe, label: 'Years of Experience', value: '20+' },
  { icon: Users, label: 'Lives Impacted', value: '25,000+' },
  { icon: Code, label: 'Projects Delivered', value: '50+' },
  { icon: Award, label: 'Industries Served', value: '10+' }
]

const values = [
  {
    icon: Heart,
    title: 'Impact-Driven Development',
    description: 'We build technology that makes a meaningful difference in people\'s lives and communities.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Excellence',
    description: 'Combining cutting-edge technology with proven methodologies to deliver exceptional results.'
  },
  {
    icon: Users,
    title: 'Collaborative Partnership',
    description: 'Working closely with our clients to understand their vision and bring it to life.'
  },
  {
    icon: Target,
    title: 'Results-Focused',
    description: 'Every project is measured by its real-world impact and the value it creates for our clients.'
  }
]

export default function AboutPage() {
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
              About
              <span className="block gradient-text">CVC Web Solutions</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              For over 20 years, we've been creating digital solutions that make a real difference. 
              From conservation education platforms reaching thousands of students to sophisticated 
              e-commerce systems serving global markets, we build technology with purpose.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center glass p-6 rounded-xl">
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  CVC Web Solutions was born from a simple belief: technology should serve humanity. 
                  What started as a small web development company has evolved into a comprehensive 
                  digital solutions partner, working with organizations that are making a positive impact on the world.
                </p>
                <p>
                  We've had the privilege of building platforms that educate thousands of students 
                  about conservation, apps that help legal professionals serve their clients better, 
                  and e-commerce systems that power growing businesses across multiple industries.
                </p>
                <p>
                  Every project we take on is guided by our core question: "How can this technology 
                  make life better?" Whether it's a nonprofit reaching underserved communities or 
                  a business innovating in their field, we're here to turn vision into reality.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                To create digital solutions that empower organizations to achieve their mission 
                and make a meaningful impact on the world.
              </p>
              
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                A world where technology serves as a force for good, connecting people, 
                protecting our planet, and creating opportunities for everyone to thrive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-xl text-center"
              >
                <value.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make an Impact?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's work together to create technology that makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Start Your Project
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass hover:bg-white hover:bg-opacity-20 transition-all text-white"
              >
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}