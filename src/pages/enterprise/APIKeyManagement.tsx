/**
 * API Key Management Page
 * 
 * Enterprise-grade API key management interface with generation, viewing, and revocation capabilities.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Clock,
  Activity,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimit: number;
  rateLimitWindow: number;
  allowedIPs: string[];
  allowedOrigins: string[];
  isActive: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  usageCount: number;
  createdAt: string;
}

interface APIKeyUsage {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  requestsByHour: Record<string, number>;
}

export default function APIKeyManagement() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageData, setUsageData] = useState<APIKeyUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // New key form state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read']);
  const [newKeyExpiresAt, setNewKeyExpiresAt] = useState('');
  const [newKeyAllowedIPs, setNewKeyAllowedIPs] = useState('');
  const [newKeyAllowedOrigins, setNewKeyAllowedOrigins] = useState('');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1000);
  const [newKeyRateLimitWindow, setNewKeyRateLimitWindow] = useState(60);

  // Fetch API keys
  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keys', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setApiKeys(data.data);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newKeyName,
          scopes: newKeyScopes,
          expiresAt: newKeyExpiresAt || undefined,
          allowedIPs: newKeyAllowedIPs ? newKeyAllowedIPs.split(',').map(ip => ip.trim()) : [],
          allowedOrigins: newKeyAllowedOrigins ? newKeyAllowedOrigins.split(',').map(origin => origin.trim()) : [],
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'API key created successfully',
        });
        setShowCreateModal(false);
        fetchAPIKeys();
        // Show the full key to the user
        setCopiedKey(data.data.fullKey);
        setVisibleKeys(prev => new Set(prev).add(data.data.keyData.id));
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create API key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`/api/keys/${keyId}/revoke`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'API key revoked successfully',
        });
        fetchAPIKeys();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to revoke API key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke API key',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'API key deleted successfully',
        });
        fetchAPIKeys();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete API key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  const handleViewUsage = async (keyId: string) => {
    try {
      const response = await fetch(`/api/keys/${keyId}/usage`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsageData(data.data);
        setShowUsageModal(true);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch usage data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch usage data',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getScopeColor = (scope: string) => {
    const colors: Record<string, string> = {
      read: 'bg-blue-100 text-blue-800',
      write: 'bg-green-100 text-green-800',
      delete: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return colors[scope] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                API Key Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your API keys for programmatic access to the platform
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <Key className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apiKeys.filter(k => k.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apiKeys.reduce((sum, k) => sum + k.usageCount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expired Keys</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apiKeys.filter(k => isExpired(k.expiresAt)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for secure access to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No API keys yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Create your first API key to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {key.name}
                          </h3>
                          <Badge variant={key.isActive ? 'default' : 'secondary'}>
                            {key.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {isExpired(key.expiresAt) && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Key className="h-4 w-4" />
                            {key.keyPrefix}••••••••••••••••
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-4 w-4" />
                            {key.usageCount.toLocaleString()} requests
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last used: {formatDate(key.lastUsedAt)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {key.scopes.map((scope) => (
                            <Badge key={scope} className={getScopeColor(scope)}>
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUsage(key.id)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeKey(key.id)}
                          disabled={!key.isActive}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Create New API Key
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API Key"
                    />
                  </div>
                  <div>
                    <Label>Scopes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['read', 'write', 'delete', 'admin'].map((scope) => (
                        <Badge
                          key={scope}
                          variant={newKeyScopes.includes(scope) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleScope(scope)}
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      value={newKeyExpiresAt}
                      onChange={(e) => setNewKeyExpiresAt(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedIPs">Allowed IPs (Optional, comma-separated)</Label>
                    <Input
                      id="allowedIPs"
                      value={newKeyAllowedIPs}
                      onChange={(e) => setNewKeyAllowedIPs(e.target.value)}
                      placeholder="e.g., 192.168.1.1, 10.0.0.0/8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedOrigins">Allowed Origins (Optional, comma-separated)</Label>
                    <Input
                      id="allowedOrigins"
                      value={newKeyAllowedOrigins}
                      onChange={(e) => setNewKeyAllowedOrigins(e.target.value)}
                      placeholder="e.g., https://example.com, https://app.example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rateLimit">Rate Limit (requests)</Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        value={newKeyRateLimit}
                        onChange={(e) => setNewKeyRateLimit(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rateLimitWindow">Rate Limit Window (seconds)</Label>
                      <Input
                        id="rateLimitWindow"
                        type="number"
                        value={newKeyRateLimitWindow}
                        onChange={(e) => setNewKeyRateLimitWindow(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey} disabled={!newKeyName}>
                    Create API Key
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Modal */}
      <AnimatePresence>
        {showUsageModal && usageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUsageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  API Key Usage
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {usageData.totalRequests.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Successful</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {usageData.successfulRequests.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {usageData.failedRequests.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {usageData.averageResponseTime.toFixed(0)}ms
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowUsageModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
