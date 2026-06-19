import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Configurable via environment variables (e.g. for Render backend)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token has expired or is invalid, remove it and redirect/force logout
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Clearing local session...');
      localStorage.removeItem('token');
      // We can trigger a window reload or handle it in context
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
