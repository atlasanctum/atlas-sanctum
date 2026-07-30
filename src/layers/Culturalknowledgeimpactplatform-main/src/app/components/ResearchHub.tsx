import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Download, Eye, ExternalLink, ShieldCheck, Brain, Network, Sparkles, LayoutGrid } from 'lucide-react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { ResearchAssistant } from './ResearchAssistant';

const papers = [
  {
    id: 1,
    title: "Ethical Frameworks for Cultural AI",
    date: "Dec 12, 2024",
    type: "Whitepaper",
    tags: ["Ethics", "AI", "Culture"],
    reads: 1205
  },
  {
    id: 2,
    title: "Decentralized Knowledge Graphs: A Case Study",
    date: "Nov 28, 2024",
    type: "Case Study",
    tags: ["Graph Theory", "Decentralization"],
    reads: 850
  },
  {
    id: 3,
    title: "Bias Mitigation in Multilingual Models",
    date: "Nov 15, 2024",
    type: "Research Paper",
    tags: ["NLP", "Bias", "Inclusion"],
    reads: 2300
  },
  {
    id: 4,
    title: "Indigenous Data Sovereignty Guide",
    date: "Oct 30, 2024",
    type: "Guide",
    tags: ["Sovereignty", "Data Rights"],
    reads: 1500
  }
];

export const ResearchHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side: Intro & Featured */}
        <div className="md:w-1/3 space-y-8">
          <div>
            <div className="inline-flex items-center rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              <Brain className="mr-2 h-4 w-4" />
              Research & Ethics
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ethical AI & Knowledge Research</h2>
            <p className="text-muted-foreground">
              Access peer-reviewed papers, whitepapers, and guides on building ethical, culturally-aware technologies.
            </p>
          </div>

          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Featured Guide
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                The Standard for Ethical Knowledge Sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">The 2025 Global Impact Protocol</h3>
              <p className="text-sm opacity-90 mb-4">
                A comprehensive guide for organizations looking to implement ethical AI practices.
              </p>
              <Button variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Resource Library */}
        <div className="md:w-2/3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-4">
                <TabsTrigger value="all">
                    <LayoutGrid className="w-4 h-4 mr-2 hidden sm:inline" />
                    Library
                </TabsTrigger>
                <TabsTrigger value="graph">
                    <Network className="w-4 h-4 mr-2 hidden sm:inline" />
                    Graph
                </TabsTrigger>
                <TabsTrigger value="assistant">
                    <Sparkles className="w-4 h-4 mr-2 hidden sm:inline" />
                    Assistant
                </TabsTrigger>
                <TabsTrigger value="papers" className="hidden sm:inline-flex">Papers</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                View Archive <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="graph" className="mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Knowledge Ecosystem</CardTitle>
                        <CardDescription>Explore connections between research topics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <KnowledgeGraph items={papers} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="assistant" className="mt-0">
                <ResearchAssistant />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {papers.map((paper) => (
                  <Card key={paper.id} className="transition-all hover:border-primary/50">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-normal">{paper.type}</Badge>
                          <span>•</span>
                          <span>{paper.date}</span>
                        </div>
                        <h4 className="text-lg font-semibold hover:text-primary cursor-pointer">
                          {paper.title}
                        </h4>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {paper.tags.map(tag => (
                            <span key={tag} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:border-l sm:pl-6">
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{paper.reads}</span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {/* Can replicate other tabs content similarly */}
            <TabsContent value="papers">
                <div className="flex items-center justify-center h-40 text-muted-foreground">Filtered view coming soon...</div>
            </TabsContent>
             <TabsContent value="guides">
                <div className="flex items-center justify-center h-40 text-muted-foreground">Filtered view coming soon...</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
