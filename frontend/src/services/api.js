import axios from 'axios';

// Base URL for backend API
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin API calls
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

// Agent API calls
export const addAgent = async (agentData) => {
  const response = await api.post('/agents/add', agentData);
  return response.data;
};

export const getAllAgents = async () => {
  const response = await api.get('/agents/all');
  return response.data;
};

// Task API calls
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/tasks/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getTasksByAgent = async () => {
  const response = await api.get('/tasks/by-agent');
  return response.data;
};

export default api;
