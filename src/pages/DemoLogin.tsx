/**
 * Demo Login Page
 * 
 * Demo login page that allows users to log in as different user types
 * and access their respective dashboards.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Leaf,
  Shield,
  Building2,
  Globe,
  TrendingUp,
  Factory,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react';

interface UserDashboard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const userDashboards: UserDashboard[] = [
  {
    id: 'donor',
    name: 'Donor Dashboard',
    description: 'Track your donations, impact, and contribution history',
    icon: <Users className="h-6 w-6" />,
    route: '/dashboard/donor',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'field-agent',
    name: 'Field Agent Dashboard',
    description: 'Manage field data collection, project monitoring, and reporting',
    icon: <Leaf className="h-6 w-6" />,
    route: '/dashboard/field-agent',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'administrator',
    name: 'Administrator Dashboard',
    description: 'Platform administration, user management, and system settings',
    icon: <Shield className="h-6 w-6" />,
    route: '/dashboard/administrator',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'community',
    name: 'Community Dashboard',
    description: 'Community engagement, events, and collaboration tools',
    icon: <Globe className="h-6 w-6" />,
    route: '/dashboard/community',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Dashboard',
    description: 'Enterprise features, billing, and advanced analytics',
    icon: <Building2 className="h-6 w-6" />,
    route: '/dashboard/enterprise',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'government',
    name: 'Government Dashboard',
    description: 'Government partnerships, compliance, and reporting',
    icon: <Award className="h-6 w-6" />,
    route: '/dashboard/government',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'defi',
    name: 'DeFi Dashboard',
    description: 'Decentralized finance, token management, and DeFi protocols',
    icon: <TrendingUp className="h-6 w-6" />,
    route: '/dashboard/defi',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'ngo',
    name: 'NGO Dashboard',
    description: 'Non-profit organization management, grant tracking, and impact reporting',
    icon: <Factory className="h-6 w-6" />,
    route: '/dashboard/ngo',
    color: 'from-cyan-500 to-cyan-600',
  },
];

export default function DemoLogin() {
  const navigate = useNavigate();
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  const handleDashboardSelect = (dashboard: UserDashboard) => {
    setSelectedDashboard(dashboard.id);
    // Simulate login by storing the selected dashboard type
    localStorage.setItem('demoDashboardType', dashboard.id);
    // Navigate to the selected dashboard
    navigate(dashboard.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center shadow-glow">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Atlas Genesis
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Demo Login
              </p>
            </div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select a user type to access their respective dashboard
          </p>
        </motion.div>

        {/* Dashboard Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleDashboardSelect(dashboard)}
              className="cursor-pointer"
            >
              <Card className={`h-full border-2 hover:shadow-lg transition-all duration-300 ${selectedDashboard === dashboard.id ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${dashboard.color} flex items-center justify-center mb-4`}>
                    {dashboard.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {dashboard.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {dashboard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className={`w-full bg-gradient-to-r ${dashboard.color} hover:opacity-90 transition-opacity`}
                    onClick={() => handleDashboardSelect(dashboard)}
                  >
                    Access Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Demo Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                This is a demo login page for testing and demonstration purposes. In production, users will be authenticated through the main authentication system and directed to their appropriate dashboard based on their role and permissions.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Donor</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Individual donors and supporters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Field Agent</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Field data collectors and monitors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Administrator</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Platform administrators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Community</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Community managers and coordinators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Enterprise</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise customers and partners</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Government</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Government agencies and officials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">DeFi</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">DeFi users and token holders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">NGO</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Non-profit organizations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400"
        >
          <p>
            © 2024 Atlas Genesis. All rights reserved. |{' '}
            <a href="/about" className="text-primary hover:underline">
              About
            </a>
            {' '}|{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            {' '}|{' '}
            <a href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
