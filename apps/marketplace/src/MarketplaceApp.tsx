/**
 * Atlas Sanctum — Marketplace App
 * Regenerative credit marketplace: carbon, biodiversity, water, ocean, community.
 * Supports listing, discovery, ordering, and retirement of verified credits.
 */

import React, { useState } from 'react';
import {
  Badge,
  MetricCard,
  SectionHeader,
  EmptyState,
  ProgressBar,
  CreditTypeBadge,
  StatusDot,
} from '../../../packages/ui/src/index';
import { CREDIT_TYPES, type CreditType } from '../../../packages/shared/index';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  id: string;
  creditType: CreditType;
  projectName: string;
  projectLocation: string;
  bioregion: string;
  amount: number;
  pricePerUnit: number;
  currency: string;
  vintage: number;
  verified: boolean;
  verificationLevel: 'self_reported' | 'third_party' | 'oracle_verified' | 'multi_source';
  seller: string;
  biodiversityScore?: number;
  methodology?: string;
}

// ─── Mock Listings ────────────────────────────────────────────────────────────

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'lst-001', creditType: 'carbon',
    projectName: 'Amazon Reforestation Initiative', projectLocation: 'Pará, Brazil',
    bioregion: 'amazon-basin', amount: 50000, pricePerUnit: 28, currency: 'USD',
    vintage: 2026, verified: true, verificationLevel: 'multi_source',
    seller: 'did:sanctum:org-amazon-trust', biodiversityScore: 0.87,
    methodology: 'Verra VM0042',
  },
  {
    id: 'lst-002', creditType: 'biodiversity',
    projectName: 'Coral Triangle Marine Reserve', projectLocation: 'Indonesia',
    bioregion: 'coral-triangle', amount: 12000, pricePerUnit: 45, currency: 'USD',
    vintage: 2026, verified: true, verificationLevel: 'oracle_verified',
    seller: 'did:sanctum:org-ocean-guardians', biodiversityScore: 0.94,
    methodology: 'IUCN Biodiversity Credit Framework',
  },
  {
    id: 'lst-003', creditType: 'water',
    projectName: 'Himalayan Watershed Restoration', projectLocation: 'Nepal',
    bioregion: 'himalayan-watershed', amount: 8000, pricePerUnit: 18, currency: 'USD',
    vintage: 2025, verified: true, verificationLevel: 'third_party',
    seller: 'did:sanctum:org-himalaya-water',
    methodology: 'WRI Water Credit Standard',
  },
  {
    id: 'lst-004', creditType: 'ocean',
    projectName: 'Sahel Mangrove Restoration', projectLocation: 'Senegal',
    bioregion: 'sahel', amount: 6500, pricePerUnit: 35, currency: 'USD',
    vintage: 2026, verified: true, verificationLevel: 'oracle_verified',
    seller: 'did:sanctum:org-west-africa-blue',
    methodology: 'Verra VM0033 Blue Carbon',
  },
  {
    id: 'lst-005', creditType: 'community',
    projectName: 'Congo Basin Indigenous Stewardship', projectLocation: 'DRC',
    bioregion: 'congo-basin', amount: 20000, pricePerUnit: 22, currency: 'USD',
    vintage: 2026, verified: true, verificationLevel: 'multi_source',
    seller: 'did:sanctum:org-congo-communities', biodiversityScore: 0.91,
    methodology: 'Gold Standard Community Impact',
  },
];

// ─── Listing Card ─────────────────────────────────────────────────────────────

const verificationColor: Record<Listing['verificationLevel'], 'success' | 'info' | 'warning' | 'neutral'> = {
  multi_source:    'success',
  oracle_verified: 'success',
  third_party:     'info',
  self_reported:   'warning',
};

const ListingCard: React.FC<{ listing: Listing; onOrder: (id: string) => void }> = ({ listing, onOrder }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{listing.projectName}</h3>
        <div className="flex flex-wrap gap-1.5">
          <CreditTypeBadge type={listing.creditType} />
          <Badge label={listing.verificationLevel.replace('_', ' ')} variant={verificationColor[listing.verificationLevel]} />
          <Badge label={listing.bioregion} variant="neutral" />
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">${listing.pricePerUnit}</div>
        <div className="text-xs text-gray-500">per tonne · {listing.currency}</div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
      <div>
        <div className="text-xs text-gray-500">Available</div>
        <div className="font-semibold">{listing.amount.toLocaleString()} t</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Vintage</div>
        <div className="font-semibold">{listing.vintage}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Location</div>
        <div className="font-semibold truncate">{listing.projectLocation}</div>
      </div>
    </div>

    {listing.biodiversityScore !== undefined && (
      <ProgressBar
        label={`Biodiversity co-benefit: ${(listing.biodiversityScore * 100).toFixed(0)}%`}
        value={listing.biodiversityScore * 100}
        color="#15803d"
        className="mb-4"
      />
    )}

    {listing.methodology && (
      <div className="text-xs text-gray-400 mb-3">Methodology: {listing.methodology}</div>
    )}

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <StatusDot status="online" />
        <span className="text-xs text-gray-500 truncate">{listing.seller.slice(0, 28)}…</span>
      </div>
      <button
        onClick={() => onOrder(listing.id)}
        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
      >
        Buy Credits
      </button>
    </div>
  </div>
);

// ─── Market Overview ──────────────────────────────────────────────────────────

const MarketOverview: React.FC = () => (
  <section>
    <SectionHeader title="💱 Market Overview" subtitle="Regenerative Value Exchange" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <MetricCard label="Total Volume (YTD)" value="$48.2M" trend="up" trendValue="+34% vs 2025" />
      <MetricCard label="Active Listings" value="1,240" trend="up" trendValue="+12% this month" />
      <MetricCard label="Credits Retired" value="890K t" trend="up" trendValue="+24% vs 2025" />
      <MetricCard label="Avg Verification" value="99.9" unit="%" trend="stable" />
    </div>
  </section>
);

// ─── Marketplace App ──────────────────────────────────────────────────────────

const MarketplaceApp: React.FC = () => {
  const [activeType, setActiveType] = useState<CreditType | 'all'>('all');
  const [orders, setOrders] = useState<string[]>([]);

  const handleOrder = (id: string) => {
    setOrders(prev => [...prev, id]);
    alert(`Order placed for listing ${id}. Settlement in progress.`);
  };

  const filtered = activeType === 'all'
    ? MOCK_LISTINGS
    : MOCK_LISTINGS.filter(l => l.creditType === activeType);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">🌱 Regenerative Marketplace</h1>
        <p className="text-xs text-gray-500">Verified impact credits — carbon, biodiversity, water, ocean, community</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        <MarketOverview />

        <section>
          <SectionHeader
            title="📋 Listings"
            subtitle={`${filtered.length} verified listings`}
            action={
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveType('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeType === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {CREDIT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeType === type ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            }
          />

          {filtered.length === 0 ? (
            <EmptyState icon="🌱" title="No listings" description="No listings match the selected credit type." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(l => (
                <ListingCard key={l.id} listing={l} onOrder={handleOrder} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MarketplaceApp;
