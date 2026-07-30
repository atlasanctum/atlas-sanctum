/**
 * Dashboard Switcher Component
 * 
 * Allows users to switch between available dashboards
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ChevronDown,
  Check,
  Users,
  Leaf,
  Shield,
  Building2,
  Globe,
  TrendingUp,
  Factory,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { DASHBOARD_CONFIGS } from '@/types/auth';
import { getRoleDisplayName } from '@/utils/authGuards';

export const DashboardSwitcher: React.FC = () => {
  const { user, currentDashboard, availableDashboards, switchDashboard, isDemoMode } = useEnhancedAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getIconForDashboard = (dashboardId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      donor: <Users className="w-4 h-4" />,
      'field-agent': <Leaf className="w-4 h-4" />,
      administrator: <Shield className="w-4 h-4" />,
      community: <Globe className="w-4 h-4" />,
      enterprise: <Building2 className="w-4 h-4" />,
      government: <Award className="w-4 h-4" />,
      defi: <TrendingUp className="w-4 h-4" />,
      ngo: <Factory className="w-4 h-4" />,
      main: <LayoutDashboard className="w-4 h-4" />,
    };
    return iconMap[dashboardId] || <LayoutDashboard className="w-4 h-4" />;
  };

  const getCurrentDashboardConfig = () => {
    return DASHBOARD_CONFIGS.find(d => d.id === currentDashboard);
  };

  const currentDashboardConfig = getCurrentDashboardConfig();

  if (!user && !isDemoMode) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentDashboardConfig && getIconForDashboard(currentDashboardConfig.id)}
          <span className="max-w-[150px] truncate">
            {currentDashboardConfig?.name || 'Dashboard'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || 'Demo User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user ? getRoleDisplayName(user.role) : 'Demo Mode'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {availableDashboards.map((dashboard) => (
            <DropdownMenuItem
              key={dashboard.id}
              onClick={() => {
                switchDashboard(dashboard.id);
                setIsOpen(false);
              }}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1">
                {getIconForDashboard(dashboard.id)}
                <span className="flex-1">{dashboard.name}</span>
                {currentDashboard === dashboard.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        {isDemoMode && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1">
              <Badge variant="secondary" className="w-full justify-center">
                Demo Mode Active
              </Badge>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardSwitcher;
