'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for growing businesses',
    price: '$49',
    yearly: '$499',
    savings: 'Save $89',
    features: [
      '1 WordPress/Magento Site',
      'Fully Managed Server',
      'Automatic Updates',
      'Daily Backups',
      'SSL Certificate',
      '24/7 Monitoring',
      'Email Support',
    ],
  },
  {
    name: 'Professional',
    description: 'Most popular choice',
    price: '$79',
    yearly: '$799',
    savings: 'Save $149',
    popular: true,
    features: [
      'Up to 3 Sites',
      'Fully Managed Server',
      'Automatic Updates',
      'Hourly Backups',
      'Staging Environment',
      'Performance Optimization',
      'Priority Support',
    ],
  },
  {
    name: 'Business',
    description: 'For high-traffic sites',
    price: '$129',
    yearly: '$1,299',
    savings: 'Save $249',
    features: [
      'Up to 5 Sites',
      'Dedicated Resources',
      'Automatic Everything',
      'Real-time Backups',
      'Multiple Staging',
      'Advanced Security',
      'Phone & Priority Support',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Transparent Managed Hosting Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete managed hosting with optional maintenance services. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                plan.popular
                  ? 'ring-2 ring-blue-600 scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-gray-600">/month</span>
                </div>
                <p className="mt-2 text-sm text-green-600 font-semibold">
                  {plan.yearly}/year ({plan.savings})
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Enterprise Solutions</h3>
            <p className="text-lg mb-6">
              Need unlimited sites, dedicated servers, or custom configurations?
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600">
          <strong>Optional Maintenance Services Available:</strong> Add comprehensive maintenance including 
          content updates, plugin management, and technical support to any plan.
        </p>
      </div>
    </section>
  )
}