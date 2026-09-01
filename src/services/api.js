/**
 * Central API Client for KRISHAK Platform
 * Communicates with the Express backend on local development and Vercel serverless
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getApiBaseUrl();

/**
 * Retrieve the active JWT token from sessionStorage or localStorage
 */
export const getAuthToken = () => {
  try {
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken && sessionToken !== 'undefined' && sessionToken !== 'null') {
      return sessionToken;
    }

    const localToken = localStorage.getItem('token');
    if (localToken && localToken !== 'undefined' && localToken !== 'null') {
      return localToken;
    }

    const rawKrishak = sessionStorage.getItem('krishak_auth_user') || localStorage.getItem('krishak_auth_user');
    if (rawKrishak) {
      const parsed = JSON.parse(rawKrishak);
      if (parsed?.token) return parsed.token;
    }

    return null;
  } catch (e) {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    credentials: 'include', // Send and receive secure HTTP-only cookies
    ...options,
    headers,
  };

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
