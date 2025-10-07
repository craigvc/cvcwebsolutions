'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPageClient() {
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
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
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl leading-tight">
              Let's Work
              <span className="block gradient-text pb-2">Together</span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Ready to transform your digital presence? Get in touch and let's discuss how we can help your business grow.
            </p>
          </motion.header>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8 lg:col-span-1"
            >
              <div>
                <h2 id="contact-heading" className="mb-6 text-3xl font-bold text-white">Get in Touch</h2>
                <p className="mb-8 text-gray-300">
                  Have a project in mind? We'd love to hear about it. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Email</h3>
                    <a href="mailto:hello@cvcwebsolutions.com" className="text-gray-300 transition-colors hover:text-purple-400">
                      hello@cvcwebsolutions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Phone</h3>
                    <a href="tel:+4930338750008" className="text-gray-300 transition-colors hover:text-purple-400">
                      +49 (0)30 3387 5008
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6 glass rounded-xl">
                <h3 className="mb-3 font-semibold text-white">Office Hours</h3>
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
              <form onSubmit={handleSubmit} className="p-8 glass rounded-xl">
                <h2 className="mb-6 text-2xl font-bold text-white">Send Us a Message</h2>

                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-gray-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block mb-2 text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block mb-2 text-gray-300">
                      Service Interested In *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
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
                    <label htmlFor="budget" className="block mb-2 text-gray-300">
                      Project Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg bg-opacity-10 focus:outline-none focus:border-purple-400"
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
                  <label htmlFor="message" className="block mb-2 text-gray-300">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 text-white placeholder-gray-400 transition-colors bg-white border border-gray-600 rounded-lg resize-none bg-opacity-10 focus:outline-none focus:border-purple-400"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 mb-6 bg-green-500 border border-green-500 rounded-lg bg-opacity-20"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
                    <span className="text-green-400">Thank you! We'll get back to you soon.</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 mb-6 bg-red-500 border border-red-500 rounded-lg bg-opacity-20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
                    <span className="text-red-400">Something went wrong. Please try again.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="quick-contact-heading">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-12 text-center glass rounded-2xl"
          >
            <h2 id="quick-contact-heading" className="mb-4 text-3xl font-bold text-white">
              Need Immediate Assistance?
            </h2>
            <p className="mb-8 text-xl text-gray-300">
              Our team is available during business hours to answer your questions.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+4930338750008"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-900 transition-all bg-white rounded-lg hover:bg-gray-100"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Call Now
              </a>
              <a
                href="mailto:hello@cvcwebsolutions.com"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
