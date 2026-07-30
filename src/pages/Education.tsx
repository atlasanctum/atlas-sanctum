import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
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

const EDUCATION_SEGMENTS = [
  {
    id: "cultural-institution",
    name: "Cultural Institution Layer",
    primaryCustomers: "Foundations, sponsors, educators",
    whatIsBeingPriced: "Knowledge archives, storytelling, education",
    pricingMechanism: "Grants, sponsorships, endowments",
    priceRange: "Grant-dependent",
    valueJustification: "Builds legitimacy and narrative trust",
    icon: BookOpen,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-amber-600",
    features: [
      "Knowledge archives",
      "Storytelling platforms",
      "Education programs",
      "Cultural preservation",
    ],
    benefits: [
      "Access to cultural heritage",
      "Educational resources",
      "Community engagement",
    ],
  },
];

const EDUCATION_PROGRAMS = [
  {
    name: "School Curriculum",
    description: "Regeneration-focused educational materials for K-12 schools",
    features: [
      "Science & social studies integration",
      "Real project data",
      "Teacher training",
      "Student activities",
    ],
    participants: "450K+ students",
  },
  {
    name: "University Partnerships",
    description: "Research and education collaboration with universities",
    features: [
      "Research opportunities",
      "Dissertation support",
      "Published papers",
      "Student internships",
    ],
    participants: "2,500+ researchers",
  },
  {
    name: "Cultural Knowledge",
    description: "Preserving indigenous knowledge and cultural heritage",
    features: [
      "Oral history recording",
      "Cultural metaphor integration",
      "Traditional art programs",
      "Festival sponsorship",
    ],
    participants: "1,200+ communities",
  },
  {
    name: "Professional Training",
    description: "Skill development for regenerative practitioners",
    features: [
      "Certification programs",
      "Workshops & seminars",
      "Online courses",
      "Mentorship programs",
    ],
    participants: "15,000+ professionals",
  },
  {
    name: "Public Awareness",
    description: "Mass education and awareness campaigns",
    features: [
      "Documentary series",
      "Social media campaigns",
      "Public events",
      "Policy advocacy",
    ],
    participants: "5M+ people",
  },
  {
    name: "Research Repository",
    description: "Open access to regenerative research",
    features: [
      "Research papers",
      "Case studies",
      "Data sets",
      "Methodology guides",
    ],
    participants: "100K+ researchers",
  },
];

const EDUCATIONAL_RESOURCES = [
  {
    name: "Regeneration Toolkit",
    description: "Comprehensive guide to regenerative practices",
    format: "PDF/EPUB",
    duration: "200+ pages",
  },
  {
    name: "Impact Calculator",
    description: "Calculate your environmental impact",
    format: "Web Application",
    duration: "Instant results",
  },
  {
    name: "Video Series",
    description: "Real stories from regeneration projects",
    format: "Video",
    duration: "15 episodes",
  },
  {
    name: "Research Papers",
    description: "Peer-reviewed research on regeneration",
    format: "PDF",
    duration: "100+ papers",
  },
];

export default function Education() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("programs");

  const handleSelectSegment = (segmentId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/education/${segmentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 via-amber-900 to-slate-900 opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Knowledge is Power
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Cultural Institution Layer
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10">
              Explore our comprehensive educational resources, knowledge archives, and
              cultural preservation initiatives that bridge ancient wisdom with modern
              science.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Access Resources
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Sponsor a Program</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="programs" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="programs" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Programs
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="segments" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Segments
              </TabsTrigger>
            </TabsList>

            {/* Programs Tab */}
            <TabsContent value="programs">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {EDUCATION_PROGRAMS.map((program, index) => (
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

            {/* Resources Tab */}
            <TabsContent value="resources">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
                {EDUCATIONAL_RESOURCES.map((resource, index) => (
                  <motion.div
                    key={resource.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className={`relative h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors group`}>
                      <CardHeader className="pb-4">
                        <h3 className="font-semibold text-lg text-foreground mb-2">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Format</span>
                            <span className="font-medium text-foreground">{resource.format}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Duration</span>
                            <span className="font-medium text-foreground">{resource.duration}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => navigate("/auth")}
                        >
                          Download Resource
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Segments Tab */}
            <TabsContent value="segments">
              <div className="grid md:grid-cols-1 gap-6 lg:gap-8 max-w-3xl mx-auto">
                {EDUCATION_SEGMENTS.map((segment, index) => (
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

      {/* Cultural Impact Section */}
      <section className="py-16 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Cultural Preservation & Education
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Honoring indigenous knowledge and cultural heritage while promoting
              regenerative practices through education
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Cultural Metaphors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    "The marketplace speaks in numbers. But human hearts respond to narratives.
                    We weave cultural metaphors that honor indigenous knowledge while supporting
                    regeneration."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="p-2 border rounded bg-slate-50">
                    <p className="font-semibold text-sm">Amazon: "Lungs of Mother Earth"</p>
                    <p className="text-xs text-muted-foreground">Framing forest regeneration as healing Pachamama</p>
                  </div>
                  <div className="p-2 border rounded bg-slate-50">
                    <p className="font-semibold text-sm">Boreal: "Seven Generations Teaching"</p>
                    <p className="text-xs text-muted-foreground">Honoring Haudenosaunee principle of long-term thinking</p>
                  </div>
                  <div className="p-2 border rounded bg-slate-50">
                    <p className="font-semibold text-sm">Coral Triangle: "Sacred Waters"</p>
                    <p className="text-xs text-muted-foreground">Integrating Polynesian ocean stewardship traditions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Educational Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-900">45+</p>
                    <p className="text-xs text-yellow-700">Languages supported</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-900">850K+</p>
                    <p className="text-xs text-yellow-700">Youth engaged</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-900">12K+</p>
                    <p className="text-xs text-yellow-700">Stories shared</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-900">180</p>
                    <p className="text-xs text-yellow-700">Cultural metaphors</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Detailed Impact Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Ready to Learn & Share?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're an educator, researcher, or community member, there's something for
            everyone in our educational programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Explore Resources
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
