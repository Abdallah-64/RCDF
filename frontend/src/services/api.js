import axios from 'axios';
// In local development, Vite proxies /api to the backend. This avoids browser
// CORS issues when Vite selects a different local port such as 5174.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 10000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('rcdf_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
    localStorage.removeItem('rcdf_token');
    window.location.assign('/admin/login');
  }
  return Promise.reject(error);
});
export const get = (url) => api.get(url).then((r) => r.data.data); export const send = (method, url, data) => api({ method, url, data }).then((r) => r.data); export default api;
