// Email service using Gmail API
import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

class GmailService {
  private auth: JWT | null = null
  private gmail: any = null

  constructor() {
    this.initializeAuth()
  }

  private initializeAuth() {
    try {
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
        this.auth = new JWT({
          email: process.env.GOOGLE_CLIENT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/gmail.send'],
          // Use your email for sending
          subject: 'craig@cvcwebsolutions.com'
        })

        this.gmail = google.gmail({ version: 'v1', auth: this.auth })
        console.log('Gmail service initialized')
      } else {
        console.warn('Google credentials not found - email notifications disabled')
      }
    } catch (error) {
      console.error('Failed to initialize Gmail service:', error)
    }
  }

  isConfigured(): boolean {
    return this.auth !== null && this.gmail !== null
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured()) {
      console.log('Gmail not configured - email would be sent:', options.subject)
      return false
    }

    try {
      // Create email message
      const emailLines = [
        `To: ${options.to}`,
        `From: ${options.from || 'CVC Appointments <craig@cvcwebsolutions.com>'}`,
        `Subject: ${options.subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        options.html
      ]

      const email = emailLines.join('\r\n')
      const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      })

      console.log('Email sent successfully via Gmail:', response.data.id)
      return true

    } catch (error) {
      console.error('Gmail sending error:', error)
      return false
    }
  }
}

const gmailService = new GmailService()

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  return await gmailService.sendEmail(options)
}

// Host notification email template
export function createHostNotificationEmail(appointmentData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #1a365d; margin-bottom: 20px; text-align: center;">
          🎯 New Appointment Scheduled!
        </h1>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
          <h2 style="color: #1565c0; margin-top: 0;">Meeting Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242; width: 120px;">Client:</td>
              <td style="padding: 8px 0; color: #212121;">${appointmentData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Email:</td>
              <td style="padding: 8px 0; color: #212121;">${appointmentData.email}</td>
            </tr>
            ${appointmentData.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Phone:</td>
              <td style="padding: 8px 0; color: #212121;">${appointmentData.phone}</td>
            </tr>
            ` : ''}
            ${appointmentData.company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Company:</td>
              <td style="padding: 8px 0; color: #212121;">${appointmentData.company}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Service:</td>
              <td style="padding: 8px 0; color: #212121;">${appointmentData.service.replace('-', ' ').toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Date:</td>
              <td style="padding: 8px 0; color: #212121; font-weight: bold;">${appointmentData.formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #424242;">Time:</td>
              <td style="padding: 8px 0; color: #212121; font-weight: bold;">${appointmentData.time}</td>
            </tr>
          </table>
        </div>

        ${appointmentData.zoomJoinUrl ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <h3 style="color: #e65100; margin-top: 0;">📹 Zoom Meeting Created</h3>
          <p style="margin: 10px 0;"><strong>Meeting URL:</strong></p>
          <a href="${appointmentData.zoomJoinUrl}" style="display: inline-block; background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
            Join Zoom Meeting
          </a>
          <p style="margin: 10px 0; font-size: 14px; color: #666;">
            Meeting ID: ${appointmentData.zoomJoinUrl.split('/j/')[1] || 'N/A'}
          </p>
        </div>
        ` : ''}

        ${appointmentData.message ? `
        <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9c27b0;">
          <h3 style="color: #7b1fa2; margin-top: 0;">💬 Client Message</h3>
          <p style="color: #4a148c; font-style: italic; margin: 0; line-height: 1.5;">
            "${appointmentData.message}"
          </p>
        </div>
        ` : ''}

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; text-align: center;">
          <h3 style="color: #2e7d32; margin-top: 0;">📊 Quick Actions</h3>
          <div style="margin: 15px 0;">
            <a href="https://zoom.us/meeting" style="display: inline-block; background: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; font-size: 14px;">
              View in Zoom
            </a>
            <a href="https://calendar.google.com" style="display: inline-block; background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; font-size: 14px;">
              View Calendar
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin: 5px 0;">
            📧 Automated notification from CVC Appointment System
          </p>
          <p style="color: #666; font-size: 12px; margin: 5px 0;">
            ID: ${appointmentData.id} | Token: ${appointmentData.token}
          </p>
        </div>
      </div>
    </div>
  `
}