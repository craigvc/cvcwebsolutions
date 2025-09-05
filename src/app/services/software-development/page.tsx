'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Code2, Database, Cloud, GitBranch, Settings, Lock } from 'lucide-react'

const solutions = [
  {
    title: 'Enterprise Resource Planning (ERP)',
    description: 'Streamline operations with custom ERP solutions',
    icon: '📊'
  },
  {
    title: 'Customer Relationship Management (CRM)',
    description: 'Manage customer interactions and sales pipelines',
    icon: '👥'
  },
  {
    title: 'Business Intelligence & Analytics',
    description: 'Data-driven insights for informed decision making',
    icon: '📈'
  },
  {
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and business processes',
    icon: '⚡'
  },
  {
    title: 'API Development & Integration',
    description: 'Connect systems and enable data exchange',
    icon: '🔗'
  },
  {
    title: 'Cloud Migration & Modernization',
    description: 'Move legacy systems to modern cloud infrastructure',
    icon: '☁️'
  }
]

const capabilities = [
  'Microservices Architecture',
  'RESTful & GraphQL APIs',
  'Real-time Data Processing',
  'Machine Learning Integration',
  'Blockchain Solutions',
  'IoT Applications',
  'DevOps & CI/CD',
  'Cloud-Native Development'
]

const technologies = {
  'Languages': ['Python', 'Java', 'C#', '.NET', 'Go', 'Rust', 'TypeScript'],
  'Frameworks': ['Spring Boot', 'Django', 'FastAPI', '.NET Core', 'Express'],
  'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra'],
  'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
  'Tools': ['Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'Prometheus']
}

export default function SoftwareDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-8">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Custom Software
              <span className="block gradient-text">Built for Your Business</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your business with tailored software solutions. From automation to enterprise systems, 
              we build software that solves real problems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Discuss Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg glass text-white hover:bg-white hover:bg-opacity-20 transition-all"
              >
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Software Solutions We Deliver
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-xl hover:transform hover:scale-105 transition-all"
                >
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-gray-300">
                    {solution.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our Technical Capabilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass p-6 rounded-xl flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">{capability}</span>
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
              Technology Stack
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(technologies).map(([category, techs], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold gradient-text mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white bg-opacity-10 text-gray-300 rounded-full text-sm hover:bg-opacity-20 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why Choose Custom Software?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass p-6 rounded-xl text-center">
                <Settings className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Tailored Solutions
                </h3>
                <p className="text-gray-300">
                  Built specifically for your unique business requirements
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <Database className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Scalability
                </h3>
                <p className="text-gray-300">
                  Grows with your business without limitations
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <Lock className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Security
                </h3>
                <p className="text-gray-300">
                  Enterprise-grade security tailored to your needs
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <GitBranch className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Integration
                </h3>
                <p className="text-gray-300">
                  Seamlessly connects with your existing systems
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our Agile Development Process
            </h2>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>
              
              {[
                { title: 'Requirements Gathering', desc: 'Deep dive into your business needs and objectives' },
                { title: 'System Architecture', desc: 'Design scalable and maintainable system architecture' },
                { title: 'Sprint Development', desc: 'Agile development with regular demos and feedback' },
                { title: 'Quality Assurance', desc: 'Comprehensive testing at every stage' },
                { title: 'Deployment', desc: 'Smooth deployment with zero downtime' },
                { title: 'Maintenance & Support', desc: 'Ongoing support and feature enhancements' }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-1/2"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 z-10 relative"></div>
                  <div className="w-1/2 px-8">
                    <div className="glass p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-300">{step.desc}</p>
                    </div>
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
              Let's Build Your Custom Solution
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Transform your business with software that works exactly how you need it to.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}