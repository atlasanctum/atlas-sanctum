import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Brain, Shield, Cpu, Layers, Zap,
  AlertTriangle, Lock, TrendingUp, Target, BookOpen, Users,
  ChevronRight, ChevronDown, Star, Building2,
  Activity, Infinity, ArrowRight, Crown, Atom,
  Network, Database, Eye, Scale, Rocket, DollarSign, Triangle,
} from 'lucide-react';
import Layout from '@/components/Layout';
import {
  CIVILIZATION_LAYERS, MISSING_LAYERS, TRUST_OS, AGENTS,
  AGENT_CIVILIZATION_EMERGENCE, NEW_ASSET_CLASSES,
  DIGITAL_TWIN_BLUEPRINT, KNOWLEDGE_GRAPH_BLUEPRINT,
  CONSTITUTIONAL_PILLARS, WHAT_MUST_NEVER_CHANGE,
  HUNDRED_YEAR_ARCHITECTURE, HIDDEN_BREAKTHROUGHS,
  OPPORTUNITIES, RISKS, MOATS, FINAL_VERDICT,
} from '@/lib/sanctum/mythic-architect';

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const SectionBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
    {children}
  </span>
);

const SectionHeader = ({ phase, title, subtitle }: { phase: string; title: string; subtitle: string }) => (
  <div className="mb-10">
    <SectionBadge>{phase}</SectionBadge>
    <h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
    <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>
    {children}
  </div>
);

const StatusDot = ({ status }: { status: 'exists' | 'partial' | 'missing' }) => {
  const colors = { exists: 'bg-emerald-500', partial: 'bg-amber-500', missing: 'bg-red-500' };
  const labels = { exists: 'Built', partial: 'Partial', missing: 'Missing' };
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium">
      <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
      {labels[status]}
    </span>
  );
};

const UrgencyBadge = ({ urgency }: { urgency: 'critical' | 'high' | 'medium' }) => {
  const styles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide ${styles[urgency]}`}>
      {urgency}
    </span>
  );
};

const TierBadge = ({ tier }: { tier: 'immutable' | 'constitutional' | 'economic' | 'operational' }) => {
  const styles = {
    immutable: 'bg-red-500/10 text-red-400 border-red-500/20',
    constitutional: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    economic: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    operational: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide ${styles[tier]}`}>
      Tier: {tier}
    </span>
  );
};

const Expandable = ({ title, children, defaultOpen = false }: {
  title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Nav tabs ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'executive', label: 'Executive Summary', icon: Crown },
  { id: 'civilization', label: 'Civilization Map', icon: Globe },
  { id: 'missing', label: 'Missing Infrastructure', icon: AlertTriangle },
  { id: 'trust-os', label: 'Trust OS', icon: Shield },
  { id: 'agents', label: 'Agent Civilization', icon: Cpu },
  { id: 'assets', label: 'New Asset Classes', icon: TrendingUp },
  { id: 'twin', label: 'Digital Twin', icon: Atom },
  { id: 'knowledge', label: 'Knowledge Graph', icon: Network },
  { id: 'constitution', label: 'Constitution', icon: Scale },
  { id: '100year', label: '100-Year Architecture', icon: Infinity },
  { id: 'breakthroughs', label: 'Hidden Breakthroughs', icon: Zap },
  { id: 'opportunities', label: 'Opportunities', icon: DollarSign },
  { id: 'risks', label: 'Risks & Moats', icon: Lock },
  { id: 'verdict', label: 'Final Verdict', icon: Star },
];

// ─── Section components ───────────────────────────────────────────────────────

