// src/services/apiService.ts

import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Types
export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface QuoteData {
  _id?: string;
  quoteId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  vehicleType: 'Aircraft' | 'Automobile' | 'Vessel';
  status: 'Need Response' | 'Quoted' | 'Approved' | 'Completed';
  createdAt: string;
  // Vehicle specific fields
  registrationNumber?: string;
  serviceType?: string;
  serviceLocation?: string;
  year?: number;
  make?: string;
  model?: string;
  boatNumber?: string;
  vesselType?: string;
  length?: number;
  services?: Array<{
    description: string;
    price: number;
  }>;
  notes?: string;
}

export interface QuoteUpdateData {
  services: Array<{
    description: string;
    price: number;
  }>;
  notes?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// API instance setup
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY || ''
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
async function handleApiResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<ApiResponse<T>> {
  try {
    const response = await promise;
    return { data: response.data, error: null };
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      data: null,
      error: error.response?.data?.error || error.message || 'An unknown error occurred'
    };
  }
}

// API Service methods
export const apiService = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return handleApiResponse(api.post('/api/auth/login', credentials));
  },

  // Quote endpoints
  async submitQuote(quoteData: Partial<QuoteData>): Promise<ApiResponse<QuoteData>> {
    return handleApiResponse(api.post('/api/quotes', quoteData));
  },

  async getQuotes(): Promise<ApiResponse<QuoteData[]>> {
    return handleApiResponse(api.get('/api/quotes'));
  },

  async getQuoteById(id: string): Promise<ApiResponse<QuoteData>> {
    return handleApiResponse(api.get(`/api/quotes/${id}`));
  },

  async updateQuote(id: string, updateData: QuoteUpdateData): Promise<ApiResponse<QuoteData>> {
    return handleApiResponse(api.put(`/api/quotes/${id}`, updateData));
  },

  async generateWorkOrder(quoteId: string): Promise<ApiResponse<{ workOrderId: string }>> {
    return handleApiResponse(api.post(`/api/quotes/${quoteId}/work-order`));
  },

  async generateQuote(quoteId: string, updateData: QuoteUpdateData): Promise<ApiResponse<QuoteData>> {
    return handleApiResponse(
      api.post(`/api/quotes/${quoteId}/generate`, updateData)
    );
  },

  async getQuotePDF(quoteId: string): Promise<ApiResponse<{ url: string }>> {
    return handleApiResponse(
      api.get(`/api/quotes/${quoteId}/pdf`)
    );
  },

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Helper method to get stored token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  // Logout method
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
};