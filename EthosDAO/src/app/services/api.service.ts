/**
 * Production API Service
 * Centralized API calls with error handling, retry logic, and caching
 */

import { logger } from './logger.service';

export type APIResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

export type RequestConfig = {
  retries?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
};

class APIService {
  private baseURL: string = process.env.API_BASE_URL || 'https://api.example.com';
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private defaultTimeout = 30000;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    return `${url}_${JSON.stringify(options?.body || '')}`;
  }

  private getCachedData<T>(cacheKey: string): T | null {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      logger.debug(`Cache hit: ${cacheKey}`, 'API');
      return cached.data;
    }
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  private setCachedData(cacheKey: string, data: any, ttl: number) {
    this.cache.set(cacheKey, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async retryRequest<T>(
    fn: () => Promise<APIResponse<T>>,
    retries: number,
    delay: number = 1000
  ): Promise<APIResponse<T>> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && this.isRetryableError(error)) {
        logger.warn(`Retrying request, ${retries} attempts remaining`, 'API', { error: error.message });
        await this.sleep(delay);
        return this.retryRequest(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      error.name === 'TypeError' ||
      error.name === 'NetworkError' ||
      (error.status >= 500 && error.status < 600)
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const {
      retries = 3,
      timeout = this.defaultTimeout,
      cache = false,
      cacheTTL = 60000
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);

    // Check cache
    if (cache && options.method === 'GET') {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return { data: cachedData, status: 200 };
      }
    }

    // Deduplication: prevent multiple identical requests
    if (this.pendingRequests.has(cacheKey)) {
      logger.debug(`Deduplicating request: ${cacheKey}`, 'API');
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this.retryRequest(async () => {
      const startTime = performance.now();
      
      try {
        const token = this.getAuthToken();
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        };

        logger.debug(`API Request: ${options.method || 'GET'} ${url}`, 'API');

        const response = await this.fetchWithTimeout(url, { ...options, headers }, timeout);
        const duration = performance.now() - startTime;

        logger.info(`API Response: ${response.status} in ${duration.toFixed(2)}ms`, 'API');

        if (!response.ok) {
          const errorText = await response.text();
          throw {
            status: response.status,
            message: errorText || response.statusText
          };
        }

        const data = await response.json();

        // Cache successful GET requests
        if (cache && options.method === 'GET') {
          this.setCachedData(cacheKey, data, cacheTTL);
        }

        return { data, status: response.status };
      } catch (error: any) {
        const duration = performance.now() - startTime;
        logger.error(`API Error after ${duration.toFixed(2)}ms`, 'API', {
          url,
          method: options.method,
          error: error.message
        });

        return {
          error: error.message || 'Request failed',
          status: error.status || 0
        };
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    }, retries);

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      config
    );
  }

  async put<T>(endpoint: string, data: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      },
      config
    );
  }

  async patch<T>(endpoint: string, data: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      },
      config
    );
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    logger.info('API cache cleared', 'API');
  }

  // Clear specific cache entry
  clearCacheEntry(url: string) {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(url)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Export singleton instance
export const apiService = new APIService();
