import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Zoom webhook event types we want to handle
const ZOOM_EVENT_TYPES = {
  MEETING_STARTED: 'meeting.started',
  MEETING_ENDED: 'meeting.ended',
  MEETING_PARTICIPANT_JOINED: 'meeting.participant_joined',
  MEETING_PARTICIPANT_LEFT: 'meeting.participant_left',
  MEETING_UPDATED: 'meeting.updated',
  MEETING_DELETED: 'meeting.deleted',
  RECORDING_COMPLETED: 'recording.completed'
}

// Verify Zoom webhook signature
function verifyZoomWebhook(payload: string, signature: string, secretToken: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secretToken)
      .update(payload)
      .digest('hex')
    
    // Handle different signature formats
    const cleanSignature = signature.replace('v0=', '').replace('sha256=', '')
    
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.warn('Webhook signature verification failed:', error)
    return false
  }
}

// Update appointment status in database
function updateAppointmentStatus(meetingId: string, status: string, data: any) {
  const appointments = globalThis.appointments || new Map()
  
  // Find appointment by Zoom meeting ID
  for (const [token, appointment] of appointments.entries()) {
    if (appointment.zoomMeetingId === meetingId) {
      appointments.set(token, {
        ...appointment,
        status,
        lastActivity: new Date().toISOString(),
        zoomActivity: {
          ...appointment.zoomActivity,
          [status]: {
            timestamp: new Date().toISOString(),
            data
          }
        }
      })
      console.log(`Updated appointment ${appointment.id} status to ${status}`)
      break
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-zm-signature')
    
    // Verify webhook signature (if secret token is configured)
    const secretToken = process.env.ZOOM_WEBHOOK_SECRET_TOKEN
    if (secretToken && secretToken !== 'your_webhook_secret_token' && signature) {
      if (!verifyZoomWebhook(body, signature, secretToken)) {
        console.error('Invalid Zoom webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else {
      console.log('Webhook signature verification skipped (no secret token configured)')
    }

    const event = JSON.parse(body)
    const eventType = event.event
    const payload = event.payload

    console.log(`Received Zoom webhook: ${eventType}`)

    switch (eventType) {
      case ZOOM_EVENT_TYPES.MEETING_STARTED:
        handleMeetingStarted(payload)
        break

      case ZOOM_EVENT_TYPES.MEETING_ENDED:
        handleMeetingEnded(payload)
        break

      case ZOOM_EVENT_TYPES.MEETING_PARTICIPANT_JOINED:
        handleParticipantJoined(payload)
        break

      case ZOOM_EVENT_TYPES.MEETING_PARTICIPANT_LEFT:
        handleParticipantLeft(payload)
        break

      case ZOOM_EVENT_TYPES.MEETING_UPDATED:
        handleMeetingUpdated(payload)
        break

      case ZOOM_EVENT_TYPES.MEETING_DELETED:
        handleMeetingDeleted(payload)
        break

      case ZOOM_EVENT_TYPES.RECORDING_COMPLETED:
        handleRecordingCompleted(payload)
        break

      default:
        console.log(`Unhandled Zoom event type: ${eventType}`)
    }

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('Error processing Zoom webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function handleMeetingStarted(payload: any) {
  const meetingId = payload.object.id
  const hostId = payload.object.host_id
  const topic = payload.object.topic
  const startTime = payload.object.start_time

  console.log(`📹 Meeting Started: ${topic} (ID: ${meetingId})`)
  
  updateAppointmentStatus(meetingId, 'in_progress', {
    startTime,
    hostId,
    topic
  })

  // TODO: Send notification to client that meeting has started
  // TODO: Update Google Calendar event status
}

function handleMeetingEnded(payload: any) {
  const meetingId = payload.object.id
  const topic = payload.object.topic
  const endTime = payload.object.end_time
  const duration = payload.object.duration

  console.log(`📹 Meeting Ended: ${topic} (Duration: ${duration} min)`)
  
  updateAppointmentStatus(meetingId, 'completed', {
    endTime,
    duration,
    topic
  })

  // TODO: Send follow-up email to client
  // TODO: Update appointment analytics
}

function handleParticipantJoined(payload: any) {
  const meetingId = payload.object.id
  const participant = payload.object.participant
  
  console.log(`👤 Participant joined: ${participant.user_name} in meeting ${meetingId}`)
  
  // Track participant activity
  const appointments = globalThis.appointments || new Map()
  for (const [token, appointment] of appointments.entries()) {
    if (appointment.zoomMeetingId === meetingId) {
      const participants = appointment.participants || []
      participants.push({
        name: participant.user_name,
        email: participant.email,
        joinTime: new Date().toISOString(),
        userId: participant.user_id
      })
      
      appointments.set(token, {
        ...appointment,
        participants,
        clientJoined: participant.email === appointment.email || participants.length > 1
      })
      break
    }
  }
}

function handleParticipantLeft(payload: any) {
  const meetingId = payload.object.id
  const participant = payload.object.participant
  
  console.log(`👤 Participant left: ${participant.user_name} from meeting ${meetingId}`)
  
  // Update participant leave time
  const appointments = globalThis.appointments || new Map()
  for (const [token, appointment] of appointments.entries()) {
    if (appointment.zoomMeetingId === meetingId) {
      const participants = appointment.participants || []
      const participantIndex = participants.findIndex((p: any) => p.userId === participant.user_id)
      
      if (participantIndex !== -1) {
        participants[participantIndex].leaveTime = new Date().toISOString()
        appointments.set(token, { ...appointment, participants })
      }
      break
    }
  }
}

function handleMeetingUpdated(payload: any) {
  const meetingId = payload.object.id
  const topic = payload.object.topic
  
  console.log(`📝 Meeting Updated: ${topic} (ID: ${meetingId})`)
  
  updateAppointmentStatus(meetingId, 'updated', {
    topic,
    updatedAt: new Date().toISOString()
  })

  // TODO: Sync updates with Google Calendar
  // TODO: Notify client of meeting changes
}

function handleMeetingDeleted(payload: any) {
  const meetingId = payload.object.id
  const topic = payload.object.topic
  
  console.log(`🗑️ Meeting Deleted: ${topic} (ID: ${meetingId})`)
  
  updateAppointmentStatus(meetingId, 'cancelled', {
    deletedAt: new Date().toISOString(),
    reason: 'meeting_deleted_in_zoom'
  })

  // TODO: Update Google Calendar
  // TODO: Notify client of cancellation
}

function handleRecordingCompleted(payload: any) {
  const meetingId = payload.object.id
  const recordings = payload.object.recording_files
  
  console.log(`🎥 Recording completed for meeting ${meetingId}`)
  
  // Store recording information
  const appointments = globalThis.appointments || new Map()
  for (const [token, appointment] of appointments.entries()) {
    if (appointment.zoomMeetingId === meetingId) {
      appointments.set(token, {
        ...appointment,
        recordings: recordings.map((recording: any) => ({
          id: recording.id,
          meetingId: recording.meeting_id,
          recordingStart: recording.recording_start,
          recordingEnd: recording.recording_end,
          fileType: recording.file_type,
          fileSize: recording.file_size,
          downloadUrl: recording.download_url,
          playUrl: recording.play_url
        }))
      })
      
      console.log(`📹 Stored ${recordings.length} recordings for appointment ${appointment.id}`)
      break
    }
  }

  // TODO: Send email with recording links to client
  // TODO: Store recordings securely
}

// GET endpoint for webhook validation
export async function GET(request: NextRequest) {
  // Zoom webhook validation endpoint
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    return new Response(challenge, {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
  
  return NextResponse.json({ status: 'Zoom webhook endpoint active' })
}