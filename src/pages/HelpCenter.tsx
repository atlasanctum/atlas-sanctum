import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, MessageCircle, FileText, HelpCircle, ChevronRight, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      id: "getting-started",
      question: "How do I get started with Atlas Sanctum?",
      answer: "To get started, create an account and complete the onboarding process. You'll be guided through setting up your profile and exploring the platform features."
    },
    {
      id: "marketplace",
      question: "How does the marketplace work?",
      answer: "The marketplace allows you to trade Regenerative Impact Units (RIUs) and invest in verified carbon credit projects. Browse projects, make purchases, and track your investments in your portfolio."
    },
    {
      id: "measurements",
      question: "What are satellite measurements used for?",
      answer: "Satellite measurements provide independent verification of land regeneration projects. They ensure transparency and accuracy in carbon credit calculations."
    },
    {
      id: "security",
      question: "How secure is my data?",
      answer: "We use enterprise-grade security measures including encryption, multi-factor authentication, and regular security audits to protect your data."
    },
    {
      id: "support",
      question: "How can I contact support?",
      answer: "You can contact support through the contact form, email, or our help desk. Premium users get priority support."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Atlas Sanctum",
      icon: <BookOpen className="w-6 h-6" />,
      link: "/help/getting-started"
    },
    {
      title: "Marketplace Guide",
      description: "How to buy, sell, and trade carbon credits",
      icon: <MessageCircle className="w-6 h-6" />,
      link: "/help/marketplace"
    },
    {
      title: "Technical Documentation",
      description: "API docs, integrations, and developer resources",
      icon: <FileText className="w-6 h-6" />,
      link: "/help/documentation"
    },
    {
      title: "Account & Security",
      description: "Manage your account and security settings",
      icon: <HelpCircle className="w-6 h-6" />,
      link: "/help/security"
    }
  ];

  const seoData = useSEO({
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  });

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-background">
        <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions and get the help you need
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-400">
                        {category.icon}
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={category.link}>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-accent">
                        Learn More
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No results found for "{searchQuery}"</p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you with any questions or issues you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:support@atlas-sanctum.com" className="gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Email Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default HelpCenter;