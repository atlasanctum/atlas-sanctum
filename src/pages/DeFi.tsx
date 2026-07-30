import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Zap,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const DEFI_SEGMENTS = [
  {
    id: "capital-markets",
    name: "Capital Markets & DeFi Layer",
    primaryCustomers: "Funds, crypto institutions, exchanges",
    whatIsBeingPriced: "Tokenized assets, oracle data, smart contracts",
    pricingMechanism: "Protocol, custody & usage fees",
    priceRange: "Low per unit, high volume",
    valueJustification: "Enables new financial instruments safely",
    icon: Network,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-blue-600",
    features: [
      "Tokenized regenerative assets",
      "Real-time oracle data",
      "Smart contract execution",
      "Multi-chain compatibility",
    ],
    useCases: [
      "RIU tokenization",
      "Impact derivatives",
      "DeFi protocol integration",
    ],
  },
  {
    id: "defi",
    name: "DeFi & Capital Market Participants",
    primaryCustomers: "Tokenized asset and smart contract users",
    whatIsBeingPriced: "Tokenized regenerative assets, oracle data, smart contract execution",
    pricingMechanism: "Protocol & Usage Fees",
    priceRange: "Low per-transaction; high volume",
    valueJustification: "Per transaction / oracle call",
    icon: Wallet,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-600",
    features: [
      "Decentralized exchanges",
      "Yield farming opportunities",
      "Liquidity provision",
      "Staking rewards",
    ],
    useCases: [
      "Automated market making",
      "Liquidity pools",
      "Staking contracts",
    ],
  },
];

const DEFI_PRODUCTS = [
  {
    name: "RIU Token",
    description: "Tokenized Regenerative Impact Units",
    features: [
      "ERC-20 standard",
      "Backed by verified impact",
      "Audited smart contracts",
    ],
    price: "$82.10",
    change24h: "+5.2%",
  },
  {
    name: "Impact Oracle",
    description: "Decentralized impact verification oracle",
    features: [
      "Real-time data feeds",
      "Multi-source validation",
      "On-chain reporting",
    ],
    price: "$0.001 per API call",
    change24h: "-1.3%",
  },
  {
    name: "Regeneration Vaults",
    description: "Automated yield farming strategies",
    features: [
      "Algorithmic strategies",
      "Risk-managed returns",
      "Impact-weighted allocations",
    ],
    price: "Variable APY",
    change24h: "+2.1%",
  },
];

export default function DeFi() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const handleSelectSegment = (segmentId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/defi/${segmentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Blockchain-Powered Finance
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              DeFi & Capital Markets
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10">
              Tokenized regenerative assets, oracle data, smart contracts, and decentralized
              financial instruments that make impact investing accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/marketplace">
                  Explore DeFi Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="products" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                DeFi Products
              </TabsTrigger>
              <TabsTrigger value="segments" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer Segments
              </TabsTrigger>
            </TabsList>

            {/* DeFi Products Tab */}
            <TabsContent value="products">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {DEFI_PRODUCTS.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className={`relative h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors group`}>
                      <CardHeader className="pb-4">
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4 space-y-2">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Current Price</span>
                            <span className="font-medium text-foreground">{product.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">24h Change</span>
                            <span className={`font-medium ${product.change24h.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                              {product.change24h}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => navigate("/marketplace")}
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Customer Segments Tab */}
            <TabsContent value="segments">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {DEFI_SEGMENTS.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card
                      className={`relative h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors group`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${segment.color.replace('text-', 'bg-')}/10`}
                          >
                            <segment.icon className={`w-5 h-5 ${segment.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">
                              {segment.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium">Primary Customers:</span>
                          <br />
                          {segment.primaryCustomers}
                        </p>
                        <div className="mt-4">
                          <span className={`text-2xl font-bold ${segment.color}`}>
                            {segment.priceRange}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {segment.pricingMechanism}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">What's Priced:</span>
                            <br />
                            {segment.whatIsBeingPriced}
                          </p>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Value Justification:</span>
                            <br />
                            {segment.valueJustification}
                          </p>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Key Use Cases:</span>
                          </p>
                          <div className="mt-2 space-y-1">
                            {segment.useCases.map((useCase, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-foreground">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectSegment(segment.id)}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Technical Infrastructure Section */}
      <section className="py-16 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Decentralized Infrastructure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Blockchain-powered architecture for secure, transparent, and efficient
              regenerative finance operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Smart Contracts",
                description: "Audited, battle-tested smart contracts for regenerative finance",
                features: ["ERC-20 tokens", "Yield farming", "Staking", "Governance"],
              },
              {
                name: "Oracles",
                description: "Decentralized oracle network for real-time impact data",
                features: ["Data aggregation", "Multi-source verification", "On-chain reporting"],
              },
              {
                name: "Bridge Infrastructure",
                description: "Cross-chain compatibility for seamless asset transfers",
                features: ["Multi-chain support", "Instant transfers", "Security audits"],
              },
            ].map((item, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <div className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Join the DeFi Revolution
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Build on our decentralized finance platform for regenerative impact
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/marketplace">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Developer Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
