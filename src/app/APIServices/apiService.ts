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
  
  // New service selection fields
  services?: ServiceSelection;
  isInFleet?: boolean;
  notes?: string;
  pricing?: QuotePricing;
}


export interface QuoteUpdateData {
  services: Array<{
    description: string;
    price: number;
  }>;
  notes?: string;
}

interface WorkOrder {
  _id: string;
  workOrderId: string;
  quoteId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  completionNotes?: string;
  beforeImages?: string[];
  afterImages?: string[];
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
}

interface FleetAircraft {
  _id: string;
  tailNumber: string;
  type: string;
  homeBase: string;
  year: number;
  passengers: string;
  isActive: boolean;
}

export interface ServiceSelection {
  exterior: string[];
  interior: string[];
  specialRequests?: string;
}

export interface ServicePricing {
  service: string;
  price: number;
}

export interface PricingBreakdown {
  exterior: ServicePricing[];
  interior: ServicePricing[];
}

export interface QuotePricing {
  total: number;
  breakdown: PricingBreakdown;
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
  } catch (error: unknown) {
    console.error('API Error:', error instanceof Error ? error.message : 'Unknown error');
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
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
  submitQuote: async (quoteData: Partial<QuoteData>): Promise<ApiResponse<QuoteData>> => {
    const response = await handleApiResponse(api.post('/api/quotes', quoteData));
    console.log(response.data)

    // console.log(response.data)

    // If it's an In Fleet aircraft, automatically approve and generate the quote
    if (response.data && response.data.isInFleet) {
      quoteData.pricing = response.data.pricing
      quoteData.isInFleet = response.data.isInFleet
      await handleApiResponse(api.post(`/api/quotes/${response.data._id}/generate`, quoteData));
      await handleApiResponse(api.get(`/api/quotes/${response.data._id}/approve`));
      
    }

    return response;
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

  getWorkOrderByQuoteId: async (quoteId: string): Promise<ApiResponse<WorkOrder>> => {
    return handleApiResponse(api.get(`/api/workorders/quote/${quoteId}`));
  },

  updateWorkOrder: async (workOrderId: string, updateData: Partial<WorkOrder>): Promise<ApiResponse<WorkOrder>> => {
    return handleApiResponse(api.put(`/api/workorders/${workOrderId}`, updateData));
  },

  getFleetAircraft: async (): Promise<ApiResponse<FleetAircraft[]>> => {
    return handleApiResponse(api.get('/api/fleet'));
  },

  addFleetAircraft: async (aircraft: Omit<FleetAircraft, '_id' | 'isActive'>): Promise<ApiResponse<FleetAircraft>> => {
    return handleApiResponse(api.post('/api/fleet', aircraft));
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