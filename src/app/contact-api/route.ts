import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #1a365d; margin-bottom: 20px; text-align: center;">
            📩 New Contact Form Submission
          </h1>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
            <h2 style="color: #1565c0; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242; width: 140px;">Name:</td>
                <td style="padding: 8px 0; color: #212121;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242;">Email:</td>
                <td style="padding: 8px 0; color: #212121;">${email}</td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242;">Phone:</td>
                <td style="padding: 8px 0; color: #212121;">${phone}</td>
              </tr>
              ` : ''}
              ${company ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242;">Company:</td>
                <td style="padding: 8px 0; color: #212121;">${company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242;">Service:</td>
                <td style="padding: 8px 0; color: #212121;">${service.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</td>
              </tr>
              ${budget ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #424242;">Budget:</td>
                <td style="padding: 8px 0; color: #212121;">${budget}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9c27b0;">
            <h3 style="color: #7b1fa2; margin-top: 0;">💬 Message</h3>
            <p style="color: #4a148c; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              📧 Contact form submission from CVC Web Solutions website
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using Gmail API
    await sendEmail({
      to: 'craig@cvcwebsolutions.com',
      subject: `🎯 New Contact Form: ${name} - ${service.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
