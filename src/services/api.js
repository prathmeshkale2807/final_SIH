/**
 * Central API Client for KRISHAK Platform
 * Communicates with the Express backend using VITE_API_URL or localhost fallback
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Retrieve the active JWT token from localStorage
 * Supports direct 'token' key and structured auth user objects
 */
export const getAuthToken = () => {
  try {
    const directToken = localStorage.getItem('token');
    if (directToken && directToken !== 'undefined' && directToken !== 'null') {
      return directToken;
    }

    const rawKrishak = localStorage.getItem('krishak_auth_user');
    if (rawKrishak) {
      const parsed = JSON.parse(rawKrishak);
      if (parsed?.token) return parsed.token;
    }

    const rawDhanya = localStorage.getItem('dhanya_auth_user');
    if (rawDhanya) {
      const parsed = JSON.parse(rawDhanya);
      if (parsed?.token) return parsed.token;
    }

    return null;
  } catch (e) {
    console.warn('[getAuthToken] Error retrieving token from storage:', e);
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
