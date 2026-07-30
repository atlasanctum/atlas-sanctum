import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Contact = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.' });
      setFormData(prev => ({ ...prev, subject: '', category: '', message: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "support@atlas-sanctum.com",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      value: "+254759895739",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Address",
      value: "123 Sustainability St, Eco City, EC 12345",
      description: "Visit our headquarters"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Response Time",
      value: "Within 24 hours",
      description: "For urgent issues, call us"
    }
  ];

  return (
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our support team. We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {message && (
                    <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full gap-2">
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Get in touch</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        <p className="text-foreground font-medium">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Premium Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Enterprise customers get priority support with dedicated account managers and faster response times.
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn About Premium Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;