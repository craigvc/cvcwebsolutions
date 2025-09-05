import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Check admin authentication
  if (!authService.isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    // Get all appointments from mock database
    const appointments = globalThis.appointments || new Map()
    
    // Convert Map to array and sort by creation date
    const appointmentsList = Array.from(appointments.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Add some analytics
    const stats = {
      total: appointmentsList.length,
      confirmed: appointmentsList.filter(a => a.status === 'confirmed').length,
      cancelled: appointmentsList.filter(a => a.status === 'cancelled').length,
      completed: appointmentsList.filter(a => a.status === 'completed').length,
      inProgress: appointmentsList.filter(a => a.status === 'in_progress').length,
      rescheduled: appointmentsList.filter(a => a.status === 'rescheduled').length
    }

    return NextResponse.json({
      appointments: appointmentsList,
      stats,
      success: true
    })

  } catch (error) {
    console.error('Admin appointments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!authService.isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { action, appointmentId, data } = body

    const appointments = globalThis.appointments || new Map()
    
    switch (action) {
      case 'update_status':
        // Find and update appointment status
        for (const [token, appointment] of appointments.entries()) {
          if (appointment.id === appointmentId) {
            const updatedAppointment = {
              ...appointment,
              status: data.status,
              lastActivity: new Date().toISOString(),
              adminNotes: data.notes || appointment.adminNotes
            }
            appointments.set(token, updatedAppointment)
            
            return NextResponse.json({
              success: true,
              appointment: updatedAppointment,
              message: 'Appointment status updated successfully'
            })
          }
        }
        
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )

      case 'add_note':
        // Add admin note to appointment
        for (const [token, appointment] of appointments.entries()) {
          if (appointment.id === appointmentId) {
            const notes = appointment.adminNotes || []
            notes.push({
              note: data.note,
              timestamp: new Date().toISOString(),
              admin: true
            })
            
            const updatedAppointment = {
              ...appointment,
              adminNotes: notes,
              lastActivity: new Date().toISOString()
            }
            appointments.set(token, updatedAppointment)
            
            return NextResponse.json({
              success: true,
              appointment: updatedAppointment,
              message: 'Note added successfully'
            })
          }
        }
        
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        )

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Admin appointment action error:', error)
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin authentication
  if (!authService.isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const appointments = globalThis.appointments || new Map()
    
    // Find and delete appointment
    for (const [token, appointment] of appointments.entries()) {
      if (appointment.id === appointmentId) {
        appointments.delete(token)
        
        return NextResponse.json({
          success: true,
          message: 'Appointment deleted successfully'
        })
      }
    }

    return NextResponse.json(
      { error: 'Appointment not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Admin appointment deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}