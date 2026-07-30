import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Globe, Mail, Zap, Database, Palette, Lock } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Atlas Sanctum',
    siteUrl: 'https://atlassanctum.io',
    adminEmail: 'admin@atlassanctum.io',
    timezone: 'UTC',
    language: 'en',
    emailNotifications: true,
    slackNotifications: false,
    webhookNotifications: true,
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    ipWhitelist: '',
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    maxUploadSize: '100',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Save logic here
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
          System Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Tabs - Mobile Dropdown, Desktop Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Mobile Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">General Settings</h3>
                
                <div>
                  <label className="block text-sm mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Administrator Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive alerts via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm">Slack Notifications</p>
                        <p className="text-xs text-gray-500">Post alerts to Slack channels</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.slackNotifications}
                      onChange={(e) => setSettings({...settings, slackNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm">Webhook Notifications</p>
                        <p className="text-xs text-gray-500">Send events to external webhooks</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.webhookNotifications}
                      onChange={(e) => setSettings({...settings, webhookNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm mb-2">Notification Email Recipients</label>
                  <textarea
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Security Settings</h3>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Require 2FA for all users</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                    className="rounded"
                  />
                </label>

                <div>
                  <label className="block text-sm mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Password Policy</label>
                  <select
                    value={settings.passwordPolicy}
                    onChange={(e) => setSettings({...settings, passwordPolicy: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value="weak">Weak (8+ characters)</option>
                    <option value="medium">Medium (10+ chars, mixed case)</option>
                    <option value="strong">Strong (12+ chars, mixed, numbers, symbols)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">IP Whitelist (one per line)</label>
                  <textarea
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({...settings, ipWhitelist: e.target.value})}
                    placeholder="192.168.1.0/24&#10;10.0.0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Third-Party Integrations</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm">Slack Integration</p>
                          <p className="text-xs text-gray-500">Connected</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">
                        Disconnect
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Slack Webhook URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm">SendGrid (Email)</p>
                          <p className="text-xs text-gray-500">Not connected</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                        Connect
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm">AWS S3 Storage</p>
                          <p className="text-xs text-gray-500">Connected</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Appearance Settings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-16 h-10 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="w-16 h-10 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm mb-2">Preview</p>
                  <div className="flex gap-2">
                    <div 
                      className="w-20 h-20 rounded-lg shadow-sm"
                      style={{ backgroundColor: settings.primaryColor }}
                    ></div>
                    <div 
                      className="w-20 h-20 rounded-lg shadow-sm"
                      style={{ backgroundColor: settings.secondaryColor }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-lg mb-4">Advanced Settings</h3>
                
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Disable public access</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm">Debug Mode</p>
                      <p className="text-xs text-gray-500">Enable verbose logging</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                    className="rounded"
                  />
                </label>

                <div>
                  <label className="block text-sm mb-2">Log Level</label>
                  <select
                    value={settings.logLevel}
                    onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Max Upload Size (MB)</label>
                  <input
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={handleSave}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
