'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Users, FileText, TrendingUp, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'

interface BillingStats {
  totalRevenue: number
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
  totalClients: number
  monthlyRevenue: number
}

interface Invoice {
  id: number
  client_id: number
  status: string
  total: number
  currency: string
  created_at: string
  due_at?: string
}

export default function FOSSBillingPage() {
  const [stats, setStats] = useState<BillingStats>({
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalClients: 0,
    monthlyRevenue: 0
  })
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isConfigured, setIsConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      const response = await fetch('/api/billing')
      const data = await response.json()

      if (response.ok) {
        setIsConfigured(data.configured)
        if (data.configured) {
          setStats(data.stats)
          setInvoices(data.invoices || [])
        }
      } else {
        setError(data.error || 'Failed to load billing data')
      }
    } catch (error) {
      setError('Failed to connect to billing system')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !isConfigured) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">FOSSBilling Integration</h1>
            
            {error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400">FOSSBilling is not configured yet</p>
              </div>
            )}

            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white">Setup Instructions:</h3>
              
              <div className="space-y-3 text-gray-300">
                <p><strong>1. Install FOSSBilling:</strong></p>
                <div className="bg-gray-800/50 p-3 rounded font-mono text-sm">
                  git clone https://github.com/FOSSBilling/FOSSBilling.git<br/>
                  cd FOSSBilling<br/>
                  composer install<br/>
                  # Configure your database and admin account
                </div>

                <p><strong>2. Generate API Key:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Login to your FOSSBilling admin panel</li>
                  <li>Go to Extensions → API</li>
                  <li>Generate a new API key with admin privileges</li>
                </ul>

                <p><strong>3. Update Environment Variables:</strong></p>
                <div className="bg-gray-800/50 p-3 rounded font-mono text-sm">
                  FOSSBILLING_API_URL=http://your-domain.com/fossbilling<br/>
                  FOSSBILLING_API_KEY=your_generated_api_key<br/>
                  FOSSBILLING_ADMIN_EMAIL=craig@cvcwebsolutions.com
                </div>

                <p><strong>4. Features Included:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Hosting services billing (consultations are FREE)</li>
                  <li>Client management integration</li>
                  <li>Hosting packages pricing (Shared, VPS, Dedicated, etc.)</li>
                  <li>Payment tracking and reporting</li>
                  <li>Dashboard analytics integration</li>
                  <li>SSL certificates and domain registration billing</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <a
                  href="https://fossbilling.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit FOSSBilling
                </a>
                <Link href="/admin" className="px-6 py-3 glass text-gray-300 rounded-lg hover:bg-white/10 transition-all">
                  Back to Admin
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
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
              <DollarSign className="w-8 h-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Billing Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                ← Back to Admin
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_FOSSBILLING_URL || 'http://localhost/fossbilling'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open FOSSBilling
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Invoices</p>
                <p className="text-2xl font-bold text-white">{stats.totalInvoices}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">€{stats.monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Paid Invoices</p>
                <p className="text-2xl font-bold text-white">{stats.paidInvoices}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="stat-card"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pendingInvoices}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="admin-card"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
            <button
              onClick={loadBillingData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="text-white font-mono">#{invoice.id}</td>
                      <td>Client #{invoice.client_id}</td>
                      <td className="text-white">€{invoice.total} {invoice.currency}</td>
                      <td>
                        <span className={`status-badge ${
                          invoice.status === 'paid' ? 'status-confirmed' :
                          invoice.status === 'unpaid' ? 'status-cancelled' :
                          'status-pending'
                        }`}>
                          {invoice.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

