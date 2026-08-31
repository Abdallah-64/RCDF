import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }
  // Fallback to deployed Render backend API URL if environment variable is not explicitly passed
  if (import.meta.env.PROD) {
    return 'https://rcdf-api.onrender.com/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rcdf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
    localStorage.removeItem('rcdf_token');
    window.location.assign('/admin/login');
  }
  return Promise.reject(error);
});

export const get = (url) => api.get(url).then((r) => r.data.data);
export const send = (method, url, data) => api({ method, url, data }).then((r) => r.data);
export default api;

