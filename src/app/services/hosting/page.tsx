'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Server, Shield, Zap, Clock, Database, Cloud } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$49',
    yearlyPrice: '$499',
    description: 'Perfect for small businesses and startups',
    features: [
      '1 WordPress/Magento Site',
      '10GB SSD Storage',
      '100GB Bandwidth',
      'Daily Backups (7 days)',
      'SSL Certificate',
      'Email Support',
      'Basic Security Monitoring'
    ],
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$79',
    yearlyPrice: '$799',
    description: 'Ideal for growing businesses',
    features: [
      '3 WordPress/Magento Sites',
      '50GB SSD Storage',
      '500GB Bandwidth',
      'Daily Backups (30 days)',
      'SSL Certificates',
      'Priority Support',
      'Advanced Security Suite',
      'Performance Optimization',
      'Staging Environment'
    ],
    highlighted: true
  },
  {
    name: 'Business',
    price: '$129',
    yearlyPrice: '$1,299',
    description: 'For high-traffic and enterprise sites',
    features: [
      'Unlimited Sites',
      '200GB SSD Storage',
      'Unlimited Bandwidth',
      'Real-time Backups',
      'Wildcard SSL',
      '24/7 Phone Support',
      'DDoS Protection',
      'CDN Integration',
      'Custom Development',
      'Dedicated Resources'
    ],
    highlighted: false
  }
]

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Imunify360 protection, firewall, and malware scanning'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'NVMe SSD storage with Cloudflare CDN integration'
  },
  {
    icon: Database,
    title: 'JetBackup',
    description: 'Automated backups with one-click restore'
  },
  {
    icon: Clock,
    title: '24/7 Monitoring',
    description: 'Proactive monitoring and instant issue resolution'
  },
  {
    icon: Cloud,
    title: 'Global Infrastructure',
    description: 'Hetzner data centers across multiple continents'
  },
  {
    icon: Server,
    title: 'Managed Updates',
    description: 'Core, plugin, and theme updates handled for you'
  }
]

const technologies = [
  'CloudLinux OS', 'LiteSpeed Web Server', 'MariaDB', 'PHP 8.x',
  'Redis Cache', 'Elasticsearch', 'Node.js', 'Python',
  'Git Version Control', 'WP-CLI', 'Composer', 'NPM'
]

export default function HostingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-8">
              <Server className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Managed Hosting
              <span className="block gradient-text">Hands-Off Excellence</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Enterprise-grade managed hosting for WordPress and Magento. 
              We handle everything so you can focus on your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
              >
                View Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Get Started
              </Link>
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
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Choose Our Managed Hosting?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass p-8 rounded-xl hover:transform hover:scale-105 transition-all"
                  >
                    <Icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 text-center mb-12">
              No hidden fees. Cancel anytime.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`glass p-8 rounded-xl ${plan.highlighted ? 'border-2 border-purple-500 transform scale-105' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="text-xs text-purple-400 font-semibold mb-2">MOST POPULAR</div>
                  )}
                  <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-purple-400 mb-4">
                    or {plan.yearlyPrice}/year (save 2 months)
                  </div>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/contact"
                    className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'glass text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Powered by Industry Leaders
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="px-4 py-2 bg-white bg-opacity-10 text-gray-300 rounded-full hover:bg-opacity-20 transition-all"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Everything You Need, Nothing You Don't
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Included in All Plans</h3>
                <ul className="space-y-3">
                  {[
                    'Free Migration Service',
                    'SSL Certificates',
                    'Daily Backups',
                    'Security Monitoring',
                    'WordPress/Magento Optimization',
                    'Email Accounts',
                    'Developer Tools Access',
                    'Uptime Monitoring'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Premium Features</h3>
                <ul className="space-y-3">
                  {[
                    'Cloudflare Enterprise CDN',
                    'Imunify360 Security Suite',
                    'JetBackup with Remote Storage',
                    'Redis Object Caching',
                    'Elasticsearch Integration',
                    'Git Version Control',
                    'Staging Environments',
                    'Priority Support Queue'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'What makes your hosting "managed"?',
                  a: 'We handle all server maintenance, security updates, backups, performance optimization, and technical support. You focus on your business while we handle the technical details.'
                },
                {
                  q: 'Do you offer free migration?',
                  a: 'Yes! We provide free migration service for all new accounts. Our team will handle the entire process with zero downtime.'
                },
                {
                  q: 'What about email hosting?',
                  a: 'All plans include professional email hosting with spam protection and webmail access.'
                },
                {
                  q: 'Can I upgrade or downgrade my plan?',
                  a: 'Absolutely! You can change your plan at any time. Upgrades are instant, and downgrades take effect at the next billing cycle.'
                },
                {
                  q: 'What is your uptime guarantee?',
                  a: 'We guarantee 99.9% uptime backed by service credits. Our infrastructure is designed for maximum reliability.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-gray-300">{faq.a}</p>
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
              Ready for Worry-Free Hosting?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of businesses enjoying hands-off hosting excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Compare Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}