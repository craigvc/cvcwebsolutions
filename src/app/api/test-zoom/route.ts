import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const accountId = process.env.ZOOM_ACCOUNT_ID
  const clientId = process.env.ZOOM_CLIENT_ID
  const clientSecret = process.env.ZOOM_CLIENT_SECRET

  console.log('Testing Zoom API Configuration:')
  console.log('Account ID:', accountId ? 'Set' : 'Missing')
  console.log('Client ID:', clientId ? 'Set' : 'Missing')
  console.log('Client Secret:', clientSecret ? 'Set' : 'Missing')

  if (!accountId || !clientId || !clientSecret) {
    return NextResponse.json({
      error: 'Missing Zoom credentials',
      details: {
        accountId: accountId ? 'Set' : 'Missing',
        clientId: clientId ? 'Set' : 'Missing',
        clientSecret: clientSecret ? 'Set' : 'Missing'
      }
    }, { status: 400 })
  }

  try {
    // Test OAuth token request
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    console.log('Making OAuth request to Zoom...')
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: accountId
      })
    })

    console.log('Zoom OAuth Response Status:', response.status)
    const responseText = await response.text()
    console.log('Zoom OAuth Response Body:', responseText)

    if (!response.ok) {
      return NextResponse.json({
        error: 'Zoom OAuth failed',
        status: response.status,
        statusText: response.statusText,
        details: responseText
      }, { status: 400 })
    }

    const tokenData = JSON.parse(responseText)
    console.log('Token scopes:', tokenData.scope)
    
    // Test API call with token
    const apiResponse = await fetch('https://api.zoom.us/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    const userData = await apiResponse.json()
    console.log('User API Response:', userData)
    
    // Test meeting creation
    let meetingTest = null
    try {
      const testMeeting = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: 'Test Meeting Creation',
          type: 2,
          start_time: new Date(Date.now() + 3600000).toISOString(),
          duration: 30,
          settings: {
            host_video: true,
            participant_video: true
          }
        })
      })
      
      if (testMeeting.ok) {
        const meetingData = await testMeeting.json()
        meetingTest = { success: true, meetingId: meetingData.id }
      } else {
        const errorText = await testMeeting.text()
        meetingTest = { success: false, error: errorText, status: testMeeting.status }
      }
    } catch (error: any) {
      meetingTest = { success: false, error: error.message }
    }
    
    return NextResponse.json({
      success: true,
      tokenReceived: !!tokenData.access_token,
      scopes: tokenData.scope,
      userInfo: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        account_id: userData.account_id
      },
      meetingCreateTest: meetingTest
    })

  } catch (error: any) {
    console.error('Zoom API Test Error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}