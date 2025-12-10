/**
 * API Client
 * Centralized HTTP client with authentication, error handling, and type safety
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from './config';
import { ApiError, RequestOptions } from '@/types/api.types';

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get authentication headers with Bearer token
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Handle API errors consistently
 */
function handleApiError(error: unknown, context: string): never {
  console.error(`[API Error] ${context}:`, error);

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    // Network error or other fetch error
    throw new ApiError(error.message, 0, context);
  }

  throw new ApiError('An unexpected error occurred', 0, context);
}

/**
 * Parse error response from server
 */
async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.message || errorData.error || `HTTP error ${response.status}`;
  } catch {
    return `HTTP error ${response.status}`;
  }
}

// ============================================================
// API Client
// ============================================================

export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const headers = options.skipAuth
        ? { 'Content-Type': 'application/json', ...options.headers }
        : { ...(await getAuthHeaders()), ...options.headers };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `GET ${endpoint}`);
    }
  },

  /**
   * POST request
   */
  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const headers = options.skipAuth
        ? { 'Content-Type': 'application/json', ...options.headers }
        : { ...(await getAuthHeaders()), ...options.headers };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `POST ${endpoint}`);
    }
  },

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(
    endpoint: string,
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const headers = options.skipAuth
        ? { 'Content-Type': 'application/json', ...options.headers }
        : { ...(await getAuthHeaders()), ...options.headers };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `PATCH ${endpoint}`);
    }
  },

  /**
   * PUT request
   */
  async put<T, D = unknown>(
    endpoint: string,
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const headers = options.skipAuth
        ? { 'Content-Type': 'application/json', ...options.headers }
        : { ...(await getAuthHeaders()), ...options.headers };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `PUT ${endpoint}`);
    }
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const headers = options.skipAuth
        ? { 'Content-Type': 'application/json', ...options.headers }
        : { ...(await getAuthHeaders()), ...options.headers };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `DELETE ${endpoint}`);
    }
  },

  /**
   * Upload file with FormData
   * Note: Don't set Content-Type header - let fetch set it with boundary
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const headers: Record<string, string> = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error, `UPLOAD ${endpoint}`);
    }
  },

  /**
   * Stream response (for chatbot)
   */
  async stream(
    endpoint: string,
    data: unknown,
    onChunk: (chunk: string) => void,
    options: RequestOptions = {}
  ): Promise<string> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new ApiError('Response body is not readable', 0, endpoint);
      }

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(chunk);
      }

      return fullText;
    } catch (error) {
      return handleApiError(error, `STREAM ${endpoint}`);
    }
  },
};

// Re-export for backward compatibility
export { API_CONFIG, STORAGE_KEYS } from './config';
