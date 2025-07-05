import axios from 'axios';

// Use environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Token helper
const getAuthToken = () => localStorage.getItem('token');

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log('=== API Request Interceptor ===');
    const token = getAuthToken();
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }

    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('=== API Response Success ===');
    console.log('Response status:', response.status);
    return response;
  },
  (error) => {
    console.log('=== API Response Error ===');
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.log('401 Unauthorized – Clearing token and redirecting...');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('Making login request to /admin/auth/login');
    const response = await api.post('/admin/auth/login', { email, password });
    console.log('Login response received:', {
      status: response.status,
      hasToken: !!response.data.token,
      userData: response.data.user,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/admin/auth/register', { name, email, password });
    return response.data;
  },

  verify: async () => {
    console.log('Making verify request to /admin/auth/me');
    const response = await api.get('/admin/auth/me');
    console.log('Verify response received:', {
      status: response.status,
      userData: response.data,
    });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/projects/featured');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData: FormData) => {
    const response = await api.post('/admin/projects', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, projectData: FormData) => {
    const response = await api.put(`/admin/projects/${id}`, projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  },
};

// Brands API
export const brandsAPI = {
  // Public
  getAll: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  // Admin
  admin: {
    getAll: async () => {
      const response = await api.get('admin/brands');
      return response.data;
    },

    create: async (formData: FormData) => {
      const response = await api.post('/admin/brands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    delete: async (id: string) => {
      const response = await api.delete(`/admin/brands/${id}`);
      return response.data;
    },
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: { name?: string; email?: string }) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default api;
