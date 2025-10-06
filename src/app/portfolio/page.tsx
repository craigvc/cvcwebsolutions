import type { Metadata } from 'next'
import { PortfolioPageClient } from './PortfolioPageClient'

export const metadata: Metadata = {
  title: 'Our Portfolio | Web & Mobile Development Projects | CVC Web Solutions',
  description: 'Explore our portfolio of successful web applications, mobile apps, e-commerce platforms, and AI solutions. 20+ years delivering exceptional digital experiences.',
  openGraph: {
    title: 'CVC Web Solutions Portfolio | Our Work & Projects',
    description: 'Explore our portfolio of web applications, mobile apps, e-commerce platforms, and custom software solutions.',
    type: 'website',
    url: 'https://cvcwebsolutions.com/portfolio',
    images: [
      {
        url: 'https://cvcwebsolutions.com/cvc-logo.png',
        width: 1200,
        height: 630,
        alt: 'CVC Web Solutions Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVC Web Solutions Portfolio | Our Work',
    description: 'Explore our portfolio of web applications, mobile apps, e-commerce platforms, and custom software.',
    images: ['https://cvcwebsolutions.com/cvc-logo.png'],
  },
  alternates: {
    canonical: 'https://cvcwebsolutions.com/portfolio',
  },
}

// Server component to fetch data
async function getPortfolioProjects() {
  try {
    // Use internal URL for server-side fetching
    const port = process.env.PORT || '3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error('Portfolio API response not ok:', response.status)
      return []
    }
    
    const data = await response.json()
    
    // Handle both array and docs format
    const projects = Array.isArray(data) ? data : (data.docs || [])
    
    // Transform projects from Payload format
    const transformedProjects = projects.map((project: any) => ({
      ...project,
      achievements: project.achievements?.map((a: any) => 
        typeof a === 'string' ? a : a.achievement
      ) || [],
      technologies: project.technologies?.map((t: any) => 
        typeof t === 'string' ? t : t.technology
      ) || [],
      tags: project.tags?.map((t: any) => 
        typeof t === 'string' ? t : t.tag
      ) || [],
      image: project.image?.url || '',
      // Include the new images field for different contexts
      images: project.images || {},
      image_url: project.image_url || ''
    }))
    
    return transformedProjects
  } catch (error) {
    console.error('Error fetching portfolio projects:', error)
    return []
  }
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects()
  
  return <PortfolioPageClient initialProjects={projects} />
}
