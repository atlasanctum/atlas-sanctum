import React, { useState } from 'react';
import { Search, Bell, Settings, User, LogOut, Moon, Sun } from 'lucide-react';

interface TopBarProps {
  currentView: string;
}

export function TopBar({ currentView }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'DAO Proposal Approved',
      message: 'Proposal #089 has been successfully executed',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Treasury Alert',
      message: 'Liquidity below recommended threshold',
      time: '15 min ago',
      unread: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'AI Model Updated',
      message: 'Carbon Optimizer v2.1 deployed successfully',
      time: '1 hour ago',
      unread: false,
    },
  ];

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'overview':
        return 'Regenerative Systems Map';
      case 'ai-console':
        return 'Moral AI Console';
      case 'blockchain':
        return 'Blockchain & Asset Monitor';
      case 'impact':
        return 'Impact Intelligence Dashboard';
      case 'knowledge':
        return 'Knowledge Repository Hub';
      case 'finance':
        return 'Regenerative Finance Console';
      case 'governance':
        return 'DAO Governance';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Current View Title */}
        <div className="ml-12 lg:ml-0">
          <h2 className="text-lg sm:text-xl">{getViewTitle(currentView)}</h2>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Real-time command intelligence</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                <input
                  type="text"
                  placeholder="Search across all systems..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  autoFocus
                />
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500 px-2">Quick Actions</p>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm">
                    View DAO Proposal #089
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm">
                    Check Carbon Offset Stats
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm">
                    AI Model Performance
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm">Notifications</h3>
                    <button className="text-xs text-purple-600 hover:text-purple-700">
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.type === 'success'
                              ? 'bg-emerald-500'
                              : notif.type === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm mb-1">{notif.title}</p>
                          <p className="text-xs text-gray-600 mb-1">{notif.message}</p>
                          <p className="text-xs text-gray-400">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings - Hidden on mobile */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-sm">Dr. Elena Chen</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm">Dr. Elena Chen</p>
                      <p className="text-xs text-gray-500">elena.chen@atlassanctum.io</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    My Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    Settings
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full text-left px-3 py-2 hover:bg-red-50 rounded text-sm flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status Bar - Hidden on mobile */}
      <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 text-xs overflow-x-auto hidden md:flex">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">All Systems Operational</span>
        </div>
        <div className="w-px h-3 bg-gray-300"></div>
        <span className="text-gray-500 whitespace-nowrap">AI Models: 12/12 Active</span>
        <div className="w-px h-3 bg-gray-300"></div>
        <span className="text-gray-500 whitespace-nowrap">Blockchain: Synced</span>
        <div className="w-px h-3 bg-gray-300"></div>
        <span className="text-gray-500 whitespace-nowrap">DAO: 3 Active Proposals</span>
        <div className="w-px h-3 bg-gray-300 hidden lg:block"></div>
        <span className="text-gray-500 whitespace-nowrap hidden lg:inline">Last Updated: Just now</span>
      </div>
    </div>
  );
}