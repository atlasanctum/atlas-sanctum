import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, Mail, Lock, User, ArrowRight, Sparkles, 
  Users, Shield, Building2, Globe, TrendingUp, Factory, Award,
  ChevronRight, LogIn, UserPlus, CheckCircle2, Info, AlertCircle, BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { DEMO_USERS, DASHBOARD_ROUTES } from "@/types/auth";
import { toast } from "sonner";
import { loginSchema, registerSchema } from "@/lib/validation";
import { securityManager } from "@/lib/security";
import { analytics } from "@/lib/analytics";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

type AuthMode = 'demo' | 'login' | 'register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('demo');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);
  
  const { signIn, signUp, demoSignIn, user, loading } = useAuth();
  const { demoSignIn: enhancedDemoSignIn, isDemoMode, currentDemoUser, exitDemoMode } = useEnhancedAuth();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize performance optimizations
  usePerformanceOptimization();
  
  // Track page view
  useEffect(() => {
    analytics.trackPageView('auth');
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (accessToken && refreshToken) {
      const tokens = { accessToken, refreshToken, expiresIn: 15 * 60 };
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userData = {
        id: tokenPayload.userId,
        email: tokenPayload.email,
        displayName: tokenPayload.email.split('@')[0],
        role: tokenPayload.role,
        tenantId: tokenPayload.tenantId,
        emailVerified: true,
        mfaEnabled: false
      };

      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      toast.success("Welcome! Account created successfully.");
      navigate("/dashboard");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!loading && user) {
      const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      if (savedUser.onboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/segment-selection");
      }
    }
  }, [user, loading, navigate]);

  // Demo mode handlers
  const handleDemoLogin = async (demoUserId: string) => {
    setIsSubmitting(true);
    setSelectedDemoUser(demoUserId);
    
    try {
      const result = await enhancedDemoSignIn(demoUserId);
      
      if (result.error) {
        toast.error(result.error.message);
        setSelectedDemoUser(null);
      } else {
        toast.success('Demo login successful!');
        const demoUser = DEMO_USERS.find(u => u.id === demoUserId);
        if (demoUser && demoUser.dashboardAccess.length > 0) {
          const primaryDashboard = demoUser.dashboardAccess[0];
          const route = DASHBOARD_ROUTES[primaryDashboard] || '/dashboard';
          navigate(route);
        }
      }
    } catch (error) {
      toast.error('Demo login failed');
      setSelectedDemoUser(null);
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

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    if (!securityManager.rateLimiter.check('oauth_attempt', 5, 300000)) {
      toast.error('Too many OAuth attempts. Please wait 5 minutes.');
      return;
    }
    
    analytics.trackEvent('oauth_attempt', { provider });
    setIsOAuthLoading(true);
    
    const apiBase = import.meta.env.PROD
      ? 'https://api.atlas-genesis.com'
      : 'http://localhost:4000';

    window.location.href = `${apiBase}/api/v2/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedData = {
      email: email.trim(),
      password,
      ...(isLogin ? {} : { fullName: fullName.trim() })
    };

    const validationResult = isLogin
      ? loginSchema.safeParse(sanitizedData)
      : registerSchema.safeParse({ ...sanitizedData, userType: 'individual' });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Validation failed';
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(sanitizedData.email, sanitizedData.password);
        if (error) {
          if (error.message.includes("Invalid email or password")) {
            toast.error("Invalid email or password. Please try again.");
          } else if (error.message.includes("Too many failed")) {
            toast.error("Too many failed attempts. Please try again later.");
          } else if (error.message.includes("account is temporarily locked")) {
            toast.error("Account temporarily locked. Please try again later.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(sanitizedData.email, sanitizedData.password, sanitizedData.fullName, 'individual');
        if (error) {
          if (error.message.includes("Email already registered")) {
            toast.error("An account with this email already exists. Please sign in instead.");
          } else if (error.message.includes("Invalid email format")) {
            toast.error("Please enter a valid email address.");
          } else if (error.message.includes("Password must be at least")) {
            toast.error("Password must be at least 8 characters long.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! Please check your email to verify your account before signing in.");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-regenerative flex items-center justify-center relative overflow-hidden">
      {/* Demo Mode Banner */}
      {isDemoMode && currentDemoUser && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Demo Mode: {currentDemoUser.displayName}
              </span>
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {currentDemoUser.role.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitDemoMode}
              className="text-white hover:bg-white/20"
            >
              Exit Demo
            </Button>
          </div>
        </motion.div>
      )}

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-ocean/20 blur-3xl animate-float-delayed"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl mx-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center shadow-glow">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Atlas Sanctum
              </h1>
              <p className="text-muted-foreground">
                {authMode === 'demo' ? 'Enhanced Authentication' : (isLogin ? 'Welcome back' : 'Create your account')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Auth Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/intelligence-architecture')}
            className="mr-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            Open Intelligence Architecture
          </Button>
          <div className="inline-flex bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg p-1 shadow-lg">
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
              onClick={() => { setAuthMode('login'); setIsLogin(true); }}
              className="rounded-md"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button
              variant={authMode === 'register' ? 'default' : 'ghost'}
              onClick={() => { setAuthMode('register'); setIsLogin(false); }}
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
                          <div className="text-white">
                            {getIconForDemoUser(demoUser.id)}
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-foreground">
                          {demoUser.displayName}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {demoUser.role.replace('_', ' ').toUpperCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{demoUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span>demo123</span>
                          </div>
                        </div>
                        <Button
                          className={`w-full bg-gradient-to-r ${getColorForDemoUser(
                            demoUser.id
                          )} hover:opacity-90 transition-opacity border-none`}
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
                      <p className="text-sm text-muted-foreground">
                        This is a demo login page for testing and demonstration purposes. 
                        Select any user type above to access their respective dashboard with pre-configured mock data.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DEMO_USERS.map((demoUser) => (
                          <div key={demoUser.id} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground">
                                {demoUser.displayName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {demoUser.role.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">
                            Note
                          </p>
                          <p className="text-sm text-muted-foreground">
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

          {/* Login/Sign Up Form */}
          {(authMode === 'login' || authMode === 'register') && (
            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-md mx-auto"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm mb-4"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    {isLogin ? "Welcome back" : "Join the movement"}
                  </span>
                </motion.div>

                <h1 className="font-display text-3xl font-bold text-foreground">
                  {isLogin ? "Sign In" : "Create Account"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {isLogin 
                    ? "Enter your credentials to access your dashboard" 
                    : "Start your regenerative journey today"}
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  {[
                    "Secure by design (MFA-ready)",
                    "Verified impact reporting",
                    "No credit card required",
                  ].map((item) => (
                    <div key={item} className="px-3 py-2 rounded-lg bg-card/60 border border-border/50">
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* OAuth Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-elevated mb-4 glass-panel"
              >
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isOAuthLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleOAuthLogin('github')}
                    disabled={isOAuthLoading}
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </motion.div>

              {/* Auth Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-elevated glass-panel"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-11 bg-input border-border focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 bg-input border-border focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 bg-input border-border focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-ocean hover:from-primary/90 hover:to-ocean/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isLogin ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Toggle between login/register */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => { setIsLogin(false); setAuthMode('register'); }}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => { setIsLogin(true); setAuthMode('login'); }}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
