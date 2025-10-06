import type { Metadata } from 'next'
import SoftwareDevelopmentPageClient from './SoftwareDevelopmentPageClient'

export const metadata: Metadata = {
  title: 'Custom Software Development Services | Enterprise Solutions & Business Applications | CVC Web Solutions',
  description: 'Professional custom software development for ERP, CRM, business intelligence, workflow automation, and enterprise applications. Scalable solutions built with modern technologies.',
  openGraph: {
    title: 'Custom Software Development Services | Enterprise Solutions',
    description: 'Build tailored software solutions for your unique business needs. ERP, CRM, automation, and custom enterprise applications.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/software-development',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Software Development Services | CVC Web Solutions',
    description: 'Professional custom software for ERP, CRM, automation, and enterprise applications. Tailored solutions for your business.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/software-development',
  },
}

export default function SoftwareDevelopmentPage() {
  return <SoftwareDevelopmentPageClient />
}
