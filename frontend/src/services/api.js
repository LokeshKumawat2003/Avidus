import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  updateUserStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
};

// Task APIs
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getUserTasks: () => api.get('/tasks/my-tasks'),
  getAllTasks: () => api.get('/tasks/all-tasks'),
  getTasksByUser: (userId) => api.get(`/tasks/user/${userId}`),
  updateTask: (taskId, data) => api.patch(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

// Activity Log APIs
export const activityLogAPI = {
  getActivityLogs: (params) => api.get('/activity-logs', { params }),
  getUserActivityLogs: (params) => api.get('/activity-logs/user/my-logs', { params }),
};

export default api;
