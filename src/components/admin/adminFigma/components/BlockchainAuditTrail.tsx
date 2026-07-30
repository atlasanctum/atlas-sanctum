import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, ExternalLink, Search, Download } from 'lucide-react';

interface AuditEvent {
  id: string;
  eventType: string;
  description: string;
  user: string;
  timestamp: Date;
  blockNumber: number;
  txHash: string;
  dataHash: string;
  verified: boolean;
  chainId: number;
}

export function BlockchainAuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const auditEvents: AuditEvent[] = [
    {
      id: '1',
      eventType: 'impact_recorded',
      description: 'Carbon offset of 1,250 tons recorded for Amazon Reforestation Project',
      user: '0xAbC...DeF',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      blockNumber: 18234567,
      txHash: '0x7a3f9b2e4c1d8e5f6a0b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      dataHash: '0x5e8a3c1f9d7b2e4a6c8d0f1a3b5c7e9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c',
      verified: true,
      chainId: 137, // Polygon
    },
    {
      id: '2',
      eventType: 'funds_allocated',
      description: 'Treasury allocated $50,000 to Ocean Restoration Initiative',
      user: '0x123...456',
      timestamp: new Date(Date.now() - 5 * 60 * 60000),
      blockNumber: 18234512,
      txHash: '0x2b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      dataHash: '0x3d5f7a9c1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f',
      verified: true,
      chainId: 137,
    },
    {
      id: '3',
      eventType: 'milestone_completed',
      description: 'Project #A45 reached 75% completion milestone',
      user: '0x789...012',
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      blockNumber: 18233890,
      txHash: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
      dataHash: '0x1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e',
      verified: true,
      chainId: 137,
    },
    {
      id: '4',
      eventType: 'verification_submitted',
      description: 'Third-party verification submitted for biodiversity impact',
      user: '0x345...678',
      timestamp: new Date(Date.now() - 48 * 60 * 60000),
      blockNumber: 18232456,
      txHash: '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      dataHash: '0x7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c',
      verified: true,
      chainId: 137,
    },
    {
      id: '5',
      eventType: 'user_action',
      description: 'Admin role granted to new team member',
      user: '0x901...234',
      timestamp: new Date(Date.now() - 72 * 60 * 60000),
      blockNumber: 18231234,
      txHash: '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      dataHash: '0x9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c1e3f5a7c9e1b3d5f7a9c',
      verified: true,
      chainId: 137,
    },
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'impact_recorded', label: 'Impact Recorded' },
    { value: 'funds_allocated', label: 'Funds Allocated' },
    { value: 'milestone_completed', label: 'Milestones' },
    { value: 'verification_submitted', label: 'Verifications' },
    { value: 'user_action', label: 'User Actions' },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'impact_recorded':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'funds_allocated':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'milestone_completed':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'verification_submitted':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'user_action':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const verifyIntegrity = (event: AuditEvent) => {
    // Simulate blockchain verification
    alert(`Verifying event on Polygon blockchain...\n\nBlock: ${event.blockNumber}\nTx: ${event.txHash}\n\n✅ Data integrity verified!`);
  };

  const filteredEvents = auditEvents.filter((event) => {
    const matchesSearch = event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || event.eventType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          Blockchain Audit Trail
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Immutable, tamper-proof record of all platform actions
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">100% Tamper-Proof Transparency</h3>
            <p className="text-sm opacity-90 mb-3">
              Every action on the platform is cryptographically hashed and stored on Polygon blockchain. Anyone can verify data integrity by checking the on-chain record.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Polygon Network</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">SHA-256 Hashing</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">IPFS Storage</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Public Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Events</p>
          <p className="text-2xl">{auditEvents.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Verified</p>
          <p className="text-2xl text-emerald-600">{auditEvents.filter((e) => e.verified).length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Last Block</p>
          <p className="text-2xl">{Math.max(...auditEvents.map((e) => e.blockNumber))}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Chain</p>
          <p className="text-lg">Polygon</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, users, or transaction hashes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Audit Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {event.verified ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs border ${getEventColor(event.eventType)}`}>
                          {event.eventType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Block #{event.blockNumber}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span>User: <code className="text-indigo-600">{event.user}</code></span>
                        <span>{event.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-600 w-20">Tx Hash:</span>
                      <code className="text-xs break-all flex-1 text-indigo-600">{event.txHash}</code>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-600 w-20">Data Hash:</span>
                      <code className="text-xs break-all flex-1 text-gray-700">{event.dataHash}</code>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => verifyIntegrity(event)}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Shield className="w-3 h-3" />
                    Verify
                  </button>
                  <a
                    href={`https://polygonscan.com/tx/${event.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explorer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Verification Portal */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Public Verification Portal</h3>
        <p className="text-sm text-gray-600 mb-4">
          Anyone can verify the integrity of our data by checking the blockchain. Enter a transaction hash or data hash below:
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="0x7a3f9b2e4c1d8e5f6a0b3c4d5e6f7a8b..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
            Verify
          </button>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">1️⃣</span>
            </div>
            <h4 className="text-sm mb-2">Event Occurs</h4>
            <p className="text-xs text-gray-600">
              Every action (impact recorded, funds moved, etc.) triggers an event
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">2️⃣</span>
            </div>
            <h4 className="text-sm mb-2">Hash & Store</h4>
            <p className="text-xs text-gray-600">
              Data is hashed using SHA-256 and written to Polygon blockchain
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">3️⃣</span>
            </div>
            <h4 className="text-sm mb-2">Public Verification</h4>
            <p className="text-xs text-gray-600">
              Anyone can verify data hasn't been tampered with by comparing hashes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
