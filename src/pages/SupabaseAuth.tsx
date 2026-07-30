import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const SupabaseAuth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, resetPassword, updatePassword, user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle redirect from password reset email
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'reset') {
      setMode('reset');
      toast.info('You can now set a new password');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user && mode !== 'reset') {
      navigate("/dashboard");
    }
  }, [user, loading, navigate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const validationResult = loginSchema.safeParse({ email: email.trim(), password });
        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0]?.message || 'Validation failed');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signIn(email.trim(), password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      } else if (mode === 'register') {
        const validationResult = registerSchema.safeParse({ 
          email: email.trim(), 
          password, 
          fullName: fullName.trim(),
          userType: 'individual' 
        });
        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0]?.message || 'Validation failed');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created successfully! You can now sign in.");
          setMode('login');
          setPassword("");
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          toast.error('Please enter your email address');
          setIsSubmitting(false);
          return;
        }

        const { error } = await resetPassword(email.trim());
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password reset email sent! Check your inbox.");
          setMode('login');
        }
      } else if (mode === 'reset') {
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }

        const { error } = await updatePassword(password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password updated successfully!");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'register': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'Set New Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Enter your credentials to access your dashboard';
      case 'register': return 'Start your regenerative journey today';
      case 'forgot': return 'Enter your email to receive a reset link';
      case 'reset': return 'Choose a strong, secure password';
    }
  };

  const getTagline = () => {
    switch (mode) {
      case 'login': return 'Welcome back';
      case 'register': return 'Join the movement';
      case 'forgot': return 'Recover access';
      case 'reset': return 'Almost there';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
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
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold text-foreground">
              Atlas Sanctum
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              {getTagline()}
            </span>
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            {getTitle()}
          </h1>
          <p className="text-muted-foreground mt-2">
            {getSubtitle()}
          </p>
        </div>

        {/* Auth Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
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
                      className="pl-11 bg-background border-border focus:border-primary"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
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
                      className="pl-11 bg-background border-border focus:border-primary"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
              )}

              {(mode === 'login' || mode === 'register' || mode === 'reset') && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-background border-border focus:border-primary"
                      required
                      autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {(mode === 'register' || mode === 'reset') && (
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  )}
                </div>
              )}

              {mode === 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11 bg-background border-border focus:border-primary"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    {mode === 'reset' && 'Update Password'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setPassword("");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setPassword("");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {(mode === 'forgot' || mode === 'reset') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <a href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Back to home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SupabaseAuth;