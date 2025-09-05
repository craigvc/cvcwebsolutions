'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, ShoppingCart, CreditCard, Package, TrendingUp, Shield, Globe } from 'lucide-react'

const features = [
  'Custom Shopping Cart Development',
  'Payment Gateway Integration',
  'Inventory Management Systems',
  'Multi-vendor Marketplaces',
  'Product Catalog Management',
  'Order Tracking & Fulfillment',
  'Customer Account Management',
  'Analytics & Reporting Dashboard'
]

const platforms = [
  {
    name: 'WooCommerce',
    description: 'Flexible WordPress e-commerce with endless customization',
    features: ['WordPress Integration', 'SEO Friendly', 'Plugin Ecosystem'],
    best_for: 'Small to medium businesses'
  },
  {
    name: 'Magento',
    description: 'Enterprise-grade platform for large-scale operations',
    features: ['Multi-store Management', 'B2B Features', 'Advanced Analytics'],
    best_for: 'Enterprise & high-volume stores'
  },
  {
    name: 'Shopify',
    description: 'User-friendly hosted solution with quick setup',
    features: ['Built-in Hosting', 'App Store', 'Mobile Commerce'],
    best_for: 'Quick launches & dropshipping'
  },
  {
    name: 'Custom Solutions',
    description: 'Tailored e-commerce built from scratch',
    features: ['Complete Control', 'Unique Features', 'Scalability'],
    best_for: 'Unique business requirements'
  }
]

const services = [
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Secure payment integration with Stripe, PayPal, Square, and more'
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Real-time stock tracking, automated reordering, and warehouse management'
  },
  {
    icon: TrendingUp,
    title: 'Marketing Tools',
    description: 'SEO optimization, email campaigns, and social media integration'
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'PCI compliance, SSL certificates, and fraud prevention'
  },
  {
    icon: Globe,
    title: 'Multi-channel Selling',
    description: 'Sell on Amazon, eBay, Facebook, and Instagram from one platform'
  }
]

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 mb-8">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              E-Commerce Solutions
              <span className="block gradient-text">That Drive Sales</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Build powerful online stores that convert visitors into customers. 
              From product showcases to complete marketplaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 transition-all"
              >
                Start Selling Online
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Stores We Built
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Choose Your Platform
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-xl hover:transform hover:scale-105 transition-all"
                >
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {platform.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {platform.description}
                  </p>
                  <div className="mb-4">
                    {platform.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Check className="w-4 h-4 text-purple-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="text-purple-400 text-sm font-semibold">
                    Best for: {platform.best_for}
                  </div>
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
              E-Commerce Features We Build
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

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Complete E-Commerce Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass p-6 rounded-xl"
                  >
                    <Icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300">
                      {service.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              E-Commerce Success Metrics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">$10M+</div>
                <div className="text-gray-300">Total Sales Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">150+</div>
                <div className="text-gray-300">Stores Launched</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-300">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">3.5%</div>
                <div className="text-gray-300">Average Conversion Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our E-Commerce Development Process
            </h2>
            
            <div className="space-y-8">
              {[
                { step: '01', title: 'Discovery & Planning', desc: 'Understanding your products, target market, and business goals' },
                { step: '02', title: 'Design & UX', desc: 'Creating user-friendly interfaces that drive conversions' },
                { step: '03', title: 'Development', desc: 'Building your store with secure payment processing and inventory management' },
                { step: '04', title: 'Testing & Launch', desc: 'Thorough testing of all features before going live' },
                { step: '05', title: 'Growth & Optimization', desc: 'Ongoing support, marketing, and conversion optimization' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-6"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="glass p-6 rounded-xl flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
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
              Ready to Start Selling Online?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's build an e-commerce platform that grows with your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 transition-all"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/services/hosting"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Learn About Hosting
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}