import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — token expired while logged in
// Do NOT redirect if already on /login or /register (wrong credentials should stay on the form)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = ['/login', '/register'].some((p) =>
      window.location.pathname.startsWith(p)
    );
    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
