export default function TechStack() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powered by Enterprise Technology
          </h2>
          <p className="text-xl text-gray-300">
            Industry-leading infrastructure for your WordPress and Magento sites
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-400 mb-2">Cloudflare</div>
            <p className="text-gray-400">Enterprise CDN</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-green-400 mb-2">JetBackup</div>
            <p className="text-gray-400">Daily Backups</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-400 mb-2">Imunify360</div>
            <p className="text-gray-400">Security Suite</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-red-400 mb-2">LiteSpeed</div>
            <p className="text-gray-400">Web Server</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-semibold mb-2">NVMe SSD</div>
            <p className="text-gray-400">10x faster than traditional SSDs</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-semibold mb-2">PHP 8.3</div>
            <p className="text-gray-400">Latest PHP with OPcache</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-semibold mb-2">10Gbps Network</div>
            <p className="text-gray-400">High-speed connectivity</p>
          </div>
        </div>
      </div>
    </section>
  )
}