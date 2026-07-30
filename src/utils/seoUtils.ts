// SEO Utilities for validation and monitoring

export interface StructuredDataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates structured data JSON-LD against basic schema requirements
 */
export const validateStructuredData = (data: unknown): StructuredDataValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data) {
    errors.push('Structured data is empty');
    return { isValid: false, errors, warnings };
  }

  const structuredData = data as Record<string, unknown>;

  if (!structuredData['@context']) {
    errors.push('Missing @context property');
  } else if (structuredData['@context'] !== 'https://schema.org') {
    warnings.push('@context should be https://schema.org');
  }

  if (!structuredData['@type']) {
    errors.push('Missing @type property');
  }

  // Type-specific validations
  switch (structuredData['@type']) {
    case 'Organization':
      if (!structuredData.name) errors.push('Organization requires name property');
      if (!structuredData.url) warnings.push('Organization should have url property');
      break;

    case 'Product':
      if (!structuredData.name) errors.push('Product requires name property');
      if (!structuredData.offers) warnings.push('Product should have offers property');
      break;

    case 'FAQPage':
      if (!structuredData.mainEntity || !Array.isArray(structuredData.mainEntity)) {
        errors.push('FAQPage requires mainEntity array');
      }
      break;

    case 'BreadcrumbList':
      if (!structuredData.itemListElement || !Array.isArray(structuredData.itemListElement)) {
        errors.push('BreadcrumbList requires itemListElement array');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Logs SEO validation results to console in development
 */
export const logSEOValidation = (page: string, result: StructuredDataValidationResult): void => {
  if (import.meta.env.DEV) {
    if (!result.isValid) {
      console.error(`SEO Validation Failed for ${page}:`, result.errors);
    }
    if (result.warnings.length > 0) {
      console.warn(`SEO Warnings for ${page}:`, result.warnings);
    }
    if (result.isValid && result.warnings.length === 0) {
      console.log(`SEO Validation Passed for ${page}`);
    }
  }
};

/**
 * Performance monitoring for SEO components
 */
export const measureSEORenderTime = (componentName: string, startTime: number): void => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (import.meta.env.DEV) {
    console.log(`${componentName} SEO render time: ${duration.toFixed(2)}ms`);
  }

  // Could send to analytics service
  if (duration > 50) { // Threshold for slow renders
    console.warn(`Slow SEO render detected: ${componentName} took ${duration.toFixed(2)}ms`);
  }
};