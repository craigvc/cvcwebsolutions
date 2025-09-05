import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import Process from '@/components/home/Process'
import Technologies from '@/components/home/Technologies'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Portfolio from '@/components/home/Portfolio'
import CTA from '@/components/home/CTA'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">{/* GDPR Cookie Test */}
      <Hero />
      <Services />
      <Process />
      <Technologies />
      <WhyChooseUs />
      <Portfolio />
      <CTA />
    </div>
  )
}