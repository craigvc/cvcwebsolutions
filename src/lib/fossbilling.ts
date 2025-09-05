// FOSSBilling API Integration
// Handles billing and invoicing integration with FOSSBilling

interface FOSSBillingConfig {
  apiUrl: string
  apiKey: string
  adminEmail: string
}

interface Client {
  id?: number
  email: string
  first_name: string
  last_name: string
  company?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  created_at?: string
  updated_at?: string
}

interface Product {
  id?: number
  title: string
  type: 'service' | 'product'
  status: 'active' | 'inactive'
  price: number
  setup_price?: number
  description?: string
  category?: string
}

interface Invoice {
  id?: number
  client_id: number
  status: 'paid' | 'unpaid' | 'cancelled'
  total: number
  currency: string
  created_at?: string
  due_at?: string
  items?: InvoiceItem[]
}

interface InvoiceItem {
  title: string
  price: number
  quantity: number
  description?: string
}

class FOSSBillingService {
  private config: FOSSBillingConfig

  constructor() {
    this.config = {
      apiUrl: process.env.FOSSBILLING_API_URL || 'http://localhost/fossbilling',
      apiKey: process.env.FOSSBILLING_API_KEY || '',
      adminEmail: process.env.FOSSBILLING_ADMIN_EMAIL || 'admin@cvcwebsolutions.com'
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiUrl && this.config.apiKey)
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    if (!this.isConfigured()) {
      throw new Error('FOSSBilling not configured. Please set FOSSBILLING_API_URL and FOSSBILLING_API_KEY')
    }

    const url = `${this.config.apiUrl}/api/${endpoint}`
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Key': this.config.apiKey
      }
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`FOSSBilling API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Client management
  async createClient(clientData: Omit<Client, 'id'>): Promise<Client> {
    const response = await this.makeRequest('admin/client', 'POST', clientData)
    return response
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    try {
      const response = await this.makeRequest(`admin/client/search?email=${encodeURIComponent(email)}`)
      return response.clients?.[0] || null
    } catch (error) {
      return null
    }
  }

  async getOrCreateClient(clientData: Omit<Client, 'id'>): Promise<Client> {
    // Try to find existing client
    const existingClient = await this.getClientByEmail(clientData.email)
    if (existingClient) {
      return existingClient
    }

    // Create new client
    return this.createClient(clientData)
  }

  // Product/Service management
  async createConsultationService(serviceType: string, price: number): Promise<Product> {
    const productData: Omit<Product, 'id'> = {
      title: `${serviceType} Consultation`,
      type: 'service',
      status: 'active',
      price,
      description: `Professional ${serviceType.replace('-', ' ')} consultation service`,
      category: 'consultation'
    }

    const response = await this.makeRequest('admin/product', 'POST', productData)
    return response
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.makeRequest('admin/product')
    return response.products || []
  }

  // Invoice management
  async createInvoiceForAppointment(appointment: any, servicePrice: number = 150): Promise<Invoice> {
    // Get or create client
    const client = await this.getOrCreateClient({
      email: appointment.email,
      first_name: appointment.name.split(' ')[0] || appointment.name,
      last_name: appointment.name.split(' ').slice(1).join(' ') || '',
      company: appointment.company || undefined,
      phone: appointment.phone || undefined
    })

    // Create invoice
    const invoiceData = {
      client_id: client.id!,
      currency: 'EUR', // Default currency
      status: 'unpaid',
      items: [
        {
          title: `${appointment.service.replace('-', ' ').toUpperCase()} Consultation`,
          description: `Consultation appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
          price: servicePrice,
          quantity: 1
        }
      ]
    }

    const response = await this.makeRequest('admin/invoice', 'POST', invoiceData)
    return response
  }

  async getInvoices(clientId?: number): Promise<Invoice[]> {
    const endpoint = clientId ? `admin/invoice?client_id=${clientId}` : 'admin/invoice'
    const response = await this.makeRequest(endpoint)
    return response.invoices || []
  }

  async markInvoiceAsPaid(invoiceId: number): Promise<void> {
    await this.makeRequest(`admin/invoice/${invoiceId}/paid`, 'POST')
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    try {
      const response = await this.makeRequest('admin/stats')
      return {
        totalRevenue: response.total_revenue || 0,
        totalInvoices: response.total_invoices || 0,
        paidInvoices: response.paid_invoices || 0,
        pendingInvoices: response.pending_invoices || 0,
        totalClients: response.total_clients || 0,
        monthlyRevenue: response.monthly_revenue || 0
      }
    } catch (error) {
      console.error('Failed to fetch FOSSBilling stats:', error)
      return {
        totalRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        totalClients: 0,
        monthlyRevenue: 0
      }
    }
  }

  // Create hosting packages (consultations are free)
  async createHostingPackages(): Promise<Product[]> {
    const packages = [
      { type: 'shared-hosting', price: 9.99, title: 'Shared Web Hosting', description: 'Perfect for small websites and blogs' },
      { type: 'vps-hosting', price: 29.99, title: 'VPS Hosting', description: 'Virtual private server with full control' },
      { type: 'dedicated-hosting', price: 199.99, title: 'Dedicated Server', description: 'Fully dedicated server resources' },
      { type: 'cloud-hosting', price: 49.99, title: 'Cloud Hosting', description: 'Scalable cloud infrastructure' },
      { type: 'managed-wordpress', price: 19.99, title: 'Managed WordPress', description: 'Optimized WordPress hosting with management' },
      { type: 'email-hosting', price: 4.99, title: 'Professional Email', description: 'Professional email hosting service' },
      { type: 'ssl-certificates', price: 39.99, title: 'SSL Certificates', description: 'Secure your website with SSL encryption' },
      { type: 'domain-registration', price: 12.99, title: 'Domain Registration', description: 'Register and manage your domain names' }
    ]

    const createdProducts: Product[] = []

    for (const pkg of packages) {
      try {
        const productData: Omit<Product, 'id'> = {
          title: pkg.title,
          type: 'service',
          status: 'active',
          price: pkg.price,
          description: pkg.description,
          category: 'hosting'
        }
        const product = await this.makeRequest('admin/product', 'POST', productData)
        createdProducts.push(product)
      } catch (error) {
        console.error(`Failed to create ${pkg.type} service:`, error)
      }
    }

    return createdProducts
  }

  // Payment processing
  async createPaymentLink(invoiceId: number): Promise<string> {
    const response = await this.makeRequest(`admin/invoice/${invoiceId}/payment-link`, 'POST')
    return response.payment_url || `${this.config.apiUrl}/invoice/${invoiceId}/pay`
  }
}

