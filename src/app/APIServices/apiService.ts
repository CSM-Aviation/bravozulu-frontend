// src/services/apiService.ts

import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Types
export interface AuthResponse {
  token: string;
  error: string;
  user: User
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ServiceItem {
  type: 'interior' | 'exterior';
  name: string;           // e.g. "basicPlus", "wetWash"
  displayName: string;    // e.g. "Basic Plus", "Wet Wash"
  price?: number;         // Optional during quote submission, required after pricing
  status?: 'pending' | 'completed';  // Used for work order tracking
}

export interface QuoteServices {
  services: ServiceItem[];
  specialRequests?: string;
  totalPrice?: number;    // Calculated by backend for in-fleet, set by sales for others
  priceSetBy?: {         // Track who set the price
    userId: string;
    timestamp: Date;
  };
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
  // services?: ServiceSelection;
  isInFleet?: boolean;
  notes?: string;
  serviceDetails: QuoteServices;
  pdfUrl?: string;
  approvedUser?: User;
  updatedAt?: string
  // pricing?: QuotePricing;
}

export interface ServiceOption {
  value: string;
  label: string;
  type: 'interior' | 'exterior';
}

export interface Service {
  type: 'interior' | 'exterior';
  name: string;
  displayName: string;
  price?: number;
  status?: 'pending' | 'completed';
}

export interface QuoteUpdateData {
  services: Array<Service>;
  notes?: string;
  specialRequests?: string;
  approvedUser?: User;
}

export interface TimeEntry {
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  hours: number;
  workPerformed: string;
}

export interface WorkOrder {
  _id: string;
  workOrderId: string;
  quoteId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  timeEntries: TimeEntry[];
  beforeImages: string[];
  afterImages: string[];
  comments?: string;
  completedServices: Service[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  laborDetails?: {
    totalHours: number;
    laborCost: number;
    hourlyRate: number;
  };
  wordorderDocument?: {
    generatedAt: string;
    url: string;
    woS3Key: string

  }
  completedUser?: User
}

export interface WorkOrderUpdateRequest {
  timeEntries: TimeEntry[];
  beforeImages: File[];
  afterImages: File[];
  comments?: string;
  completedServices: string[];
}

export interface WorkOrderUpdateData {
  timeEntries: TimeEntry[];
  completedServices: Service[];
  comments?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completedAt?: string;
  completedUser?: User
}


export interface FleetAircraft {
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

export interface AircraftData {
  nNumber: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  owner: string;
  status: string;
  registrationDate: string;
  expirationDate: string;
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
    // Handle axios errors with more detail
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      // Handle specific status codes
      switch (status) {
        case 401:
          console.error('Authentication error: Please log in again');
          break;
        case 403:
          console.error('Authorization error: You do not have permission to perform this action');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error occurred');
          break;
        default:
          console.error(`API Error (${status}):`, message);
      }

      return {
        data: null,
        error: message
      };
    }

    // Handle non-axios errors
    console.error('Unexpected error:', error instanceof Error ? error.message : 'Unknown error');
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
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
      if (response.data.serviceDetails) {
        quoteData.serviceDetails = response.data.serviceDetails;
      }
      quoteData.approvedUser = {
        username: "system",
        firstName: "System",
        lastName: "Automated",
        email: "system@csmaviation.com",
        role: "system"
      }

      quoteData.isInFleet = response.data.isInFleet;
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
    // Calculate total price
    const totalPrice = updateData.services.reduce((sum, service) => sum + (service.price || 0), 0);

    // Structure the request data
    const requestData = {
      serviceDetails: {
        services: updateData.services,
        totalPrice,
        specialRequests: updateData.specialRequests
      },
      notes: updateData.notes,
      approvedUser: updateData.approvedUser
    };

    return handleApiResponse(
      api.post(`/api/quotes/${quoteId}/generate`, requestData)
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

  // Add these methods to apiService.ts

  uploadWorkOrderImages: async (workOrderId: string, files: File[], type: 'before' | 'after') => {
    const formData = new FormData();

    // Append each file with a unique field name
    files.forEach((file) => {
      formData.append(`${type}Images`, file);
    });

    const config = {
      headers: {
        ...api.defaults.headers.common,
        'Content-Type': 'multipart/form-data',
      },
      // Add timeout and max content length
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    return handleApiResponse(
      api.post(`/api/workorders/${workOrderId}/images`, formData, config)
    );
  },

  updateWorkOrder: async (workOrderId: string, updateData: WorkOrderUpdateData): Promise<ApiResponse<WorkOrder>> => {
    return handleApiResponse(
      api.put(`/api/workorders/${workOrderId}`, updateData)
    );
  },


  getFleetAircraft: async (): Promise<ApiResponse<FleetAircraft[]>> => {
    return handleApiResponse(api.get('/api/fleet'));
  },

  addFleetAircraft: async (aircraft: Omit<FleetAircraft, '_id' | 'isActive'>): Promise<ApiResponse<FleetAircraft>> => {
    return handleApiResponse(api.post('/api/fleet', aircraft));
  },

  async getAircraftByNNumber(nNumber: string): Promise<ApiResponse<AircraftData>> {
    return handleApiResponse(api.get(`/api/aircraft/${nNumber}`));
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