import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Star, Download, Search, Filter, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const listings = [
  { name: 'Amazon Carbon Credits Bundle', type: 'Carbon Credits', price: '$18.40/tCO₂', rating: 4.9, sales: 2840, verified: true, category: 'Climate' },
  { name: 'Sahel Reforestation Project', type: 'Impact Project', price: '$12,000', rating: 4.7, sales: 142, verified: true, category: 'Ecosystem' },
  { name: 'Regenerative Farm Data Feed', type: 'Data', price: '$240/mo', rating: 4.8, sales: 890, verified: true, category: 'Agriculture' },
  { name: 'Ocean Plastic Offset Credits', type: 'Carbon Credits', price: '$22.10/tCO₂', rating: 4.6, sales: 1240, verified: true, category: 'Ocean' },
  { name: 'Urban Biodiversity Index API', type: 'API', price: '$80/mo', rating: 4.5, sales: 340, verified: false, category: 'Urban' },
  { name: 'Solar Farm Impact Bonds', type: 'Finance', price: '$5,000 min', rating: 4.8, sales: 67, verified: true, category: 'Energy' },
];

const categories = ['All', 'Climate', 'Ecosystem', 'Agriculture', 'Ocean', 'Energy', 'Urban'];

export default function GlobalMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? listings : listings.filter(l => l.category === activeCategory);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Phase 4</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Global Marketplace</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The world's first regenerative intelligence marketplace — trade carbon credits, impact data, research, and financial instruments in one open platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Store, label: 'Total Listings', value: '4,820' },
            { icon: Zap, label: 'Daily Volume', value: '$2.4M' },
            { icon: Star, label: 'Verified Sellers', value: '1,240' },
            { icon: Download, label: 'Transactions', value: '84K' },
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

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 bg-muted/50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search marketplace..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                    {item.verified && <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-foreground">{item.price}</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {item.rating} · {item.sales.toLocaleString()} sales
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">View Listing</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
