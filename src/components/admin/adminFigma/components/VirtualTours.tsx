import React, { useState } from 'react';
import { Glasses, Play, Users, Heart, Share2 } from 'lucide-react';

interface VirtualTour {
  id: string;
  title: string;
  location: string;
  type: string;
  duration: string;
  participants: number;
  thumbnail: string;
  description: string;
  features: string[];
}

export function VirtualTours() {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);

  const tours: VirtualTour[] = [
    {
      id: '1',
      title: 'Amazon Rainforest Reforestation',
      location: 'Brazil',
      type: 'Reforestation',
      duration: '15 min',
      participants: 1247,
      thumbnail: '🌳🦜',
      description: 'Walk through our 10,000-hectare reforestation project in the Amazon. See native species returning, meet local communities, and witness the impact firsthand.',
      features: ['360° Video', 'AI Guide', 'Live Data Overlay', 'Time-Travel View'],
    },
    {
      id: '2',
      title: 'Great Barrier Reef Coral Restoration',
      location: 'Australia',
      type: 'Ocean',
      duration: '20 min',
      participants: 892,
      thumbnail: '🐠🪸',
      description: 'Dive into the underwater world of coral restoration. See our innovative techniques for coral propagation and marine biodiversity recovery.',
      features: ['Underwater VR', 'Marine Life ID', 'Impact Metrics', 'Scientist Q&A'],
    },
    {
      id: '3',
      title: 'Sahara Solar Farm Initiative',
      location: 'Morocco',
      type: 'Renewable Energy',
      duration: '12 min',
      participants: 634,
      thumbnail: '☀️⚡',
      description: 'Explore one of the world\'s largest solar installations. Learn about clean energy generation and community electrification programs.',
      features: ['Solar Array Flythrough', 'Energy Dashboard', 'Community Stories', 'Technical Deep-Dive'],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Glasses className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
          Virtual Impact Tours
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Immersive VR/AR experiences of regenerative projects worldwide
        </p>
      </div>

      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Glasses className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Visit Projects Without Traveling</h3>
            <p className="text-sm opacity-90 mb-3">
              Experience regenerative projects in immersive VR. Works with VR headsets, AR on mobile, or 360° video in browser.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">WebXR</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Meta Quest</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Mobile AR</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Social VR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all">
            <div className="aspect-video bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-6xl relative group cursor-pointer"
              onClick={() => setSelectedTour(tour)}>
              {tour.thumbnail}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-pink-600 ml-1" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm mb-1">{tour.title}</h3>
              <p className="text-xs text-gray-600 mb-3">📍 {tour.location}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {tour.features.map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {tour.participants}
                </span>
                <span>{tour.duration}</span>
              </div>

              <button className="w-full mt-3 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Tour
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTour && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg mb-2">{selectedTour.title}</h3>
              <p className="text-sm text-gray-600">{selectedTour.description}</p>
            </div>
            <button onClick={() => setSelectedTour(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="aspect-video bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg mb-4 flex items-center justify-center text-8xl">
            {selectedTour.thumbnail}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center justify-center gap-2">
              <Glasses className="w-4 h-4" />
              Enter VR
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
