'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          
          <div className="glass p-8 rounded-xl">
            <div className="prose prose-invert prose-gray max-w-none">
              <p className="text-gray-300 mb-6">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information you provide directly to us, such as when you contact us 
                through our website, request our services, or communicate with us.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Name and contact information</li>
                <li>• Email address and phone number</li>
                <li>• Company information</li>
                <li>• Project requirements and communications</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Technical Information</h3>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• IP address and device information</li>
                <li>• Browser type and version</li>
                <li>• Pages visited and time spent on our site</li>
                <li>• Referral sources</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• To provide and improve our services</li>
                <li>• To communicate with you about your projects</li>
                <li>• To respond to your inquiries and requests</li>
                <li>• To analyze and improve our website performance</li>
                <li>• To comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• With your explicit consent</li>
                <li>• To comply with legal requirements</li>
                <li>• To protect our rights and property</li>
                <li>• With trusted service providers who assist in our operations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-gray-300 mb-6">
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your information</li>
                <li>• Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p className="text-gray-300 mb-6">
                Our website uses cookies to improve your browsing experience and analyze 
                site traffic. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 mb-6">
                We may update this Privacy Policy from time to time. We will notify you 
                of any changes by posting the new policy on this page with an updated 
                effective date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@cvcwebsolutions.com" className="text-purple-400 hover:text-purple-300">
                  privacy@cvcwebsolutions.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}