import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { validateStructuredData, logSEOValidation, measureSEORenderTime } from '@/utils/seoUtils';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  hreflang?: Array<{ lang: string; url: string }>;
  structuredData?: object | object[];
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Atlas Sanctum - Regenerative Platform',
  description = 'Atlas Sanctum is the civilization operating system for regenerative agriculture, climate health, commerce, and ecosystem intelligence.',
  keywords = 'Atlas Sanctum, regenerative platform, climate resilience, regenerative agriculture, carbon credits, ecosystem intelligence, sustainable infrastructure',
  image = '/og-image.jpg',
  url,
  type = 'website',
  siteName = 'Atlas Sanctum',
  twitterCard = 'summary_large_image',
  twitterSite = '@AtlasSanctum',
  twitterCreator = '@AtlasSanctum',
  canonical,
  robots,
  hreflang,
  structuredData,
  noindex = false,
  nofollow = false,
}) => {
  const startTime = performance.now();
  const brandName = 'Atlas Sanctum';

  const fullTitle = title.includes(brandName) ? title : `${title} | ${brandName}`;
  const fullUrl = url ? `${window.location.origin}${url}` : window.location.href;
  const canonicalUrl = canonical || fullUrl;

  const robotsContent = robots || (noindex && nofollow ? 'noindex,nofollow' : noindex ? 'noindex' : nofollow ? 'nofollow' : 'index,follow');

  // Validate structured data
  useEffect(() => {
    if (structuredData) {
      const validationResult = validateStructuredData(structuredData);
      logSEOValidation(title, validationResult);
    }
  }, [structuredData, title]);

  // Measure render time
  useEffect(() => {
    measureSEORenderTime('SEO Component', startTime);
  });

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${window.location.origin}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${window.location.origin}${image}`} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />

      {/* Hreflang for internationalization */}
      {hreflang?.map(({ lang, url: hreflangUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hreflangUrl} />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

      {/* Search Console Verification */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />

      {/* Additional meta tags for SEO */}
      <meta name="author" content="Atlas Sanctum Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en-US" />
    </Helmet>
  );
};

export default SEO;