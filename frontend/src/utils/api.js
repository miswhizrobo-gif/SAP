import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  getAllEmployees: () => API.get('/auth/employees'),
};

export const taskAPI = {
  createTask: (data) => API.post('/tasks/create', data),
  getEmployeeTasks: () => API.get('/tasks/employee-tasks'),
  getAllTasks: () => API.get('/tasks/all-tasks'),
  updateTaskStatus: (taskId, status) => API.put(`/tasks/update-status/${taskId}`, { status }),
  deleteTask: (taskId) => API.delete(`/tasks/delete/${taskId}`),
  getStats: () => API.get('/tasks/stats'),
};

export default API;
