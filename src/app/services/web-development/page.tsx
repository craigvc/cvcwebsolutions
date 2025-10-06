import type { Metadata } from 'next'
import WebDevelopmentPageClient from './WebDevelopmentPageClient'

export const metadata: Metadata = {
  title: 'Custom Web Development Services | React, Next.js & Full-Stack Solutions | CVC Web Solutions',
  description: 'Professional web development services with React, Next.js, Node.js, and modern frameworks. Custom web applications, APIs, PWAs, and enterprise solutions built for performance and scalability.',
  openGraph: {
    title: 'Custom Web Development Services | Full-Stack Solutions',
    description: 'Build powerful web applications with React, Next.js, Node.js, and modern technologies. Custom web development for businesses of all sizes.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/web-development',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Development Services | CVC Web Solutions',
    description: 'Professional web development with React, Next.js, and modern frameworks. Build scalable web applications.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/web-development',
  },
}

export default function WebDevelopmentPage() {
  return <WebDevelopmentPageClient />
}
