'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, Building, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns'
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
  status: 'confirmed' | 'cancelled' | 'rescheduled'
  zoomMeetingUrl?: string
  calendarEventId?: string
  createdAt: string
}

const services = [
  { value: 'web-development', label: 'Web Development Consultation' },
  { value: 'mobile-development', label: 'Mobile App Development' },
  { value: 'ecommerce', label: 'E-Commerce Solutions' },
  { value: 'ai-solutions', label: 'AI Solutions Consultation' },
  { value: 'software-development', label: 'Custom Software Development' },
  { value: 'hosting', label: 'Managed Hosting Services' },
  { value: 'general', label: 'General Consultation' }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00'
]

export default function ManageAppointmentClient({ token }: { token: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState<'view' | 'reschedule' | 'cancel'>('view')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Rescheduling state
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availability, setAvailability] = useState<{[key: string]: {time: string, available: boolean}[]}>({})

  // Generate week days
  const generateWeekDays = (weekOffset: number) => {
    const startDate = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset)
    return Array.from({ length: 5 }, (_, i) => addDays(startDate, i))
  }

  const weekDays = generateWeekDays(currentWeek)

  useEffect(() => {
    loadAppointment()
  }, [token])

  useEffect(() => {
    if (action === 'reschedule') {
      loadAvailability()
    }
  }, [action, currentWeek])

  const loadAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/manage/${token}`)
      if (!response.ok) {
        throw new Error('Appointment not found')
      }
      const data = await response.json()
      setAppointment(data.appointment)
    } catch (err) {
      setError('Appointment not found or invalid link')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailability = async () => {
    const newAvailability: {[key: string]: {time: string, available: boolean}[]} = {}
    
    for (const day of weekDays) {
      const dateKey = format(day, 'yyyy-MM-dd')
      try {
        const response = await fetch(`/api/appointments?date=${day.toISOString()}`)
        if (response.ok) {
          const data = await response.json()
          newAvailability[dateKey] = data.availability
        }
      } catch (error) {
        // Fallback availability
        newAvailability[dateKey] = timeSlots.map(time => ({ time, available: true }))
      }
    }
    
    setAvailability(newAvailability)
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !appointment) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/appointments/manage/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          newDate: selectedDate.toISOString(),
          newTime: selectedTime
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment')
      }

      setSuccess(true)
      setAction('view')
      loadAppointment()
    } catch (error) {
      setError('Failed to reschedule appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = async () => {
    if (!appointment) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/appointments/manage/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel appointment')
      }

      setSuccess(true)
      setAction('view')
      loadAppointment()
    } catch (error) {
      setError('Failed to cancel appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Appointment Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/schedule" className="btn-primary">
            Talk to Us
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Manage Your Appointment</h1>
            <p className="text-gray-300">Reschedule or cancel your meeting</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8 text-center"
            >
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold">
                {action === 'cancel' ? 'Appointment cancelled successfully!' : 'Appointment rescheduled successfully!'}
              </p>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Appointment Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Appointment Details</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    appointment.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    appointment.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {appointment.status.toUpperCase()}
                  </div>
                </div>

                {action === 'reschedule' ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Select New Date & Time</h3>
                    
                    {/* Week Navigation */}
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setCurrentWeek(currentWeek - 1)}
                        className="btn-secondary"
                        disabled={currentWeek <= 0}
                      >
                        Previous Week
                      </button>
                      <h4 className="text-lg font-semibold text-white">
                        {format(weekDays[0], 'MMM d')} - {format(weekDays[4], 'MMM d, yyyy')}
                      </h4>
                      <button
                        onClick={() => setCurrentWeek(currentWeek + 1)}
                        className="btn-secondary"
                      >
                        Next Week
                      </button>
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-5 gap-2 mb-6">
                      {weekDays.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedTime(null)
                          }}
                          className={`p-3 rounded-lg transition-all text-center ${
                            selectedDate && isSameDay(date, selectedDate)
                              ? 'bg-blue-500 text-white'
                              : 'glass text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-xs text-gray-400 mb-1">
                            {format(date, 'EEE')}
                          </div>
                          <div className="text-lg font-semibold">
                            {format(date, 'd')}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <h5 className="text-white font-medium mb-3">Available Times</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {availability[format(selectedDate, 'yyyy-MM-dd')]?.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-2 rounded text-sm transition-all ${
                                selectedTime === slot.time
                                  ? 'bg-blue-500 text-white'
                                  : slot.available
                                  ? 'glass text-gray-300 hover:bg-white/20'
                                  : 'bg-red-500/20 text-red-300 cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleReschedule}
                        disabled={!selectedDate || !selectedTime || isSubmitting}
                        className="flex-1 btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
                      </button>
                      <button
                        onClick={() => setAction('view')}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Client Name</label>
                        <div className="text-white font-medium">{appointment.name}</div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Company</label>
                        <div className="text-white font-medium">{appointment.company || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <div className="text-white font-medium">{appointment.email}</div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Phone</label>
                        <div className="text-white font-medium">{appointment.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Date</label>
                        <div className="text-white font-medium">
                          {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Time</label>
                        <div className="text-white font-medium">{appointment.time}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Service</label>
                      <div className="text-white font-medium">
                        {services.find(s => s.value === appointment.service)?.label || appointment.service}
                      </div>
                    </div>

                    {appointment.message && (
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Message</label>
                        <div className="text-white bg-gray-800/50 p-3 rounded-lg">
                          {appointment.message}
                        </div>
                      </div>
                    )}

                    {appointment.zoomMeetingUrl && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">Zoom Meeting</h4>
                        <a 
                          href={appointment.zoomMeetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm break-all"
                        >
                          {appointment.zoomMeetingUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Actions */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Actions</h3>
                
                {appointment.status === 'confirmed' && action === 'view' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setAction('reschedule')}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Reschedule
                    </button>
                    
                    <button
                      onClick={() => setAction('cancel')}
                      className="w-full btn-destructive flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Cancel Appointment
                    </button>
                  </div>
                )}

                {action === 'cancel' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Are you sure you want to cancel this appointment? This action cannot be undone.
                    </p>
                    <button
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="w-full btn-destructive disabled:opacity-50"
                    >
                      {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Appointment'}
                    </button>
                    <button
                      onClick={() => setAction('view')}
                      className="w-full btn-secondary"
                    >
                      Keep Appointment
                    </button>
                  </div>
                )}

                {appointment.status !== 'confirmed' && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">
                      This appointment has been {appointment.status}.
                    </p>
                    <Link href="/schedule" className="btn-primary">
                      Talk to Us
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}