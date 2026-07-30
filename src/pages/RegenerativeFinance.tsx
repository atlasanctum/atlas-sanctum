import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const REGENERATIVE_FINANCE_SEGMENTS = [
  {
    id: "outcome-based",
    name: "Outcome-Based Financing",
    primaryCustomers: "Donors, DFIs, governments, insurers",
    whatIsBeingPriced: "Verified real-world outcomes",
    pricingMechanism: "Pay-for-success / results-based payments",
    priceRange: "Outcome-dependent (often $/ton, $/hectare, $/life)",
    valueJustification: "Capital only pays when reality improves",
    icon: DollarSign,
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-600",
    features: [
      "Pay only when outcomes are verified",
      "Outcome-based pricing models",
      "Real-time impact tracking",
      "Independent verification",
    ],
    caseStudies: [
      {
        name: "Reforestation in Amazon",
        outcome: "10,000 hectares restored",
        investment: "$2.5M",
        impact: "250,000 tons CO₂ sequestered",
      },
    ],
  },
  {
    id: "risk-reduction",
    name: "Risk-Reduction-as-a-Service",
    primaryCustomers: "Insurers, reinsurers, treasuries",
    whatIsBeingPriced: "Quantified risk reduction from regeneration",
    pricingMechanism: "Premium-sharing or service fees",
    priceRange: "% of avoided loss or fixed contracts",
    valueJustification: "Prevention cheaper than disaster recovery",
    icon: Shield,
    color: "text-red-500",
    gradient: "from-red-500 to-rose-600",
    features: [
      "Climate risk assessment",
      "Regeneration impact on risk reduction",
      "Insurance premium optimization",
      "Disaster resilience modeling",
    ],
    caseStudies: [
      {
        name: "Coastal Protection in Bangladesh",
        outcome: "50% flood risk reduction",
        investment: "$1.8M",
        impact: "200,000 people protected",
      },
    ],
  },
  {
    id: "investors",
    name: "Impact Investors & Funds",
    primaryCustomers: "Financial institutions and fund managers",
    whatIsBeingPriced: "Deal flow, risk-scored regenerative projects, performance-linked instruments",
    pricingMechanism: "Origination + Performance Fees",
    priceRange: "1–2% origination + success-based upside",
    valueJustification: "On deal close and verified impact performance",
    icon: TrendingUp,
    color: "text-teal-500",
    gradient: "from-teal-500 to-cyan-600",
    features: [
      "Curated deal flow",
      "Risk-scored projects",
      "Impact performance tracking",
      "Performance-linked returns",
    ],
    caseStudies: [
      {
        name: "Regenerative Agriculture Fund",
        outcome: "15% IRR + 100,000 tons CO₂",
        investment: "$50M fund",
        impact: "50,000 smallholder farmers",
      },
    ],
  },
];

const FINANCIAL_PRODUCTS = [
  {
    name: "Regeneration Bonds",
    description: "Fixed-income securities tied to verified regenerative outcomes",
    features: [
      "Green bond certified",
      "Outcome-linked coupons",
      "Credit enhancement via impact verification",
    ],
    minInvestment: "$10,000",
    returns: "3-8% annually",
  },
  {
    name: "Impact ETFs",
    description: "Exchange-traded funds tracking regenerative assets",
    features: [
      "Diversified portfolio",
      "Real-time impact tracking",
      "Liquidity matching",
    ],
    minInvestment: "$100",
    returns: "Market-linked + impact premium",
  },
  {
    name: "Regeneration Certificates",
    description: "Tokenized outcome-based financing instruments",
    features: [
      "Blockchain verification",
      "Fractional ownership",
      "Secondary market liquidity",
    ],
    minInvestment: "$1,000",
    returns: "Outcome-dependent",
  },
];

export default function RegenerativeFinance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const handleSelectSegment = (segmentId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/regenerative-finance/${segmentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Outcomes Matter Most
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Regenerative Finance
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10">
              Invest in verified impact with outcome-based financing, risk-reduction solutions,
              and performance-linked instruments that deliver both financial returns and
              environmental benefits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/marketplace">
                  Explore Investment Opportunities
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
                Financial Products
              </TabsTrigger>
              <TabsTrigger value="segments" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer Segments
              </TabsTrigger>
            </TabsList>

            {/* Financial Products Tab */}
            <TabsContent value="products">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {FINANCIAL_PRODUCTS.map((product, index) => (
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
                            <span className="text-sm text-muted-foreground">Minimum Investment</span>
                            <span className="font-medium text-foreground">{product.minInvestment}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Expected Returns</span>
                            <span className="font-medium text-foreground">{product.returns}</span>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {REGENERATIVE_FINANCE_SEGMENTS.map((segment, index) => (
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

      {/* Case Studies Section */}
      <section className="py-16 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Real-World Impact Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how regenerative finance is delivering measurable outcomes around the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGENERATIVE_FINANCE_SEGMENTS.flatMap((segment) =>
              segment.caseStudies.map((caseStudy, index) => (
                <Card key={`${segment.id}-${index}`} className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{caseStudy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Outcome</span>
                        <span className="font-medium text-foreground">{caseStudy.outcome}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Investment</span>
                        <span className="font-medium text-foreground">{caseStudy.investment}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Impact</span>
                        <span className="font-medium text-foreground">{caseStudy.impact}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Detailed Report
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Ready to Invest in Impact?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading financial institutions investing in the regenerative economy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/marketplace">
                Explore Investment Opportunities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
