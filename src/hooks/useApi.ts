import { useState, useEffect, useCallback } from 'react';
import type { AxiosResponse } from "axios";


interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<any>>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction(...args);
      const data = response.data.data || response.data;
      
      setState({
        data,
        loading: false,
        error: null,
      });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Define interface for pagination parameters
interface PaginationParams {
  page: number;
  limit: number;
  [key: string]: any; // Allow additional filter parameters
}

// Specialized hook for paginated data
export function usePaginatedApi(
  apiFunction: (params: PaginationParams) => Promise<AxiosResponse<any>>,
  initialParams: Partial<PaginationParams> = {}
) {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 50,
    ...initialParams,
  });

  const { data, loading, error, execute } = useApi(apiFunction);

  const loadPage = useCallback((page: number) => {
    setParams((prev: PaginationParams) => ({ ...prev, page }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<PaginationParams>) => {
    setParams((prev: PaginationParams) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    execute(params);
  }, [execute, params]);

  useEffect(() => {
    execute(params);
  }, [execute, params]);

  return {
    data: data?.data || [],
    meta: data?.meta || { page: 1, limit: 50, total: 0, totalPages: 0 },
    loading,
    error,
    params,
    loadPage,
    updateFilters,
    refresh,
  };
}

// Hook for real-time data updates
export function useRealTimeData<T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<any>>,
  eventType: string,
  refreshInterval?: number
) {
  const { data, loading, error, execute } = useApi<T>(apiFunction, { immediate: true });
  
  useEffect(() => {
    const handleUpdate = (_event: CustomEvent) => {
      // Refresh data when real-time update is received
      execute();
    };

    window.addEventListener(eventType, handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener(eventType, handleUpdate as EventListener);
    };
  }, [eventType, execute]);

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        execute();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, execute]);

  return { data, loading, error, refresh: execute };
}

// Hook for form submissions
export function useApiSubmit<T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<any>>,
  options: UseApiOptions = {}
) {
  const { data, loading, error, execute, reset } = useApi<T>(apiFunction, options);

  const submit = useCallback(async (formData: any) => {
    try {
      const result = await execute(formData);
      return result;
    } catch (error) {
      throw error;
    }
  }, [execute]);

  return {
    data,
    loading,
    error,
    submit,
    reset,
  };
}