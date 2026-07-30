import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  User, Lock, Bell, Shield, LogOut, Save, ArrowLeft,
  RefreshCw, Moon, Sun, Monitor, Eye, EyeOff, AlertCircle, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import {
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
  useEmailPreferences,
  useDeleteAccount,
} from "@/hooks/useUserData";
import { toast } from "sonner";

const Settings = () => {
  const { signOut, loading: authLoading } = useAuth();
  const { data: platformUser, isLoading: userLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const { data: emailPreferences, updatePreferences } = useEmailPreferences();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ displayName: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "appearance">("profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { theme, setTheme } = useTheme();

  const loading = authLoading || userLoading;

  useEffect(() => {
    if (!loading && !platformUser) navigate("/auth");
  }, [platformUser, loading, navigate]);

  useEffect(() => {
    if (platformUser) {
      setFormData({
        displayName: platformUser.displayName || "",
        email: platformUser.email || "",
      });
    }
  }, [platformUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!formData.displayName.trim()) {
      setMessage({ type: "error", text: "Display name is required" });
      setIsLoading(false);
      return;
    }
    if (formData.displayName.length > 50) {
      setMessage({ type: "error", text: "Display name must be less than 50 characters" });
      setIsLoading(false);
      return;
    }

    try {
      await updateProfile.mutateAsync({ displayName: formData.displayName.trim() });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmailPreferences = async () => {
    if (!emailPreferences) return;
    await updatePreferences.mutateAsync(emailPreferences);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!passwordData.currentPassword) { setMessage({ type: "error", text: "Current password is required" }); return; }
    if (!passwordData.newPassword) { setMessage({ type: "error", text: "New password is required" }); return; }
    if (passwordData.newPassword.length < 8) { setMessage({ type: "error", text: "Password must be at least 8 characters long" }); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { setMessage({ type: "error", text: "New passwords do not match" }); return; }
    if (passwordData.currentPassword === passwordData.newPassword) { setMessage({ type: "error", text: "New password must be different from current password" }); return; }

    setIsChangingPassword(true);
    try {
      await changePassword.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to change password" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleEmailPreference = (key: "marketing" | "transactional" | "notifications") => {
    if (!emailPreferences) return;
    updatePreferences.mutate({ ...emailPreferences, [key]: !emailPreferences[key] });
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && activeTab === "profile" && (
                  <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                    {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter your display name"
                    className="border-border/50"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isLoading || updateProfile.isPending} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading || updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Email Preferences</CardTitle>
                    <CardDescription>Manage how you receive email notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Transactional Emails</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Important account and transaction notifications</p>
                  </div>
                  <Switch
                    checked={emailPreferences?.transactional ?? true}
                    onCheckedChange={() => toggleEmailPreference("transactional")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">New projects, features, and special offers</p>
                  </div>
                  <Switch
                    checked={emailPreferences?.marketing ?? true}
                    onCheckedChange={() => toggleEmailPreference("marketing")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">General Notifications</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Updates about projects and platform activity</p>
                  </div>
                  <Switch
                    checked={emailPreferences?.notifications ?? true}
                    onCheckedChange={() => toggleEmailPreference("notifications")}
                  />
                </div>

                <Button
                  onClick={handleSaveEmailPreferences}
                  disabled={updatePreferences.isPending}
                  className="w-full mt-4"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updatePreferences.isPending ? "Saving..." : "Save Email Preferences"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how Atlas Sanctum looks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-4 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", Icon: Sun },
                      { id: "dark", label: "Dark", Icon: Moon },
                      { id: "system", label: "System", Icon: Monitor },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          theme === id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your theme preference is automatically saved and will persist across sessions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Change Password */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {message && activeTab === "security" && (
                  <Alert className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                    {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
                    const labels: Record<string, string> = {
                      currentPassword: "Current Password",
                      newPassword: "New Password",
                      confirmPassword: "Confirm New Password",
                    };
                    const showKey = field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm";
                    return (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field}>{labels[field]}</Label>
                        <div className="relative">
                          <Input
                            id={field}
                            name={field}
                            type={showPasswords[showKey] ? "text" : "password"}
                            value={passwordData[field]}
                            onChange={handlePasswordChange}
                            placeholder={`Enter ${labels[field].toLowerCase()}`}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                [showKey]: !prev[showKey],
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswords[showKey] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <Button type="submit" disabled={isChangingPassword || changePassword.isPending} className="w-full">
                    {(isChangingPassword || changePassword.isPending) && (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Security Status */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Current security status of your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Email Verification</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {platformUser?.emailVerified ? "Your email is verified" : "Please verify your email"}
                    </p>
                  </div>
                  {platformUser?.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {platformUser?.mfaEnabled ? "Enabled" : "Not configured"}
                    </p>
                  </div>
                  {platformUser?.mfaEnabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => navigate("/mfa-setup")}>Enable</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10"
                  disabled={deleteAccount.isPending}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This is irreversible.")) {
                      deleteAccount.mutate();
                    }
                  }}
                >
                  {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Settings;
