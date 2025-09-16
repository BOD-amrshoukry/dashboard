import axios from 'axios';
import { getCookie } from '../shared/utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:1337/api', // change this to your API endpoint
  withCredentials: true, // if you need cookies
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// api.interceptors.request.use(() => {
//   return Promise.reject(new Error('💥 Forced request error for testing'));
// });

// Optional: request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: attach token if stored
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle 401 globally
    if (error.response?.status === 401) {
      console.error('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  },
);

export default api;

