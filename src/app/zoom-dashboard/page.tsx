'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play,
  Calendar,
  TrendingUp,
  Activity,
  Download,
  Eye
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface MeetingStats {
  total: number
  completed: number
  inProgress: number
  upcoming: number
  cancelled: number
  clientJoinRate: number
  averageDuration: number
  recordingCount: number
  recentMeetings: any[]
  todaysMeetings: any[]
  serviceStats: any[]
}

export default function ZoomDashboardPage() {
  const [stats, setStats] = useState<MeetingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (authenticated) {
      loadDashboard()
      // Refresh every 30 seconds for real-time updates
      const interval = setInterval(loadDashboard, 30000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/meetings/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Dashboard Unavailable</h1>
          <p className="text-gray-400">Unable to load meeting statistics</p>
        </div>
      </div>
    )
  }

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (password === 'zoom2025' || password === 'admin') {
      setAuthenticated(true)
      setLoading(true)
    } else {
      alert('Invalid password')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'confirmed': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Zoom Dashboard</h1>
            <p className="text-gray-400">Admin access required</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            />
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Access Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Video className="w-12 h-12 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Zoom Meeting Dashboard</h1>
            </div>
            <p className="text-gray-300 text-lg">Real-time insights into your appointment meetings</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Meetings</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Client Join Rate</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.clientJoinRate}%</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Duration</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.averageDuration}min</p>
                </div>
                <Clock className="w-10 h-10 text-purple-400" />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Today's Meetings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-400" />
                Today's Meetings ({stats.todaysMeetings.length})
              </h3>

              {stats.todaysMeetings.length > 0 ? (
                <div className="space-y-4">
                  {stats.todaysMeetings.map((meeting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{meeting.name}</p>
                        <p className="text-sm text-gray-400">{meeting.service}</p>
                        <p className="text-sm text-blue-400">{meeting.time}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(meeting.status)}`}>
                          {meeting.status.toUpperCase()}
                        </div>
                        {meeting.clientJoined && (
                          <p className="text-xs text-green-400 mt-1">Client Joined ✓</p>
                        )}
                        {meeting.duration && (
                          <p className="text-xs text-gray-400">{meeting.duration} min</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No meetings scheduled for today</p>
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-400" />
                Recent Activity
              </h3>

              {stats.recentMeetings.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentMeetings.map((meeting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white text-sm">{meeting.name}</p>
                        <p className="text-xs text-gray-400">{meeting.service}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(meeting.status)}`}>
                          {meeting.status.toUpperCase()}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(parseISO(meeting.lastActivity), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Service Statistics */}
          {stats.serviceStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl p-6 mt-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                Service Performance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.serviceStats.map((service, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">{service.service.replace('-', ' ').toUpperCase()}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Total:</span>
                        <span className="text-white font-medium">{service.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Completed:</span>
                        <span className="text-green-400 font-medium">{service.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Avg Duration:</span>
                        <span className="text-blue-400 font-medium">{service.avgDuration || 0}min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-white">Live Zoom Integration Active</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Dashboard updates automatically every 30 seconds with real-time Zoom webhook data
            </p>
            {stats.inProgress > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
                <Video className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">{stats.inProgress} meeting(s) in progress</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}