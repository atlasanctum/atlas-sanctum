import React, { useState } from 'react';
import { Database, Download, Upload, RefreshCw, Calendar, HardDrive, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  size: string;
  created: Date;
  type: 'full' | 'incremental' | 'manual';
  status: 'completed' | 'in-progress' | 'failed';
  duration: string;
}

const backups: Backup[] = [
  {
    id: '1',
    name: 'Full System Backup',
    size: '12.8 GB',
    created: new Date(Date.now() - 2 * 60 * 60000),
    type: 'full',
    status: 'completed',
    duration: '8m 42s',
  },
  {
    id: '2',
    name: 'Incremental Backup',
    size: '2.4 GB',
    created: new Date(Date.now() - 24 * 60 * 60000),
    type: 'incremental',
    status: 'completed',
    duration: '2m 15s',
  },
  {
    id: '3',
    name: 'Manual Export - Q4 Data',
    size: '5.6 GB',
    created: new Date(Date.now() - 3 * 24 * 60 * 60000),
    type: 'manual',
    status: 'completed',
    duration: '4m 38s',
  },
  {
    id: '4',
    name: 'Full System Backup',
    size: '12.3 GB',
    created: new Date(Date.now() - 7 * 24 * 60 * 60000),
    type: 'full',
    status: 'completed',
    duration: '9m 12s',
  },
];

export function DataBackup() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

  const dataTypes = [
    { id: 'ai-models', label: 'AI Model Configurations', size: '2.4 GB' },
    { id: 'blockchain', label: 'Blockchain Transaction Data', size: '5.8 GB' },
    { id: 'dao', label: 'DAO Governance Records', size: '1.2 GB' },
    { id: 'finance', label: 'Financial Data & Analytics', size: '3.6 GB' },
    { id: 'impact', label: 'Impact Metrics & Reports', size: '2.1 GB' },
    { id: 'users', label: 'User Data & Permissions', size: '0.8 GB' },
    { id: 'knowledge', label: 'Knowledge Hub Documents', size: '4.5 GB' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 border-emerald-300';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-300';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'incremental':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'manual':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleDataType = (id: string) => {
    setSelectedDataTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const totalSelectedSize = dataTypes
    .filter(dt => selectedDataTypes.includes(dt.id))
    .reduce((sum, dt) => sum + parseFloat(dt.size), 0)
    .toFixed(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Database className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          Data Backup & Export
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage system backups, data exports, and restore operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Backups</p>
          <p className="text-xl sm:text-2xl">{backups.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Storage Used</p>
          <p className="text-xl sm:text-2xl">33.1 GB</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Last Backup</p>
          <p className="text-xl sm:text-2xl text-emerald-600">2h ago</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Next Scheduled</p>
          <p className="text-xl sm:text-2xl text-blue-600">22h</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          <div className="text-left">
            <p className="text-sm">Export Data</p>
            <p className="text-xs opacity-80">Custom export</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
          <RefreshCw className="w-5 h-5" />
          <div className="text-left">
            <p className="text-sm">Create Backup</p>
            <p className="text-xs opacity-80">Manual backup</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Upload className="w-5 h-5" />
          <div className="text-left">
            <p className="text-sm">Restore Data</p>
            <p className="text-xs opacity-80">From backup</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Calendar className="w-5 h-5" />
          <div className="text-left">
            <p className="text-sm">Schedule</p>
            <p className="text-xs opacity-80">Auto backups</p>
          </div>
        </button>
      </div>

      {/* Backup Schedule */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-base sm:text-lg mb-4">Backup Schedule</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <Database className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm">Full System Backup</p>
                <p className="text-xs text-gray-600">Every Sunday at 2:00 AM UTC</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs border border-emerald-300 self-start sm:self-auto">
              Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm">Incremental Backup</p>
                <p className="text-xs text-gray-600">Daily at 11:00 PM UTC</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs border border-emerald-300 self-start sm:self-auto">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Backup History - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg">Backup History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Backup Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Size</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Created</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Duration</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm">{backup.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border capitalize ${getTypeColor(backup.type)}`}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{backup.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatDate(backup.created)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{backup.duration}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(backup.status)}
                      <span className="text-sm capitalize">{backup.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Upload className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup History - Mobile/Tablet */}
      <div className="lg:hidden space-y-3">
        <h3 className="text-base sm:text-lg px-2">Backup History</h3>
        {backups.map((backup) => (
          <div key={backup.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm flex-1">{backup.name}</p>
              {getStatusIcon(backup.status)}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs border capitalize ${getTypeColor(backup.type)}`}>
                {backup.type}
              </span>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(backup.status)}`}>
                {backup.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <p className="text-gray-500">Size</p>
                <p className="text-gray-900">{backup.size}</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="text-gray-900">{backup.duration}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{formatDate(backup.created)}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button className="flex-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs transition-colors">
                Download
              </button>
              <button className="flex-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs transition-colors">
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl mb-4">Custom Data Export</h3>
            
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600">Select data types to export:</p>
              {dataTypes.map(type => (
                <label
                  key={type.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedDataTypes.includes(type.id)}
                      onChange={() => toggleDataType(type.id)}
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.size}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedDataTypes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-900">
                  Total export size: <strong>{totalSelectedSize} GB</strong>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                disabled={selectedDataTypes.length === 0}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Selected Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
