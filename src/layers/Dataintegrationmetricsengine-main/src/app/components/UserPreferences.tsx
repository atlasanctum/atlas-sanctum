import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Palette, 
  Bell, 
  Layout, 
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Save,
  RotateCcw,
  Check,
  Mail
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion } from 'motion/react';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showAnimations: boolean;
  defaultView: string;
  refreshInterval: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sound: boolean;
  };
  dashboard: {
    showWelcome: boolean;
    autoRefresh: boolean;
    defaultTimeRange: string;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

export const UserPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'system',
    compactMode: false,
    showAnimations: true,
    defaultView: 'dashboard',
    refreshInterval: '30',
    notifications: {
      email: true,
      push: false,
      inApp: true,
      sound: true,
    },
    dashboard: {
      showWelcome: true,
      autoRefresh: true,
      defaultTimeRange: '30d',
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
    },
  });

  const [saved, setSaved] = useState(false);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateNestedPreference = <K extends keyof Preferences>(
    parent: K,
    key: string,
    value: any
  ) => {
    setPreferences(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value
      }
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    // Simulate save
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetPreferences = () => {
    setPreferences({
      theme: 'system',
      compactMode: false,
      showAnimations: true,
      defaultView: 'dashboard',
      refreshInterval: '30',
      notifications: {
        email: true,
        push: false,
        inApp: true,
        sound: true,
      },
      dashboard: {
        showWelcome: true,
        autoRefresh: true,
        defaultTimeRange: '30d',
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        largeText: false,
      },
    });
    setSaved(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              User Preferences
            </CardTitle>
            <CardDescription>
              Customize your experience and notification settings
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetPreferences}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={savePreferences}
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <Layout className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Monitor className="h-4 w-4 mr-2" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Theme</Label>
              <RadioGroup 
                value={preferences.theme} 
                onValueChange={(value) => updatePreference('theme', value as any)}
              >
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        "hover:bg-accent",
                        preferences.theme === 'light' 
                          ? "border-primary bg-primary/5" 
                          : "border-muted"
                      )}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        "hover:bg-accent",
                        preferences.theme === 'dark' 
                          ? "border-primary bg-primary/5" 
                          : "border-muted"
                      )}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        "hover:bg-accent",
                        preferences.theme === 'system' 
                          ? "border-primary bg-primary/5" 
                          : "border-muted"
                      )}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Display Options */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Display Options</Label>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="compact" className="cursor-pointer">Compact Mode</Label>
                  <p className="text-xs text-muted-foreground">Reduce padding and spacing</p>
                </div>
                <Switch
                  id="compact"
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => updatePreference('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="animations" className="cursor-pointer">Show Animations</Label>
                  <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                </div>
                <Switch
                  id="animations"
                  checked={preferences.showAnimations}
                  onCheckedChange={(checked) => updatePreference('showAnimations', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Default View */}
            <div className="space-y-3">
              <Label htmlFor="default-view" className="text-base font-semibold">Default View</Label>
              <Select 
                value={preferences.defaultView} 
                onValueChange={(value) => updatePreference('defaultView', value)}
              >
                <SelectTrigger id="default-view">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="innovations">Innovations</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="oceanic">Oceanic</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="circular">Circular Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Notification Channels</Label>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="cursor-pointer">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => updateNestedPreference('notifications', 'email', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="cursor-pointer">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Mobile push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => updateNestedPreference('notifications', 'push', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="cursor-pointer">In-App Notifications</Label>
                    <p className="text-xs text-muted-foreground">Show alerts in the app</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.inApp}
                  onCheckedChange={(checked) => updateNestedPreference('notifications', 'inApp', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">Notification Sound</Label>
                  <p className="text-xs text-muted-foreground">Play sound for alerts</p>
                </div>
                <Switch
                  checked={preferences.notifications.sound}
                  onCheckedChange={(checked) => updateNestedPreference('notifications', 'sound', checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">Show Welcome Message</Label>
                  <p className="text-xs text-muted-foreground">Display greeting on dashboard</p>
                </div>
                <Switch
                  checked={preferences.dashboard.showWelcome}
                  onCheckedChange={(checked) => updateNestedPreference('dashboard', 'showWelcome', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">Auto-Refresh Data</Label>
                  <p className="text-xs text-muted-foreground">Automatically update metrics</p>
                </div>
                <Switch
                  checked={preferences.dashboard.autoRefresh}
                  onCheckedChange={(checked) => updateNestedPreference('dashboard', 'autoRefresh', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-semibold">Refresh Interval</Label>
                <Select 
                  value={preferences.refreshInterval}
                  onValueChange={(value) => updatePreference('refreshInterval', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Every 15 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Default Time Range</Label>
                <Select 
                  value={preferences.dashboard.defaultTimeRange}
                  onValueChange={(value) => updateNestedPreference('dashboard', 'defaultTimeRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Accessibility Options</Label>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">Reduce Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={preferences.accessibility.reduceMotion}
                  onCheckedChange={(checked) => updateNestedPreference('accessibility', 'reduceMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">Increase contrast for better readability</p>
                </div>
                <Switch
                  checked={preferences.accessibility.highContrast}
                  onCheckedChange={(checked) => updateNestedPreference('accessibility', 'highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="cursor-pointer">Large Text</Label>
                  <p className="text-xs text-muted-foreground">Increase font size throughout the app</p>
                </div>
                <Switch
                  checked={preferences.accessibility.largeText}
                  onCheckedChange={(checked) => updateNestedPreference('accessibility', 'largeText', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};