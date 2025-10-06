import type { Metadata } from 'next'
import ServicesPageClient from './ServicesPageClient'

export const metadata: Metadata = {
  title: 'Professional Web Development & Digital Solutions Services | CVC Web Solutions',
  description: 'Comprehensive web development, mobile apps, e-commerce, AI solutions, custom software, UI/UX design, and managed hosting services. 20+ years of experience delivering results.',
  openGraph: {
    title: 'Professional Digital Solutions & Web Development Services',
    description: 'Full-stack web development, mobile apps, e-commerce, AI solutions, and custom software. Expert team with 20+ years experience.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Digital Solutions Services | CVC Web Solutions',
    description: 'Full-stack web development, mobile apps, e-commerce, AI solutions, and custom software. 20+ years experience.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
