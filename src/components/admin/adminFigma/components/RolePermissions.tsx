import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2, Users, Lock } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  color: string;
}

const roles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    users: 2,
    permissions: ['all'],
    color: 'purple',
  },
  {
    id: '2',
    name: 'AI Operator',
    description: 'Manage AI models and configurations',
    users: 5,
    permissions: ['ai.read', 'ai.write', 'ai.deploy', 'analytics.read'],
    color: 'blue',
  },
  {
    id: '3',
    name: 'Finance Manager',
    description: 'Oversee financial operations and transactions',
    users: 3,
    permissions: ['finance.read', 'finance.write', 'finance.approve', 'reports.read'],
    color: 'emerald',
  },
  {
    id: '4',
    name: 'DAO Coordinator',
    description: 'Manage governance proposals and voting',
    users: 8,
    permissions: ['dao.read', 'dao.write', 'dao.vote', 'community.read'],
    color: 'amber',
  },
  {
    id: '5',
    name: 'Analyst',
    description: 'Read-only access to analytics and reports',
    users: 12,
    permissions: ['analytics.read', 'reports.read', 'impact.read'],
    color: 'indigo',
  },
];

const permissionCategories = [
  {
    category: 'AI & Models',
    permissions: [
      { id: 'ai.read', label: 'View AI Models', description: 'View AI model configurations and status' },
      { id: 'ai.write', label: 'Edit AI Models', description: 'Modify AI model parameters' },
      { id: 'ai.deploy', label: 'Deploy Models', description: 'Deploy AI models to production' },
      { id: 'ai.delete', label: 'Delete Models', description: 'Remove AI models from system' },
    ],
  },
  {
    category: 'Finance',
    permissions: [
      { id: 'finance.read', label: 'View Finances', description: 'View financial data and transactions' },
      { id: 'finance.write', label: 'Create Transactions', description: 'Initiate financial transactions' },
      { id: 'finance.approve', label: 'Approve Transactions', description: 'Approve pending transactions' },
      { id: 'finance.delete', label: 'Delete Transactions', description: 'Remove transaction records' },
    ],
  },
  {
    category: 'DAO Governance',
    permissions: [
      { id: 'dao.read', label: 'View Proposals', description: 'View DAO proposals and votes' },
      { id: 'dao.write', label: 'Create Proposals', description: 'Submit new DAO proposals' },
      { id: 'dao.vote', label: 'Vote', description: 'Participate in DAO voting' },
      { id: 'dao.admin', label: 'Manage DAO', description: 'Administer DAO settings' },
    ],
  },
  {
    category: 'Analytics',
    permissions: [
      { id: 'analytics.read', label: 'View Analytics', description: 'Access analytics dashboards' },
      { id: 'reports.read', label: 'View Reports', description: 'Access generated reports' },
      { id: 'reports.export', label: 'Export Reports', description: 'Download and export reports' },
    ],
  },
  {
    category: 'User Management',
    permissions: [
      { id: 'users.read', label: 'View Users', description: 'View user list and details' },
      { id: 'users.write', label: 'Manage Users', description: 'Create and edit users' },
      { id: 'users.delete', label: 'Delete Users', description: 'Remove users from system' },
      { id: 'roles.manage', label: 'Manage Roles', description: 'Create and modify roles' },
    ],
  },
  {
    category: 'System',
    permissions: [
      { id: 'system.settings', label: 'System Settings', description: 'Modify system configuration' },
      { id: 'system.backup', label: 'Backup & Restore', description: 'Manage system backups' },
      { id: 'system.logs', label: 'View Logs', description: 'Access system logs' },
      { id: 'system.api', label: 'API Management', description: 'Manage API keys and access' },
    ],
  },
];

export function RolePermissions() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const getRoleColor = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      amber: 'bg-amber-100 text-amber-700 border-amber-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    };
    return colors[color] || colors.purple;
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const openEditRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              Roles & Permissions
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage user roles and permission settings
            </p>
          </div>
          
          <button
            onClick={() => {
              setSelectedRole(null);
              setSelectedPermissions([]);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Roles</p>
          <p className="text-xl sm:text-2xl">{roles.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-xl sm:text-2xl">{roles.reduce((sum, r) => sum + r.users, 0)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Permissions</p>
          <p className="text-xl sm:text-2xl">{permissionCategories.reduce((sum, c) => sum + c.permissions.length, 0)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Custom Roles</p>
          <p className="text-xl sm:text-2xl">{roles.filter(r => r.id !== '1').length}</p>
        </div>
      </div>

      {/* Roles List - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Role Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Description</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Users</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Permissions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className={`px-2 py-1 rounded text-xs border ${getRoleColor(role.color)}`}>
                        {role.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{role.users}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {role.permissions[0] === 'all' ? 'All Permissions' : `${role.permissions.length} permissions`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditRole(role)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      {role.id !== '1' && (
                        <button className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className={`px-2 py-1 rounded text-xs border ${getRoleColor(role.color)}`}>
                  {role.name}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditRole(role)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                {role.id !== '1' && (
                  <button className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-gray-400" />
                <span>{role.users} users</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>
                  {role.permissions[0] === 'all' ? 'All' : role.permissions.length} permissions
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl mb-4">
              {selectedRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Role Name</label>
                <input
                  type="text"
                  defaultValue={selectedRole?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="e.g., Content Manager"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  defaultValue={selectedRole?.description}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  rows={2}
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Color Theme</label>
                <div className="flex gap-2">
                  {['purple', 'blue', 'emerald', 'amber', 'indigo'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${getRoleColor(color)} hover:opacity-80`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm mb-3">Permissions</h4>
              <div className="space-y-4">
                {permissionCategories.map((category) => (
                  <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm mb-3">{category.category}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.permissions.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{perm.label}</p>
                            <p className="text-xs text-gray-500">{perm.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                {selectedRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
