import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  customItems?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, customItems }) => {
  const location = useLocation();

  // Generate breadcrumbs based on current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": crumb.href ? `${window.location.origin}${crumb.href}` : undefined
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home className="w-4 h-4" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium flex items-center gap-1">
                {index === 0 && <Home className="w-4 h-4" />}
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;