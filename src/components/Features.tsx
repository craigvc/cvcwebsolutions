import { Shield, Database, Zap, Users, RefreshCw, Globe } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Cloudflare CDN, Imunify360 protection, WAF firewall, and 24/7 security monitoring keep your sites safe.',
  },
  {
    icon: Database,
    title: 'Daily JetBackup',
    description: 'Automated daily backups with 30-day retention. Instant restore capabilities for peace of mind.',
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'NVMe SSD storage, LiteSpeed/Nginx servers, Redis caching, and HTTP/3 support for blazing speeds.',
  },
  {
    icon: RefreshCw,
    title: 'Managed Updates',
    description: 'We handle major upgrades manually for stability, plus weekly security patches and plugin updates.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'WordPress & Magento specialists available 24/7. Average response time under 5 minutes.',
  },
  {
    icon: Globe,
    title: 'Global Infrastructure',
    description: '33 data centers worldwide, 10Gbps network, 99.99% uptime SLA with redundant systems.',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Complete Hands-Off Hosting Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Focus on your business while we handle all the technical details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="relative p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}