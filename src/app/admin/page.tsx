'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, Eye, EyeOff, Shield, Calendar, Users, Mail, Zap,
  FileText, PenTool, Sparkles, BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface Appointment {
  id: string
  token: string
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  date: string
  time: string
  message?: string
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'in_progress'
  zoomMeetingId?: string
  zoomJoinUrl?: string
  calendarEventId?: string
  createdAt: string
  lastActivity?: string
  zoomActivity?: any
  participants?: any[]
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  useEffect(() => {
    checkAuthStatus()
    if (isAuthenticated) {
      loadAppointments()
    }
  }, [isAuthenticated])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/admin')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/admin')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Failed to load appointments:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setLoginError(data.error)
        setRemainingAttempts(data.remainingAttempts)
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin', { method: 'DELETE' })
      setIsAuthenticated(false)
      setAppointments([])
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-8 w-full max-w-md mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm">Enter admin password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-12"
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="alert alert-error">
                <p className="text-sm">{loginError}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="text-red-300 text-xs mt-1">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5 border-white mr-2"></div>
              ) : (
                <Lock className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <Link 
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard with integrated marketing tools
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Dashboard Content */}
      <div className="">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter(a => a.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
            <button
              onClick={loadAppointments}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date & Time</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-gray-800 font-medium">{appointment.name}</p>
                          <p className="text-gray-500 text-sm">{appointment.email}</p>
                          {appointment.company && (
                            <p className="text-gray-400 text-xs">{appointment.company}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{appointment.service}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-gray-800">{new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-gray-500 text-sm">{appointment.time}</p>
                        </div>
                      </td>
                      <td className="px-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          appointment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {appointment.zoomJoinUrl && (
                            <a
                              href={appointment.zoomJoinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            >
                              Zoom
                            </a>
                          )}
                          <Link
                            href={`/manage-appointment/${appointment.token}`}
                            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Marketing Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Marketing Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/portfolio" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Portfolio</h3>
              <p className="text-gray-600 text-sm">Manage case studies</p>
            </Link>

            <Link href="/admin/blog" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Blog</h3>
              <p className="text-gray-600 text-sm">Create blog posts</p>
            </Link>

            <Link href="/admin/blog/generate" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Generator</h3>
              <p className="text-gray-600 text-sm">Generate with AI</p>
            </Link>

            <Link href="/admin/analytics" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">View metrics</p>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Appointments</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage client consultations and meetings.
            </p>
            <Link 
              href="/admin/appointments"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Appointments
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Billing</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage billing and hosting services.
            </p>
            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => window.location.href = '/billing'}
            >
              Open Billing Panel
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Calendar</h3>
            <p className="text-gray-600 text-sm mb-4">
              View your Google Calendar.
            </p>
            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => window.open('https://calendar.google.com', '_blank')}
            >
              Open Calendar
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

