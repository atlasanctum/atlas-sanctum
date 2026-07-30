import React, { useState } from 'react';
import { Users, UserPlus, Search, MoreVertical, Shield, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'analyst' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: Date;
  joinedDate: Date;
  permissions: string[];
}

const users: User[] = [
  {
    id: '1',
    name: 'Dr. Elena Chen',
    email: 'elena.chen@atlassanctum.io',
    role: 'admin',
    status: 'active',
    lastActive: new Date(Date.now() - 5 * 60000),
    joinedDate: new Date('2023-01-15'),
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@atlassanctum.io',
    role: 'operator',
    status: 'active',
    lastActive: new Date(Date.now() - 20 * 60000),
    joinedDate: new Date('2023-03-22'),
    permissions: ['ai_console', 'blockchain', 'dao_governance'],
  },
  {
    id: '3',
    name: 'Aisha Patel',
    email: 'aisha.p@atlassanctum.io',
    role: 'analyst',
    status: 'active',
    lastActive: new Date(Date.now() - 2 * 60 * 60000),
    joinedDate: new Date('2023-05-10'),
    permissions: ['impact_dashboard', 'knowledge_hub', 'analytics'],
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@atlassanctum.io',
    role: 'operator',
    status: 'active',
    lastActive: new Date(Date.now() - 5 * 60 * 60000),
    joinedDate: new Date('2023-06-18'),
    permissions: ['refi_console', 'dao_governance'],
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    email: 'yuki.t@atlassanctum.io',
    role: 'viewer',
    status: 'inactive',
    lastActive: new Date(Date.now() - 48 * 60 * 60000),
    joinedDate: new Date('2023-08-05'),
    permissions: ['view_only'],
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'operator' | 'analyst' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [showAddUser, setShowAddUser] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'operator':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'analyst':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'viewer':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalUsers = users.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          User Management
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage platform users, roles, and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-xl sm:text-2xl">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-xl sm:text-2xl text-emerald-600">{activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Admins</p>
          <p className="text-xl sm:text-2xl">1</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Operators</p>
          <p className="text-xl sm:text-2xl">2</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Add User Button */}
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">User</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Last Active</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Joined</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.status)}
                      <span className="text-sm capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatLastActive(user.lastActive)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.joinedDate.toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Shield className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded transition-colors">
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

      {/* Users Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button className="p-1">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs border ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
                {getStatusIcon(user.status)}
                <span className="capitalize">{user.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Last Active</p>
                <p className="text-gray-900">{formatLastActive(user.lastActive)}</p>
              </div>
              <div>
                <p className="text-gray-500">Joined</p>
                <p className="text-gray-900">{user.joinedDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              <button className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs transition-colors">
                Permissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl mb-4">Add New User</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="john.doe@atlassanctum.io"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                  <option value="viewer">Viewer</option>
                  <option value="analyst">Analyst</option>
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
