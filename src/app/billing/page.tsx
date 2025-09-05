'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ExternalLink } from 'lucide-react'
import { authService } from '@/lib/auth'

export default function BillingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [fossBillingUrl, setFossBillingUrl] = useState<string>('')

  useEffect(() => {
    checkAuthStatus()
    setFossBillingUrl(process.env.NEXT_PUBLIC_FOSSBILLING_URL || 'http://localhost/fossbilling/admin')
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/admin')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  // Redirect to admin login if not authenticated
  if (isAuthenticated === false) {
    window.location.href = '/admin'
    return null
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Billing Administration</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Admin
              </a>
              <a
                href={fossBillingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOSSBilling Admin Panel Iframe */}
      <div className="h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          <iframe
            src={fossBillingUrl}
            className="w-full h-full border-0"
            title="FOSSBilling Admin Panel"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  )
}