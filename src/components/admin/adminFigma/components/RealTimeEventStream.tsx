import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Database, Users, Brain, Zap } from 'lucide-react';

interface Event {
  id: string;
  type: 'ai' | 'blockchain' | 'dao' | 'finance' | 'impact';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning';
}

const mockEvents: Event[] = [
  {
    id: '1',
    type: 'ai',
    title: 'AI Model Decision Executed',
    description: 'Carbon Optimizer allocated $45K to Amazon rainforest restoration',
    timestamp: new Date(Date.now() - 2 * 60000),
    severity: 'success',
  },
  {
    id: '2',
    type: 'blockchain',
    title: 'Smart Contract Executed',
    description: 'Carbon credit transfer completed: 120 tCO2 tokens minted',
    timestamp: new Date(Date.now() - 5 * 60000),
    severity: 'info',
  },
  {
    id: '3',
    type: 'dao',
    title: 'DAO Proposal Reached Quorum',
    description: 'Proposal #089 achieved 10,000+ votes, ready for execution',
    timestamp: new Date(Date.now() - 8 * 60000),
    severity: 'success',
  },
  {
    id: '4',
    type: 'finance',
    title: 'ReFi Pool Rebalancing',
    description: 'Automated portfolio adjustment: +15% biodiversity allocation',
    timestamp: new Date(Date.now() - 12 * 60000),
    severity: 'info',
  },
  {
    id: '5',
    type: 'impact',
    title: 'Impact Verification Complete',
    description: 'Ocean restoration project verified: +340 km² protected',
    timestamp: new Date(Date.now() - 15 * 60000),
    severity: 'success',
  },
  {
    id: '6',
    type: 'finance',
    title: 'Treasury Alert',
    description: 'Liquidity dropped below 25% threshold - rebalancing recommended',
    timestamp: new Date(Date.now() - 18 * 60000),
    severity: 'warning',
  },
];

export function RealTimeEventStream() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate real-time events
    const interval = setInterval(() => {
      const newEvent: Event = {
        id: Date.now().toString(),
        type: ['ai', 'blockchain', 'dao', 'finance', 'impact'][Math.floor(Math.random() * 5)] as Event['type'],
        title: 'New System Event',
        description: 'Real-time system activity detected',
        timestamp: new Date(),
        severity: ['info', 'success'][Math.floor(Math.random() * 2)] as Event['severity'],
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 20));
    }, 30000); // New event every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Brain className="w-4 h-4" />;
      case 'blockchain':
        return <Database className="w-4 h-4" />;
      case 'dao':
        return <Users className="w-4 h-4" />;
      case 'finance':
        return <TrendingUp className="w-4 h-4" />;
      case 'impact':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ai':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'blockchain':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'dao':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'finance':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'impact':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg text-white">Real-Time Event Stream</h3>
          <div className="flex items-center gap-1 ml-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'all' 
                ? 'bg-teal-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'ai' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('blockchain')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'blockchain' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Blockchain
          </button>
          <button
            onClick={() => setFilter('dao')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              filter === 'dao' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            DAO
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className={`border rounded-lg p-3 transition-all hover:shadow-md ${getEventColor(event.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${getEventColor(event.type)} border`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm text-white">{event.title}</h4>
                  <span className={`px-2 py-0.5 rounded border text-xs ml-2 flex-shrink-0 ${getSeverityBadge(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{event.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{formatTimestamp(event.timestamp)}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500 capitalize">{event.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}
