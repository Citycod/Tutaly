import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// In-memory token storage (prevents XSS extraction from localStorage)
let memoryToken: string | null = null;

export const setMemoryToken = (token: string | null) => {
  memoryToken = token;
};

export const api = axios.create({
  baseURL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach in-memory token
api.interceptors.request.use((config) => {
  if (memoryToken && config.headers) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

// Response Interceptor: Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the HttpOnly cookie
        const refreshRes = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const newToken = refreshRes.data.accessToken;
        setMemoryToken(newToken);
        
        // Update the failed request with the new token and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (cookie expired or missing) - user is truly logged out
        setMemoryToken(null);
        // Optional: emit an event or redirect to login here
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Keep apiAuth for backwards compatibility, but wire it to use the new api instance
export const apiAuth = {
  withToken: (token?: string) => {
    if (token) setMemoryToken(token);
    return api;
  },
};
