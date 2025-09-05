export default function Stats() {
  const stats = [
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '0.3s', label: 'Average Load Time' },
    { value: '24/7', label: 'Expert Support' },
    { value: '33+', label: 'Global Data Centers' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}