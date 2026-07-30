// Enhanced Security Layer
export const securityManager = {
  // Content Security Policy
  enforceCSP: () => {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.atlas-genesis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  },

  // Rate limiting for API calls
  rateLimiter: (() => {
    const requests = new Map<string, number[]>();
    
    return {
      check: (key: string, limit: number = 100, window: number = 60000): boolean => {
        const now = Date.now();
        const windowStart = now - window;
        
        if (!requests.has(key)) {
          requests.set(key, []);
        }
        
        const keyRequests = requests.get(key)!;
        const validRequests = keyRequests.filter(time => time > windowStart);
        
        if (validRequests.length >= limit) {
          return false;
        }
        
        validRequests.push(now);
        requests.set(key, validRequests);
        return true;
      }
    };
  })(),

  // Input sanitization
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Token validation
  validateToken: (token: string): boolean => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp > now;
    } catch {
      return false;
    }
  }
};