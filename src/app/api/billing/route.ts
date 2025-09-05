import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'
import { fossBillingService, createInvoiceForAppointment } from '@/lib/fossbilling'

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
    const { action, appointmentToken, data } = body

    switch (action) {
      case 'create_invoice': {
        // Get appointment from token
        const appointments = globalThis.appointments || new Map()
        const appointment = appointments.get(appointmentToken)
        
        if (!appointment) {
          return NextResponse.json(
            { error: 'Appointment not found' },
            { status: 404 }
          )
        }

        const invoice = await createInvoiceForAppointment(appointment)
        
        if (invoice) {
          // Update appointment with invoice info
          const updatedAppointment = {
            ...appointment,
            invoiceId: invoice.id,
            invoiceStatus: invoice.status,
            lastActivity: new Date().toISOString()
          }
          appointments.set(appointmentToken, updatedAppointment)

          return NextResponse.json({
            success: true,
            invoice,
            message: 'Invoice created successfully'
          })
        } else {
          return NextResponse.json(
            { error: 'Failed to create invoice - FOSSBilling not configured' },
            { status: 503 }
          )
        }
      }

      case 'get_stats': {
        const stats = await fossBillingService.getDashboardStats()
        return NextResponse.json({
          success: true,
          stats
        })
      }

      case 'get_invoices': {
        const invoices = await fossBillingService.getInvoices()
        return NextResponse.json({
          success: true,
          invoices
        })
      }

      case 'mark_paid': {
        if (!data.invoiceId) {
          return NextResponse.json(
            { error: 'Invoice ID is required' },
            { status: 400 }
          )
        }

        await fossBillingService.markInvoiceAsPaid(data.invoiceId)
        
        return NextResponse.json({
          success: true,
          message: 'Invoice marked as paid'
        })
      }

      case 'create_payment_link': {
        if (!data.invoiceId) {
          return NextResponse.json(
            { error: 'Invoice ID is required' },
            { status: 400 }
          )
        }

        const paymentUrl = await fossBillingService.createPaymentLink(data.invoiceId)
        
        return NextResponse.json({
          success: true,
          paymentUrl,
          message: 'Payment link created'
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Billing API error:', error)
    return NextResponse.json(
      { error: 'Failed to process billing request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Check admin authentication
  if (!authService.isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'config': {
        return NextResponse.json({
          configured: fossBillingService.isConfigured(),
          apiUrl: process.env.FOSSBILLING_API_URL || 'Not configured'
        })
      }

      case 'stats': {
        const stats = await fossBillingService.getDashboardStats()
        return NextResponse.json({ stats })
      }

      case 'invoices': {
        const invoices = await fossBillingService.getInvoices()
        return NextResponse.json({ invoices })
      }

      case 'products': {
        const products = await fossBillingService.getProducts()
        return NextResponse.json({ products })
      }

      default: {
        // Return general billing information
        const [stats, invoices, products] = await Promise.all([
          fossBillingService.getDashboardStats(),
          fossBillingService.getInvoices(),
          fossBillingService.getProducts()
        ])

        return NextResponse.json({
          configured: fossBillingService.isConfigured(),
          stats,
          invoices: invoices.slice(0, 10), // Latest 10 invoices
          products
        })
      }
    }

  } catch (error) {
    console.error('Billing GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}