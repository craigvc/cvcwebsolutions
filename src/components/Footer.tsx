import Link from 'next/link'
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/cvc-logo.png" 
              alt="CVC Web Solutions" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 mb-4">
              Creating digital solutions that make a real difference. 20+ years of experience serving diverse industries worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-development" className="text-gray-400 hover:text-white">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-development" className="text-gray-400 hover:text-white">
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link href="/services/ecommerce" className="text-gray-400 hover:text-white">
                  E-Commerce Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/ai-solutions" className="text-gray-400 hover:text-white">
                  AI Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/hosting" className="text-gray-400 hover:text-white">
                  Managed Hosting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">+49 (0)30 3387 5008</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@cvcwebsolutions.com" className="text-gray-400 hover:text-white">
                  info@cvcwebsolutions.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Berlin, Germany<br />
                  Global Service Coverage
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CVC Web Solutions. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}