import { Check } from 'lucide-react'

interface CTACustomizableProps {
  title?: string;
  subtitle?: string;
  showFeatures?: boolean;
  showButtons?: boolean;
}

export default function CTACustomizable({ 
  title = "Ready to Experience Truly Managed Hosting?",
  subtitle = "Join businesses that trust us for their WordPress and Magento hosting. Get your free migration and consultation today.",
  showFeatures = true,
  showButtons = true
}: CTACustomizableProps) {
  return (
    <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl mx-auto mb-8 text-xl text-blue-100">
          {subtitle}
        </p>

        {showFeatures && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Free Migration</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>24/7 Support</span>
            </div>
          </div>
        )}

        {showButtons && (
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              Start Free Trial
            </a>
            <a
              href="tel:1800HOSTING"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-blue-600"
            >
              Call 1-800-HOSTING
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
