import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({
      config,
    })
    
    // Payload is already initialized when calling getPayload
    // Just return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payload initialized successfully' 
    })
  } catch (error) {
    console.error('Payload initialization error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