const ExecutiveSummary = () => (
  <section>
    <SectionHeader
      phase="Executive Summary"
      title="Atlas Sanctum: The Trust OS for Humanity"
      subtitle="A civilization-scale analysis of what Atlas Sanctum is, what it is missing, and what it must become to serve as indispensable global infrastructure for the next 1,000 years."
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { icon: Building2, label: 'Institutions Replaced', value: '12+', sub: 'Carbon registries, audit firms, manual brokers' },
        { icon: Layers, label: 'Infrastructure Layers', value: '10', sub: 'Identity, Knowledge, Agent, Oracle, Governance, Financial + 4 more' },
        { icon: DollarSign, label: 'Addressable Value', value: '$4T+', sub: 'Impact markets, identity, digital twin, trust-as-currency' },
      ].map(item => (
        <Card key={item.label} className="flex flex-col items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <item.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">{item.value}</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
          </div>
        </Card>
      ))}
    </div>
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/20 shrink-0">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-2">The Core Insight</h3>
          <p className="text-muted-foreground leading-relaxed">
            Atlas Sanctum has built the financial and governance scaffolding for a civilizational platform.
            The trust engine, constitutional framework, agent economy definitions, and AI layer architecture
            are world-class — there is nothing comparable in the market.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            What separates a brilliant prototype from indispensable global infrastructure is three missing keystones:
            a <span className="text-primary font-semibold">live oracle network</span>, <span className="text-primary font-semibold">portable sovereign identity</span>,
            and the <span className="text-primary font-semibold">constitutional engine deployed on-chain</span>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            The Trust OS insight is the core moat. Making trust itself the pricing primitive is what Moody's did for debt in 1909.
            Atlas Sanctum has the opportunity to do the same for impact in 2025.
          </p>
        </div>
      </div>
    </Card>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Rocket className="w-4 h-4 text-primary" /> Critical Path</h4>
        <ol className="space-y-2">
          {FINAL_VERDICT.criticalPath.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
              {step.replace(/^\d+\. /, '')}
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Comparable Institutions</h4>
        {[
          { name: 'Visa', angle: 'Settlement rails for trust instruments' },
          { name: 'Stripe', angle: 'Developer-first impact finance API' },
          { name: 'Palantir', angle: 'Planetary intelligence & decision engine' },
          { name: 'S&P Global', angle: 'Trust scoring standard for impact' },
          { name: 'OpenAI', angle: 'AI civilization operating layer' },
        ].map(item => (
          <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
            <span className="text-sm font-medium text-foreground">{item.name}</span>
            <span className="text-xs text-muted-foreground text-right max-w-[200px]">{item.angle}</span>
          </div>
        ))}
      </Card>
    </div>
  </section>
);

