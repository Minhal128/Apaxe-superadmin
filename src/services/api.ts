import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superadmin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superadmin_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ============ AUTHENTICATION ============

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () =>
    api.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// ============ DASHBOARD & MARKET WATCH ============

export const dashboardApi = {
  getDashboard: () =>
    api.get('/test/dashboard'),
  
  getMarketWatch: (segment: string, params?: {
    search?: string;
    limit?: number;
    page?: number;
  }) =>
    api.get(`/market/segment/${segment}`, { params }),
  
  getMarketData: async (params?: {
    segment?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    // Use the correct market endpoint that has live data
    let url: URL;
    
    if (params?.segment && params.segment !== 'ALL') {
      // Use segment-specific endpoint for filtered data
      url = new URL(`/api/v1/market/segment/${params.segment}`, API_BASE_URL.replace('/api/v1', ''));
    } else {
      // Use general market endpoint for all data
      url = new URL('/api/v1/market', API_BASE_URL.replace('/api/v1', ''));
    }
    
    // Add other parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && key !== 'segment') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiResponse = await response.json();
    
    // Handle different response formats
    let instruments = [];
    if (apiResponse.data) {
      if (Array.isArray(apiResponse.data)) {
        // Direct array from /market endpoint
        instruments = apiResponse.data;
      } else if (apiResponse.data.instruments) {
        // Nested instruments from /market/segment endpoint
        instruments = apiResponse.data.instruments;
      }
    }
    
    // Return in axios-like format expected by useApi hook
    return { 
      data: {
        data: instruments
      },
      status: response.status,
      statusText: response.statusText,
      headers: {} as any,
      config: {} as any
    } as any;
  },
  
  addInstruments: (data: {
    segmentId: string;
    symbols: string[];
  }) =>
    api.post('/superadmin/instruments', data),
};

// ============ USER MANAGEMENT ============

export const userApi = {
  getUsers: (params?: {
    role?: string;
    status?: string;
    parentId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/users', { params }),
  
  createUser: (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    parentId?: string;
    balance?: number;
    permissions?: object;
  }) =>
    api.post('/superadmin/users', userData),
  
  updateUser: (id: string, updateData: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
    permissions?: object;
  }) =>
    api.put(`/superadmin/users/${id}`, updateData),
  
  adjustBalance: (id: string, data: {
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    reason: string;
  }) =>
    api.post(`/superadmin/users/${id}/balance`, data),
};

// ============ TRADING MANAGEMENT ============

export const tradingApi = {
  getAllTrades: (params?: {
    userId?: string;
    segmentId?: string;
    instrumentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/trades', { params }),
  
  getAllPositions: (params?: {
    userId?: string;
    segmentId?: string;
    instrumentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    // Filter out empty string values to avoid validation errors
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      });
    }
    return api.get('/superadmin/positions', { params: cleanParams });
  },
  
  executeManualTrade: (data: {
    userId: string;
    instrumentId: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price?: number;
    orderType?: string;
    reason: string;
  }) =>
    api.post('/superadmin/trades/manual', data),
  
  closePosition: (id: string, data: {
    quantity?: number;
    price?: number;
    reason: string;
  }) =>
    api.post(`/superadmin/positions/${id}/close`, data),
};

// ============ FOREX MANAGEMENT ============

export const forexApi = {
  getForexTrades: (params?: {
    userId?: string;
    currencyPair?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/forex/trades', { params }),
  
  getForexPositions: (params?: {
    userId?: string;
    currencyPair?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/forex/positions', { params }),
  
  updateFxRates: (data: {
    rates: Array<{
      pair: string;
      rate: number;
      source?: string;
    }>;
  }) =>
    api.put('/superadmin/forex/rates', data),
};

// ============ SUMMARY & EXPOSURE ============

export const summaryApi = {
  getTradingSummary: (params?: {
    segment?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get('/superadmin/summary', { params }),
  
  getExposureSummary: (params?: {
    segment?: string;
    userId?: string;
  }) =>
    api.get('/superadmin/exposure', { params }),
};

// ============ ACCOUNTING & LEDGER ============

export const accountingApi = {
  getLedgerEntries: (params?: {
    userId?: string;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/ledger', { params }),
  
  createCashEntry: (data: {
    userId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    description: string;
    reference?: string;
  }) =>
    api.post('/superadmin/cash-entry', data),
  
  createJournalVoucher: (data: {
    entries: Array<{
      userId: string;
      amount: number;
      type: 'CREDIT' | 'DEBIT';
      description: string;
    }>;
    description: string;
    reference?: string;
  }) =>
    api.post('/superadmin/journal-voucher', data),
};

// ============ REPORTS ============

export const reportsApi = {
  generateTradeReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
  }) =>
    api.get('/superadmin/reports/trades', { 
      params,
      responseType: params?.format && params.format !== 'json' ? 'blob' : 'json'
    }),
  
  generatePnLReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
  }) =>
    api.get('/superadmin/reports/pnl', { 
      params,
      responseType: params?.format && params.format !== 'json' ? 'blob' : 'json'
    }),
};

// ============ UTILITIES ============

export const utilityApi = {
  getTradeLogs: (params?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/trades', { params }),
  
  getUserEditLogs: (params?: {
    userId?: string;
    editedBy?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/user-edits', { params }),
  
  configureAutoSquareOff: (data: {
    segmentId: string;
    enabled: boolean;
    time?: string;
    marginThreshold?: number;
    lossThreshold?: number;
  }) =>
    api.post('/superadmin/auto-square-off', data),
};

// ============ WEBSOCKET CONNECTION ============

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private subscriptions = new Set<string>();

  connect() {
    const token = localStorage.getItem('superadmin_token');
    if (!token) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:5001'}/ws?token=${token}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Resubscribe to previous subscriptions
      this.subscriptions.forEach(subscription => {
        this.subscribe(subscription);
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
  }

  subscribe(channel: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channel,
      }));
      this.subscriptions.add(channel);
    }
  }

  unsubscribe(channel: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        channel,
      }));
      this.subscriptions.delete(channel);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectInterval);
    }
  }

  private handleMessage(data: any) {
    // Emit custom events for different message types
    const event = new CustomEvent(`ws-${data.type}`, {
      detail: data,
    });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
export const wsService = new WebSocketService();

// ============ UTILITY FUNCTIONS ============

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatCurrency = (amount: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (number: number, decimals = 2) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export default api;