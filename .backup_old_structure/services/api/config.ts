/**
 * API Configuration
 * Single source of truth for all API-related constants
 */

// Base URL for API calls - update this for your environment
export const API_BASE_URL = 'http://192.168.2.81:3000/api'

// Origin URL for WebSocket and file URLs (without /api suffix)
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '')

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ORIGIN: API_ORIGIN,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const

// Storage keys used across the app
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME_MODE: 'themeMode',
  CHATBOT_THREAD_ID: 'chatbot_thread_id',
  CHATBOT_MESSAGES: 'chatbot_messages',
} as const
