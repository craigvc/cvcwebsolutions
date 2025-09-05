'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, PenTool, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  status: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    confirmedAppointments: 0,
    portfolioProjects: 0,
    blogPosts: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load appointments
      const appointmentsRes = await fetch('/api/appointments/admin');
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        const appts = appointmentsData.appointments || [];
        setAppointments(appts);
        
        setStats(prev => ({
          ...prev,
          totalAppointments: appts.length,
          confirmedAppointments: appts.filter((a: any) => a.status === 'confirmed').length
        }));
      }

      // Load content stats
      const [portfolioRes, blogRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/blog')
      ]);
      
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setStats(prev => ({
          ...prev,
          portfolioProjects: portfolioData.projects?.length || 0
        }));
      }
      
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setStats(prev => ({
          ...prev,
          blogPosts: blogData.posts?.length || 0
        }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/admin/appointments'
    },
    {
      title: 'Confirmed',
      value: stats.confirmedAppointments,
      icon: Users,
      color: 'bg-green-500',
      href: '/admin/appointments'
    },
    {
      title: 'Portfolio Projects',
      value: stats.portfolioProjects,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/admin/portfolio'
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: PenTool,
      color: 'bg-orange-500',
      href: '/admin/blog'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={stat.href} className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/portfolio"
              className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Add New Portfolio Project
            </Link>
            <Link
              href="/admin/blog/generate"
              className="block px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Generate Blog with AI
            </Link>
            <Link
              href="/admin/appointments"
              className="block px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              View Appointments
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• New appointment scheduled</p>
            <p>• Blog post published</p>
            <p>• Portfolio project updated</p>
            <p>• System backup completed</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-800 font-medium">Today</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}