import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * API Client wrapper around axios for communicating with the backend
 * Automatically handles Supabase token injection and error handling
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor: Add Supabase auth token to headers
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const supabase = createBrowserClient();
          if (!supabase) return config;

          const { data: { session } } = await supabase.auth.getSession();

          if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ApiClient] Error getting session:', error);
          }
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle 401 errors (token expired)
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ApiClient] Unauthorized - Token expired or invalid');
          }

          // Sign out the user if token is expired
          try {
            const supabase = createBrowserClient();
            if (supabase) {
              await supabase.auth.signOut();
            }

            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } catch (signOutError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[ApiClient] Error signing out:', signOutError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: object): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: object): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
