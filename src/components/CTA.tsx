import { Check } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Experience Truly Managed Hosting?
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
          Join businesses that trust us for their WordPress and Magento hosting. 
          Get your free migration and consultation today.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Free Migration</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>30-Day Money Back</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>No Setup Fees</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>24/7 Support</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </a>
          <a
            href="tel:1800HOSTING"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            Call 1-800-HOSTING
          </a>
        </div>
      </div>
    </section>
  )
}