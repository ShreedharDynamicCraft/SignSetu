import axios from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - could be used for authentication tokens
api.interceptors.request.use(
  config => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // Handle specific error cases
    if (!response) {
      console.error('Network error! Please check your internet connection.');
      return Promise.reject(new Error('Network error! Please check your internet connection.'));
    }
    
    if (response.status === 401) {
      console.error('Authentication error. Please login again.');
      // Handle auth errors - e.g., redirect to login
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Words API
  getWords: (query = '') => {
    return api.get(`/words${query ? `?search=${query}` : ''}`);
  },
  getWordById: (id) => {
    return api.get(`/words/${id}`);
  },
  createWord: (wordData) => {
    return api.post('/words', wordData);
  },
  updateWord: (id, wordData) => {
    return api.put(`/words/${id}`, wordData);
  },
  deleteWord: (id) => {
    return api.delete(`/words/${id}`);
  },
  
  // Any other API endpoints...
};

export default apiService;
