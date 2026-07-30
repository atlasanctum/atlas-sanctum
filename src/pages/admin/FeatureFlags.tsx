import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import Layout from '../../components/Layout';
import adminConnector from '../../services/adminConnector';

type Flags = Record<string, boolean>;

const FeatureFlagsAdmin: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAdmin();
  const [flags, setFlags] = useState<Flags>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = adminConnector.getToken();
      const res = await fetch('/api/admin/flags', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to load flags: ${res.status}`);
      }
      const data = await res.json();
      setFlags(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFlags();
    }
  }, [isAuthenticated]);

  const toggleFlag = async (flag: string) => {
    setSaving(flag);
    try {
      const token = adminConnector.getToken();
      const res = await fetch(`/api/admin/flags/${flag}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !flags[flag] }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update flag: ${res.status}`);
      }
      setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    } catch (err: any) {
      setError(err.message || 'Failed to update flag');
    } finally {
      setSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading feature flags...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-slate-400">Please log in to access feature flags.</p>
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
            <h1 className="text-3xl font-bold text-white">Feature Flags</h1>
            <p className="text-slate-400 mt-1">Manage platform feature flags</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Flags Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(flags).map(([flag, enabled]) => (
              <div
                key={flag}
                className={`p-4 rounded-lg border transition-all ${
                  enabled
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-slate-500'}`} />
                    <span className="text-white font-medium">{flag}</span>
                  </div>
                  <button
                    onClick={() => toggleFlag(flag)}
                    disabled={saving === flag}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      enabled
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-600 hover:bg-slate-700 text-white'
                    } ${saving === flag ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {saving === flag ? 'Saving...' : enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.keys(flags).length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">No feature flags found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FeatureFlagsAdmin;
