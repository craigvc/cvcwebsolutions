import type { Metadata } from 'next'
import HostingPageClient from './HostingPageClient'

export const metadata: Metadata = {
  title: 'Managed WordPress & Magento Hosting | Enterprise Web Hosting Services | CVC Web Solutions',
  description: 'Enterprise-grade managed hosting for WordPress and Magento with 24/7 monitoring, daily backups, SSL certificates, and expert support. Powered by CloudLinux and LiteSpeed.',
  openGraph: {
    title: 'Managed WordPress & Magento Hosting Services',
    description: 'Enterprise hosting with 24/7 monitoring, daily backups, SSL certificates, and expert support. Optimized for WordPress and Magento.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/services/hosting',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Managed Hosting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Managed Web Hosting Services | CVC Web Solutions',
    description: 'Enterprise WordPress & Magento hosting with 24/7 monitoring, backups, and expert support. 99.9% uptime guarantee.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/services/hosting',
  },
}

export default function HostingPage() {
  return <HostingPageClient />
}
