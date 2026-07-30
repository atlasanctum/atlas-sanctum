import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Briefcase,
  BarChart3,
  Globe,
  TreePine,
  Settings,
  HelpCircle,
  ChevronDown,
  Leaf,
  Activity,
  Shield,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  MapPin,
  Brain,
  Zap,
  Trophy,
  Link2,
  Coins,
  Sparkles,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Marketplace',
    href: '/marketplace',
    icon: ShoppingCart,
    badge: 'New',
    children: [
      { title: 'All Projects', href: '/marketplace', icon: TreePine },
      { title: 'Reforestation', href: '/marketplace?type=reforestation', icon: TreePine },
      { title: 'Renewable Energy', href: '/marketplace?type=renewable_energy', icon: Activity },
      { title: 'Ocean Restoration', href: '/marketplace?type=ocean_restoration', icon: Globe },
    ],
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    icon: Briefcase,
    children: [
      { title: 'Holdings', href: '/portfolio', icon: Wallet },
      { title: 'Transactions', href: '/transactions', icon: FileText },
      { title: 'Performance', href: '/portfolio?tab=performance', icon: TrendingUp },
    ],
  },
  {
    title: 'Analytics',
    href: '/reports-analytics',
    icon: BarChart3,
    children: [
      { title: 'Reports', href: '/reports-analytics', icon: FileText },
      { title: 'Measurements', href: '/measurements', icon: Activity },
      { title: 'Valuation', href: '/valuation', icon: TrendingUp },
    ],
  },
];

const exploreNavItems: NavItem[] = [
  {
    title: 'AI Insights',
    href: '/ai-insights',
    icon: Brain,
    badge: 'AI',
    children: [
      { title: 'Predictions', href: '/ai-insights', icon: TrendingUp },
      { title: 'Recommendations', href: '/ai-insights?tab=recommendations', icon: Sparkles },
    ],
  },
  {
    title: 'Carbon Market',
    href: '/carbon-marketplace',
    icon: Coins,
    badge: 'DeFi',
    children: [
      { title: 'Marketplace', href: '/carbon-marketplace', icon: ShoppingCart },
      { title: 'Trading', href: '/carbon-marketplace?tab=trading', icon: Zap },
      { title: 'Bonds', href: '/carbon-marketplace?tab=bonds', icon: Coins },
    ],
  },
  {
    title: 'Challenges',
    href: '/impact-challenges',
    icon: Trophy,
    badge: 'New',
    children: [
      { title: 'Achievements', href: '/impact-challenges', icon: Trophy },
      { title: 'Leaderboard', href: '/impact-challenges?tab=leaderboard', icon: TrendingUp },
      { title: 'Team Challenges', href: '/impact-challenges?tab=teams', icon: Users },
      { title: 'Quests', href: '/impact-challenges?tab=quests', icon: MapPin },
    ],
  },
  {
    title: 'Blockchain',
    href: '/blockchain-verification',
    icon: Link2,
    badge: 'Web3',
    children: [
      { title: 'Verified Projects', href: '/blockchain-verification', icon: Shield },
      { title: 'Impact NFTs', href: '/blockchain-verification?tab=nfts', icon: Zap },
      { title: 'DAO Governance', href: '/blockchain-verification?tab=governance', icon: Users },
    ],
  },
  {
    title: 'Bioregions',
    href: '/bioregions',
    icon: Globe,
  },
  {
    title: 'Governance',
    href: '/governance',
    icon: Shield,
  },
  {
    title: 'Health',
    href: '/health',
    icon: Activity,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help Center',
    href: '/help',
    icon: HelpCircle,
  },
];

function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const location = useLocation();
  const { state } = useSidebar();
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = hasChildren && item.children?.some(
    (child) => location.pathname === child.href || location.pathname.startsWith(child.href)
  );

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={isExpanded} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={state === 'collapsed' ? item.title : undefined}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </span>
              <span className="flex items-center gap-2">
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {item.badge}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((child) => (
                <SidebarMenuSubItem key={child.href}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname === child.href}
                  >
                    <Link to={child.href}>
                      <child.icon className="w-3.5 h-3.5" />
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={state === 'collapsed' ? item.title : undefined}
      >
        <Link to={item.href}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-4">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DashboardSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-ocean flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {state === 'expanded' && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-semibold text-sidebar-foreground whitespace-nowrap overflow-hidden"
              >
                Atlas Sanctum
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exploreNavItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
