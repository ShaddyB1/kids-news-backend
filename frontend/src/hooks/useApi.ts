/**
 * Junior News Digest - API Hooks
 * React hooks for API data management
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService, NewsArticle, Video, Quiz } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  total: number;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Articles hooks
export function useArticles(category?: string): UseApiListState<NewsArticle> {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchArticles = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentOffset = reset ? 0 : offset;
      const response = await apiService.getArticles({
        category,
        limit,
        offset: currentOffset,
      });

      if (reset) {
        setData(response.articles);
        setOffset(limit);
      } else {
        setData(prev => [...prev, ...response.articles]);
        setOffset(prev => prev + limit);
      }

      setTotal(response.total);
      setHasMore(response.articles.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      console.error('Articles API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, offset]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchArticles(false);
  }, [fetchArticles, hasMore, loading]);

  const refetch = useCallback(async () => {
    setOffset(0);
    await fetchArticles(true);
  }, [fetchArticles]);

  useEffect(() => {
    refetch();
  }, [category]);

  return {
    data,
    loading,
    error,
    refetch,
    loadMore,
    hasMore,
    total,
  };
}

// Single article hook
export function useArticle(id: string): UseApiState<NewsArticle> {
  return useApi(() => apiService.getArticle(id), [id]);
}

// Article quiz hook
export function useArticleQuiz(articleId: string): UseApiState<Quiz> {
  return useApi(() => apiService.getArticleQuiz(articleId), [articleId]);
}

// Videos hooks
export function useVideos(category?: string, status?: 'processing' | 'ready' | 'failed'): UseApiListState<Video> {
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getVideos({
        category,
        status,
        limit: 50, // Load more videos at once
      });

      setData(response.videos);
      setTotal(response.total);
      setHasMore(false); // For now, load all videos at once
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      console.error('Videos API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, status]);

  const refetch = useCallback(async () => {
    await fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    data,
    loading,
    error,
    refetch,
    loadMore: async () => {}, // Not implemented for videos yet
    hasMore,
    total,
  };
}

// Search hook
export function useSearch(query: string, category?: string, type?: 'article' | 'video') {
  const [data, setData] = useState<{
    articles: NewsArticle[];
    videos: Video[];
    total: number;
  }>({ articles: [], videos: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setData({ articles: [], videos: [], total: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.searchContent(searchQuery, {
        category,
        type,
        limit: 20,
      });

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Search API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, type]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query);
    }, 500); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [query, search]);

  return {
    data,
    loading,
    error,
    search,
  };
}

// Bookmarks hook
export function useBookmarks() {
  return useApi(() => apiService.getBookmarks(), []);
}

// Health check hook
export function useHealthCheck() {
  return useApi(() => apiService.healthCheck(), []);
}
