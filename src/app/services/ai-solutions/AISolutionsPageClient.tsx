'use client'

import { motion } from 'framer-motion'
import { Brain, MessageCircle, Database, Zap, Shield, Cog, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Intelligent Chatbots',
    description: 'Custom AI-powered chatbots that understand context and provide human-like responses.',
    benefits: ['24/7 Customer Support', 'Multi-language Support', 'Lead Generation', 'FAQ Automation']
  },
  {
    icon: Database,
    title: 'Knowledge Management',
    description: 'Transform your data into intelligent, searchable knowledge bases with AI-powered insights.',
    benefits: ['Document Analysis', 'Smart Search', 'Content Recommendation', 'Knowledge Discovery']
  },
  {
    icon: Brain,
    title: 'Custom AI Models',
    description: 'Tailored AI solutions designed specifically for your industry and business needs.',
    benefits: ['Industry-Specific Training', 'Custom Workflows', 'Predictive Analytics', 'Process Automation']
  },
  {
    icon: Zap,
    title: 'AI-Powered Automation',
    description: 'Streamline operations with intelligent automation that learns and adapts.',
    benefits: ['Workflow Optimization', 'Decision Support', 'Quality Assurance', 'Cost Reduction']
  }
]

const useCases = [
  {
    title: 'Customer Service Enhancement',
    description: 'Deploy intelligent chatbots that handle inquiries, process orders, and provide personalized recommendations.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Business Intelligence',
    description: 'Extract actionable insights from your data with AI-powered analytics and reporting systems.',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Document Processing',
    description: 'Automate document analysis, extraction, and classification with advanced AI technologies.',
    icon: Database,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Process Optimization',
    description: 'Identify inefficiencies and optimize workflows using AI-driven process analysis.',
    icon: Cog,
    color: 'from-orange-500 to-red-500'
  }
]

const technologies = [
  { name: 'OpenAI GPT', icon: '🤖' },
  { name: 'Claude AI', icon: '🧠' },
  { name: 'TensorFlow', icon: '🔥' },
  { name: 'PyTorch', icon: '⚡' },
  { name: 'LangChain', icon: '🔗' },
  { name: 'Vector Databases', icon: '🗃️' },
  { name: 'Natural Language Processing', icon: '💬' },
  { name: 'Machine Learning', icon: '🎯' }
]

export default function AISolutionsPageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
              AI Solutions
              <span className="block gradient-text">That Transform Business</span>
            </h1>
            
            <p className="max-w-4xl mx-auto mb-12 text-xl leading-relaxed text-gray-300">
              Harness the power of artificial intelligence to transform your business operations, 
              enhance customer experiences, and unlock new opportunities with custom AI solutions 
              tailored to your specific needs.
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
              >
                Start AI Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                Explore Solutions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">AI Solutions We Offer</h2>
            <p className="text-xl text-gray-300">
              Comprehensive AI services to accelerate your digital transformation
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 transition-all duration-300 glass rounded-xl hover:transform hover:scale-105"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-semibold text-white">{feature.title}</h3>
                    <p className="leading-relaxed text-gray-300">{feature.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">AI Use Cases</h2>
            <p className="text-xl text-gray-300">
              Real-world applications that drive business value
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 overflow-hidden glass rounded-xl group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${useCase.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${useCase.color} flex-shrink-0`}>
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{useCase.title}</h3>
                  </div>
                  <p className="leading-relaxed text-gray-300">{useCase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">AI Technologies We Use</h2>
            <p className="text-xl text-gray-300">
              Cutting-edge AI tools and frameworks
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer group"
              >
                <span className="inline-flex items-center gap-3 px-6 py-3 font-medium text-gray-200 transition-all duration-300 border rounded-full shadow-sm bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border-orange-500/20 hover:border-orange-400/40 hover:shadow-md backdrop-blur-sm">
                  <span className="text-xl">{tech.icon}</span>
                  <span className="transition-colors group-hover:text-white">{tech.name}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">Our AI Development Process</h2>
            <p className="text-xl text-gray-300">
              From concept to deployment, we ensure AI solutions that deliver results
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Discovery & Analysis', description: 'We analyze your business needs and identify AI opportunities.' },
              { step: '02', title: 'Data Preparation', description: 'Clean, structure, and prepare your data for AI model training.' },
              { step: '03', title: 'Model Development', description: 'Design and train custom AI models tailored to your requirements.' },
              { step: '04', title: 'Integration & Support', description: 'Deploy AI solutions and provide ongoing optimization support.' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-2xl font-bold text-white rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                  {process.step}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">{process.title}</h3>
                <p className="leading-relaxed text-gray-300">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/50 to-amber-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Brain className="w-16 h-16 mx-auto mb-6 text-orange-400" />
            <h2 className="mb-6 text-4xl font-bold text-white">Ready to Embrace AI?</h2>
            <p className="mb-8 text-xl text-gray-300">
              Transform your business with intelligent automation and AI-powered solutions. 
              Let's discuss how AI can accelerate your growth.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
              >
                Get AI Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all rounded-lg glass hover:bg-white hover:bg-opacity-20"
              >
                View AI Projects
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
