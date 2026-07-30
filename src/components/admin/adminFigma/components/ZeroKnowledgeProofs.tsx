import React, { useState } from 'react';
import { Shield, Lock, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ZKProof {
  id: string;
  type: string;
  statement: string;
  verified: boolean;
  proofHash: string;
  generatedAt: Date;
  privateDataHidden: string[];
}

export function ZeroKnowledgeProofs() {
  const [selectedProof, setSelectedProof] = useState<ZKProof | null>(null);
  const [showPrivateData, setShowPrivateData] = useState(false);

  const proofs: ZKProof[] = [
    {
      id: '1',
      type: 'Impact Verification',
      statement: 'Carbon offset > 10,000 tons without revealing exact amount',
      verified: true,
      proofHash: '0x7a3f...9b2e',
      generatedAt: new Date(Date.now() - 2 * 60 * 60000),
      privateDataHidden: ['Exact carbon amount', 'Project locations', 'Partner identities'],
    },
    {
      id: '2',
      type: 'Compliance Proof',
      statement: 'All regulatory requirements met without exposing sensitive data',
      verified: true,
      proofHash: '0x4c1d...8e5f',
      generatedAt: new Date(Date.now() - 5 * 60 * 60000),
      privateDataHidden: ['Financial details', 'Internal processes', 'Proprietary methods'],
    },
    {
      id: '3',
      type: 'Contribution Proof',
      statement: 'Individual donated > $50K while maintaining anonymity',
      verified: true,
      proofHash: '0x2b9a...6f3c',
      generatedAt: new Date(Date.now() - 24 * 60 * 60000),
      privateDataHidden: ['Donor identity', 'Exact amount', 'Payment method'],
    },
  ];

  const generateProof = () => {
    // Simulated proof generation
    console.log('Generating zero-knowledge proof...');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          Zero-Knowledge Proofs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Prove impact without revealing sensitive data - cryptographic privacy meets transparency
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Cryptographic Privacy</h3>
            <p className="text-sm opacity-90 mb-3">
              Zero-knowledge proofs allow you to prove statements are true (like "I offset more than 10K tons of CO2") without revealing the actual data. Perfect for corporate privacy and regulatory compliance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">zk-SNARKs</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Circom Circuits</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">On-Chain Verification</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">How Zero-Knowledge Proofs Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-sm mb-2">1. Keep Data Private</h4>
            <p className="text-xs text-gray-600">
              Your sensitive data (amounts, identities, locations) stays encrypted
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-sm mb-2">2. Generate Proof</h4>
            <p className="text-xs text-gray-600">
              Cryptographic proof created that statement is true without revealing data
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-sm mb-2">3. Verify On-Chain</h4>
            <p className="text-xs text-gray-600">
              Anyone can verify the proof is valid, but can't see the original data
            </p>
          </div>
        </div>
      </div>

      {/* Active Proofs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg">Active Zero-Knowledge Proofs</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {proofs.map((proof) => (
            <div key={proof.id} className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {proof.verified ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm mb-1">{proof.type}</h4>
                      <p className="text-xs text-gray-600">{proof.statement}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      proof.verified
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {proof.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Proof Hash:</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{proof.proofHash}</code>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Private Data (Hidden):</p>
                    <div className="flex flex-wrap gap-2">
                      {proof.privateDataHidden.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Generated: {proof.generatedAt.toLocaleString()}</span>
                    <button className="text-indigo-600 hover:text-indigo-700">
                      View on Explorer →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate New Proof */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Generate New Zero-Knowledge Proof</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Proof Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>Impact Verification</option>
              <option>Compliance Proof</option>
              <option>Contribution Proof</option>
              <option>Credential Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Statement to Prove</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
              placeholder="e.g., 'My organization has offset more than 50,000 tons of CO2 in the past year'"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Private Data (will not be revealed)</label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Exact carbon offset amount
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Project locations and details
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Partner and vendor identities
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Financial transaction details
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={generateProof}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Generate Proof
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Common Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Corporate Reporting',
              description: 'Prove compliance without revealing competitive data',
              icon: '🏢',
            },
            {
              title: 'Anonymous Donations',
              description: 'Verify large contributions while maintaining privacy',
              icon: '💰',
            },
            {
              title: 'Regulatory Compliance',
              description: 'Meet requirements without exposing internal processes',
              icon: '📋',
            },
            {
              title: 'Impact Verification',
              description: 'Prove impact thresholds without exact numbers',
              icon: '✅',
            },
          ].map((useCase, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="text-3xl mb-2">{useCase.icon}</div>
              <h4 className="text-sm mb-1">{useCase.title}</h4>
              <p className="text-xs text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Technical Implementation</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <p className="mb-1"><strong>Circuit Design:</strong> Circom + SnarkJS</p>
              <p className="text-xs text-gray-600">Custom circuits for impact verification</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <p className="mb-1"><strong>Blockchain:</strong> Polygon zkEVM</p>
              <p className="text-xs text-gray-600">Low-cost, high-speed verification</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <p className="mb-1"><strong>Storage:</strong> IPFS for proof artifacts</p>
              <p className="text-xs text-gray-600">Decentralized, tamper-proof storage</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
            <div>
              <p className="mb-1"><strong>Compliance:</strong> GDPR + CCPA ready</p>
              <p className="text-xs text-gray-600">Privacy by design, data minimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
