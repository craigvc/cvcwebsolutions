'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const technologies = {
  'Frontend': [
    { name: 'React', logo: '⚛️' },
    { name: 'Next.js', logo: '▲' },
    { name: 'Vue.js', logo: '🟢' },
    { name: 'Angular', logo: '🅰️' },
    { name: 'TypeScript', logo: '📘' },
    { name: 'Tailwind CSS', logo: '💨' }
  ],
  'Backend': [
    { name: 'Node.js', logo: '🟩' },
    { name: 'Python', logo: '🐍' },
    { name: 'PHP', logo: '🐘' },
    { name: 'Laravel', logo: '🏗️' },
    { name: '.NET', logo: '🔷' },
    { name: 'Java', logo: '☕' }
  ],
  'Mobile': [
    { name: 'React Native', logo: '📱' },
    { name: 'Flutter', logo: '🦋' },
    { name: 'Swift', logo: '🍎' },
    { name: 'Kotlin', logo: '🤖' },
    { name: 'PWA', logo: '⚡' }
  ],
  'Database': [
    { name: 'PostgreSQL', logo: '🐘' },
    { name: 'MySQL', logo: '🗄️' },
    { name: 'MongoDB', logo: '🍃' },
    { name: 'Redis', logo: '🔴' },
    { name: 'Firebase', logo: '🔥' }
  ],
  'Cloud & DevOps': [
    { name: 'AWS', logo: '☁️' },
    { name: 'Google Cloud', logo: '🌐' },
    { name: 'Azure', logo: '🔵' },
    { name: 'Docker', logo: '🐳' },
    { name: 'Kubernetes', logo: '☸️' },
    { name: 'CI/CD', logo: '🔄' }
  ],
  'CMS & E-Commerce': [
    { name: 'WordPress', logo: '📝' },
    { name: 'Magento', logo: '🛒' },
    { name: 'Shopify', logo: '🛍️' },
    { name: 'WooCommerce', logo: '🛒' },
    { name: 'Strapi', logo: '🎛️' }
  ],
  'AI & Machine Learning': [
    { name: 'OpenAI GPT', logo: '🤖' },
    { name: 'Claude AI', logo: '🧠' },
    { name: 'LangChain', logo: '🔗' },
    { name: 'TensorFlow', logo: '🔥' },
    { name: 'PyTorch', logo: '⚡' },
    { name: 'Vector Databases', logo: '🗃️' }
  ]
}

export default function Technologies() {
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
            Technologies We Use
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Modern tech stack for cutting-edge solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(technologies).map(([category, techs], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4 gradient-text">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {techs.map((tech) => (
                  <motion.div
                    key={tech.name}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-gray-200 rounded-full text-sm font-medium transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40 shadow-sm hover:shadow-md backdrop-blur-sm">
                      <span className="text-lg">{tech.logo}</span>
                      <span className="group-hover:text-white transition-colors">{tech.name}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}