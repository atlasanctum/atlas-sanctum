import DOMPurify from 'dompurify';

// Configure DOMPurify for security
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress'],
};

// Sanitize HTML content
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, purifyConfig);
}

// Sanitize plain text (remove HTML tags and dangerous characters)
export function sanitizeText(text: string): string {
  // First remove HTML tags
  const withoutTags = text.replace(/<[^>]*>/g, '');
  // Remove dangerous characters
  return withoutTags.replace(/[<>]/g, '');
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
    // Remove dangerous characters from URL
    return parsedUrl.toString().replace(/[<>"']/g, '');
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

// Sanitize email address
export function sanitizeEmail(email: string): string {
  // Basic email sanitization - remove dangerous characters
  return email.replace(/[<>"'\s]/g, '').toLowerCase();
}

// Sanitize file name for safe storage
export function sanitizeFileName(fileName: string): string {
  // Remove path separators and dangerous characters
  return fileName
    .replace(/[/\\:*?"<>|]/g, '_')
    .substring(0, 255); // Limit length
}

// Sanitize SQL-like inputs (additional defense)
export function sanitizeSqlInput(input: string): string {
  // Remove common SQL injection patterns
  return input
    .replace(/(\b(union|select|insert|delete|update|drop|create|alter|exec|execute)\b)/gi, '')
    .replace(/(-{2}|\/\*|\*\/)/g, '');
}

// Comprehensive input sanitization for user data
export function sanitizeUserInput(input: string, options: {
  allowHtml?: boolean;
  maxLength?: number;
  preserveNewlines?: boolean;
} = {}): string {
  const { allowHtml = false, maxLength = 10000, preserveNewlines = true } = options;

  let sanitized = input;

  if (allowHtml) {
    sanitized = sanitizeHtml(sanitized);
  } else {
    sanitized = sanitizeText(sanitized);
  }

  // Preserve newlines if requested
  if (preserveNewlines && !allowHtml) {
    sanitized = sanitized.replace(/\n/g, '<br>');
  }

  // Limit length
  if (maxLength > 0) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

// Validate and sanitize form data recursively
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data } as Record<string, unknown>;

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // Special handling for different field types
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('url')) {
        sanitized[key] = sanitizeUrl(value);
      } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('content')) {
        sanitized[key] = sanitizeUserInput(value, { allowHtml: true, maxLength: 5000 });
      } else {
        sanitized[key] = sanitizeUserInput(value, { maxLength: 1000 });
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    }
  }

  return sanitized as T;
}

// XSS protection for dynamic content insertion
export function createSafeHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
}

// Validate file content (basic check for malicious content)
export function validateFileContent(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        resolve(false);
        return;
      }

      // Check for common malicious patterns
      const maliciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i,
        /eval\(/i,
        /Function\(/i,
      ];

      const isMalicious = maliciousPatterns.some(pattern => pattern.test(content));
      resolve(!isMalicious);
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file.slice(0, 1024)); // Only check first 1KB
  });
}