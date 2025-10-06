import type { Metadata } from 'next'
import MobileDevelopmentPageClient from './MobileDevelopmentPageClient'

export const metadata: Metadata = {
  title: 'Mobile App Development Services | iOS & Android Apps | CVC Web Solutions',
  description: 'Professional mobile app development for iOS and Android. Native and cross-platform apps with React Native, Flutter, Swift, and Kotlin. Expert mobile development team.',
  openGraph: {
    title: 'Mobile App Development Services | iOS & Android',
    description: 'Build stunning native and cross-platform mobile apps for iOS and Android. Expert development with React Native, Flutter, Swift, and Kotlin.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/mobile-development',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Mobile Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development Services | CVC Web Solutions',
    description: 'Professional iOS and Android app development. Native and cross-platform mobile apps built for success.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/mobile-development',
  },
}

export default function MobileDevelopmentPage() {
  return <MobileDevelopmentPageClient />
}
