import { projectId, publicAnonKey } from '/utils/supabase/info';
import { handleApiError, logError } from './errorHandler';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Request failed with status ${response.status}`;
      logError(`API ${method} ${endpoint}`, errorMessage, { status: response.status });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const handledError = handleApiError(error);
    logError(`API ${method} ${endpoint}`, error, { endpoint, method });
    return {
      success: false,
      error: handledError.message,
    };
  }
}

// ============================================================
// STORIES API
// ============================================================

export interface Story {
  id: string;
  title: string;
  category: string;
  story: string;
  author: string;
  authorImage: string;
  excerpt: string;
  likes: number;
  comments: number;
  createdAt: string;
  status?: string;
}

export const storiesApi = {
  getAll: () => apiRequest<Story[]>('/stories'),
  
  create: (data: {
    title: string;
    category: string;
    story: string;
    author?: string;
  }) => apiRequest<Story>('/stories', 'POST', data),
  
  like: (storyId: string) => apiRequest<Story>(`/stories/${storyId}/like`, 'POST'),
};

// ============================================================
// DISCUSSIONS API
// ============================================================

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  authorImage: string;
  tag: string;
  replies: number;
  likes: number;
  createdAt: string;
  time: string;
}

export const discussionsApi = {
  getAll: () => apiRequest<Discussion[]>('/discussions'),
  
  create: (data: {
    title: string;
    content: string;
    author: string;
    authorImage?: string;
    tag?: string;
  }) => apiRequest<Discussion>('/discussions', 'POST', data),
};

// ============================================================
// RESEARCH API
// ============================================================

export interface Research {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  category: string;
  year: number;
  doi?: string;
  citations: number;
  downloads: number;
  createdAt: string;
}

export const researchApi = {
  getAll: () => apiRequest<Research[]>('/research'),
  
  create: (data: {
    title: string;
    authors: string;
    abstract: string;
    category: string;
    year?: number;
    doi?: string;
  }) => apiRequest<Research>('/research', 'POST', data),
};

// ============================================================
// KNOWLEDGE GRAPH API
// ============================================================

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
}

export interface GraphConnection {
  source: string;
  target: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  connections: GraphConnection[];
  updatedAt?: string;
}

export const graphApi = {
  get: () => apiRequest<GraphData>('/graph-data'),
  
  update: (data: {
    nodes: GraphNode[];
    connections: GraphConnection[];
  }) => apiRequest<GraphData>('/graph-data', 'PUT', data),
};