// Export singleton instance
export const fossBillingService = new FOSSBillingService()

// Helper functions for appointment integration
export async function createInvoiceForAppointment(appointment: any): Promise<Invoice | null> {
  if (!fossBillingService.isConfigured()) {
    console.warn('FOSSBilling not configured - skipping invoice creation')
    return null
  }

  try {
    // Determine service price based on type
    const servicePrices: { [key: string]: number } = {
      'web-development': 150,
      'mobile-development': 180,
      'ecommerce': 200,
      'ai-solutions': 250,
      'software-development': 300,
      'hosting': 100,
      'general': 120
    }

    const price = servicePrices[appointment.service] || 150
    return await fossBillingService.createInvoiceForAppointment(appointment, price)
  } catch (error) {
    console.error('Failed to create FOSSBilling invoice:', error)
    return null
  }
}

export async function initializeFOSSBillingServices(): Promise<void> {
  if (!fossBillingService.isConfigured()) {
    console.warn('FOSSBilling not configured - skipping service initialization')
    return
  }

  try {
    const existingProducts = await fossBillingService.getProducts()
    if (existingProducts.length === 0) {
      console.log('Creating hosting service packages in FOSSBilling...')
      await fossBillingService.createHostingPackages()
      console.log('FOSSBilling hosting packages created successfully')
    }
  } catch (error) {
    console.error('Failed to initialize FOSSBilling services:', error)
  }
}