import axios from "axios";
import { useAppStore } from "../store/useAppStore";

const BASE_URL = "https://alsyahaalarabia.com/wp-json/wp/v2";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased to 60s for very slow networks
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const loginUser = async (username: string, password: string) => {
  try {
    // Standard WordPress JWT Auth endpoint
    // If the plugin is not installed, this will fail gracefully
    const response = await api.post(
      "/jwt-auth/v1/token",
      {
        username,
        password,
      },
      {
        baseURL: "https://alsyahaalarabia.com/wp-json", // JWT usually sits at root wp-json
      },
    );
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    // Mock for development if needed
    if (username === "demo" && password === "demo123") {
      return {
        token: "mock-token-123",
        user_email: "demo@example.com",
        user_nicename: "Demo User",
        user_display_name: "Demo User",
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
        ...params,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(
        `WP Error (${endpoint}) - Status: ${error.response.status}`,
        error.response.data,
      );
    } else if (error.request) {
      console.error(
        `WP Error (${endpoint}) - No response received from server`,
      );
    } else {
      console.error(`WP Error (${endpoint}) - Message:`, error.message);
    }
    throw error;
  }
};

// --- Post/Editor Services ---

// Fetch post with editor context (includes .raw field for blocks)
export const fetchPostForEdit = async (id: string) => {
  return await fetchFromWP(`/posts/${id}`, { context: "edit" });
};

// Update post with new content
export const updatePost = async (id: string, data: any) => {
  try {
    const response = await api.post(`/posts/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Update Post Error (${id}):`, error.response?.data || error.message);
    throw error;
  }
};

// --- User/Author Services ---

// Get current logged-in user details
export const getCurrentUser = async () => {
  return await fetchFromWP("/users/me", { context: "edit" });
};

// Get specific user by ID
export const getUserById = async (id: number) => {
  return await fetchFromWP(`/users/${id}`);
};

// Update current user profile
export const updateCurrentUser = async (data: any) => {
  try {
    const response = await api.post("/users/me", data);
    return response.data;
  } catch (error: any) {
    console.error("Update User Error:", error.response?.data || error.message);
    throw error;
  }
};
