'use client'

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  gradient: string
}

export default function StatsCard({ title, value, change, icon, gradient }: StatsCardProps) {
  return (
    <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-xl rounded-xl dark:bg-gray-800 group hover:shadow-2xl">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 bg-gradient-to-r ${gradient} rounded-lg shadow-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
