import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import Process from '@/components/home/Process'
import Technologies from '@/components/home/Technologies'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Portfolio from '@/components/home/Portfolio'
import CTA from '@/components/home/CTA'

export const metadata: Metadata = {
  title: 'CVC Web Solutions | Custom Web Development, Mobile Apps & AI Solutions',
  description: 'Expert web development, mobile apps, e-commerce, and AI solutions. 20+ years building custom software that drives business growth. WordPress, React, Next.js, and more.',
  openGraph: {
    title: 'CVC Web Solutions | Custom Software Development',
    description: 'Expert web development, mobile apps, e-commerce, and AI solutions. 20+ years of experience delivering exceptional results.',
    type: 'website',
    url: 'https://cvcwebsolutions.com',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVC Web Solutions | Custom Software Development',
    description: 'Expert web development, mobile apps, e-commerce, and AI solutions. 20+ years of experience.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Hero />
      <Services />
      <Process />
      <Technologies />
      <WhyChooseUs />
      <Portfolio />
      <CTA />
    </main>
  )
}