import { NextRequest, NextResponse } from 'next/server'
import { googleCalendarAPI } from '@/lib/google-calendar'
import { zoomAPI } from '@/lib/zoom'

// Mock function to find appointment by token
function findAppointmentByToken(token: string) {
  const appointments = globalThis.appointments || new Map()
  return appointments.get(token) || null
}

// Mock function to update appointment
function updateAppointment(token: string, data: any) {
  const appointments = globalThis.appointments || new Map()
  const existing = appointments.get(token)
  if (existing) {
    appointments.set(token, { ...existing, ...data })
    return appointments.get(token)
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const appointment = findAppointmentByToken(token)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const { action, newDate, newTime } = body
    
    const appointment = findAppointmentByToken(token)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (appointment.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot modify cancelled appointment' },
        { status: 400 }
      )
    }

    if (action === 'reschedule') {
      if (!newDate || !newTime) {
        return NextResponse.json(
          { error: 'New date and time are required for rescheduling' },
          { status: 400 }
        )
      }

      // Update appointment data
      const updatedData = {
        date: newDate,
        time: newTime,
        status: 'rescheduled',
        updatedAt: new Date().toISOString()
      }

      // Update Google Calendar event
      if (appointment.calendarEventId && googleCalendarAPI.isConfigured()) {
        try {
          const appointmentDate = new Date(newDate)
          const [hours, minutes] = newTime.split(':').map(Number)
          appointmentDate.setHours(hours, minutes, 0, 0)
          
          const endDateTime = new Date(appointmentDate)
          endDateTime.setMinutes(appointmentDate.getMinutes() + 30)

          await googleCalendarAPI.updateAppointmentEvent(appointment.calendarEventId, {
            date: appointmentDate,
            time: newTime,
            name: appointment.name,
            email: appointment.email,
            phone: appointment.phone,
            company: appointment.company,
            service: appointment.service,
            message: appointment.message
          })
        } catch (error) {
          console.error('Error updating calendar event:', error)
          // Continue with appointment update even if calendar fails
        }
      }

      // Update Zoom meeting (if configured)
      if (appointment.zoomMeetingId && zoomAPI.isConfigured()) {
        try {
          // Zoom meetings typically need to be recreated for new times
          // For now, we'll keep the same meeting but in production you'd update it
          console.log('Zoom meeting would be updated for:', appointment.zoomMeetingId)
        } catch (error) {
          console.error('Error updating Zoom meeting:', error)
        }
      }

      const updated = updateAppointment(token, updatedData)
      
      return NextResponse.json({
        message: 'Appointment rescheduled successfully',
        appointment: updated
      })

    } else if (action === 'cancel') {
      // Update appointment status
      const updatedData = {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      }

      // Delete Google Calendar event
      if (appointment.calendarEventId && googleCalendarAPI.isConfigured()) {
        try {
          await googleCalendarAPI.deleteAppointmentEvent(appointment.calendarEventId)
        } catch (error) {
          console.error('Error deleting calendar event:', error)
          // Continue with cancellation even if calendar fails
        }
      }

      // Cancel Zoom meeting (if configured)
      if (appointment.zoomMeetingId && zoomAPI.isConfigured()) {
        try {
          // In production, you'd cancel the Zoom meeting here
          console.log('Zoom meeting would be cancelled for:', appointment.zoomMeetingId)
        } catch (error) {
          console.error('Error cancelling Zoom meeting:', error)
        }
      }

      const updated = updateAppointment(token, updatedData)
      
      return NextResponse.json({
        message: 'Appointment cancelled successfully',
        appointment: updated
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error managing appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}