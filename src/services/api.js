
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://the-stack-guy.onrender.com/api';

export const SOCKET_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : 'https://the-stack-guy.onrender.com';

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

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method;

    // ✅ Show success toast for mutations only
    if (
      ['post', 'put', 'patch', 'delete'].includes(method) &&
      !response.config?.skipToast
    ) {
      const message =
        response?.data?.message || 'Operation successful';
      toast.success(message);
    }

    return response;
  },
  (error) => {
    let message = 'Something went wrong';

    // =========================
    // NETWORK ERROR
    // =========================
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        message = 'Request timeout. Please try again.';
      } else {
        message = 'No internet connection. Please check your network.';
      }
    }
    // =========================
    // SERVER ERROR
    // =========================
    else {
      message =
        error.response?.data?.message ||
        'Server error. Please try again later.';
    }

    // =========================
    // SHOW ERROR TOAST
    // =========================
    if (!error.config?.skipToast) {
      toast.error(message);
    }

    // =========================
    // AUTH ERROR HANDLING
    // =========================
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (
        window.location.pathname.startsWith('/dashboard') ||
        window.location.pathname.startsWith('/admin')
      ) {
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
  createUser: (data) => api.post('/auth/users', data),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  seedAdmin: () => api.post('/auth/seed-admin'),
  getAdmin: () => api.get('/auth/admin'),
};

// Leads
export const leadsAPI = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  update: (id, data) => api.post(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  addFollowUp: (id, data) => api.post(`/leads/${id}/follow-up`, data),
  scheduleMeeting: (id, data) =>
    api.post(`/leads/${id}/schedule-meeting`, data),
};

// Projects
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.patch(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  reorderKanban: (data) => api.patch('/projects/kanban/reorder', data),
  addFile: (projectId, data) =>
    api.post(`/projects/${projectId}/files`, data),
  deleteFile: (projectId, fileId) =>
    api.delete(`/projects/${projectId}/files/${fileId}`),

  addMilestone: (id, data) =>
    api.post(`/projects/${id}/milestones`, data),
  updateMilestone: (id, milestoneId, data) =>
    api.patch(`/projects/${id}/milestones/${milestoneId}`, data),
  deleteMilestone: (id, milestoneId) =>
    api.delete(`/projects/${id}/milestones/${milestoneId}`),
};

// Vault
export const vaultAPI = {
  getProjectFiles: (projectId) =>
    api.get(`/projects/${projectId}`),
  addFile: (projectId, data) =>
    api.post(`/projects/${projectId}/files`, data),
  deleteFile: (projectId, fileId) =>
    api.delete(`/projects/${projectId}/files/${fileId}`),
};

// Invoices
export const invoicesAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.patch(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  addPayment: (id, data) => api.post(`/invoices/${id}/pay`, data),
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
  getSlots: (date) =>
    api.get('/appointments/slots', { params: { date } }),
  book: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  update: (id, data) =>
    api.patch(`/appointments/${id}`, data),
  createManual: (data) =>
    api.post('/appointments/admin', data),
  addNote: (id, note) =>
    api.post(`/appointments/${id}/notes`, { note }),
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
  getByProject: (projectId) =>
    api.get(`/messages/project/${projectId}`),
  getSupportConversations: () =>
    api.get('/messages/admin/support'),
  send: (data) => api.post('/messages', data),
  replyViaEmail: (data) =>
    api.post('/messages/reply-email', data),
  markRead: (userId) =>
    api.patch(`/messages/read/${userId}`),
  getUnreadCount: () =>
    api.get('/messages/unread/count'),
};

// Notifications
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) =>
    api.post(`/notifications/${id}/read`),
  markAllRead: () =>
    api.post('/notifications/all/read'),
};

// Analytics
export const analyticsAPI = {
  getRevenue: (params) =>
    api.get('/analytics/revenue', { params }),
  getActivity: () => api.get('/analytics/activity'),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// AI
export const aiAPI = {
  chat: (messages, model) =>
    api.post('/ai/chat', { messages, model }),
  generateBlog: (data) =>
    api.post('/ai/generate-blog', data),
  analyzeLead: (id) =>
    api.post(`/ai/analyze-lead/${id}`),
  generateRoadmap: (id) =>
    api.post(`/ai/generate-roadmap/${id}`),
};

export const crmAPI = {
  sync: () => api.post('/crm/sync'),
  updateSettings: (data) =>
    api.patch('/crm/settings', data),
};

// Services
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getBySlug: (slug) =>
    api.get(`/services/${slug}`),
};

// Audit
export const auditAPI = {
  getLogs: (params) => api.get('/audit/logs', { params }),
  getSummary: () => api.get('/audit/summary'),
};

// Community
export const communityAPI = {
  getAll: (params) => api.get('/community', { params }),
  create: (data) => api.post('/community', data),
  like: (id) => api.post(`/community/${id}/like`),
  comment: (id, data) =>
    api.post(`/community/${id}/comment`, data),
};

export default api;