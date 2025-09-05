import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'

// Meeting analytics and dashboard data
export async function GET(request: NextRequest) {
  try {
    const appointments = globalThis.appointments || new Map()
    const allAppointments = Array.from(appointments.values())

    // Calculate meeting statistics
    const stats = {
      total: allAppointments.length,
      completed: allAppointments.filter(apt => apt.status === 'completed').length,
      inProgress: allAppointments.filter(apt => apt.status === 'in_progress').length,
      upcoming: allAppointments.filter(apt => apt.status === 'confirmed').length,
      cancelled: allAppointments.filter(apt => apt.status === 'cancelled').length,
      
      // Meeting activity stats
      clientJoinRate: calculateClientJoinRate(allAppointments),
      averageDuration: calculateAverageDuration(allAppointments),
      recordingCount: allAppointments.filter(apt => apt.recordings?.length > 0).length,
      
      // Recent activity
      recentMeetings: getRecentMeetingActivity(allAppointments, 10),
      
      // Daily summary
      todaysMeetings: getTodaysMeetings(allAppointments),
      
      // Service breakdown
      serviceStats: getServiceStats(allAppointments)
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching meeting dashboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateClientJoinRate(appointments: any[]): number {
  const meetingsWithParticipants = appointments.filter(apt => apt.participants?.length > 0)
  if (meetingsWithParticipants.length === 0) return 0

  const meetingsWithClients = meetingsWithParticipants.filter(apt => apt.clientJoined)
  return Math.round((meetingsWithClients.length / meetingsWithParticipants.length) * 100)
}

function calculateAverageDuration(appointments: any[]): number {
  const completedMeetings = appointments.filter(apt => 
    apt.status === 'completed' && apt.zoomActivity?.completed?.data?.duration
  )

  if (completedMeetings.length === 0) return 30 // Default 30 minutes

  const totalDuration = completedMeetings.reduce((sum, apt) => 
    sum + (apt.zoomActivity.completed.data.duration || 0), 0
  )

  return Math.round(totalDuration / completedMeetings.length)
}

function getRecentMeetingActivity(appointments: any[], limit: number): any[] {
  return appointments
    .filter(apt => apt.lastActivity)
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, limit)
    .map(apt => ({
      id: apt.id,
      name: apt.name,
      service: apt.service,
      status: apt.status,
      lastActivity: apt.lastActivity,
      duration: apt.zoomActivity?.completed?.data?.duration,
      clientJoined: apt.clientJoined
    }))
}

function getTodaysMeetings(appointments: any[]): any[] {
  const today = format(new Date(), 'yyyy-MM-dd')
  
  return appointments
    .filter(apt => apt.date && apt.date.startsWith(today))
    .map(apt => ({
      id: apt.id,
      name: apt.name,
      email: apt.email,
      service: apt.service,
      time: apt.time,
      status: apt.status,
      zoomJoinUrl: apt.zoomJoinUrl,
      clientJoined: apt.clientJoined,
      duration: apt.zoomActivity?.completed?.data?.duration
    }))
}

function getServiceStats(appointments: any[]): any[] {
  const serviceMap = new Map()

  appointments.forEach(apt => {
    const service = apt.service || 'general'
    if (!serviceMap.has(service)) {
      serviceMap.set(service, {
        service,
        total: 0,
        completed: 0,
        cancelled: 0,
        totalDuration: 0,
        avgDuration: 0
      })
    }

    const stats = serviceMap.get(service)
    stats.total++
    
    if (apt.status === 'completed') {
      stats.completed++
      if (apt.zoomActivity?.completed?.data?.duration) {
        stats.totalDuration += apt.zoomActivity.completed.data.duration
      }
    } else if (apt.status === 'cancelled') {
      stats.cancelled++
    }
  })

  // Calculate averages
  serviceMap.forEach(stats => {
    if (stats.completed > 0) {
      stats.avgDuration = Math.round(stats.totalDuration / stats.completed)
    }
  })

  return Array.from(serviceMap.values())
    .sort((a, b) => b.total - a.total)
}