import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, MapPin, Eye, Wifi, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const feeds = [
  { region: 'Amazon Basin', type: 'Deforestation Alert', status: 'active', severity: 'high', updated: '2 min ago' },
  { region: 'Sahel Zone', type: 'Desertification Monitor', status: 'active', severity: 'medium', updated: '5 min ago' },
  { region: 'Arctic Circle', type: 'Ice Coverage', status: 'active', severity: 'critical', updated: '1 min ago' },
  { region: 'Great Barrier Reef', type: 'Coral Bleaching', status: 'active', severity: 'high', updated: '8 min ago' },
  { region: 'Mekong Delta', type: 'Flood Risk', status: 'monitoring', severity: 'low', updated: '12 min ago' },
  { region: 'Siberian Permafrost', type: 'Methane Emissions', status: 'active', severity: 'critical', updated: '3 min ago' },
];

const severityColor: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

export default function SatelliteIntegration() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Satellite Integration</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time Earth observation data from 40+ satellite constellations powering environmental intelligence and early warning systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Satellite, label: 'Active Satellites', value: '47', color: 'text-blue-500' },
            { icon: Eye, label: 'Daily Observations', value: '2.1M', color: 'text-emerald-500' },
            { icon: Wifi, label: 'Live Feeds', value: '312', color: 'text-purple-500' },
            { icon: Globe, label: 'Coverage', value: '98.4%', color: 'text-amber-500' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
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

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Environmental Feeds
              <span className="ml-auto flex items-center gap-1.5 text-sm font-normal text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feeds.map((feed, i) => (
              <motion.div
                key={feed.region}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{feed.region}</p>
                    <p className="text-sm text-muted-foreground">{feed.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={severityColor[feed.severity]}>{feed.severity}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:block">{feed.updated}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
