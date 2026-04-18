import axios from "axios";
import { useAppStore } from "../store/useAppStore";

const BASE_URL = "https://alsyahaalarabia.com/wp-json/wp/v2";
export const WP_JSON_ROOT = "https://alsyahaalarabia.com/wp-json";

/** WordPress site origin (programmatic login forms, links). */
export const WP_SITE_ORIGIN = new URL(WP_JSON_ROOT).origin;
/** Ultimate Member / theme password-reset page (in-app WebView). */
export const WP_PASSWORD_RESET_PAGE_URL = `${WP_SITE_ORIGIN}/password-reset/`;
/** WordPress registration (in-app WebView). */
export const WP_REGISTER_PAGE_URL = `${WP_SITE_ORIGIN}/wp-login.php?action=register`;

export interface JwtAuthTokenResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  user_id?: number;
  /** Some JWT plugin builds use `id` instead of `user_id`. */
  id?: number;
}

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

/** POST token request must not use the shared `api` client (no Bearer; correct base path). */
export const loginUser = async (
  username: string,
  password: string,
): Promise<JwtAuthTokenResponse> => {
  const { data } = await axios.post<JwtAuthTokenResponse>(
    `${WP_JSON_ROOT}/jwt-auth/v1/token`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 60000,
    },
  );
  return data;
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

// Update current user profile (WordPress REST standard is PATCH; some stacks still accept POST)
export const updateCurrentUser = async (data: Record<string, unknown>) => {
  const normalizeError = (error: any): never => {
    console.error("Update User Error:", error.response?.data || error.message);
    const msg =
      error?.response?.data?.message ??
      error?.response?.data?.code ??
      error?.message;
    const err = new Error(
      typeof msg === "string" ? msg : "Failed to update profile",
    );
    (err as any).response = error?.response;
    throw err;
  };

  try {
    const response = await api.patch("/users/me", data);
    return response.data;
  } catch (patchErr: any) {
    const status = patchErr?.response?.status;
    if (status === 405 || status === 501) {
      try {
        const response = await api.post("/users/me", data);
        return response.data;
      } catch (postErr: any) {
        normalizeError(postErr);
      }
    }
    normalizeError(patchErr);
  }
};

/** Update password for the authenticated user (`PATCH /users/me`). */
export const updateCurrentUserPassword = async (newPassword: string) => {
  return updateCurrentUser({ password: newPassword });
};
