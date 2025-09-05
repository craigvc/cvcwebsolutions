'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, User, Mail, Phone, CheckCircle, XCircle } from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns'

interface TimeSlot {
  time: string
  available: boolean
  zoomMeetingId?: string
}

interface AppointmentData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  date: Date
  time: string
  message: string
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

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'general',
    date: new Date(),
    time: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [availability, setAvailability] = useState<{[key: string]: TimeSlot[]}>({})

  // Generate week days
  const generateWeekDays = (weekOffset: number) => {
    const startDate = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset)
    return Array.from({ length: 5 }, (_, i) => addDays(startDate, i))
  }

  const weekDays = generateWeekDays(currentWeek)

  // Function to check Zoom API availability
  const checkZoomAvailability = async (date: Date): Promise<TimeSlot[]> => {
    try {
      const response = await fetch(`/api/appointments?date=${date.toISOString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }
      
      const data = await response.json()
      return data.availability.map((slot: any) => ({
        time: slot.time,
        available: slot.available,
        zoomMeetingId: slot.available ? `zoom_${date.getTime()}_${slot.time.replace(':', '')}` : undefined
      }))
    } catch (error) {
      console.error('Error fetching availability:', error)
      // Fallback to mock data
      const bookedSlots = ['10:30', '14:00', '15:30']
      return timeSlots.map(time => ({
        time,
        available: !bookedSlots.includes(time),
        zoomMeetingId: bookedSlots.includes(time) ? undefined : `zoom_${date.getTime()}_${time.replace(':', '')}`
      }))
    }
  }

  // Load availability for the current week
  useEffect(() => {
    const loadAvailability = async () => {
      const newAvailability: {[key: string]: TimeSlot[]} = {}
      
      for (const day of weekDays) {
        const dateKey = format(day, 'yyyy-MM-dd')
        newAvailability[dateKey] = await checkZoomAvailability(day)
      }
      
      setAvailability(newAvailability)
    }
    
    loadAvailability()
  }, [currentWeek])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setAppointmentData(prev => ({ ...prev, date }))
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setAppointmentData(prev => ({ ...prev, time }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Submit appointment to API
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          company: appointmentData.company,
          service: appointmentData.service,
          date: selectedDate.toISOString(),
          time: selectedTime,
          message: appointmentData.message
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to book appointment')
      }

      const result = await response.json()
      console.log('Appointment booked:', result)
      
      setSubmitStatus('success')
      
      // Reset form
      setAppointmentData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'general',
        date: new Date(),
        time: '',
        message: ''
      })
      setSelectedDate(null)
      setSelectedTime(null)
      
      // Refresh availability to reflect the new booking
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const updatedSlots = await checkZoomAvailability(selectedDate)
      setAvailability(prev => ({
        ...prev,
        [dateKey]: updatedSlots
      }))
      
    } catch (error) {
      console.error('Booking error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailableSlots = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return availability[dateKey] || []
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-gray-900" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Calendar className="w-12 h-12 text-blue-400" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Talk to <span className="gradient-text">Us</span>
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Connect with our experts for a consultation. We'll discuss your project requirements 
              and create a tailored solution for your business needs via Zoom video call.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">
                ✨ Yes, we built this appointment system too!
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calendar & Time Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                Select Date & Time
              </h2>

              {/* Week Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-all"
                  disabled={currentWeek <= 0}
                >
                  Previous Week
                </button>
                <h3 className="text-lg font-semibold text-white">
                  {format(weekDays[0], 'MMM d')} - {format(weekDays[4], 'MMM d, yyyy')}
                </h3>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Next Week
                </button>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-5 gap-2 mb-8">
                {weekDays.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-4 rounded-lg transition-all text-center ${
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-400" />
                    Available Times
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {getAvailableSlots(selectedDate).map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'bg-blue-500 text-white'
                            : slot.available
                            ? 'glass text-gray-300 hover:bg-white/20'
                            : 'bg-red-500/20 text-red-300 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <XCircle className="w-4 h-4 ml-1 inline" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Appointment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-400" />
                Your Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={appointmentData.name}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={appointmentData.email}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={appointmentData.phone}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    value={appointmentData.company}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service of Interest *
                  </label>
                  <select
                    required
                    value={appointmentData.service}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  >
                    {services.map(service => (
                      <option key={service.value} value={service.value} className="bg-gray-800">
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    value={appointmentData.message}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                    placeholder="Tell us about your project requirements, goals, and any specific questions you have..."
                  />
                </div>

                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
                  >
                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      Appointment Summary
                    </h4>
                    <p className="text-gray-300">
                      <strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}<br/>
                      <strong>Time:</strong> {selectedTime}<br/>
                      <strong>Duration:</strong> 30 minutes<br/>
                      <strong>Platform:</strong> Zoom Video Call
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h4 className="text-green-400 font-semibold mb-2">Appointment Confirmed!</h4>
                    <p className="text-gray-300 text-sm">
                      You'll receive a confirmation email with the Zoom meeting details shortly.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center"
                  >
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <h4 className="text-red-400 font-semibold mb-2">Booking Failed</h4>
                    <p className="text-gray-300 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </span>
                  ) : (
                    'Connect Via Zoom'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Talk to Us?</h2>
            <p className="text-xl text-gray-300">
              Professional consultation experience tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: 'HD Video Calls',
                description: 'Crystal clear video quality through Zoom for effective communication'
              },
              {
                icon: Calendar,
                title: 'Flexible Timing',
                description: 'Choose from available time slots that work best for your schedule'
              },
              {
                icon: CheckCircle,
                title: 'Expert Consultation',
                description: '20+ years of experience helping businesses achieve their digital goals'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-8 text-center"
              >
                <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}