const CivilizationMap = () => (
  <section>
    <SectionHeader
      phase="Phase 1 — Civilization Decomposition"
      title="What Atlas Sanctum Is Truly Solving"
      subtitle="A systematic map of which institutions Atlas replaces, augments, and creates — and which layers are built, partial, or missing."
    />
    <div className="space-y-4">
      {CIVILIZATION_LAYERS.map(layer => (
        <Expandable
          key={layer.id}
          title={
            <div className="flex items-center gap-3">
              <StatusDot status={layer.status} />
              <span>{layer.name}</span>
            </div>
          }
          defaultOpen={layer.id === 'trust-infra'}
        >
          <p className="text-sm text-muted-foreground mb-4">{layer.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Replaces', items: layer.replaces, color: 'text-red-400' },
              { title: 'Augments', items: layer.augments, color: 'text-amber-400' },
              { title: 'Creates', items: layer.creates, color: 'text-emerald-400' },
            ].map(col => (
              <div key={col.title}>
                <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${col.color}`}>{col.title}</div>
                <ul className="space-y-1">
                  {col.items.map(item => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-muted-foreground/50" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Expandable>
      ))}
    </div>
  </section>
);

const MissingInfrastructure = () => (
  <section>
    <SectionHeader
      phase="Phase 2 — Missing Infrastructure"
      title="The Missing Foundational Layers"
      subtitle="Seven critical infrastructure gaps that, if left unfilled, prevent Atlas Sanctum from becoming indispensable global infrastructure."
    />
    <div className="grid grid-cols-1 gap-5">
      {MISSING_LAYERS.map((layer, i) => (
        <Card key={layer.id} className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/30" />
          <div className="pl-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-mono">#{String(i + 1).padStart(2, '0')}</span>
                  <UrgencyBadge urgency={layer.urgency} />
                  <span className="text-xs text-muted-foreground capitalize">{layer.category}</span>
                </div>
                <h3 className="font-bold text-foreground">{layer.name}</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Why It's Missing</div>
                <p className="text-sm text-muted-foreground">{layer.whyMissing}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">What It Unlocks</div>
                <p className="text-sm text-muted-foreground">{layer.whatItUnlocks}</p>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Required Primitives</div>
              <div className="flex flex-wrap gap-2">
                {layer.primitives.map(p => (
                  <span key={p} className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground font-mono">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const TrustOS = () => (
  <section>
    <SectionHeader
      phase="Phase 3 — Trust Operating System"
      title="Atlas Sanctum as the Trust OS for Humanity"
      subtitle="The complete primitive set that makes trust flow through the system — from raw evidence to priced financial instruments."
    />
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
      <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Trust Flow</div>
      <p className="text-sm text-muted-foreground leading-relaxed font-mono">{TRUST_OS.trustFlow}</p>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: 'Trust Primitives', items: TRUST_OS.trustPrimitives, icon: Shield, color: 'text-blue-400' },
        { title: 'Reputation Primitives', items: TRUST_OS.reputationPrimitives, icon: Star, color: 'text-amber-400' },
        { title: 'Verification Primitives', items: TRUST_OS.verificationPrimitives, icon: Eye, color: 'text-emerald-400' },
        { title: 'Incentive Primitives', items: TRUST_OS.incentivePrimitives, icon: DollarSign, color: 'text-purple-400' },
        { title: 'Coordination Primitives', items: TRUST_OS.coordinationPrimitives, icon: Network, color: 'text-rose-400' },
      ].map(group => (
        <Card key={group.title}>
          <div className="flex items-center gap-2 mb-4">
            <group.icon className={`w-4 h-4 ${group.color}`} />
            <h3 className="font-semibold text-foreground text-sm">{group.title}</h3>
          </div>
          <div className="space-y-3">
            {group.items.map((item: { name: string; description: string }) => (
              <div key={item.name}>
                <div className="text-xs font-semibold text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const AgentCivilization = () => (
  <section>
    <SectionHeader
      phase="Phase 4 — Agent Civilization"
      title="The First Native AI Economy"
      subtitle="Seven constitutionally-constrained agents forming the executive layer of Atlas Sanctum — earning, hiring, competing, and governing."
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
      {AGENTS.map(agent => (
        <Expandable
          key={agent.id}
          title={
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-semibold">{agent.name}</span>
              <span className="text-xs text-muted-foreground truncate">{agent.purpose.split('.')[0]}</span>
            </div>
          }
        >
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Purpose</div>
              <p className="text-muted-foreground">{agent.purpose}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Powers</div>
                <ul className="space-y-1">{agent.powers.map(p => <li key={p} className="text-xs text-muted-foreground flex gap-1"><ChevronRight className="w-3 h-3 shrink-0 mt-0.5" />{p}</li>)}</ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Constraints</div>
                <ul className="space-y-1">{agent.constraints.map(c => <li key={c} className="text-xs text-muted-foreground flex gap-1"><ChevronRight className="w-3 h-3 shrink-0 mt-0.5" />{c}</li>)}</ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">Revenue</div>
                <p className="text-xs text-muted-foreground">{agent.revenue}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Governance</div>
                <p className="text-xs text-muted-foreground">{agent.governance}</p>
              </div>
            </div>
          </div>
        </Expandable>
      ))}
    </div>
    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
      <div className="flex items-start gap-3">
        <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-foreground mb-3">How an AI Civilization Emerges</h3>
          <div className="space-y-2">
            {AGENT_CIVILIZATION_EMERGENCE.trim().split('\n\n').slice(1).map((para, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para.replace(/^\d+\. [A-Z]+ — /, '')}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </section>
);

const NewAssetClasses = () => (
  <section>
    <SectionHeader
      phase="Phase 5 — Regenerative Value Exchange"
      title="New Asset Classes for the Impact Age"
      subtitle="Six entirely new financial instruments that go beyond stocks, bonds, commodities, and crypto — creating markets for what has never been tradeable."
    />
    <div className="grid grid-cols-1 gap-5">
      {NEW_ASSET_CLASSES.map(asset => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{asset.category}</div>
              <h3 className="font-bold text-foreground">{asset.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-muted-foreground mb-0.5">Market Size</div>
              <div className="font-bold text-primary">{asset.marketSizeUSD}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Issuance', value: asset.issuance },
              { label: 'Verification', value: asset.verification },
              { label: 'Pricing', value: asset.pricing },
              { label: 'Liquidity', value: asset.liquidity },
            ].map(col => (
              <div key={col.label} className="bg-muted/50 rounded-xl p-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{col.label}</div>
                <p className="text-xs text-foreground/80 leading-relaxed">{col.value}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const DigitalTwin = () => (
  <section>
    <SectionHeader
      phase="Phase 6 — Digital Twin of Civilization"
      title="Planetary Simulation Engine"
      subtitle="A real-time model of cities, governments, economies, and ecosystems that enables consequence modeling before decisions are made."
    />
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
      <p className="text-sm text-muted-foreground leading-relaxed">{DIGITAL_TWIN_BLUEPRINT.purpose}</p>
      <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
        <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Key Capability</div>
        <p className="text-sm text-foreground/90">{DIGITAL_TWIN_BLUEPRINT.keyCapability}</p>
      </div>
    </Card>
    <div className="space-y-3 mb-6">
      {DIGITAL_TWIN_BLUEPRINT.layers.map(layer => (
        <div key={layer.name} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-1">{layer.name}</h4>
              <div className="flex flex-wrap gap-2">
                {layer.models.map(m => (
                  <span key={m} className="px-2 py-0.5 bg-muted rounded-lg text-xs text-muted-foreground">{m}</span>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-muted-foreground mb-1">Data Source</div>
              <div className="text-xs text-primary/80 font-mono">{layer.dataSource}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <Card>
      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> How It Works</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{DIGITAL_TWIN_BLUEPRINT.howItWorks}</p>
    </Card>
  </section>
);

const KnowledgeGraph = () => (
  <section>
    <SectionHeader
      phase="Phase 7 — Knowledge Graph of Humanity"
      title="The First Global Knowledge Commons"
      subtitle="A semantic graph connecting people, organizations, assets, capital, risks, and ecosystems — the intelligence substrate for every Atlas agent."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> Ontology</h4>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Core Entities</div>
            <div className="flex flex-wrap gap-1.5">
              {KNOWLEDGE_GRAPH_BLUEPRINT.ontology.coreEntities.map(e => (
                <span key={e} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs border border-blue-500/20">{e}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Core Relations</div>
            <div className="flex flex-wrap gap-1.5">
              {KNOWLEDGE_GRAPH_BLUEPRINT.ontology.coreRelations.map(r => (
                <span key={r} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs border border-purple-500/20 font-mono">{r}</span>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-border space-y-1.5">
            <div>
              <span className="text-xs font-semibold text-foreground">Temporal Model: </span>
              <span className="text-xs text-muted-foreground">{KNOWLEDGE_GRAPH_BLUEPRINT.ontology.temporalModel}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground">Privacy Model: </span>
              <span className="text-xs text-muted-foreground">{KNOWLEDGE_GRAPH_BLUEPRINT.ontology.privacyModel}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> AI Integration</h4>
        <ul className="space-y-2">
          {KNOWLEDGE_GRAPH_BLUEPRINT.aiIntegration.map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
    <Card>
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Data Model</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(KNOWLEDGE_GRAPH_BLUEPRINT.dataModel).map(([key, value]) => (
          <div key={key} className="bg-muted/50 rounded-xl p-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide capitalize mb-1">{key}</div>
            <p className="text-xs text-foreground/80">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  </section>
);

const Constitution = () => (
  <section>
    <SectionHeader
      phase="Phase 8 — Atlas Constitution"
      title="The Highest Law of Atlas Sanctum"
      subtitle="Constitutional foundations encoded as executable constraints — not just documentation but the protocol's supreme legal layer."
    />
    <div className="space-y-3 mb-8">
      {CONSTITUTIONAL_PILLARS.map(pillar => (
        <div key={pillar.id} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{pillar.id}</span>
                <TierBadge tier={pillar.tier} />
              </div>
              <h4 className="font-semibold text-foreground text-sm">{pillar.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{pillar.text}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-muted-foreground mb-0.5">Enforced At</div>
              <div className="text-xs font-mono text-primary/80">{pillar.enforcedAt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <Card className="border-red-500/20 bg-red-500/5">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Lock className="w-4 h-4 text-red-400" />
        What Must Never Change
      </h4>
      <ul className="space-y-2">
        {WHAT_MUST_NEVER_CHANGE.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  </section>
);

const HundredYearArch = () => {
  const arch = HUNDRED_YEAR_ARCHITECTURE;
  return (
    <section>
      <SectionHeader
        phase="Phase 9 — 100-Year Architecture"
        title="Built to Outlast Any Government"
        subtitle="Technical, organizational, governance, and economic architecture designed to operate for 100+ years across billions of users, sovereign institutions, and autonomous AI agents."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> Technical Architecture</h4>
          <p className="text-xs text-muted-foreground mb-3 italic">"{arch.technical.principle}"</p>
          <div className="space-y-2">
            {arch.technical.layers.map(l => (
              <div key={l.name} className="bg-muted/50 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{l.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{l.tech}</div>
                  </div>
                  <span className="text-xs text-emerald-400 shrink-0">{l.durability}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Governance Phases</h4>
            <div className="space-y-2">
              {Object.values(arch.organizational).map((phase) => (
                <div key={phase.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-16 text-xs font-mono text-muted-foreground shrink-0">{phase.years}</div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-foreground">{phase.name}</div>
                    <div className="text-xs text-muted-foreground">{phase.control}</div>
                  </div>
                  <div className="text-xs text-primary shrink-0">{Math.round(phase.daoWeight * 100)}% DAO</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Economic Architecture</h4>
            <p className="text-xs text-muted-foreground italic mb-3">"{arch.economic.principle}"</p>
            <ul className="space-y-1">
              {arch.economic.streams.map(s => (
                <li key={s} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary">→</span>{s}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">{arch.economic.treasury}</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

const HiddenBreakthroughs = () => (
  <section>
    <SectionHeader
      phase="Phase 10 — Hidden Breakthroughs"
      title="Innovations That Do Not Yet Exist"
      subtitle="Six discoveries that Atlas Sanctum has not yet made — each representing a breakthrough that would redefine an industry."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {HIDDEN_BREAKTHROUGHS.map((b, i) => (
        <Card key={b.id} className="relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="absolute top-4 right-4 text-5xl font-black text-muted/10 group-hover:text-primary/10 transition-colors">
            {String(i + 1).padStart(2, '0')}
          </div>
          <div className="relative">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{b.category}</div>
            <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const Opportunities = () => (
  <section>
    <SectionHeader
      phase="Deliverables"
      title="Billion & Trillion-Dollar Opportunities"
      subtitle="Concrete opportunities Atlas Sanctum can capture with the right infrastructure investments — ordered by horizon and magnitude."
    />
    <div className="space-y-4">
      {OPPORTUNITIES.map(opp => (
        <Card key={opp.id} className={`border-l-4 ${opp.tier === 'trillion' ? 'border-l-purple-500' : 'border-l-primary'}`}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${opp.tier === 'trillion' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                  {opp.tier}-dollar
                </span>
                <span className="text-xs text-muted-foreground">{opp.timeHorizonYears}yr horizon</span>
              </div>
              <h3 className="font-bold text-foreground">{opp.title}</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="font-semibold text-muted-foreground mb-0.5">Key Dependency</div>
              <div className="text-foreground/80">{opp.keyDependency}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="font-semibold text-muted-foreground mb-0.5">Moat</div>
              <div className="text-foreground/80">{opp.moat}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const RisksAndMoats = () => (
  <section>
    <SectionHeader
      phase="Deliverables"
      title="Greatest Risks & Greatest Moats"
      subtitle="Existential risks that must be designed against, and structural advantages that compound over time."
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Triangle className="w-4 h-4 text-red-400" /> Greatest Risks</h3>
        <div className="space-y-3">
          {RISKS.map(risk => (
            <div key={risk.id} className="border border-border rounded-xl p-4 hover:border-red-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${risk.severity === 'existential' ? 'bg-red-500' : risk.severity === 'critical' ? 'bg-amber-500' : 'bg-yellow-500'}`} />
                <span className="text-xs font-semibold uppercase text-muted-foreground">{risk.severity}</span>
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">{risk.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2">
                <div className="text-xs font-semibold text-emerald-400 mb-0.5">Mitigation</div>
                <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400" /> Greatest Moats</h3>
        <div className="space-y-3">
          {MOATS.map(moat => (
            <div key={moat.id} className="border border-border rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground capitalize">{moat.type}</span>
                  <h4 className="font-semibold text-foreground text-sm">{moat.name}</h4>
                </div>
                <span className="text-xs text-emerald-400 shrink-0">{moat.durabilityYears}yr durability</span>
              </div>
              <p className="text-xs text-muted-foreground">{moat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FinalVerdict = () => (
  <section>
    <SectionHeader
      phase="Final Verdict"
      title="If Atlas Sanctum Succeeds..."
      subtitle="The institution that will exist in the world that does not exist today."
    />
    <Card className="mb-6">
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{FINAL_VERDICT.summary}</p>
    </Card>
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/20">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-widest">The New Institution</div>
            <h3 className="text-xl font-bold text-foreground">The Trust Clearing House of Civilization</h3>
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          {FINAL_VERDICT.newInstitution.split('\n\n').map((para, i) => (
            <p key={i} className={`leading-relaxed mb-3 ${i === 1 ? 'text-lg font-semibold text-foreground' : 'text-muted-foreground'}`}>
              {para.replace(/^THE TRUST CLEARING HOUSE OF CIVILIZATION\n\n/, '')}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/20">
          {[
            { label: 'The Federal Reserve of', value: 'The Regenerative Economy' },
            { label: 'The S&P Global of', value: 'The Impact Age' },
            { label: 'The ICAO of', value: 'Planetary Governance' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-sm font-semibold text-primary mt-0.5">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </section>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const SECTION_MAP: Record<string, React.ReactNode> = {
  executive: <ExecutiveSummary />,
  civilization: <CivilizationMap />,
  missing: <MissingInfrastructure />,
  'trust-os': <TrustOS />,
  agents: <AgentCivilization />,
  assets: <NewAssetClasses />,
  twin: <DigitalTwin />,
  knowledge: <KnowledgeGraph />,
  constitution: <Constitution />,
  '100year': <HundredYearArch />,
  breakthroughs: <HiddenBreakthroughs />,
  opportunities: <Opportunities />,
  risks: <RisksAndMoats />,
  verdict: <FinalVerdict />,
};

const MythicArchitect = () => {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-primary/5 to-background py-16 px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SectionBadge>Mythic Architect Blueprint</SectionBadge>
              <h1 className="mt-4 text-4xl md:text-5xl font-black text-foreground leading-tight">
                Atlas Sanctum<br />
                <span className="text-primary">Civilization Architecture</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                A 1,000-year design analysis combining the systems intelligence of da Vinci, Turing, Fuller, Ostrom, and Hopper.
                Every phase, every blueprint, every breakthrough — encoded and navigable.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {[
                  { icon: BookOpen, label: '14 Deliverables' },
                  { icon: Layers, label: '10 Infrastructure Phases' },
                  { icon: Globe, label: '100-Year Architecture' },
                  { icon: DollarSign, label: 'Trillion-Dollar Opportunities' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="w-4 h-4 text-primary" />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar nav */}
            <aside className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-24 space-y-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile tab strip */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-2 flex gap-2 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs shrink-0 transition-colors ${
                    activeTab === tab.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main content */}
            <main className="flex-1 min-w-0 pb-20 xl:pb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {SECTION_MAP[activeTab]}
                </motion.div>
              </AnimatePresence>

              {/* Next section nav */}
              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                {TABS.findIndex(t => t.id === activeTab) > 0 && (
                  <button
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.id === activeTab);
                      setActiveTab(TABS[idx - 1].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {TABS[TABS.findIndex(t => t.id === activeTab) - 1].label}
                  </button>
                )}
                <div className="flex-1" />
                {TABS.findIndex(t => t.id === activeTab) < TABS.length - 1 && (
                  <button
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.id === activeTab);
                      setActiveTab(TABS[idx + 1].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:text-primary transition-colors"
                  >
                    {TABS[TABS.findIndex(t => t.id === activeTab) + 1].label} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MythicArchitect;
