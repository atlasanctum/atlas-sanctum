/**
 * Atlas Sanctum Marketplace — Main App Component
 * Browse, filter, and purchase verified regenerative credits.
 */

import React, { useEffect, useState } from 'react';
import { AtlasSanctumClient, MarketplaceListing } from '../../../packages/sdk/index';

const client = new AtlasSanctumClient({
  apiUrl: import.meta.env?.VITE_API_URL ?? 'http://localhost:3001',
  token:  import.meta.env?.VITE_API_TOKEN,
});

const CREDIT_COLORS: Record<string, string> = {
  carbon:         'bg-green-100 text-green-800',
  biodiversity:   'bg-emerald-100 text-emerald-800',
  water:          'bg-blue-100 text-blue-800',
  ocean:          'bg-cyan-100 text-cyan-800',
  community:      'bg-purple-100 text-purple-800',
  healthcare:     'bg-rose-100 text-rose-800',
  circular_economy: 'bg-amber-100 text-amber-800',
};

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CREDIT_COLORS[listing.creditType] ?? 'bg-gray-100 text-gray-700'}`}>
          {listing.creditType.replace('_', ' ').toUpperCase()}
        </span>
        {listing.verified && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            ✓ Verified
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{listing.projectName}</h3>
      <p className="text-xs text-gray-500 mb-3">Vintage {listing.vintage} · {listing.amount.toLocaleString()} credits</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900">${listing.pricePerUnit.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">/ credit</span>
        </div>
        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
          Purchase
        </button>
      </div>
    </div>
  );
}

export default function MarketplaceApp() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.marketplace.listListings().then(r => {
      if (r.ok) setListings(r.data.data);
      setLoading(false);
    });
  }, []);

  const creditTypes = ['all', 'carbon', 'biodiversity', 'water', 'ocean', 'community'];
  const filtered = filter === 'all' ? listings : listings.filter(l => l.creditType === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Regenerative Marketplace</h1>
        <p className="text-sm text-gray-500">Verified impact credits — carbon, biodiversity, water, ocean, community</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {creditTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === type ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
            }`}
          >
            {type === 'all' ? 'All Credits' : type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse h-40 bg-gray-100 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          {!filtered.length && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No listings found for this credit type.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
