// Zoom API Integration
// This file handles Zoom API interactions for appointment scheduling

interface ZoomMeetingRequest {
  topic: string
  type: 2 // Scheduled meeting
  start_time: string // ISO format
  duration: number // in minutes
  timezone: string
  password?: string
  settings: {
    host_video: boolean
    participant_video: boolean
    join_before_host: boolean
    mute_upon_entry: boolean
    waiting_room: boolean
    registrants_email_notification: boolean
  }
}

interface ZoomMeetingResponse {
  id: string
  host_id: string
  topic: string
  type: number
  status: string
  start_time: string
  duration: number
  timezone: string
  join_url: string
  password: string
  h323_password: string
  pstn_password: string
  encrypted_password: string
  settings: {
    host_video: boolean
    participant_video: boolean
    join_before_host: boolean
    mute_upon_entry: boolean
    waiting_room: boolean
  }
}

interface ZoomUser {
  id: string
  email: string
  first_name: string
  last_name: string
  type: number
  status: string
}

class ZoomAPI {
  private baseUrl = 'https://api.zoom.us/v2'
  private accountId: string
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null

  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID || ''
    this.clientId = process.env.ZOOM_CLIENT_ID || ''
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET || ''
  }

  // Check if Zoom API is properly configured
  isConfigured(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret)
  }

  // Get OAuth access token using Server-to-Server OAuth
  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: this.accountId
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    
    // Set token expiration (Zoom tokens expire in 1 hour)
    setTimeout(() => {
      this.accessToken = null
    }, (data.expires_in - 60) * 1000) // Refresh 1 minute before expiration

    return this.accessToken!
  }

  // Get user information
  async getUser(userId: string = 'me'): Promise<ZoomUser> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.statusText}`)
    }

    return response.json()
  }

  // Get user's meetings for availability checking
  async getUserMeetings(userId: string = 'me', from?: Date, to?: Date): Promise<any[]> {
    const token = await this.getAccessToken()
    
    const params = new URLSearchParams({
      type: 'scheduled',
      page_size: '100'
    })
    
    if (from) {
      params.append('from', from.toISOString().split('T')[0])
    }
    
    if (to) {
      params.append('to', to.toISOString().split('T')[0])
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/meetings?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get meetings: ${response.statusText}`)
    }

    const data = await response.json()
    return data.meetings || []
  }

  // Create a new meeting
  async createMeeting(meetingData: ZoomMeetingRequest, userId: string = 'me'): Promise<ZoomMeetingResponse> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/users/${userId}/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create meeting: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Update a meeting
  async updateMeeting(meetingId: string, meetingData: Partial<ZoomMeetingRequest>): Promise<void> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/meetings/${meetingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to update meeting: ${error.message || response.statusText}`)
    }
  }

  // Delete a meeting
  async deleteMeeting(meetingId: string): Promise<void> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to delete meeting: ${error.message || response.statusText}`)
    }
  }

  // Check availability for a specific date and time range
  async checkAvailability(date: Date, startHour: number = 9, endHour: number = 17): Promise<{ time: string, available: boolean }[]> {
    if (!this.isConfigured()) {
      throw new Error('Zoom API not configured. Please set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET environment variables.')
    }

    const meetings = await this.getUserMeetings('me', date, date)
    
    // Generate time slots (30-minute intervals)
    const timeSlots: { time: string, available: boolean }[] = []
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const slotDateTime = new Date(date)
        slotDateTime.setHours(hour, minute, 0, 0)
        
        // Check if this time slot conflicts with existing meetings
        const hasConflict = meetings.some(meeting => {
          const meetingStart = new Date(meeting.start_time)
          const meetingEnd = new Date(meetingStart.getTime() + (meeting.duration * 60 * 1000))
          
          return slotDateTime >= meetingStart && slotDateTime < meetingEnd
        })
        
        timeSlots.push({
          time: timeString,
          available: !hasConflict
        })
      }
    }
    
    return timeSlots
  }

}

// Export singleton instance
export const zoomAPI = new ZoomAPI()

// Helper function to create a consultation meeting
export async function createConsultationMeeting(
  clientName: string,
  clientEmail: string,
  service: string,
  dateTime: Date,
  duration: number = 30
): Promise<ZoomMeetingResponse> {
  if (!zoomAPI.isConfigured()) {
    throw new Error('Zoom API not configured. Please set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET environment variables.')
  }

  const meetingData: ZoomMeetingRequest = {
    topic: `${service} Consultation with ${clientName}`,
    type: 2,
    start_time: dateTime.toISOString(),
    duration,
    timezone: 'Europe/Berlin', // Your local timezone
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      waiting_room: true,
      registrants_email_notification: true
    }
  }

  return zoomAPI.createMeeting(meetingData)
}

// Helper function to check if a time slot is available
export async function isTimeSlotAvailable(date: Date, time: string): Promise<boolean> {
  const availability = await zoomAPI.checkAvailability(date)
  const slot = availability.find(slot => slot.time === time)
  return slot?.available || false
}