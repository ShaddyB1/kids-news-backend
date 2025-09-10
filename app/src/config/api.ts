/**
 * Junior News Digest - API Configuration
 * Configure backend API endpoints and settings
 */

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Environment-based configuration
const isDevelopment = __DEV__;

export const API_CONFIG: ApiConfig = {
  // Use live backend for all environments
  baseUrl: 'https://kids-news-backend.onrender.com',
  // Always use production backend for consistency and editorial updates
  
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // Articles
  articles: '/api/articles',
  article: (id: string) => `/api/articles/${id}`,
  articleQuiz: (id: string) => `/api/articles/${id}/quiz`,
  
  // Videos
  videos: '/api/videos',
  video: (id: string) => `/api/videos/${id}`,
  
  // Search
  search: '/api/search',
  
  // User data
  bookmarks: '/api/bookmarks',
  progress: '/api/progress',
  
  // Content generation (admin)
  generateStory: '/api/generate/story',
  generateVideo: '/api/generate/video',
  generateQuiz: '/api/generate/quiz',
} as const;

// Request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'JuniorNewsDigest/1.0.0',
} as const;

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  NOT_FOUND: 'Content not found.',
  UNAUTHORIZED: 'Access denied.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
} as const;

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
} as const;
