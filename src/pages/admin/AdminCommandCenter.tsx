import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import Layout from '../../components/Layout';

const AdminCommandCenter: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, dashboard, unreadAlerts, unreadNotifications } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-slate-400">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-8 bg-slate-900 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Command Center</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300">
              {user?.role || 'admin'}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{dashboard?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-white mt-1">{unreadAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Notifications</p>
                <p className="text-3xl font-bold text-white mt-1">{unreadNotifications}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Health</p>
                <p className="text-3xl font-bold text-white mt-1 capitalize">{dashboard?.systemHealth || 'unknown'}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                dashboard?.systemHealth === 'healthy' ? 'bg-green-600/20' : 
                dashboard?.systemHealth === 'warning' ? 'bg-amber-600/20' : 'bg-red-600/20'
              }`}>
                <svg className={`w-6 h-6 ${
                  dashboard?.systemHealth === 'healthy' ? 'text-green-400' : 
                  dashboard?.systemHealth === 'warning' ? 'text-amber-400' : 'text-red-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Links */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/admin/flags" className="flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Feature Flags</p>
                <p className="text-slate-400 text-sm">Manage platform features</p>
              </div>
            </a>

            <a href="/dashboard/administrator" className="flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Administrator Dashboard</p>
                <p className="text-slate-400 text-sm">Manage all platform users</p>
              </div>
            </a>

            <a href="/settings" className="flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Settings</p>
                <p className="text-slate-400 text-sm">Platform configuration</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dashboard.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'error' ? 'bg-red-500' :
                    activity.severity === 'warning' ? 'bg-amber-500' :
                    activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white">{activity.message}</p>
                    <p className="text-slate-400 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCommandCenter;
