import axios from 'axios';

const BASE_URL = 'https://alsyahaalarabia.com/wp-json/wp/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to handle API requests
export const fetchFromWP = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, {
      params: {
        _embed: 1, // Include featured images, author info, and categories
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`WP API Error (${endpoint}):`, error);
    throw error;
  }
};
