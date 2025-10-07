import { NextRequest, NextResponse } from 'next/server'
import { createConsultationMeeting, zoomAPI } from '@/lib/zoom'
import { createConsultationCalendarEvent, checkGoogleCalendarAvailability } from '@/lib/google-calendar'
import { sendEmail, createHostNotificationEmail } from '@/lib/email'
import { createInvoiceForAppointment, fossBillingService } from '@/lib/fossbilling'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, service, date, time, message } = body

    // Validate required fields
    if (!name || !email || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse date and time
    const appointmentDate = new Date(date)
    const [hours, minutes] = time.split(':').map(Number)
    appointmentDate.setHours(hours, minutes, 0, 0)

    // Check availability using both Zoom and Google Calendar
    let zoomAvailable = true
    let calendarAvailable = true
    
    // Check Google Calendar availability
    try {
      const calendarAvailability = await checkGoogleCalendarAvailability(appointmentDate, [time])
      const calendarSlot = calendarAvailability.find(slot => slot.time === time)
      calendarAvailable = calendarSlot?.available ?? true
    } catch (error) {
      console.error('Calendar availability check failed:', error)
    }
    
    // Check Zoom availability if configured
    try {
      if (zoomAPI.isConfigured()) {
        const zoomAvailability = await zoomAPI.checkAvailability(appointmentDate)
        const zoomSlot = zoomAvailability.find(slot => slot.time === time)
        zoomAvailable = zoomSlot?.available ?? true
      }
    } catch (error) {
      console.error('Zoom availability check failed:', error)
    }
    
    if (!zoomAvailable || !calendarAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available' },
        { status: 409 }
      )
    }

    // Create Zoom meeting
    let zoomMeeting = null
    try {
      if (zoomAPI.isConfigured()) {
        zoomMeeting = await createConsultationMeeting(
          name,
          email,
          service,
          appointmentDate,
          30 // 30 minutes duration
        )
        console.log('Zoom meeting created successfully')
      } else {
        console.warn('Zoom API not configured - appointment will be created without Zoom meeting')
      }
    } catch (zoomError) {
      console.error('Zoom API Error:', zoomError)
      // Continue without Zoom meeting - appointment can still be created
    }

    // Create Google Calendar event
    let calendarEvent = null
    try {
      calendarEvent = await createConsultationCalendarEvent(
        {
          name,
          email,
          phone,
          company,
          service,
          date: appointmentDate,
          time,
          message,
          duration: 30
        },
        zoomMeeting?.join_url
      )
    } catch (calendarError) {
      console.error('Google Calendar Error:', calendarError)
      // Continue without calendar event for demo purposes
    }

    // In a real application, you would:
    // 1. Save the appointment to a database
    // 2. Send confirmation emails to both client and company
    // 3. Add the meeting to calendar systems
    // 4. Set up reminders

    // Generate management token for appointment
    const managementToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Mock database save
    const appointment = {
      id: `apt_${Date.now()}`,
      token: managementToken,
      name,
      email,
      phone,
      company,
      service,
      date: appointmentDate.toISOString(),
      time,
      message,
      zoomMeetingId: zoomMeeting?.id,
      zoomJoinUrl: zoomMeeting?.join_url,
      zoomPassword: zoomMeeting?.password,
      calendarEventId: calendarEvent?.id,
      calendarEventUrl: calendarEvent?.htmlLink,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }

    // Note: FOSSBilling integration available for hosting services
    // Consultations are free - billing is only for hosting packages
    console.log('Free consultation booked - FOSSBilling available for hosting services')

    // Store in mock database for management API
    const appointments = globalThis.appointments || (globalThis.appointments = new Map())
    appointments.set(managementToken, appointment)

    // Send confirmation email to client (mock implementation)
    await sendConfirmationEmail(appointment)

    // Send notification email to host (you!)
    await sendHostNotificationEmail(appointment)

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        date: format(appointmentDate, 'EEEE, MMMM d, yyyy'),
        time: time,
        zoomJoinUrl: appointment.zoomJoinUrl,
        zoomPassword: appointment.zoomPassword
      }
    })

  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const requestedDate = new Date(date)
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00'
    ]
    
    // Check availability using both Zoom and Google Calendar
    let zoomAvailability: any[] = []
    let calendarAvailability: any[] = []
    
    // Check Google Calendar availability
    try {
      calendarAvailability = await checkGoogleCalendarAvailability(requestedDate, timeSlots)
    } catch (error) {
      console.error('Calendar availability check failed:', error)
      // Default to all available if calendar check fails
      calendarAvailability = timeSlots.map(time => ({ time, available: true }))
    }
    
    // Check Zoom availability if configured
    try {
      if (zoomAPI.isConfigured()) {
        zoomAvailability = await zoomAPI.checkAvailability(requestedDate)
      } else {
        console.warn('Zoom API not configured - using Google Calendar availability only')
        zoomAvailability = timeSlots.map(time => ({ time, available: true }))
      }
    } catch (error) {
      console.error('Zoom availability check failed:', error)
      // Default to all available if Zoom check fails
      zoomAvailability = timeSlots.map(time => ({ time, available: true }))
    }
    
    // Combine both availability checks (both must be available)
    const combinedAvailability = timeSlots.map(time => {
      const zoomSlot = zoomAvailability.find(slot => slot.time === time)
      const calendarSlot = calendarAvailability.find(slot => slot.time === time)
      
      return {
        time,
        available: (zoomSlot?.available ?? true) && (calendarSlot?.available ?? true)
      }
    })

    return NextResponse.json({
      date: format(requestedDate, 'yyyy-MM-dd'),
      availability: combinedAvailability
    })

  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

