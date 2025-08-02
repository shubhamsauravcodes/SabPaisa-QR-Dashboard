import axios from 'axios';
import type { QRCode, Transaction } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid request');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Network error');
  }
);

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalRecords: number;
    };
  };
}

// QR Code API Functions
export const qrApi = {
  // Get all QR codes with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<QRCode>> => {
    const response = await api.get('/qr', { params });
    return response.data;
  },

  // Get single QR code by ID
  getById: async (qrId: string): Promise<ApiResponse<{
    qrCode: QRCode;
    stats: {
      totalTransactions: number;
      statusBreakdown: Array<{
        _id: string;
        count: number;
        totalAmount: number;
      }>;
    };
  }>> => {
    const response = await api.get(`/qr/${qrId}`);
    return response.data;
  },

  // Create new QR code
  create: async (qrData: Omit<QRCode, 'qrId' | 'createdAt' | 'simulationActive' | 'status'>): Promise<ApiResponse<QRCode>> => {
    const response = await api.post('/qr', qrData);
    return response.data;
  },

  // Update QR code
  update: async (qrId: string, qrData: Partial<QRCode>): Promise<ApiResponse<QRCode>> => {
    const response = await api.put(`/qr/${qrId}`, qrData);
    return response.data;
  },

  // Delete QR code
  delete: async (qrId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/qr/${qrId}`);
    return response.data;
  },

  // Toggle QR code status
  toggleStatus: async (qrId: string): Promise<ApiResponse<QRCode>> => {
    const response = await api.patch(`/qr/${qrId}/status`);
    return response.data;
  },

  // Toggle QR code simulation
  toggleSimulation: async (qrId: string): Promise<ApiResponse<QRCode>> => {
    const response = await api.patch(`/qr/${qrId}/simulation`);
    return response.data;
  },

  // Get transactions for a QR code
  getTransactions: async (
    qrId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get(`/qr/${qrId}/transactions`, { params });
    return response.data;
  },
};

// Transaction API Functions
export const transactionApi = {
  // Get all transactions with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    qrId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  // Get single transaction by ID
  getById: async (paymentId: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/transactions/${paymentId}`);
    return response.data;
  },

  // Create new transaction
  create: async (transactionData: Omit<Transaction, 'paymentId' | 'utr' | 'timestamp'>): Promise<ApiResponse<Transaction>> => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // Update transaction status
  updateStatus: async (paymentId: string, status: 'Success' | 'Failed' | 'Pending'): Promise<ApiResponse<Transaction>> => {
    const response = await api.put(`/transactions/${paymentId}`, { status });
    return response.data;
  },

  // Delete transaction
  delete: async (paymentId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/transactions/${paymentId}`);
    return response.data;
  },

  // Get transaction statistics
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    qrId?: string;
  }): Promise<ApiResponse<{
    summary: {
      totalTransactions: number;
      totalAmount: number;
      successfulTransactions: number;
      failedTransactions: number;
      pendingTransactions: number;
      successfulAmount: number;
      averageAmount: number;
      successRate: string;
    };
    statusBreakdown: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
    dailyStats: Array<{
      _id: { year: number; month: number; day: number };
      count: number;
      amount: number;
    }>;
    topUpiApps: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
  }>> => {
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },

  // Simulate transactions
  simulate: async (qrId: string, count?: number): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.post('/transactions/simulate', { qrId, count });
    return response.data;
  },
};

// Simulation API Functions
export const simulationApi = {
  // Toggle simulation for QR code
  toggleSimulation: async (qrId: string): Promise<ApiResponse<{ qrId: string; simulationActive: boolean; message: string }>> => {
    const response = await api.post(`/simulation/${qrId}/toggle`);
    return response.data;
  },

  // Start simulation for QR code
  startSimulation: async (qrId: string): Promise<ApiResponse<{ qrId: string; simulationActive: boolean; message: string }>> => {
    const response = await api.post(`/simulation/${qrId}/start`);
    return response.data;
  },

  // Stop simulation for QR code
  stopSimulation: async (qrId: string): Promise<ApiResponse<{ qrId: string; simulationActive: boolean; message: string }>> => {
    const response = await api.post(`/simulation/${qrId}/stop`);
    return response.data;
  },

  // Get simulation status for all QR codes
  getStatus: async (): Promise<ApiResponse<{
    activeSimulations: number;
    runningQRs: string[];
    isInitialized: boolean;
    qrCodes: Array<{
      qrId: string;
      referenceName: string;
      status: string;
      simulationActive: boolean;
      isRunning: boolean;
    }>;
  }>> => {
    const response = await api.get('/simulation/status');
    return response.data;
  },

  // Stop all running simulations
  stopAll: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/simulation/stop-all');
    return response.data;
  },
};

// General API Functions
export const generalApi = {
  // Health check
  healthCheck: async (): Promise<{ status: string; message: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get API info
  getApiInfo: async (): Promise<any> => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;
