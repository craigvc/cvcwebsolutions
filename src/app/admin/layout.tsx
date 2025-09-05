'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Shield,
  Calendar,
  FileText,
  PenTool,
  BarChart3,
  Camera,
  Sparkles,
  Settings,
  Globe,
  Database,
  Menu,
  X,
  Home,
  LogOut,
  DollarSign,
  Users
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/admin');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      // Only redirect to login if not authenticated and not already on login page
      if (!data.authenticated && pathname !== '/admin') {
        router.push('/admin');
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (pathname !== '/admin') {
        router.push('/admin');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin', { method: 'DELETE' });
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login page without layout
  if (!isAuthenticated && pathname === '/admin') {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/admin');
    return null;
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin',
      exact: true
    },
    {
      title: 'Content Management',
      items: [
        {
          title: 'Portfolio Projects',
          icon: FileText,
          href: '/admin/portfolio',
          description: 'Manage case studies'
        },
        {
          title: 'Blog Posts',
          icon: PenTool,
          href: '/admin/blog',
          description: 'Create and edit blog content'
        },
        {
          title: 'AI Generator',
          icon: Sparkles,
          href: '/admin/blog/generate',
          description: 'Generate content with AI'
        }
      ]
    },
    {
      title: 'Tools',
      items: [
        {
          title: 'Screenshot Tool',
          icon: Camera,
          href: '/admin/screenshot',
          description: 'Capture website screenshots'
        },
        {
          title: 'Website Analyzer',
          icon: Globe,
          href: '/admin/analyzer',
          description: 'Analyze website content'
        },
        {
          title: 'Analytics',
          icon: BarChart3,
          href: '/admin/analytics',
          description: 'View content metrics'
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Appointments',
          icon: Calendar,
          href: '/admin/appointments',
          description: 'Manage consultations'
        },
        {
          title: 'Settings',
          icon: Settings,
          href: '/admin/settings',
          description: 'System configuration'
        }
      ]
    }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">CVC Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Administrator</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-16 bottom-0 z-30 overflow-hidden`}>
          <nav className="p-4 space-y-6 overflow-y-auto h-full">
            {menuItems.map((section, index) => (
              <div key={index}>
                {section.href ? (
                  <Link
                    href={section.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(section.href, section.exact)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </Link>
                ) : (
                  <>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items?.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive(item.href)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{item.title}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500">{item.description}</div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}