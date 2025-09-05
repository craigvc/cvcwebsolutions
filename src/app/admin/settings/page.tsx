'use client';

import { useState } from 'react';
import { Settings, Save, Database, Globe, Mail, Video } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'CVC Web Solutions',
    siteUrl: 'http://localhost:8010',
    adminEmail: 'admin@cvcwebsolutions.com',
    googleCalendarId: 'craig@cvcwebsolutions.com',
    zoomEnabled: true,
    emailNotifications: true,
    autoBackup: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      // Mock save for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure your admin panel and website settings</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            Integration Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Calendar ID</label>
              <input
                type="email"
                value={settings.googleCalendarId}
                onChange={(e) => setSettings({ ...settings, googleCalendarId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Zoom Integration</label>
              <button
                onClick={() => setSettings({ ...settings, zoomEnabled: !settings.zoomEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.zoomEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } transition-colors`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.zoomEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-500" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <button
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                } transition-colors`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            Backup Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Automatic Backup</label>
              <button
                onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                } transition-colors`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>

        {saved && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}