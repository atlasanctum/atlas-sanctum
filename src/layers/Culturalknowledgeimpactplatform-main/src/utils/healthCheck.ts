/**
 * Health check utilities for verifying system status
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

/**
 * Check if the backend server is responding
 */
export async function checkBackendHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a/health`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        service: 'Backend Server',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
      };
    }

    return {
      service: 'Backend Server',
      status: 'down',
      responseTime,
      error: `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    return {
      service: 'Backend Server',
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if the Stories API is working
 */
export async function checkStoriesApi(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a/stories`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        service: 'Stories API',
        status: 'healthy',
        responseTime,
      };
    }

    return {
      service: 'Stories API',
      status: 'down',
      responseTime,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      service: 'Stories API',
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if the Discussions API is working
 */
export async function checkDiscussionsApi(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a/discussions`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        service: 'Discussions API',
        status: 'healthy',
        responseTime,
      };
    }

    return {
      service: 'Discussions API',
      status: 'down',
      responseTime,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      service: 'Discussions API',
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Run all health checks
 */
export async function runAllHealthChecks(): Promise<HealthCheckResult[]> {
  const checks = await Promise.allSettled([
    checkBackendHealth(),
    checkStoriesApi(),
    checkDiscussionsApi(),
  ]);

  return checks.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    
    const services = ['Backend Server', 'Stories API', 'Discussions API'];
    return {
      service: services[index],
      status: 'down' as const,
      error: 'Health check failed',
    };
  });
}

/**
 * Get a summary of system health
 */
export function getSystemHealthSummary(results: HealthCheckResult[]): {
  overall: 'healthy' | 'degraded' | 'down';
  healthyCount: number;
  degradedCount: number;
  downCount: number;
} {
  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const degradedCount = results.filter(r => r.status === 'degraded').length;
  const downCount = results.filter(r => r.status === 'down').length;

  let overall: 'healthy' | 'degraded' | 'down' = 'healthy';
  if (downCount > 0) {
    overall = downCount === results.length ? 'down' : 'degraded';
  } else if (degradedCount > 0) {
    overall = 'degraded';
  }

  return {
    overall,
    healthyCount,
    degradedCount,
    downCount,
  };
}
