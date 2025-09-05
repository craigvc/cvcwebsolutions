'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: ''
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    // Simulate form submission
    setTimeout(() => {
      setStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        budget: '',
        message: ''
      })
      
      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Let's Work
              <span className="block gradient-text">Together</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your digital presence? Get in touch and let's discuss how we can help your business grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  Have a project in mind? We'd love to hear about it. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a href="mailto:hello@cvcwebsolutions.com" className="text-gray-300 hover:text-purple-400 transition-colors">
                      hello@cvcwebsolutions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <a href="tel:+1234567890" className="text-gray-300 hover:text-purple-400 transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Office</h3>
                    <p className="text-gray-300">
                      123 Business Street<br />
                      Suite 100<br />
                      City, State 12345
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-white font-semibold mb-3">Office Hours</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-gray-300 mb-2">
                      Service Interested In *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="" className="bg-gray-900">Select a service</option>
                      <option value="web-development" className="bg-gray-900">Web Development</option>
                      <option value="mobile-development" className="bg-gray-900">Mobile Development</option>
                      <option value="ecommerce" className="bg-gray-900">E-Commerce Solutions</option>
                      <option value="software-development" className="bg-gray-900">Custom Software</option>
                      <option value="ui-ux-design" className="bg-gray-900">UI/UX Design</option>
                      <option value="managed-hosting" className="bg-gray-900">Managed Hosting</option>
                      <option value="other" className="bg-gray-900">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-gray-300 mb-2">
                      Project Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="" className="bg-gray-900">Select budget range</option>
                      <option value="under-5k" className="bg-gray-900">Under $5,000</option>
                      <option value="5k-10k" className="bg-gray-900">$5,000 - $10,000</option>
                      <option value="10k-25k" className="bg-gray-900">$10,000 - $25,000</option>
                      <option value="25k-50k" className="bg-gray-900">$25,000 - $50,000</option>
                      <option value="over-50k" className="bg-gray-900">Over $50,000</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Thank you! We'll get back to you soon.</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Something went wrong. Please try again.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass p-12 rounded-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our team is available during business hours to answer your questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-purple-900 hover:bg-gray-100 transition-all"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </a>
              <a
                href="mailto:hello@cvcwebsolutions.com"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}