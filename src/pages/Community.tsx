import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Heart,
  FileText,
  CheckCircle,
  ArrowRight,
  Zap,
  GraduationCap,
  TreePine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const COMMUNITY_SEGMENTS = [
  {
    id: "commons-stewardship",
    name: "Commons Stewardship (DAO)",
    primaryCustomers: "Members, stewards, partners",
    whatIsBeingPriced: "Governance rights, voting, stewardship roles",
    pricingMechanism: "Mostly non-monetary; stake-based",
    priceRange: "Minimal / symbolic",
    valueJustification: "Prevents capture and mission drift",
    icon: Users,
    color: "text-teal-500",
    gradient: "from-teal-500 to-cyan-600",
    features: [
      "DAO governance structure",
      "Voting & decision-making",
      "Stewardship roles",
      "Community-driven initiatives",
    ],
    benefits: [
      "Participate in platform governance",
      "Shape future development",
      "Access community resources",
    ],
  },
  {
    id: "intellectual-infrastructure",
    name: "Intellectual Infrastructure",
    primaryCustomers: "Developers, researchers, institutions",
    whatIsBeingPriced: "Standards, schemas, ethical AI protocols",
    pricingMechanism: "Open core + paid services",
    priceRange: "Free core; paid hosting & guarantees",
    valueJustification: "Standards drive adoption and longevity",
    icon: FileText,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-600",
    features: [
      "Open standards & schemas",
      "Ethical AI protocols",
      "Research & development",
      "Developer resources",
    ],
    benefits: [
      "Access to open APIs",
      "Developer support",
      "Research partnerships",
    ],
  },
  {
    id: "producers",
    name: "Regenerative Producers",
    description: "Farmers, fishers, land & ocean stewards",
    whatTheyGet: "Mobile access, onboarding, AI-assisted regeneration guidance, impact verification, access to buyers & finance",
    pricingModel: "Free / Subsidized",
    priceRange: "$0",
    whenWeGetPaid: "Never at entry; platform earns only when credits are sold to buyers",
    icon: TreePine,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-600",
    features: [
      "Mobile tools",
      "AI guidance",
      "Impact verification",
      "Market access",
    ],
    benefits: [
      "Free platform access",
      "Technical support",
      "Market connections",
    ],
  },
  {
    id: "communities",
    name: "Local Communities & Youth Nodes",
    description: "Schools, labs, cooperatives",
    whatTheyGet: "Education access, impact storytelling tools, ethical AI library, participation in DAO",
    pricingModel: "Free / Grant-backed",
    priceRange: "$0",
    whenWeGetPaid: "Indirectly via sponsors, institutions, and buyers",
    icon: GraduationCap,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-600",
    features: [
      "Education programs",
      "Storytelling tools",
      "Youth engagement",
      "Cultural preservation",
    ],
    benefits: [
      "Educational resources",
      "Community programs",
      "Youth leadership",
    ],
  },
  {
    id: "ngos",
    name: "NGOs & Research Partners",
    description: "Nonprofits and academic institutions",
    whatTheyGet: "Data access, co-branded pilots, ethical AI tools",
    pricingModel: "Strategic / Sponsored",
    priceRange: "Often $0 or cost-recovery",
    whenWeGetPaid: "Paid via sponsors, grants, or institutional partners",
    icon: Heart,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-600",
    features: [
      "Data access",
      "Research collaboration",
      "Program support",
      "Networking",
    ],
    benefits: [
      "Research grants",
      "Partnership opportunities",
      "Impact tracking",
    ],
  },
];

const COMMUNITY_PROGRAMS = [
  {
    name: "Youth Leadership",
    description: "Empowering young people to become regeneration leaders",
    features: [
      "School curriculum integration",
      "Youth councils",
      "Summer fellowships",
      "University partnerships",
    ],
    participants: "850K+",
  },
  {
    name: "Cultural Preservation",
    description: "Honoring indigenous knowledge and cultural heritage",
    features: [
      "Oral tradition recording",
      "Cultural metaphor integration",
      "Art & visual design",
      "Festival sponsorship",
    ],
    participants: "1,200+ communities",
  },
  {
    name: "Research Network",
    description: "Collaborative research on regenerative practices",
    features: [
      "Open data access",
      "Research grants",
      "Academic partnerships",
      "Publication support",
    ],
    participants: "2,500+ researchers",
  },
];

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("segments");

  const handleSelectSegment = (segmentId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/community/${segmentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-blue-900 to-slate-900 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
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
              Community-Powered Regeneration
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Community Stewardship
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10">
              Join our global network of regenerative producers, communities, researchers, and
              stewards working together to create positive change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Join Our Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="segments" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="segments" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community Segments
              </TabsTrigger>
              <TabsTrigger value="programs" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Programs
              </TabsTrigger>
            </TabsList>

            {/* Community Segments Tab */}
            <TabsContent value="segments">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {COMMUNITY_SEGMENTS.map((segment, index) => (
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
                          {segment.primaryCustomers || segment.description}
                        </p>
                        {segment.priceRange && (
                          <div className="mt-4">
                            <span className={`text-2xl font-bold ${segment.color}`}>
                              {segment.priceRange}
                            </span>
                          </div>
                        )}
                        {segment.pricingMechanism && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {segment.pricingMechanism}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Key Features:</span>
                          </p>
                          <div className="mt-2 space-y-1">
                            {segment.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Benefits:</span>
                          </p>
                          <div className="mt-2 space-y-1">
                            {segment.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-foreground">{benefit}</span>
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

            {/* Programs Tab */}
            <TabsContent value="programs">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {COMMUNITY_PROGRAMS.map((program, index) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className={`relative h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors group`}>
                      <CardHeader className="pb-4">
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          {program.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4 space-y-2">
                          {program.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Participants</span>
                            <span className="font-medium text-foreground">{program.participants}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => navigate("/auth")}
                        >
                          Get Involved
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

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Voices from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from the people making regeneration happen on the ground
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Maria Lopez",
                role: "Coffee Farmer, Colombia",
                quote: "The platform has connected our small cooperative to global buyers who value our regenerative practices. We've seen our income increase by 40% while improving our soil health.",
                impact: "100 hectares reforested",
              },
              {
                name: "James Okoth",
                role: "Youth Leader, Kenya",
                quote: "As a member of the Youth Council, I've learned so much about environmental stewardship and how to advocate for change in my community.",
                impact: "500 students educated",
              },
              {
                name: "Dr. Sarah Chen",
                role: "Researcher, China",
                quote: "The open data platform has revolutionized our climate research. We now have access to real-time impact data from projects around the world.",
                impact: "20 peer-reviewed papers",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm italic text-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.impact}
                    </Badge>
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
            Ready to Join Our Movement?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're a producer, researcher, or community member, there's a place for you
            in our regenerative network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Create Your Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
