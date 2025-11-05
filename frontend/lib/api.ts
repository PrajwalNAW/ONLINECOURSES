import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string; referralCode?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: { title: string; description?: string; price?: number }) => api.post('/courses', data),
};

// Purchase APIs
export const purchaseAPI = {
  create: (courseId: string) => api.post('/purchases', { courseId }),
  getMyPurchases: () => api.get('/purchases/my-purchases'),
};

// Referral APIs
export const referralAPI = {
  getDashboard: () => api.get('/referrals/dashboard'),
  validateCode: (code: string) => api.get(`/referrals/validate/${code}`),
};
