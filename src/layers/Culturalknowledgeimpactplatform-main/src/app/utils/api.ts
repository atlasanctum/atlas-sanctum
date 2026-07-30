import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f7350c8a`;

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// ===== STORIES API =====

export async function fetchStories() {
  return apiRequest('/stories');
}

export async function submitStory(data: {
  title: string;
  category: string;
  story: string;
  author?: string;
  authorImage?: string;
}) {
  return apiRequest('/stories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function likeStory(storyId: string) {
  return apiRequest(`/stories/${storyId}/like`, {
    method: 'POST',
  });
}

// ===== DISCUSSIONS API =====

export async function fetchDiscussions() {
  return apiRequest('/discussions');
}

export async function createDiscussion(data: {
  title: string;
  content: string;
  author?: string;
  authorImage?: string;
  tag?: string;
}) {
  return apiRequest('/discussions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ===== RESEARCH API =====

export async function fetchResearchNodes() {
  return apiRequest('/research/nodes');
}

// ===== INITIALIZATION =====

export async function initializeData() {
  return apiRequest('/init-data', {
    method: 'POST',
  });
}

// ===== HEALTH CHECK =====

export async function healthCheck() {
  return apiRequest('/health');
}
