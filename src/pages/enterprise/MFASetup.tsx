/**
 * MFA Setup Page
 * 
 * Allows users to enable and configure Multi-Factor Authentication.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Key, Copy, Check, AlertCircle, RefreshCw, Clock } from 'lucide-react';

interface MFAStatus {
  enabled: boolean;
  verified: boolean;
  lastUsedAt?: Date;
  remainingBackupCodes?: number;
}

interface MFASecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export default function MFASetupPage() {
  const [status, setStatus] = useState<MFAStatus | null>(null);
  const [secret, setSecret] = useState<MFASecret | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/mfa/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError('Failed to load MFA status');
      console.error('Error fetching MFA status:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/mfa/generate', {
        method: 'POST',
      });
      const data = await response.json();
      setSecret(data);
    } catch (err) {
      setError('Failed to generate MFA secret');
      console.error('Error generating MFA secret:', err);
    } finally {
      setGenerating(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('MFA enabled successfully!');
        setCode('');
        setSecret(null);
        fetchStatus();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code');
      console.error('Error. verifying code:', err);
    } finally {
      setVerifying(false);
    }
  };

  const disableMFA = async () => {
    if (!confirm('Are you sure you want to disable MFA? This will reduce your account security.')) {
      return;
    }

    try {
      const response = await fetch('/api/mfa/disable', {
        method: 'POST',
      });

      if (response.ok) {
        setSuccess('MFA disabled successfully');
        fetchStatus();
      } else {
        setError('Failed to disable MFA');
      }
    } catch (err) {
      setError('Failed to disable MFA');
      console.error('Error disabling MFA:', err);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!confirm('This will invalidate all existing backup codes. Continue?')) {
      return;
    }

    try {
      const response = await fetch('/api/mfa/backup-codes/regenerate', {
        method: 'POST',
      });
      const data = await response.json();
      setSecret(prev => prev ? { ...prev, backupCodes: data.backupCodes } : null);
      setSuccess('Backup codes regenerated successfully');
    } catch (err) {
      setError('Failed to regenerate backup codes');
      console.error('Error regenerating backup codes:', err);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'codes') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Multi-Factor Authentication
            </h1>
            <p className="text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>

          {/* Status Card */}
          {status && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-8 p-6 rounded-xl border-2 ${
                status.enabled
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {status.enabled ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {status.enabled ? 'MFA Enabled' : 'MFA Not Enabled'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {status.enabled
                      ? `Last used: ${status.lastUsedAt ? new Date(status.lastUsedAt).toLocaleString() : 'Never'}`
                      : 'Your account is not protected by MFA'}
                  </p>
                  {status.enabled && status.remainingBackupCodes !== undefined && (
                    <p className="text-sm text-gray-600 mt-1">
                      {status.remainingBackupCodes} backup codes remaining
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
            >
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </motion.div>
          )}

          {/* Setup MFA */}
          {!status?.enabled && !secret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <button
                onClick={generateSecret}
                disabled={generating}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating secret...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5" />
                    <span>Enable MFA</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* QR Code and Secret */}
          {secret && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">
                  Scan QR Code
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Manual Entry Key
                  </h3>
                  <button
                    onClick={() => copyToClipboard(secret.secret, 'secret')}
                    className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                  >
                    {copiedSecret ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-lg tracking-wider text-center">
                  {secret.secret}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Enter this key manually if you can't scan the QR code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit code
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 text-center text-2xl font-mono tracking-widest py-3 px-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  />
                  <button
                    onClick={verifyAndEnable}
                    disabled={verifying || code.length !== 6}
                    className="px py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:From-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Verify</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Code refreshes in {timeRemaining}s</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Backup Codes */}
          {secret && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900">
                    Backup Codes
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(secret.backupCodes.join('\n'), 'codes')}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                >
                  {copiedCodes ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Save these backup codes in a safe place. You can use them if you lose access to your authenticator app.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {secret.backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Disable MFA */}
          {status?.enabled && !secret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Disable MFA
                  </h3>
                  <p className="text-sm text-gray-600">
                    Remove MFA protection from your account
                  </p>
                </div>
                <button
                  onClick={disableMFA}
                  className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  Disable MFA
                </button>
              </div>
            </motion.div>
          )}

          {/* Regenerate Backup Codes */}
          {status?.enabled && !secret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-4"
            >
              <button
                onClick={regenerateBackupCodes}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Regenerate Backup Codes</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
