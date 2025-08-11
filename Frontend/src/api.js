import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cloud-storage-production-9975.up.railway.app/', // ✅ match your backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
