import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmailVerificationStatus from "@/components/profile/EmailVerificationStatus";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, Calendar, CheckCircle, AlertCircle, Bell, Building2, Save } from "lucide-react";
import Header from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";

interface ProfileData {
  full_name: string;
  organization: string;
}

interface PreferencesData {
  email_notifications: boolean;
  transaction_alerts: boolean;
  impact_updates: boolean;
  marketing_emails: boolean;
  newsletter_subscribed: boolean;
  organization_type: string;
}

const Profile = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    organization: '',
  });
  
  const [preferences, setPreferences] = useState<PreferencesData>({
    email_notifications: true,
    transaction_alerts: true,
    impact_updates: true,
    marketing_emails: false,
    newsletter_subscribed: false,
    organization_type: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfileAndPreferences();
    }
  }, [user]);

  const fetchProfileAndPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, organization')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          organization: profileData.organization || '',
        });
      }

      // Fetch preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error fetching preferences:', prefsError);
      }

      if (prefsData) {
        setPreferences({
          email_notifications: prefsData.email_notifications ?? true,
          transaction_alerts: prefsData.transaction_alerts ?? true,
          impact_updates: prefsData.impact_updates ?? true,
          marketing_emails: prefsData.marketing_emails ?? false,
          newsletter_subscribed: prefsData.newsletter_subscribed ?? false,
          organization_type: prefsData.organization_type || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      // Update or insert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          organization: profile.organization,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (profileError) {
        throw profileError;
      }

      // Update or insert preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          transaction_alerts: preferences.transaction_alerts,
          impact_updates: preferences.impact_updates,
          marketing_emails: preferences.marketing_emails,
          newsletter_subscribed: preferences.newsletter_subscribed,
          organization_type: preferences.organization_type,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (prefsError) {
        throw prefsError;
      }

      toast.success('Profile updated successfully!');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="" alt={profile.full_name || user.email || ''} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {(profile.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{profile.full_name || 'User'}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {preferences.organization_type || 'Individual'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{user.email}</span>
                      {user.email_confirmed_at && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                    </div>
                    {profile.organization && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.organization}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {new Date(user.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email Verification Status */}
              <EmailVerificationStatus />
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {message && (
                    <Alert className={`${message.type === 'error' ? 'border-destructive/50 bg-destructive/10' : 'border-primary/50 bg-primary/10'}`}>
                      {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        type="text"
                        value={profile.organization}
                        onChange={(e) => setProfile(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Your company or organization"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type</Label>
                    <Select
                      value={preferences.organization_type}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, organization_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="small_business">Small Business</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="educational">Educational Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important account updates via email</p>
                      </div>
                      <Switch
                        id="email_notifications"
                        checked={preferences.email_notifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email_notifications: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transaction_alerts">Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when credits are purchased or sold</p>
                      </div>
                      <Switch
                        id="transaction_alerts"
                        checked={preferences.transaction_alerts}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, transaction_alerts: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="impact_updates">Impact Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about your environmental impact</p>
                      </div>
                      <Switch
                        id="impact_updates"
                        checked={preferences.impact_updates}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, impact_updates: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newsletter_subscribed">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Subscribe to our monthly newsletter</p>
                      </div>
                      <Switch
                        id="newsletter_subscribed"
                        checked={preferences.newsletter_subscribed}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, newsletter_subscribed: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing_emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                      </div>
                      <Switch
                        id="marketing_emails"
                        checked={preferences.marketing_emails}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing_emails: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Panel */}
              <AchievementsPanel />

              {/* Save Button */}
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving} 
                className="w-full sm:w-auto"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;