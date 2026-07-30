/**
 * CovenantLayer.tsx
 *
 * Layer I of the Beatific Alignment Engine — made visible.
 *
 * Instead of "Terms & Conditions" (a legal shield for the platform),
 * this is a Covenant (a mutual promise between participant and commons).
 *
 * The difference:
 * - T&C: "You agree not to sue us."
 * - Covenant: "Here is what you promise, who benefits, who bears risk,
 *              and how future generations are affected."
 *
 * Every action in Atlas Sanctum is a covenant event.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Globe, Clock, ChevronRight,
  CheckCircle, AlertCircle, Heart, Leaf, Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Covenant, CovenantPromise } from '@/lib/sanctum/BeatificAlignmentEngine';

// ─── Covenant definitions by participant type ─────────────────────────────────

const COVENANTS: Record<string, Covenant> = {
  individual: {
    participantId: '',
    participantType: 'individual',
    promises: [
      { id: 'p1', text: 'I will submit only truthful impact claims, verified to the best of my ability.', measurable: true, verificationMethod: 'Oracle attestation', timeHorizon: '1y' },
      { id: 'p2', text: 'I will act as a steward of the commons, not merely an extractor of value.', measurable: false, verificationMethod: 'Virtue ledger observation', timeHorizon: '10y' },
      { id: 'p3', text: 'I will consider how my actions affect people and ecosystems I will never meet.', measurable: false, verificationMethod: 'Time horizon evaluation', timeHorizon: '100y' },
      { id: 'p4', text: 'I will not use this platform to manipulate, deceive, or coerce others.', measurable: true, verificationMethod: 'Behavioral monitoring', timeHorizon: '1y' },
    ],
    responsibilities: [
      'Verify claims before submission',
      'Disclose conflicts of interest',
      'Report suspected fraud to the Auditor Agent',
      'Respect indigenous data sovereignty',
    ],
    beneficiaries: ['Future generations', 'Ecosystem communities', 'Other platform participants', 'The global commons'],
    riskBearers: ['Buyers of impact instruments I issue', 'Communities whose land I claim to steward'],
    futureGenerationsAffected: true,
    signedAt: 0,
    version: '2.0.0',
  },
  organization: {
    participantId: '',
    participantType: 'organization',
    promises: [
      { id: 'p1', text: 'We will submit only audited, third-party verified impact claims.', measurable: true, verificationMethod: 'Multi-oracle attestation', timeHorizon: '1y' },
      { id: 'p2', text: 'We will not use governance weight to extract value from the commons.', measurable: true, verificationMethod: 'Governance power monitoring', timeHorizon: '10y' },
      { id: 'p3', text: 'We will publish our methodology and accept public scrutiny.', measurable: true, verificationMethod: 'Open source requirement', timeHorizon: '1y' },
      { id: 'p4', text: 'We will share 2% of protocol revenue with the communities whose ecosystems we measure.', measurable: true, verificationMethod: 'Treasury audit', timeHorizon: '10y' },
    ],
    responsibilities: [
      'Maintain oracle diversity (HUMAN + API + SENSOR)',
      'Publish annual impact reports on-chain',
      'Respect the 10% governance power cap',
      'Obtain FPIC from indigenous communities before measuring their territories',
    ],
    beneficiaries: ['Local communities', 'Ecosystem inhabitants', 'Future generations', 'Instrument buyers'],
    riskBearers: ['Instrument holders', 'Communities whose land is measured', 'The protocol treasury'],
    futureGenerationsAffected: true,
    signedAt: 0,
    version: '2.0.0',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TimeHorizonBadge = ({ horizon }: { horizon: CovenantPromise['timeHorizon'] }) => {
  const styles = {
    '1y': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    '10y': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    '100y': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  const labels = { '1y': '1 Year', '10y': '10 Years', '100y': '100 Years' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[horizon]}`}>
      {labels[horizon]}
    </span>
  );
};

const PromiseCard = ({
  promise,
  accepted,
  onToggle,
}: {
  promise: CovenantPromise;
  accepted: boolean;
  onToggle: () => void;
}) => (
  <motion.div
    layout
    className={`border rounded-xl p-4 cursor-pointer transition-all ${
      accepted
        ? 'border-primary/40 bg-primary/5'
        : 'border-border hover:border-primary/20'
    }`}
    onClick={onToggle}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        accepted ? 'border-primary bg-primary' : 'border-muted-foreground'
      }`}>
        {accepted && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground leading-relaxed">{promise.text}</p>
        <div className="flex items-center gap-2 mt-2">
          <TimeHorizonBadge horizon={promise.timeHorizon} />
          {promise.measurable && (
            <span className="text-xs text-muted-foreground">
              Verified by: {promise.verificationMethod}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface CovenantLayerProps {
  participantType?: 'individual' | 'organization';
  onCovenantSigned?: (covenant: Covenant) => void;
  compact?: boolean;
}

export function CovenantLayer({
  participantType = 'individual',
  onCovenantSigned,
  compact = false,
}: CovenantLayerProps) {
  const covenant = COVENANTS[participantType];
  const [acceptedPromises, setAcceptedPromises] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<'promises' | 'responsibilities' | 'impact' | 'signed'>('promises');
  const [signed, setSigned] = useState(false);

  const allPromisesAccepted = acceptedPromises.size === covenant.promises.length;

  const togglePromise = (id: string) => {
    setAcceptedPromises(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSign = () => {
    const signedCovenant: Covenant = {
      ...covenant,
      signedAt: Date.now(),
      promises: covenant.promises.map(p => ({ ...p, fulfilled: false })),
    };
    setSigned(true);
    setStep('signed');
    onCovenantSigned?.(signedCovenant);
  };

  if (compact && signed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <Shield className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary">Covenant Active</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Enter the Covenant</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          This is not a Terms & Conditions agreement. It is a mutual covenant —
          a set of promises you make to the commons, and the commons makes to you.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['promises', 'responsibilities', 'impact'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step === s ? 'bg-primary text-primary-foreground' :
              ['promises', 'responsibilities', 'impact', 'signed'].indexOf(step) > i
                ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Promises */}
        {step === 'promises' && (
          <motion.div
            key="promises"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Your Promises
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These are the commitments you make when you join Atlas Sanctum.
                  Each promise has a time horizon — some affect the next year, some the next century.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {covenant.promises.map(promise => (
                  <PromiseCard
                    key={promise.id}
                    promise={promise}
                    accepted={acceptedPromises.has(promise.id)}
                    onToggle={() => togglePromise(promise.id)}
                  />
                ))}
                <Button
                  className="w-full mt-4"
                  disabled={!allPromisesAccepted}
                  onClick={() => setStep('responsibilities')}
                >
                  {allPromisesAccepted ? 'I accept these promises' : `Accept all ${covenant.promises.length} promises to continue`}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Responsibilities */}
        {step === 'responsibilities' && (
          <motion.div
            key="responsibilities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Your Responsibilities
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These are the specific obligations that come with participation.
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {covenant.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Who Benefits</span>
                    </div>
                    <ul className="space-y-1">
                      {covenant.beneficiaries.map((b, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Who Bears Risk</span>
                    </div>
                    <ul className="space-y-1">
                      {covenant.riskBearers.map((r, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setStep('impact')}>
                  I understand my responsibilities
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Future Generations Impact */}
        {step === 'impact' && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Future Generations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your actions on this platform will affect people who are not yet born.
                  This is not metaphor — it is the literal consequence of ecosystem decisions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {[
                    { horizon: '1 Year', icon: Clock, description: 'Your impact claims affect current buyers and communities.' },
                    { horizon: '10 Years', icon: Leaf, description: 'Ecosystem decisions you make today shape biodiversity for a decade.' },
                    { horizon: '100 Years', icon: Globe, description: 'The precedents you set become the institutions your grandchildren inherit.' },
                  ].map(item => (
                    <div key={item.horizon} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.horizon}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-foreground/90 italic leading-relaxed">
                    "Would future generations thank us for this decision?"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    — The question Atlas Sanctum asks before every governance proposal executes.
                  </p>
                </div>

                <Button className="w-full" onClick={handleSign}>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign the Covenant
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Signed */}
        {step === 'signed' && (
          <motion.div
            key="signed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-8 pb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">Covenant Signed</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  You are now a covenant participant in Atlas Sanctum. Your promises are recorded,
                  your trust score begins accumulating, and your actions will be evaluated against
                  the Beatific Alignment Engine.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Shield className="w-3 h-3 mr-1" />
                    Covenant Active
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Leaf className="w-3 h-3 mr-1" />
                    Stewardship Tracking
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Globe className="w-3 h-3 mr-1" />
                    100-Year Horizon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CovenantLayer;
