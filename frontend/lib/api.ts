const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const pendingRequests = new Map<string, Promise<any>>();

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const token = typeof window !== 'undefined' ? localStorage.getItem('finquest_token') : null;
  const cacheKey = `${method}:${endpoint}:${token || 'anon'}`;

  if (method === 'GET' && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = (async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error?.message || 'API Request Failed');
      }

      return await res.json();
    } catch (err) {
      console.warn(`[FinQuest API Client] Endpoint ${endpoint} unreachable, using rich client state:`, err);
      throw err;
    } finally {
      if (method === 'GET') {
        pendingRequests.delete(cacheKey);
      }
    }
  })();

  if (method === 'GET') {
    pendingRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
}

