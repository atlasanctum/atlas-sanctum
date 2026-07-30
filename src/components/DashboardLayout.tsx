import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RealtimeToastProvider } from '@/components/RealtimeToast';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              {index === 0 && <Home className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center gap-1">
              {index === 0 && <Home className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function DashboardHeader({ 
  title, 
  description, 
  breadcrumbs 
}: { 
  title?: string; 
  description?: string; 
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="hidden sm:block">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationCenter />
        </div>
      </div>
      
      {(title || description) && (
        <div className="px-4 lg:px-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {title && (
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </motion.div>
        </div>
      )}
    </header>
  );
}

export function DashboardLayout({ 
  children, 
  title, 
  description,
  breadcrumbs: customBreadcrumbs,
}: DashboardLayoutProps) {
  const location = useLocation();
  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs(location.pathname);

  return (
    <RealtimeToastProvider>
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <DashboardHeader 
              title={title} 
              description={description} 
              breadcrumbs={breadcrumbs}
            />
            <main className="flex-1 p-4 lg:p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {children}
              </motion.div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </RealtimeToastProvider>
  );
}
