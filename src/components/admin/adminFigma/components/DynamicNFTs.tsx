import React, { useState } from 'react';
import { Coins, Star, Share2, ExternalLink, Zap } from 'lucide-react';

interface DynamicNFT {
  tokenId: string;
  name: string;
  owner: string;
  carbonOffset: number;
  biodiversityScore: number;
  socialImpact: number;
  level: number;
  visualTier: string;
  mintedDate: Date;
  lastUpdated: Date;
  attributes: Record<string, any>;
}

export function DynamicNFTs() {
  const [selectedNFT, setSelectedNFT] = useState<DynamicNFT | null>(null);
  
  const nfts: DynamicNFT[] = [
    {
      tokenId: '0x1a2b...3c4d',
      name: 'Ancient Forest Guardian',
      owner: '0xAbC...DeF',
      carbonOffset: 15420,
      biodiversityScore: 89,
      socialImpact: 92,
      level: 5,
      visualTier: 'legendary',
      mintedDate: new Date('2024-01-15'),
      lastUpdated: new Date(Date.now() - 2 * 60 * 60000),
      attributes: {
        rarity: 'Legendary',
        treesPlanted: 1542,
        speciesProtected: 23,
        communitiesImpacted: 8,
      },
    },
    {
      tokenId: '0x5e6f...7g8h',
      name: 'Ocean Protector',
      owner: '0x123...456',
      carbonOffset: 8750,
      biodiversityScore: 76,
      socialImpact: 84,
      level: 4,
      visualTier: 'epic',
      mintedDate: new Date('2024-03-20'),
      lastUpdated: new Date(Date.now() - 5 * 60 * 60000),
      attributes: {
        rarity: 'Epic',
        coralRestored: 875,
        marineLife: 156,
        coastalCommunities: 5,
      },
    },
    {
      tokenId: '0x9i0j...1k2l',
      name: 'Renewable Pioneer',
      owner: '0x789...012',
      carbonOffset: 12100,
      biodiversityScore: 68,
      socialImpact: 95,
      level: 4,
      visualTier: 'epic',
      mintedDate: new Date('2024-02-10'),
      lastUpdated: new Date(Date.now() - 24 * 60 * 60000),
      attributes: {
        rarity: 'Epic',
        solarPanels: 1210,
        householdsPowered: 450,
        communitiesServed: 12,
      },
    },
    {
      tokenId: '0x3m4n...5o6p',
      name: 'Seedling Supporter',
      owner: '0x345...678',
      carbonOffset: 2500,
      biodiversityScore: 45,
      socialImpact: 58,
      level: 2,
      visualTier: 'rare',
      mintedDate: new Date('2024-11-01'),
      lastUpdated: new Date(Date.now() - 10 * 60000),
      attributes: {
        rarity: 'Rare',
        treesPlanted: 250,
        speciesProtected: 5,
        communitiesImpacted: 2,
      },
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legendary':
        return 'from-yellow-400 via-amber-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 via-pink-500 to-red-500';
      case 'rare':
        return 'from-blue-400 via-cyan-400 to-teal-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getVisualRepresentation = (nft: DynamicNFT) => {
    // Simulated dynamic visual based on impact
    const tier = nft.visualTier;
    const size = 120 + (nft.level * 20);
    
    return (
      <div 
        className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${getTierColor(tier)} p-8 flex items-center justify-center`}
        style={{ height: '200px' }}
      >
        <div className="relative">
          {/* Visual evolves with impact */}
          {tier === 'legendary' && (
            <div className="text-center">
              <div className="text-6xl mb-2">🌳</div>
              <div className="flex gap-1 justify-center">
                <span className="text-2xl">🦋</span>
                <span className="text-2xl">🐦</span>
                <span className="text-2xl">🦌</span>
              </div>
            </div>
          )}
          {tier === 'epic' && (
            <div className="text-center">
              <div className="text-6xl mb-2">{nft.name.includes('Ocean') ? '🌊' : '☀️'}</div>
              <div className="flex gap-1 justify-center">
                <span className="text-2xl">{nft.name.includes('Ocean') ? '🐠' : '⚡'}</span>
                <span className="text-2xl">{nft.name.includes('Ocean') ? '🐙' : '🔆'}</span>
              </div>
            </div>
          )}
          {tier === 'rare' && (
            <div className="text-center">
              <div className="text-6xl">🌱</div>
            </div>
          )}
          
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">{nft.level}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
          Dynamic Impact NFTs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Living NFTs that evolve with your real-world regenerative impact
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Dynamic NFT Technology</h3>
            <p className="text-sm opacity-90 mb-3">
              Your NFTs are living credentials that update in real-time as you create impact. The visuals evolve, stats increase, and rarity improves with your contributions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">On-Chain Verification</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Real-Time Updates</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Tradeable</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Cross-Chain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total NFTs</p>
          <p className="text-xl sm:text-2xl">{nfts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Impact</p>
          <p className="text-xl sm:text-2xl">{nfts.reduce((sum, n) => sum + n.carbonOffset, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Floor Price</p>
          <p className="text-xl sm:text-2xl">0.5 ETH</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Volume</p>
          <p className="text-xl sm:text-2xl">12.8 ETH</p>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
          >
            {/* Visual */}
            {getVisualRepresentation(nft)}

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{nft.name}</h3>
                  <code className="text-xs text-gray-500">{nft.tokenId}</code>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getTierBadge(nft.visualTier)}`}>
                  Level {nft.level}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Carbon</p>
                  <p className="text-sm">{nft.carbonOffset.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Bio</p>
                  <p className="text-sm">{nft.biodiversityScore}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Social</p>
                  <p className="text-sm">{nft.socialImpact}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Updated {Math.floor((Date.now() - nft.lastUpdated.getTime()) / 3600000)}h ago</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Share2 className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mint New NFT */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              Mint Your Impact NFT
            </h3>
            <p className="text-sm text-gray-600">
              Create a living NFT that represents your regenerative contributions. It will evolve as you make more impact.
            </p>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all text-sm">
            Mint NFT (0.05 ETH)
          </button>
        </div>
      </div>

      {/* NFT Evolution Path */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">NFT Evolution Path</h3>
        <div className="space-y-4">
          {[
            { level: 1, name: 'Seedling', carbon: '0-1K', visual: '🌱', color: 'gray' },
            { level: 2, name: 'Sprout', carbon: '1K-5K', visual: '🌿', color: 'blue' },
            { level: 3, name: 'Young Tree', carbon: '5K-10K', visual: '🌳', color: 'cyan' },
            { level: 4, name: 'Mature Forest', carbon: '10K-20K', visual: '🌲🌳', color: 'purple' },
            { level: 5, name: 'Ancient Guardian', carbon: '20K+', visual: '🌳🦋🐦', color: 'amber' },
          ].map((stage) => (
            <div key={stage.level} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-3xl">{stage.visual}</div>
              <div className="flex-1">
                <h4 className="text-sm mb-1">Level {stage.level}: {stage.name}</h4>
                <p className="text-xs text-gray-600">{stage.carbon} tons CO2 offset</p>
              </div>
              <div className={`px-3 py-1 bg-${stage.color}-100 text-${stage.color}-700 rounded text-xs`}>
                {stage.level === 1 ? 'Common' : stage.level === 2 ? 'Uncommon' : stage.level === 3 ? 'Rare' : stage.level === 4 ? 'Epic' : 'Legendary'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">NFT Marketplace</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">Listed</p>
            <p className="text-2xl">23</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Avg Price</p>
            <p className="text-2xl">0.8 ETH</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Volume (24h)</p>
            <p className="text-2xl">5.2 ETH</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Owners</p>
            <p className="text-2xl">187</p>
          </div>
        </div>
      </div>
    </div>
  );
}
