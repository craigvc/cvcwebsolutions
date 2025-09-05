// Google Calendar API Integration
// This file handles Google Calendar interactions for appointment scheduling

import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

interface CalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: {
    email: string
    displayName?: string
  }[]
  conferenceData?: {
    createRequest: {
      requestId: string
      conferenceSolutionKey: {
        type: string
      }
    }
  }
  reminders: {
    useDefault: boolean
    overrides?: {
      method: 'email' | 'popup'
      minutes: number
    }[]
  }
}

interface AppointmentData {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  date: Date
  time: string
  message?: string
  duration?: number // in minutes, default 30
}

class GoogleCalendarAPI {
  private auth: JWT | null = null
  private calendar: any = null
  private calendarId: string

  constructor() {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    this.initializeAuth()
  }

  private initializeAuth() {
    try {
      // Service Account Authentication with Domain-Wide Delegation
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
        this.auth = new JWT({
          email: process.env.GOOGLE_CLIENT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/calendar'],
          // Domain-Wide Delegation: Impersonate the user
          subject: process.env.GOOGLE_CALENDAR_ID
        })

        this.calendar = google.calendar({ version: 'v3', auth: this.auth })
      } else {
        console.warn('Google Calendar credentials not found. Calendar integration will be disabled.')
      }
    } catch (error) {
      console.error('Failed to initialize Google Calendar auth:', error)
    }
  }

  // Check if Google Calendar is properly configured
  isConfigured(): boolean {
    return this.auth !== null && this.calendar !== null
  }

  // Get calendar events for a specific date range (for availability checking)
  async getEvents(startDate: Date, endDate: Date): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured')
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      return response.data.items || []
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw new Error('Failed to fetch calendar events')
    }
  }

  // Check availability for specific time slots
  async checkAvailability(date: Date, timeSlots: string[]): Promise<{ time: string, available: boolean }[]> {
    if (!this.isConfigured()) {
      // Return mock availability if Google Calendar is not configured
      return timeSlots.map(time => ({
        time,
        available: !['10:30', '14:00', '15:30'].includes(time) // Mock some busy slots
      }))
    }

    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const events = await this.getEvents(startOfDay, endOfDay)
      
      return timeSlots.map(time => {
        const [hours, minutes] = time.split(':').map(Number)
        const slotStart = new Date(date)
        slotStart.setHours(hours, minutes, 0, 0)
        
        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotStart.getMinutes() + 30) // 30-minute slots

        // Check if this slot conflicts with any existing events
        const hasConflict = events.some(event => {
          if (!event.start?.dateTime || !event.end?.dateTime) return false

          const eventStart = new Date(event.start.dateTime)
          const eventEnd = new Date(event.end.dateTime)

          // Check for overlap
          return (slotStart < eventEnd && slotEnd > eventStart)
        })

        return {
          time,
          available: !hasConflict
        }
      })
    } catch (error) {
      console.error('Error checking availability:', error)
      // Return all slots as available if there's an error
      return timeSlots.map(time => ({ time, available: true }))
    }
  }

  // Create a calendar event for an appointment
  async createAppointmentEvent(appointmentData: AppointmentData, zoomMeetingUrl?: string): Promise<any> {
    if (!this.isConfigured()) {
      console.log('Google Calendar not configured, skipping calendar event creation')
      return null
    }

    try {
      const { name, email, phone, company, service, date, time, message, duration = 30 } = appointmentData
      
      // Parse the appointment time
      const [hours, minutes] = time.split(':').map(Number)
      const startDateTime = new Date(date)
      startDateTime.setHours(hours, minutes, 0, 0)
      
      const endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(startDateTime.getMinutes() + duration)

      // Create event description
      let description = `Consultation: ${service}\n\n`
      description += `Client: ${name}\n`
      if (company) description += `Company: ${company}\n`
      description += `Email: ${email}\n`
      if (phone) description += `Phone: ${phone}\n`
      if (message) description += `\nMessage:\n${message}\n`
      if (zoomMeetingUrl) description += `\nZoom Meeting: ${zoomMeetingUrl}`

      const eventData: CalendarEvent = {
        summary: `${service} - ${name}${company ? ` (${company})` : ''}`,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        },
        attendees: [
          {
            email: email,
            displayName: name
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'email', minutes: 60 },      // 1 hour before
            { method: 'popup', minutes: 15 }       // 15 minutes before
          ]
        }
      }

      // Skip Google Meet creation to avoid permission issues
      // if (!zoomMeetingUrl) {
      //   eventData.conferenceData = {
      //     createRequest: {
      //       requestId: `meet_${Date.now()}`,
      //       conferenceSolutionKey: {
      //         type: 'hangoutsMeet'
      //       }
      //     }
      //   }
      // }

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        resource: eventData,
        sendUpdates: 'all' // Send email invitations with Domain-Wide Delegation
        // conferenceDataVersion: !zoomMeetingUrl ? 1 : 0
      })

      console.log('Calendar event created:', response.data.id)
      return response.data

    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw new Error('Failed to create calendar event')
    }
  }

  // Update an existing calendar event
  async updateAppointmentEvent(eventId: string, appointmentData: Partial<AppointmentData>): Promise<any> {
    if (!this.isConfigured()) {
      console.log('Google Calendar not configured, skipping calendar event update')
      return null
    }

    try {
      // Get existing event
      const existingEvent = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId
      })

      // Update with new data
      const updatedEvent = {
        ...existingEvent.data,
        // Add your update logic here based on appointmentData
      }

      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        resource: updatedEvent,
        sendUpdates: 'all'
      })

      return response.data

    } catch (error) {
      console.error('Error updating calendar event:', error)
      throw new Error('Failed to update calendar event')
    }
  }

  // Delete a calendar event
  async deleteAppointmentEvent(eventId: string): Promise<void> {
    if (!this.isConfigured()) {
      console.log('Google Calendar not configured, skipping calendar event deletion')
      return
    }

    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
        sendUpdates: 'all'
      })

      console.log('Calendar event deleted:', eventId)

    } catch (error) {
      console.error('Error deleting calendar event:', error)
      throw new Error('Failed to delete calendar event')
    }
  }

  // Get calendar event details
  async getAppointmentEvent(eventId: string): Promise<any> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId
      })

      return response.data

    } catch (error) {
      console.error('Error getting calendar event:', error)
      return null
    }
  }

  // List upcoming appointments
  async getUpcomingAppointments(maxResults: number = 10): Promise<any[]> {
    if (!this.isConfigured()) {
      return []
    }

    try {
      const now = new Date()
      const oneMonthLater = new Date()
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

      const events = await this.getEvents(now, oneMonthLater)
      
      return events
        .filter(event => event.summary && event.summary.includes('Consultation'))
        .slice(0, maxResults)

    } catch (error) {
      console.error('Error getting upcoming appointments:', error)
      return []
    }
  }
}

// Export singleton instance
export const googleCalendarAPI = new GoogleCalendarAPI()

// Helper function to create a consultation calendar event
export async function createConsultationCalendarEvent(
  appointmentData: AppointmentData,
  zoomMeetingUrl?: string
): Promise<any> {
  try {
    return await googleCalendarAPI.createAppointmentEvent(appointmentData, zoomMeetingUrl)
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    return null
  }
}

// Helper function to check availability using Google Calendar
export async function checkGoogleCalendarAvailability(
  date: Date,
  timeSlots: string[]
): Promise<{ time: string, available: boolean }[]> {
  return await googleCalendarAPI.checkAvailability(date, timeSlots)
}