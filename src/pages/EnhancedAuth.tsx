/**
 * Enhanced Authentication Page
 * 
 * Comprehensive authentication page with demo login access to all dashboards
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Leaf,
  Shield,
  Building2,
  Globe,
  TrendingUp,
  Factory,
  Award,
  Mail,
  Lock,
  User,
  ArrowRight,
  ChevronRight,
  Sparkles,
  LogOut,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { DEMO_USERS } from '@/types/auth';
import { toast } from 'sonner';

type AuthMode = 'demo' | 'login' | 'register';

export default function EnhancedAuth() {
  const navigate = useNavigate();
  const { demoSignIn, signIn, signUp, isDemoMode, currentDemoUser, exitDemoMode, loading } = useEnhancedAuth();
  
  const [authMode, setAuthMode] = useState<AuthMode>('demo');
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerRole, setRegisterRole] = useState<'individual' | 'organization'>('individual');

  const handleDemoLogin = async (demoUserId: string) => {
    setIsSubmitting(true);
    setSelectedDemoUser(demoUserId);
    
    try {
      const result = await demoSignIn(demoUserId);
      
      if (result.error) {
        toast.error(result.error.message);
        setSelectedDemoUser(null);
      } else {
        toast.success('Demo login successful!');
        const demoUser = DEMO_USERS.find(u => u.id === demoUserId);
        if (demoUser) {
          navigate(`/dashboard/${demoUser.dashboardAccess[0]}`);
        }
      }
    } catch (error) {
      toast.error('Demo login failed');
      setSelectedDemoUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signIn({ email: loginEmail, password: loginPassword });
      
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signUp({
        email: registerEmail,
        password: registerPassword,
        fullName: registerFullName,
      });
      
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Account created! Please check your email to verify.');
        setAuthMode('login');
      }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExitDemoMode = async () => {
    await exitDemoMode();
    toast.success('Exited demo mode');
  };

  const getIconForDemoUser = (demoUserId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'demo-donor': <Users className="h-6 w-6" />,
      'demo-field-agent': <Leaf className="h-6 w-6" />,
      'demo-administrator': <Shield className="h-6 w-6" />,
      'demo-community': <Globe className="h-6 w-6" />,
      'demo-enterprise': <Building2 className="h-6 w-6" />,
      'demo-government': <Award className="h-6 w-6" />,
      'demo-defi': <TrendingUp className="h-6 w-6" />,
      'demo-ngo': <Factory className="h-6 w-6" />,
    };
    return iconMap[demoUserId] || <User className="h-6 w-6" />;
  };

  const getColorForDemoUser = (demoUserId: string) => {
    const colorMap: Record<string, string> = {
      'demo-donor': 'from-emerald-500 to-emerald-600',
      'demo-field-agent': 'from-green-500 to-green-600',
      'demo-administrator': 'from-blue-500 to-blue-600',
      'demo-community': 'from-purple-500 to-purple-600',
      'demo-enterprise': 'from-indigo-500 to-indigo-600',
      'demo-government': 'from-amber-500 to-amber-600',
      'demo-defi': 'from-pink-500 to-pink-600',
      'demo-ngo': 'from-cyan-500 to-cyan-600',
    };
    return colorMap[demoUserId] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Demo Mode Banner */}
      {isDemoMode && currentDemoUser && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Demo Mode: {currentDemoUser.displayName}
              </span>
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {currentDemoUser.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitDemoMode}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </motion.div>
      )}

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
                Enhanced Authentication
              </p>
            </div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Access all dashboards with demo login or create your account
          </p>
        </motion.div>

        {/* Auth Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <Button
              variant={authMode === 'demo' ? 'default' : 'ghost'}
              onClick={() => setAuthMode('demo')}
              className="rounded-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Demo Login
            </Button>
            <Button
              variant={authMode === 'login' ? 'default' : 'ghost'}
              onClick={() => setAuthMode('login')}
              className="rounded-md"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button
              variant={authMode === 'register' ? 'default' : 'ghost'}
              onClick={() => setAuthMode('register')}
              className="rounded-md"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Demo Login Mode */}
          {authMode === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEMO_USERS.map((demoUser, index) => (
                  <motion.div
                    key={demoUser.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`h-full border-2 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        selectedDemoUser === demoUser.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => !isSubmitting && handleDemoLogin(demoUser.id)}
                    >
                      <CardHeader className="pb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorForDemoUser(
                            demoUser.id
                          )} flex items-center justify-center mb-4`}
                        >
                          {getIconForDemoUser(demoUser.id)}
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                          {demoUser.displayName}
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          {demoUser.role.replace('_', ' ').toUpperCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{demoUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Lock className="w-4 h-4" />
                            <span>demo123</span>
                          </div>
                        </div>
                        <Button
                          className={`w-full bg-gradient-to-r ${getColorForDemoUser(
                            demoUser.id
                          )} hover:opacity-90 transition-opacity`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && selectedDemoUser === demoUser.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Logging in...
                            </>
                          ) : (
                            <>
                              Access Dashboard
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Demo Mode Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8"
              >
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Demo Mode Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        This is a demo login page for testing and demonstration purposes. 
                        Select any user type above to access their respective dashboard with pre-configured mock data.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DEMO_USERS.map((demoUser) => (
                          <div key={demoUser.id} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {demoUser.displayName}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {demoUser.role.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Note
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            In production, users will be authenticated through the main authentication system 
                            and directed to their appropriate dashboard based on their role and permissions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Login Mode */}
          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => toast.info('Password reset functionality coming soon')}
                    >
                      Forgot password?
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Register Mode */}
          {authMode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>
                    Start your regenerative journey today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-fullname"
                          type="text"
                          placeholder="John Doe"
                          value={registerFullName}
                          onChange={(e) => setRegisterFullName(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-11"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    By creating an account, you agree to our{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => navigate('/privacy-policy')}
                    >
                      Privacy Policy
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => navigate('/terms-of-service')}
                    >
                      Terms of Service
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400"
        >
          <p>
            © 2024 Atlas Genesis. All rights reserved. |{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/about')}
            >
              About
            </button>
            {' '}|{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/privacy-policy')}
            >
              Privacy Policy
            </button>
            {' '}|{' '}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/terms-of-service')}
            >
              Terms of Service
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Helper icons
function LogIn({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

function UserPlus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}
