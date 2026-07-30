import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Download, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const papers = [
  { title: 'Regenerative Agriculture Impact on Carbon Sequestration', authors: 'Chen et al.', year: 2025, citations: 142, domain: 'Agriculture', open: true },
  { title: 'AI-Driven Early Warning Systems for Climate Tipping Points', authors: 'Okonkwo & Patel', year: 2025, citations: 89, domain: 'Climate', open: true },
  { title: 'Governance Resilience in Post-Conflict Regions', authors: 'Müller et al.', year: 2024, citations: 67, domain: 'Governance', open: true },
  { title: 'Biodiversity Loss Prediction Using Satellite Imagery', authors: 'Santos & Kim', year: 2025, citations: 203, domain: 'Ecosystem', open: true },
  { title: 'Economic Multipliers of Regenerative Investment', authors: 'Adeyemi et al.', year: 2024, citations: 118, domain: 'Economy', open: false },
];

const datasets = [
  { name: 'Global Carbon Flux 2020–2025', size: '4.2 GB', downloads: 8400, license: 'CC BY 4.0' },
  { name: 'Bioregional Biodiversity Index', size: '1.8 GB', downloads: 3200, license: 'CC BY 4.0' },
  { name: 'Food Security Indicators 180 Countries', size: '840 MB', downloads: 12000, license: 'Open Data' },
];

export default function OpenResearchPlatform() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">Phase 4</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Open Research Platform</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Open-access research, datasets, and collaboration tools for scientists, policymakers, and communities working on regenerative challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: 'Research Papers', value: '2,840' },
            { icon: BookOpen, label: 'Open Datasets', value: '480' },
            { icon: Users, label: 'Researchers', value: '6,200' },
            { icon: Download, label: 'Total Downloads', value: '1.2M' },
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

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 bg-muted/50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search research papers, datasets..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button variant="hero" size="sm">Submit Research</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Recent Publications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {papers.map((paper, i) => (
                  <motion.div
                    key={paper.title}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-medium text-sm text-foreground leading-snug">{paper.title}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">{paper.domain}</Badge>
                        {paper.open && <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Open</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{paper.authors} · {paper.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        {paper.citations} citations
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" /> Open Datasets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {datasets.map((ds, i) => (
                <motion.div
                  key={ds.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <p className="font-medium text-sm text-foreground mb-1">{ds.name}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{ds.size}</span>
                    <span>{ds.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{ds.license}</Badge>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
