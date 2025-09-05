'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          
          <div className="glass p-8 rounded-xl">
            <div className="prose prose-invert prose-gray max-w-none">
              <p className="text-gray-300 mb-6">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
              <p className="text-gray-300 mb-6">
                By accessing and using our website and services, you accept and agree to be 
                bound by the terms and provision of this agreement. These Terms of Service 
                govern your use of our services provided by CVC Web Solutions.
              </p>
              
              <h2 className="text-2xl font-bold text-white mb-4">Services</h2>
              <p className="text-gray-300 mb-4">
                CVC Web Solutions provides digital solution services including but not limited to:
              </p>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Web development and design</li>
                <li>• Mobile application development</li>
                <li>• E-commerce solutions</li>
                <li>• UI/UX design services</li>
                <li>• Managed hosting services</li>
                <li>• Custom software development</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Project Terms</h2>
              <h3 className="text-xl font-semibold text-white mb-3">Project Scope</h3>
              <p className="text-gray-300 mb-4">
                All projects begin with a detailed scope of work that outlines deliverables, 
                timelines, and costs. Changes to the project scope may result in additional 
                charges and timeline adjustments.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Payment Terms</h3>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Payment schedules are outlined in individual project agreements</li>
                <li>• Late payments may incur additional fees</li>
                <li>• All payments are non-refundable unless otherwise specified</li>
                <li>• Taxes are additional where applicable</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Client Responsibilities</h3>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Provide timely feedback and approvals</li>
                <li>• Supply necessary content, assets, and access</li>
                <li>• Maintain clear communication throughout the project</li>
                <li>• Provide accurate and complete project requirements</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-white mb-3">Client Content</h3>
              <p className="text-gray-300 mb-4">
                You retain ownership of all content, data, and materials you provide to us.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Developed Work</h3>
              <p className="text-gray-300 mb-6">
                Upon full payment, you will own the custom code and designs created specifically 
                for your project. We retain rights to use general methodologies, techniques, 
                and knowledge gained during the project for other clients.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Warranties and Limitations</h2>
              <p className="text-gray-300 mb-4">
                We warrant that our services will be performed in a professional manner. 
                However, we do not guarantee:
              </p>
              <ul className="text-gray-300 mb-6 space-y-1">
                <li>• Specific results or outcomes from our services</li>
                <li>• Compatibility with all third-party software or services</li>
                <li>• Uninterrupted service or error-free operation</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 mb-6">
                Our liability for any claim arising from our services shall not exceed the 
                total amount paid by you for the specific project. We shall not be liable 
                for any indirect, incidental, or consequential damages.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p className="text-gray-300 mb-6">
                Either party may terminate a project with written notice. Upon termination, 
                you will be billed for work completed up to the termination date. Any 
                deliverables completed and paid for will be provided to you.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Support and Maintenance</h2>
              <p className="text-gray-300 mb-6">
                Post-launch support terms are outlined in individual project agreements. 
                Additional support beyond the agreed terms may incur additional charges.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300 mb-6">
                We reserve the right to modify these terms at any time. Changes will be 
                posted on our website with an updated effective date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300">
                For questions about these Terms of Service, please contact us at:
                <br />
                <a href="mailto:legal@cvcwebsolutions.com" className="text-purple-400 hover:text-purple-300">
                  legal@cvcwebsolutions.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}