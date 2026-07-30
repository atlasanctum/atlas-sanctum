import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const defaultSEO: SEOData = {
  title: 'Atlas Sanctum - Regenerative Platform',
  description: 'Atlas Sanctum is the civilization operating system for regenerative agriculture, climate health, commerce, and ecosystem intelligence.',
  keywords: 'Atlas Sanctum, regenerative platform, climate resilience, regenerative agriculture, carbon credits, ecosystem intelligence, sustainable infrastructure',
  image: '/og-image.jpg',
  type: 'website',
};

const pageSEO: Record<string, SEOData> = {
  '/': {
    title: 'Home',
    description: 'Discover Atlas Genesis - the leading platform for regenerative agriculture, carbon credits, and sustainable farming solutions.',
  },
  '/marketplace': {
    title: 'Marketplace',
    description: 'Explore and invest in regenerative agriculture projects. Browse carbon credit opportunities and sustainable farming initiatives.',
  },
  '/portfolio': {
    title: 'Portfolio',
    description: 'Manage your investments in regenerative agriculture and track the impact of your sustainable farming portfolio.',
  },
  '/measurements': {
    title: 'Measurements',
    description: 'Access real-time environmental measurements and data analytics for regenerative agriculture monitoring.',
  },
  '/help': {
    title: 'Help Center',
    description: 'Get support and find answers to your questions about Atlas Genesis and regenerative agriculture.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with the Atlas Genesis team for support, partnerships, or inquiries about regenerative agriculture.',
  },
};

export const useSEO = (customSEO?: Partial<SEOData>): SEOData => {
  const location = useLocation();

  const seoData = useMemo(() => {
    const currentPageSEO = pageSEO[location.pathname] || {};
    return {
      ...defaultSEO,
      ...currentPageSEO,
      ...customSEO,
      url: location.pathname,
    };
  }, [location.pathname, customSEO]);

  return seoData;
};