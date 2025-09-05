'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Shield, BarChart, Settings } from 'lucide-react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a small delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted))
    setShowBanner(false)
    // Here you would initialize analytics/marketing scripts
    console.log('All cookies accepted')
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly))
    setShowBanner(false)
    console.log('Only necessary cookies accepted')
  }

  const handleSavePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('cookieConsent', JSON.stringify(savedPreferences))
    setShowBanner(false)
    setShowDetails(false)
    console.log('Cookie preferences saved:', savedPreferences)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-all duration-300"
        onClick={() => {/* Prevent closing on overlay click per GDPR */}}
      />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-500 transform">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {!showDetails ? (
              /* Main Banner */
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Cookie className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Cookie Consent</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        We value your privacy and comply with GDPR
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can also customize your preferences 
                  or accept only necessary cookies. For more information, please read our{' '}
                  <a href="/privacy-policy" className="text-purple-600 underline hover:text-purple-700">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/cookie-policy" className="text-purple-600 underline hover:text-purple-700">
                    Cookie Policy
                  </a>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
                  >
                    Accept All Cookies
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Necessary Only
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Cookie Settings
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  This website is operated by Adoptavia Germany UG (trading as CVC Web Solutions), a company registered in Germany. 
                  We are committed to protecting your privacy in accordance with the EU General Data Protection Regulation (GDPR).
                </p>
              </div>
            ) : (
              /* Detailed Settings */
              <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Cookie Settings</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">Necessary Cookies</h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Always Active</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          These cookies are essential for the website to function properly. They enable basic functions 
                          like page navigation and access to secure areas of the website. The website cannot function 
                          properly without these cookies.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="mt-1 w-5 h-5 text-purple-600 rounded cursor-not-allowed opacity-50"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          These cookies help us understand how visitors interact with our website by collecting and 
                          reporting information anonymously. This helps us improve our website and services.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Providers: Google Analytics, Hotjar
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                        className="mt-1 w-5 h-5 text-purple-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Cookie className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          These cookies are used to track visitors across websites. The intention is to display ads 
                          that are relevant and engaging for the individual user.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Providers: Google Ads, Facebook Pixel, LinkedIn Insight
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                        className="mt-1 w-5 h-5 text-purple-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Preference Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          These cookies enable the website to remember choices you make (such as your language preference 
                          or the region you are in) and provide enhanced, more personal features.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => setPreferences({...preferences, preferences: e.target.checked})}
                        className="mt-1 w-5 h-5 text-purple-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    Save My Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    For more information about how we use cookies, please visit our{' '}
                    <a href="/cookie-policy" className="text-purple-600 underline">Cookie Policy</a>.
                    You can withdraw or change your consent at any time from our{' '}
                    <a href="/privacy-settings" className="text-purple-600 underline">Privacy Settings</a> page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}