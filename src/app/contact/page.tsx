import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us | Get Started with Your Project | CVC Web Solutions',
  description: 'Contact CVC Web Solutions for web development, mobile apps, e-commerce, AI solutions, and custom software. Get a free consultation and quote for your next project.',
  openGraph: {
    title: 'Contact CVC Web Solutions | Start Your Project Today',
    description: 'Get in touch with our expert team for web development, mobile apps, e-commerce solutions, and custom software development. Free consultation available.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/contact',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Contact',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact CVC Web Solutions | Start Your Project',
    description: 'Get in touch for web development, mobile apps, e-commerce solutions, and custom software. Free consultation available.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/contact',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}