import axios from 'axios';

const BASE_URL = 'https://alsyahaalarabia.com/wp-json/wp/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased to 60s for very slow networks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Tablet) AlsyahaApp/1.0',
    'Cache-Control': 'no-cache',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  // We'll import store dynamically or use a more robust way later
  // For now, these are the headers for WP Auth
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = async (username: string, password: string) => {
  try {
    // Standard WordPress JWT Auth endpoint
    // If the plugin is not installed, this will fail gracefully
    const response = await api.post('/jwt-auth/v1/token', {
      username,
      password,
    }, {
      baseURL: 'https://alsyahaalarabia.com/wp-json' // JWT usually sits at root wp-json
    });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    // Mock for development if needed
    if (username === 'demo' && password === 'demo123') {
      return {
        token: 'mock-token-123',
        user_email: 'demo@example.com',
        user_nicename: 'Demo User',
        user_display_name: 'Demo User',
      };
    }
    throw error;
  }
};

// Helper to handle API requests
export const fetchFromWP = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, {
      params: {
        _embed: 1, // Include featured images, author info, and categories
        orderby: 'date',
        order: 'desc',
        ...params,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`WP Error (${endpoint}) - Status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error(`WP Error (${endpoint}) - No response received from server`);
    } else {
      console.error(`WP Error (${endpoint}) - Message:`, error.message);
    }
    throw error;
  }
};
