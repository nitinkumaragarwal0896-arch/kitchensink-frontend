import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('[API] No refresh token available, redirecting to login');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        console.log('[API] Access token expired, attempting refresh...');
        const response = await axios.post(`${API_BASE}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        console.log('[API] Token refreshed successfully');
        
        // 🔧 FIX: Trigger user info refresh by dispatching custom event
        window.dispatchEvent(new CustomEvent('tokenRefreshed'));
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError.response?.status, refreshError.response?.data);
        console.log('[API] Clearing tokens and redirecting to login');
        localStorage.clear();
        
        // Dispatch logout event to clear AuthContext
        window.dispatchEvent(new CustomEvent('forceLogout'));
        
        // Force redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  validateResetToken: (token) => api.post('/auth/validate-reset-token', { token }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

// Profile APIs
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.post('/profile/change-password', data),
};

// Member APIs
export const memberAPI = {
  getAll: ({ page = 0, size = 10, sort = 'name,asc', search } = {}) => {
    let url = `/members?page=${page}&size=${size}&sort=${sort}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return api.get(url);
  },
  getById: (id) => api.get(`/members/${id}`),
  create: (member) => api.post('/members', member),
  update: (id, member) => api.put(`/members/${id}`, member),
  delete: (id) => api.delete(`/members/${id}`),
};

// Admin User APIs
export const userAPI = {
  getAll: (page = 0, size = 20) => api.get(`/admin/users?page=${page}&size=${size}`),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  assignRoles: (id, roles) => api.post(`/admin/users/${id}/roles`, { roles }),
  removeRoles: (id, roles) => api.delete(`/admin/users/${id}/roles`, { data: { roles } }),
  enable: (id) => api.post(`/admin/users/${id}/enable`),
  disable: (id) => api.post(`/admin/users/${id}/disable`),
  unlock: (id) => api.post(`/admin/users/${id}/unlock`),
};

// Admin Role APIs
export const roleAPI = {
  getAll: () => api.get('/admin/roles'),
  getById: (id) => api.get(`/admin/roles/${id}`),
  create: (role) => api.post('/admin/roles', role),
  update: (id, role) => api.put(`/admin/roles/${id}`, role),
  delete: (id) => api.delete(`/admin/roles/${id}`),
  getPermissions: () => api.get('/admin/roles/permissions'),
};

// Session APIs
export const sessionAPI = {
  getAll: (currentRefreshToken) => {
    const params = currentRefreshToken ? `?currentRefreshToken=${encodeURIComponent(currentRefreshToken)}` : '';
    return api.get(`/sessions${params}`);
  },
  revoke: (sessionId, currentRefreshToken) => {
    const params = currentRefreshToken ? `?currentRefreshToken=${encodeURIComponent(currentRefreshToken)}` : '';
    return api.delete(`/sessions/${sessionId}${params}`);
  },
  logoutAll: () => api.post('/auth/logout-all'),
};

export default api;
