import type { Metadata } from 'next'
import DesignPageClient from './DesignPageClient'

export const metadata: Metadata = {
  title: 'UI/UX Design Services | User Interface & Experience Design | CVC Web Solutions',
  description: 'Professional UI/UX design services for web and mobile applications. User research, wireframing, prototyping, design systems, and brand identity. Create exceptional user experiences.',
  openGraph: {
    title: 'UI/UX Design Services | Create Exceptional User Experiences',
    description: 'Research-driven UI/UX design for web and mobile. Beautiful interfaces, intuitive experiences, and comprehensive design systems.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/design',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions UI/UX Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI/UX Design Services | CVC Web Solutions',
    description: 'Professional UI/UX design that converts. User research, prototyping, design systems, and brand identity.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/design',
  },
}

export default function DesignPage() {
  return <DesignPageClient />
}
