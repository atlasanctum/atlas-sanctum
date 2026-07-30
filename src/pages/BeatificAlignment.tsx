/**
 * BeatificAlignment.tsx
 *
 * The platform's conscience — made navigable.
 *
 * This page answers the question every Mythic Engineer must ask:
 * "Is this system actually living up to its own principles?"
 *
 * Route: /alignment
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Globe, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlignmentDashboard } from '@/components/sanctum/AlignmentDashboard';
import { CovenantLayer } from '@/components/sanctum/CovenantLayer';

const LAYERS = [
  { id: 'I', name: 'Covenant', description: 'Promises, responsibilities, and who bears risk' },
  { id: 'II', name: 'Incentive Engine', description: 'Truth + Stewardship + Trust − Exploitation' },
  { id: 'III', name: 'Wisdom Engine', description: 'Data → Information → Knowledge → Wisdom' },
  { id: 'IV', name: 'Stewardship Graph', description: 'Does this action improve or diminish the commons?' },
  { id: 'V', name: 'Virtue Ledger', description: 'Observable qualities in repeated behavior' },
  { id: 'VI', name: 'Sanctum AI', description: 'Maximize capability, not dependency' },
  { id: 'VII', name: 'Time Horizon', description: 'Today → 1 Year → 10 Years → 100 Years' },
  { id: 'VIII', name: 'Cathedral Protocol', description: 'Built to outlast its creators' },
  { id: 'IX', name: 'Beatific Alignment', description: 'Continuous incentive → behavior → outcome review' },
];

export default function BeatificAlignment() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-primary/5 to-background py-16 px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="max-w-5xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Layer IX
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4">
                The Beatific<br />
                <span className="text-primary">Alignment Engine</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Every system worships something. This page makes explicit what Atlas Sanctum worships —
                and whether it is actually living up to its own principles right now.
              </p>

              {/* 9 Layers */}
              <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                {LAYERS.map((layer, i) => (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:border-primary/30 bg-card/50 transition-all cursor-default">
                      <div className="text-xs font-black text-primary">{layer.id}</div>
                      <div className="text-xs font-semibold text-foreground text-center leading-tight hidden md:block">
                        {layer.name}
                      </div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 rounded-lg bg-popover border border-border text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                      <div className="font-semibold text-foreground mb-0.5">{layer.name}</div>
                      {layer.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Alignment Dashboard
              </TabsTrigger>
              <TabsTrigger value="covenant" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Enter the Covenant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AlignmentDashboard />
            </TabsContent>

            <TabsContent value="covenant">
              <CovenantLayer
                participantType="individual"
                onCovenantSigned={() => setActiveTab('dashboard')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
