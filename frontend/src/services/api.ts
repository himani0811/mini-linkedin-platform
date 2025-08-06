import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, bio?: string) =>
    api.post('/auth/register', { name, email, password, bio }),
  
  getProfile: () => api.get('/auth/profile'),
};

export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  createPost: (content: string) => api.post('/posts', { content }),
  getUserPosts: (userId: number) => api.get(`/posts/user/${userId}`),
};

export const usersAPI = {
  getUser: (userId: number) => api.get(`/users/${userId}`),
};

export default api;
