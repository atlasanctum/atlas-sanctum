import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw, Lock } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed: Date;
  permissions: string[];
  status: 'active' | 'revoked';
  requestCount: number;
}

const apiKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_a7b9c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    created: new Date('2023-01-15'),
    lastUsed: new Date(Date.now() - 10 * 60000),
    permissions: ['read', 'write', 'delete'],
    status: 'active',
    requestCount: 145623,
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    key: 'sk_live_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    created: new Date('2023-05-22'),
    lastUsed: new Date(Date.now() - 30 * 60000),
    permissions: ['read'],
    status: 'active',
    requestCount: 78432,
  },
  {
    id: '3',
    name: 'Mobile App Integration',
    key: 'sk_live_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8',
    created: new Date('2023-08-10'),
    lastUsed: new Date(Date.now() - 2 * 60 * 60000),
    permissions: ['read', 'write'],
    status: 'active',
    requestCount: 34219,
  },
  {
    id: '4',
    name: 'Legacy Integration',
    key: 'sk_live_w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4',
    created: new Date('2022-12-01'),
    lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60000),
    permissions: ['read'],
    status: 'revoked',
    requestCount: 12847,
  },
];

export function APIConfiguration() {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 12)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success toast
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    if (diff < 43200) return `${Math.floor(diff / 1440)}d ago`;
    return formatDate(date);
  };

  const activeKeys = apiKeys.filter(k => k.status === 'active').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Key className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          API Configuration
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage API keys, endpoints, and integration settings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total API Keys</p>
          <p className="text-xl sm:text-2xl">{apiKeys.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Keys</p>
          <p className="text-xl sm:text-2xl text-emerald-600">{activeKeys}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Requests</p>
          <p className="text-xl sm:text-2xl">271K</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Rate Limit</p>
          <p className="text-xl sm:text-2xl">10K/hr</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span className="hidden sm:inline">Keys are encrypted at rest</span>
          <span className="sm:hidden">Encrypted</span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create API Key</span>
          <span className="sm:hidden">New Key</span>
        </button>
      </div>

      {/* API Keys List - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">API Key</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Permissions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Created</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Last Used</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Requests</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id} className={`hover:bg-gray-50 transition-colors ${key.status === 'revoked' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{key.name}</p>
                      {key.status === 'revoked' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Revoked</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {showKeys[key.id] ? key.key : maskKey(key.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {showKeys[key.id] ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {key.permissions.map(perm => (
                        <span key={perm} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(key.created)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatLastUsed(key.lastUsed)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{key.requestCount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Keys Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        {apiKeys.map((key) => (
          <div key={key.id} className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${key.status === 'revoked' ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm mb-1">{key.name}</p>
                {key.status === 'revoked' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Revoked</span>
                )}
              </div>
              <button className="p-1">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 overflow-hidden">
                  {showKeys[key.id] ? key.key : maskKey(key.key)}
                </code>
                <button onClick={() => toggleKeyVisibility(key.id)} className="p-1 hover:bg-gray-100 rounded">
                  {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copyToClipboard(key.key)} className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {key.permissions.map(perm => (
                <span key={perm} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                  {perm}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{formatDate(key.created)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Used</p>
                <p className="text-gray-900">{formatLastUsed(key.lastUsed)}</p>
              </div>
              <div>
                <p className="text-gray-500">Requests</p>
                <p className="text-gray-900">{key.requestCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-base sm:text-lg mb-4">Quick Start Guide</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-600 mb-2">1. Authentication Header:</p>
            <code className="block bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <div>
            <p className="text-gray-600 mb-2">2. Base URL:</p>
            <code className="block bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              https://api.atlassanctum.io/v1
            </code>
          </div>
          <div>
            <p className="text-gray-600 mb-2">3. Example Request:</p>
            <code className="block bg-gray-100 p-3 rounded text-xs overflow-x-auto whitespace-pre">
{`curl https://api.atlassanctum.io/v1/impact/carbon \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </code>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl mb-4">Create New API Key</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm mb-1">Key Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Production API Key"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Permissions</label>
                <div className="space-y-2">
                  {['read', 'write', 'delete'].map(perm => (
                    <label key={perm} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
