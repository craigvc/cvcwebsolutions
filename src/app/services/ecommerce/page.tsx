import type { Metadata } from 'next'
import EcommercePageClient from './EcommercePageClient'

export const metadata: Metadata = {
  title: 'E-Commerce Development Services | WooCommerce, Shopify & Magento | CVC Web Solutions',
  description: 'Professional e-commerce development services for online stores. Expert WooCommerce, Shopify, Magento, and custom e-commerce solutions with payment integration, inventory management, and conversion optimization.',
  openGraph: {
    title: 'E-Commerce Development Services | Build Your Online Store',
    description: 'Build powerful online stores that convert. Expert e-commerce development with WooCommerce, Shopify, Magento, and custom solutions.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/ecommerce',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions E-Commerce Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Development Services | CVC Web Solutions',
    description: 'Build powerful online stores that convert. Expert e-commerce development with WooCommerce, Shopify, Magento, and custom solutions.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/ecommerce',
  },
}

export default function EcommercePage() {
  return <EcommercePageClient />
}