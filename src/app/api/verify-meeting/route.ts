import { NextRequest, NextResponse } from 'next/server'
import { zoomAPI } from '@/lib/zoom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const meetingId = searchParams.get('id') || '83243165895'

  try {
    const token = await zoomAPI.getAccessToken()
    
    // Get specific meeting details
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const meeting = await response.json()
      return NextResponse.json({
        exists: true,
        meeting: {
          id: meeting.id,
          topic: meeting.topic,
          start_time: meeting.start_time,
          duration: meeting.duration,
          join_url: meeting.join_url,
          status: meeting.status,
          host_email: meeting.host_email
        }
      })
    } else {
      const error = await response.text()
      return NextResponse.json({
        exists: false,
        error: error,
        status: response.status
      })
    }

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}