// Mock email sending function
async function sendConfirmationEmail(appointment: any): Promise<void> {
  // In a real implementation, you would use a service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Resend
  
  const emailContent = {
    to: appointment.email,
    subject: `Appointment Confirmed - ${appointment.service} Consultation`,
    html: `
      <h2>Your Consultation is Confirmed!</h2>
      <p>Hi ${appointment.name},</p>
      <p>Thank you for scheduling a consultation with CVC Web Solutions. Here are your appointment details:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Service:</strong> ${appointment.service}</p>
        <p><strong>Date:</strong> ${format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Duration:</strong> 30 minutes</p>
        ${appointment.company ? `<p><strong>Company:</strong> ${appointment.company}</p>` : ''}
      </div>

      ${appointment.zoomJoinUrl ? `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Join Zoom Meeting</h3>
          <p><strong>Meeting URL:</strong> <a href="${appointment.zoomJoinUrl}">${appointment.zoomJoinUrl}</a></p>
          ${appointment.zoomPassword ? `<p><strong>Meeting Password:</strong> ${appointment.zoomPassword}</p>` : ''}
        </div>
      ` : ''}

      <p>We look forward to discussing your project and how we can help bring your vision to life!</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
        <h3>Manage Your Appointment</h3>
        <p>Need to reschedule or cancel? Use this secure link:</p>
        <p><a href="https://cvcwebsolutions.com/manage-appointment/${appointment.token}" style="color: #2196F3; font-weight: bold;">Manage Appointment</a></p>
      </div>

      <p>Best regards,<br>
      CVC Web Solutions Team</p>
      
      <hr>
      <p style="font-size: 12px; color: #666;">
        You can manage this appointment using the link above, or contact us directly at info@cvcwebsolutions.com or +49 1520 9992503.
      </p>
    `
  }

  // Mock email sending - in production, integrate with actual email service
  console.log('Confirmation email would be sent:', emailContent)
}

// Send notification email to host
async function sendHostNotificationEmail(appointment: any): Promise<void> {
  try {
    const hostEmail = 'craig@cvcwebsolutions.com'
    const formattedDate = format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')
    
    const emailData = {
      ...appointment,
      formattedDate,
      service: appointment.service
    }

    await sendEmail({
      to: hostEmail,
      subject: `🎯 New Appointment: ${appointment.name} - ${emailData.service}`,
      html: createHostNotificationEmail(emailData)
    })

    console.log('Host notification email sent to:', hostEmail)
  } catch (error) {
    console.error('Failed to send host notification email:', error)
  }
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}