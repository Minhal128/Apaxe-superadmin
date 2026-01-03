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

// Helper to clean parameters by removing empty strings, nulls, and undefineds
const cleanParams = (params?: any) => {
  if (!params) return params;
  const cleaned: any = {};
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

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
    api.get('/superadmin/dashboard'),

  getSegments: (activeOnly?: boolean) =>
    api.get('/segments', { params: activeOnly ? { activeOnly: 'true' } : {} }),

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
    const { segment, ...rest } = params || {};
    const url = segment && segment !== 'ALL'
      ? `/market/segment/${segment}`
      : '/market';

    return api.get(url, { params: rest });
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
    api.get('/superadmin/users', { params: cleanParams(params) }),

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
    api.get('/superadmin/trades', { params: cleanParams(params) }),

  getAllPositions: (params?: {
    userId?: string;
    segmentId?: string;
    instrumentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/positions', { params: cleanParams(params) }),

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
    api.get('/superadmin/forex/trades', { params: cleanParams(params) }),

  getForexPositions: (params?: {
    userId?: string;
    currencyPair?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/forex/positions', { params: cleanParams(params) }),

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

// Temporarily disabled - returns mock data to avoid 500 errors in console
// Re-enable after backend is deployed with fixes

export const summaryApi = {
  getTradingSummary: (params?: {
    segment?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get('/superadmin/summary', { params: cleanParams(params) }),

  getExposureSummary: (params?: {
    segment?: string;
    userId?: string;
  }) =>
    api.get('/superadmin/exposure', { params: cleanParams(params) }),
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
    api.get('/superadmin/ledger', { params: cleanParams(params) }),

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
  getTradeReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
  }) =>
    api.get('/superadmin/reports/trades', {
      params: cleanParams(params),
      responseType: params?.format && params.format !== 'json' ? 'blob' : 'json'
    }),

  getPnLReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
  }) =>
    api.get('/superadmin/reports/pnl', {
      params: cleanParams(params),
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
    api.get('/superadmin/logs/trades', { params: cleanParams(params) }),

  getUserEditLog: (params?: {
    userId?: string;
    editedBy?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/user-edits', { params: cleanParams(params) }),

  getRejectionLogs: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/rejections', { params: cleanParams(params) }),

  getCashLedgerLogs: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/cash-ledger', { params: cleanParams(params) }),

  getDepositLedgerLogs: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/deposit-ledger', { params: cleanParams(params) }),

  getBulkTradingLogs: (params?: {
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/bulk-trading', { params: cleanParams(params) }),

  configureAutoSquareOff: (data: {
    segmentId: string;
    enabled: boolean;
    time?: string;
    marginThreshold?: number;
    lossThreshold?: number;
  }) =>
    api.post('/superadmin/auto-square-off', data),
};

// ============ ADMIN / BANS ============

export const adminApi = {
  getBans: (params?: {
    type?: string;
    instrumentId?: string;
    segmentId?: string;
    userId?: string;
  }) =>
    api.get('/admin/bans', { params: cleanParams(params) }),

  createBan: (data: {
    type: string;
    reason: string;
    instrumentId?: string;
    segmentId?: string;
    userId?: string;
    endDate?: string;
    allowSquareOff?: boolean;
  }) =>
    api.post('/admin/bans', data),

  removeBan: (id: string) =>
    api.delete(`/admin/bans/${id}`),
};

// ============ LEDGER API ============

export const ledgerApi = {
  getCashLedger: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/cash-ledger', { params: cleanParams(params) }),

  getDepositLedger: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/deposit-ledger', { params: cleanParams(params) }),

  getJournalLedger: (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/cash-ledger', { params: cleanParams(params) }),

  getLedgerBalances: (params?: {
    userId?: string;
  }) =>
    api.get('/superadmin/ledger/balances', { params: cleanParams(params) }),

  createCashEntry: (data: {
    userId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    category: string;
    description?: string;
  }) =>
    api.post('/superadmin/ledger/cash', data),

  createDepositEntry: (data: {
    userId: string;
    amount: number;
    description?: string;
  }) =>
    api.post('/superadmin/ledger/deposit', data),

  createJournalEntry: (data: {
    fromUserId: string;
    toUserId: string;
    amount: number;
    description?: string;
  }) =>
    api.post('/superadmin/ledger/journal', data),
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