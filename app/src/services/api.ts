/**
 * Junior News Digest - API Service
 * Handles all backend communication
 */

import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS, API_ERRORS, HTTP_STATUS } from '../config/api';

interface NewsArticle {
  id: string;
  title: string;
  headline: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  published_date: string;
  read_time: string;
  likes: number;
  views: number;
  comments: number;
  is_breaking: boolean;
  is_trending: boolean;
  is_hot: boolean;
  video_url?: string;
  thumbnail_url?: string;
  quiz_id?: string;
}

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  duration: string;
  category: string;
  views: number;
  upload_date: string;
  status: 'processing' | 'ready' | 'failed';
}

interface Quiz {
  id: string;
  article_id: string;
  title: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

class ApiService {
  constructor() {
    // Configuration is imported from config file
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = this.getErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(API_ERRORS.TIMEOUT_ERROR);
      }
      
      throw error;
    }
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return 'Invalid request';
      case HTTP_STATUS.UNAUTHORIZED:
        return API_ERRORS.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return API_ERRORS.UNAUTHORIZED;
      case HTTP_STATUS.NOT_FOUND:
        return API_ERRORS.NOT_FOUND;
      case HTTP_STATUS.RATE_LIMITED:
        return API_ERRORS.RATE_LIMITED;
      case HTTP_STATUS.SERVER_ERROR:
        return API_ERRORS.SERVER_ERROR;
      default:
        return `API Error: ${status}`;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Try the health endpoint first
      return await this.request(API_ENDPOINTS.health);
    } catch (error) {
      // If health endpoint doesn't exist, check if main site is accessible
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/`);
        if (response.ok) {
          return {
            status: 'healthy',
            timestamp: new Date().toISOString()
          };
        }
        throw new Error('Site not accessible');
      } catch (e) {
        throw new Error('Backend offline');
      }
    }
  }

  // Articles
  async getArticles(params?: {
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ articles: NewsArticle[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `${API_ENDPOINTS.articles}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<{ success: boolean; articles: NewsArticle[] }>(endpoint);
      
      // Transform backend response to expected format
      return {
        articles: response.articles || [],
        total: response.articles?.length || 0
      };
    } catch (error) {
      // Return empty results if API fails
      console.warn('Articles API failed, returning empty results:', error);
      return {
        articles: [],
        total: 0
      };
    }
  }

  async getArticle(id: string): Promise<NewsArticle> {
    return this.request(API_ENDPOINTS.article(id));
  }

  async getArticleQuiz(id: string): Promise<Quiz> {
    return this.request(API_ENDPOINTS.articleQuiz(id));
  }

  // Videos
  async getVideos(params?: {
    category?: string;
    status?: 'processing' | 'ready' | 'failed';
    limit?: number;
  }): Promise<{ videos: Video[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const endpoint = `${API_ENDPOINTS.videos}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<{ success: boolean; videos: Video[] }>(endpoint);
      
      // Transform backend response to expected format
      return {
        videos: response.videos || [],
        total: response.videos?.length || 0
      };
    } catch (error) {
      // Return empty results if API fails
      console.warn('Videos API failed, returning empty results:', error);
      return {
        videos: [],
        total: 0
      };
    }
  }

  // Search (fallback to filtering articles by category for now)
  async searchContent(query: string, params?: {
    category?: string;
    type?: 'article' | 'video';
    limit?: number;
  }): Promise<{
    articles: NewsArticle[];
    videos: Video[];
    total: number;
  }> {
    try {
      // For now, use category filtering as search since backend may not have search endpoint
      const articlesResponse = await this.getArticles({ 
        category: params?.category,
        limit: params?.limit || 20 
      });
      
      const videosResponse = await this.getVideos({ 
        limit: params?.limit || 20 
      });

      // Filter by query string (basic client-side search)
      const filteredArticles = articlesResponse.articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.category.toLowerCase().includes(query.toLowerCase())
      );

      return {
        articles: params?.type === 'video' ? [] : filteredArticles,
        videos: params?.type === 'article' ? [] : videosResponse.videos,
        total: filteredArticles.length + (params?.type === 'article' ? 0 : videosResponse.videos.length)
      };
    } catch (error) {
      // Fallback to empty results if search fails
      return {
        articles: [],
        videos: [],
        total: 0
      };
    }
  }

  // User Progress (for future implementation)
  async updateReadingProgress(articleId: string, progress: number): Promise<void> {
    await this.request(`/api/progress/reading`, {
      method: 'POST',
      body: JSON.stringify({ article_id: articleId, progress }),
    });
  }

  async updateVideoProgress(videoId: string, watchTime: number): Promise<void> {
    await this.request(`/api/progress/video`, {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId, watch_time: watchTime }),
    });
  }

  // Bookmarks
  async getBookmarks(): Promise<{ articles: NewsArticle[]; videos: Video[] }> {
    return this.request('/api/bookmarks');
  }

  async addBookmark(type: 'article' | 'video', id: string): Promise<void> {
    await this.request('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ type, id }),
    });
  }

  async removeBookmark(type: 'article' | 'video', id: string): Promise<void> {
    await this.request(`/api/bookmarks/${type}/${id}`, {
      method: 'DELETE',
    });
  }

  // Content Generation (for admin use)
  async generateStory(newsUrl: string): Promise<{ story_id: string; status: string }> {
    return this.request('/api/generate/story', {
      method: 'POST',
      body: JSON.stringify({ news_url: newsUrl }),
    });
  }

  async generateVideo(articleId: string): Promise<{ video_id: string; status: string }> {
    return this.request('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify({ article_id: articleId }),
    });
  }

  async generateQuiz(articleId: string): Promise<{ quiz_id: string; status: string }> {
    return this.request('/api/generate/quiz', {
      method: 'POST',
      body: JSON.stringify({ article_id: articleId }),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  NewsArticle,
  Video,
  Quiz,
  QuizQuestion,
};
