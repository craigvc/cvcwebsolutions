import type { Metadata } from 'next'
import AISolutionsPageClient from './AISolutionsPageClient'

export const metadata: Metadata = {
  title: 'AI Solutions & Machine Learning Services | Chatbots, Automation & Custom AI | CVC Web Solutions',
  description: 'Professional AI solutions including intelligent chatbots, knowledge management systems, custom AI models, and process automation. Transform your business with artificial intelligence.',
  openGraph: {
    title: 'AI Solutions & Machine Learning Services | Transform Your Business',
    description: 'Intelligent chatbots, knowledge management, custom AI models, and process automation. Professional AI solutions powered by OpenAI, Claude, and cutting-edge ML technologies.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/ai-solutions',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions AI Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Solutions & Machine Learning Services | CVC Web Solutions',
    description: 'Transform your business with AI-powered chatbots, automation, and custom machine learning solutions.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/ai-solutions',
  },
}

export default function AISolutionsPage() {
  return <AISolutionsPageClient />
}
