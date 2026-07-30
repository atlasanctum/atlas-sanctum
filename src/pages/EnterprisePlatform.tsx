import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Shield, BarChart3, Zap, Globe, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Starter',
    price: '$2,400/mo',
    users: 'Up to 25 users',
    features: ['Core dashboards', 'REST API access', 'Email support', '5 data domains', 'Standard SLA'],
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$8,400/mo',
    users: 'Up to 100 users',
    features: ['All dashboards', 'Full API + webhooks', 'Priority support', 'All data domains', 'AI copilot', '99.9% SLA', 'Custom reports'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    users: 'Unlimited users',
    features: ['White-label option', 'Dedicated infrastructure', '24/7 support', 'Custom AI models', 'On-premise option', '99.99% SLA', 'SSO & RBAC'],
    highlight: false,
  },
];

const clients = [
  { name: 'Ministry of Environment, Kenya', type: 'Government', since: '2024' },
  { name: 'Global Climate Fund', type: 'NGO', since: '2024' },
  { name: 'Regenerative Capital Partners', type: 'Finance', since: '2025' },
  { name: 'UN Environment Programme', type: 'International', since: '2025' },
];

export default function EnterprisePlatform() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Enterprise Platform</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Institutional-grade intelligence infrastructure for governments, NGOs, research institutions, and enterprises driving regenerative impact at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Building2, label: 'Enterprise Clients', value: '84' },
            { icon: Users, label: 'Platform Users', value: '12,400' },
            { icon: Globe, label: 'Countries', value: '47' },
            { icon: Shield, label: 'Uptime SLA', value: '99.99%' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full ${tier.highlight ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-card/50' : 'bg-card/50 border-border/50'}`}>
                <CardHeader>
                  {tier.highlight && <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20">Most Popular</Badge>}
                  <CardTitle>{tier.name}</CardTitle>
                  <p className="text-2xl font-bold text-foreground">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.users}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.highlight ? 'hero' : 'outline'}>
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Enterprise Clients</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clients.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Since {c.since}</p>
                  </div>
                </div>
                <Badge variant="secondary">{c.type}</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
