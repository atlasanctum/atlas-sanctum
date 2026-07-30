import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Map,
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Heart,
  Sprout,
  Zap,
  Globe,
  BookOpen,
  HelpCircle,
  Settings,
  User,
  LogIn,
  Home,
  FileText,
  Award,
  Phone,
  CreditCard,
  Database,
} from "lucide-react";

interface CommandItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  category: string;
}

const commandItems: CommandItem[] = [
  // Core Platform
  { name: "Home", href: "/", icon: <Home className="w-4 h-4" />, category: "Navigation" },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, category: "Navigation" },
  { name: "Marketplace", href: "/marketplace", icon: <ShoppingBag className="w-4 h-4" />, category: "Platform" },
  { name: "Portfolio", href: "/portfolio", icon: <Wallet className="w-4 h-4" />, category: "Platform" },
  { name: "Bioregions", href: "/bioregions", icon: <Map className="w-4 h-4" />, category: "Platform" },
  { name: "Measurements", href: "/measurements", icon: <BarChart3 className="w-4 h-4" />, category: "Platform" },
  { name: "Valuation Engine", href: "/valuation", icon: <TrendingUp className="w-4 h-4" />, category: "Platform" },
  { name: "Transactions", href: "/transactions", icon: <Database className="w-4 h-4" />, category: "Platform" },
  
  // Impact
  { name: "Regenerative Agriculture", href: "/regenerative-agriculture", icon: <Sprout className="w-4 h-4" />, category: "Impact" },
  { name: "Renewable Energy", href: "/marketplace", icon: <Zap className="w-4 h-4" />, category: "Impact" },
  { name: "Ecosystem Health", href: "/health", icon: <Heart className="w-4 h-4" />, category: "Impact" },
  { name: "Community Governance", href: "/governance", icon: <Users className="w-4 h-4" />, category: "Impact" },
  { name: "Security & Trust", href: "/security", icon: <Shield className="w-4 h-4" />, category: "Impact" },
  { name: "Global Adoption", href: "/adoption", icon: <Globe className="w-4 h-4" />, category: "Impact" },
  
  // Resources
  { name: "Documentation", href: "/outreach", icon: <FileText className="w-4 h-4" />, category: "Resources" },
  { name: "Education Hub", href: "/outreach", icon: <BookOpen className="w-4 h-4" />, category: "Resources" },
  { name: "Help Center", href: "/help-center", icon: <HelpCircle className="w-4 h-4" />, category: "Resources" },
  { name: "Pricing", href: "/pricing", icon: <CreditCard className="w-4 h-4" />, category: "Resources" },
  { name: "Contact", href: "/contact", icon: <Phone className="w-4 h-4" />, category: "Resources" },
  { name: "Certifications", href: "/marketplace", icon: <Award className="w-4 h-4" />, category: "Resources" },
  
  // Account
  { name: "Settings", href: "/settings", icon: <Settings className="w-4 h-4" />, category: "Account" },
  { name: "Profile", href: "/profile", icon: <User className="w-4 h-4" />, category: "Account" },
  { name: "Sign In", href: "/auth", icon: <LogIn className="w-4 h-4" />, category: "Account" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const groupedItems = commandItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, features, and more..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([category, items], index) => (
          <React.Fragment key={category}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={category}>
              {items.map((item) => (
                <CommandItem
                  key={item.href + item.name}
                  value={item.name}
                  onSelect={() => runCommand(() => navigate(item.href))}
                  className="cursor-pointer"
                >
                  <span className="mr-2 text-muted-foreground">{item.icon}</span>
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  
  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  
  return { open, setOpen, toggle };
}