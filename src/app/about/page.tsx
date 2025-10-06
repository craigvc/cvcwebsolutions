import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us | 20+ Years of Impact-Driven Development | CVC Web Solutions',
  description: 'Learn about CVC Web Solutions - 20+ years building technology that makes a difference. Serving 25,000+ lives with custom software development for impact-driven organizations.',
  openGraph: {
    title: 'About CVC Web Solutions | Impact-Driven Development Since 2003',
    description: '20+ years building technology that makes a difference. From conservation education to e-commerce, we create digital solutions with purpose.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/about',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CVC Web Solutions | 20+ Years of Excellence',
    description: '20+ years building technology that makes a difference. Impact-driven development for organizations that matter.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/about',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}