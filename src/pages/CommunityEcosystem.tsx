import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Globe, MessageSquare, Heart, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const hubs = [
  { name: 'Climate Action Network', members: 4200, region: 'Global', activity: 'high', topics: ['Carbon', 'Forests', 'Oceans'] },
  { name: 'Regenerative Farmers Alliance', members: 1840, region: 'Africa & Asia', activity: 'high', topics: ['Soil', 'Water', 'Crops'] },
  { name: 'Urban Resilience Collective', members: 2100, region: 'Americas', activity: 'medium', topics: ['Cities', 'Infrastructure', 'Health'] },
  { name: 'Indigenous Knowledge Keepers', members: 680, region: 'Global', activity: 'medium', topics: ['Biodiversity', 'Culture', 'Land'] },
  { name: 'Youth Climate Scientists', members: 3400, region: 'Global', activity: 'high', topics: ['Research', 'Policy', 'Innovation'] },
];

const discussions = [
  { title: 'Best practices for soil carbon measurement in tropical regions', replies: 47, likes: 128, author: 'Dr. Amara Diallo', time: '2h ago' },
  { title: 'How AI is transforming early drought detection in the Sahel', replies: 32, likes: 94, author: 'Priya Nair', time: '5h ago' },
  { title: 'Community-led mangrove restoration: lessons from Bangladesh', replies: 61, likes: 203, author: 'Md. Rahman', time: '1d ago' },
];

export default function CommunityEcosystem() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Phase 4</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Community Ecosystem</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A global network of changemakers — developers, scientists, policymakers, farmers, and community leaders — collaborating to regenerate Earth.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Community Members', value: '48,200' },
            { icon: Globe, label: 'Countries', value: '124' },
            { icon: MessageSquare, label: 'Discussions', value: '18,400' },
            { icon: Heart, label: 'Projects Supported', value: '2,840' },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Community Hubs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hubs.map((hub, i) => (
                <motion.div
                  key={hub.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">{hub.name}</p>
                      <p className="text-xs text-muted-foreground">{hub.region} · {hub.members.toLocaleString()} members</p>
                    </div>
                    <Badge className={`text-xs ${hub.activity === 'high' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                      {hub.activity}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {hub.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
              <Button className="w-full" variant="outline">Browse All Hubs</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Trending Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-sm text-foreground mb-2 leading-snug">{d.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{d.author} · {d.time}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{d.replies}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{d.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="flex gap-3">
                <Button className="flex-1" variant="hero">Join Community</Button>
                <Button variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
