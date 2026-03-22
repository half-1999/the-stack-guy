import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: (params) => api.get('/auth/users', { params }),
  seedAdmin: () => api.post('/auth/seed-admin'),
  getAdmin: () => api.get('/auth/admin'),
};

// Leads
export const leadsAPI = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  addFollowUp: (id, data) => api.post(`/leads/${id}/follow-up`, data),
};

// Projects
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  reorderKanban: (data) => api.patch('/projects/kanban/reorder', data),
};

// Invoices
export const invoicesAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.patch(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

// Proposals
export const proposalsAPI = {
  getAll: (params) => api.get('/proposals', { params }),
  getOne: (id) => api.get(`/proposals/${id}`),
  create: (data) => api.post('/proposals', data),
  aiGenerate: (data) => api.post('/proposals/ai-generate', data),
  update: (id, data) => api.patch(`/proposals/${id}`, data),
  delete: (id) => api.delete(`/proposals/${id}`),
};

// Appointments
export const appointmentsAPI = {
  getSlots: (date) => api.get('/appointments/slots', { params: { date } }),
  book: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  update: (id, data) => api.patch(`/appointments/${id}`, data),
};

// Blog
export const blogAPI = {
  getPublished: (params) => api.get('/blog', { params }),
  getBySlug: (slug) => api.get(`/blog/slug/${slug}`),
  getAll: () => api.get('/blog/admin/all'),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.patch(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`),
};

// Portfolio
export const portfolioAPI = {
  getAll: (params) => api.get('/portfolio', { params }),
  getBySlug: (slug) => api.get(`/portfolio/${slug}`),
  getById: (id) => api.get(`/portfolio/admin/${id}`),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.patch(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

// Testimonials
export const testimonialsAPI = {
  getApproved: (params) => api.get('/testimonials', { params }),
  create: (data) => api.post('/testimonials', data),
  getAll: () => api.get('/testimonials/admin/all'),
  update: (id, data) => api.patch(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Messages
export const messagesAPI = {
  getByUser: (userId) => api.get(`/messages/user/${userId}`),
  send: (data) => api.post('/messages', data),

  markReadUser: (userId) => api.patch(`/messages/read/user/${userId}`),
  getUnreadPerUser: () => api.get('/messages/unread/users'),

  getByProject: (projectId) => api.get(`/messages/project/${projectId}`),

  getUnreadCount: () => api.get('/messages/unread/count'),
};

// Notifications
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// Analytics
export const analyticsAPI = {
  getRevenue: (params) => api.get('/analytics/revenue', { params }),
  getActivity: () => api.get('/analytics/activity'),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Services
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getBySlug: (slug) => api.get(`/services/${slug}`),
};

// Audit
export const auditAPI = {
  audit: (url) => api.post('/audit', { url }),
};

export default api;
