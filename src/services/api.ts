import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5001';

// Create axios instance
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('superadmin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/superadmin/dashboard'),
  
  getMarketWatch: (segment: string) => 
    api.get(`/superadmin/market-watch/${segment}`),
  
  addInstruments: (data: { segmentId: string; symbols: string[] }) =>
    api.post('/superadmin/market-watch/instruments', data),
  
  removeInstrument: (instrumentId: string) =>
    api.delete(`/superadmin/market-watch/instruments/${instrumentId}`),
};

// User Management API
export const userAPI = {
  getMasters: (params?: any) => 
    api.get('/superadmin/users/masters', { params }),
  
  getBrokers: (params?: any) => 
    api.get('/superadmin/users/brokers', { params }),
  
  getCustomers: (params?: any) => 
    api.get('/superadmin/users/customers', { params }),
  
  createUser: (userData: any) =>
    api.post('/superadmin/users/create', userData),
  
  updateUser: (userId: string, userData: any) =>
    api.put(`/superadmin/users/${userId}`, userData),
  
  adjustBalance: (userId: string, data: { type: 'credit' | 'debit'; amount: number; description: string }) =>
    api.post(`/superadmin/users/${userId}/balance`, data),
};

// Trading API
export const tradingAPI = {
  getPositions: (params?: any) => 
    api.get('/superadmin/trading/positions', { params }),
  
  getTrades: (params?: any) => 
    api.get('/superadmin/trading/trades', { params }),
  
  executeManualTrade: (tradeData: any) =>
    api.post('/superadmin/trading/manual-trade', tradeData),
  
  exitPosition: (data: { positionId: string; quantity?: number }) =>
    api.post('/superadmin/trading/exit-position', data),
  
  rolloverPosition: (data: { positionId: string; newInstrumentId: string }) =>
    api.post('/superadmin/trading/rollover', data),
};

// Forex API
export const forexAPI = {
  getPositions: (params?: any) => 
    api.get('/superadmin/forex/positions', { params }),
  
  getTrades: (params?: any) => 
    api.get('/superadmin/forex/trades', { params }),
  
  getSummary: () => 
    api.get('/superadmin/forex/summary'),
  
  updateMarginManagement: (data: any) =>
    api.put('/superadmin/forex/margin-management', data),
};

// Reports API
export const reportsAPI = {
  getSummary: (params?: any) => 
    api.get('/superadmin/summary', { params }),
  
  getExposureSummary: (params?: any) => 
    api.get('/superadmin/exposure-summary', { params }),
  
  getProfitLossReport: (params?: any) => 
    api.get('/superadmin/reports/profit-loss', { params }),
  
  getTradeReport: (params?: any) => 
    api.get('/superadmin/reports/trades', { params }),
};

// Accounts API
export const accountsAPI = {
  createCashEntry: (data: any) =>
    api.post('/superadmin/accounts/cash-entry', data),
  
  getCashLedger: (params?: any) => 
    api.get('/superadmin/accounts/cash-ledger', { params }),
  
  createDepositEntry: (data: any) =>
    api.post('/superadmin/accounts/deposit-entry', data),
  
  getDepositLedger: (params?: any) => 
    api.get('/superadmin/accounts/deposit-ledger', { params }),
  
  createJournalVoucher: (data: any) =>
    api.post('/superadmin/accounts/journal-voucher', data),
  
  getJVLedger: (params?: any) => 
    api.get('/superadmin/accounts/jv-ledger', { params }),
  
  getLedger: (params?: any) => 
    api.get('/superadmin/accounts/ledger', { params }),
};

// Utilities API
export const utilitiesAPI = {
  getAutoSquareOffSettings: () => 
    api.get('/superadmin/utilities/auto-square-off'),
  
  updateAutoSquareOffSettings: (data: any) =>
    api.put('/superadmin/utilities/auto-square-off', data),
  
  executeBulkTrades: (data: { trades: any[] }) =>
    api.post('/superadmin/utilities/bulk-trading', data),
  
  getTradeLogs: (params?: any) => 
    api.get('/superadmin/utilities/trade-logs', { params }),
  
  getRejectionLogs: (params?: any) => 
    api.get('/superadmin/utilities/rejection-logs', { params }),
  
  getUserEditLogs: (params?: any) => 
    api.get('/superadmin/utilities/user-edit-logs', { params }),
  
  getCashLedgerLogs: (params?: any) => 
    api.get('/superadmin/utilities/cash-ledger-logs', { params }),
};

// Settings API
export const settingsAPI = {
  getSettings: (params?: any) => 
    api.get('/superadmin/settings', { params }),
  
  updateSettings: (data: { key: string; value: any }) =>
    api.put('/superadmin/settings', data),
};

// WebSocket connection for real-time data
export class SuperAdminWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  connect() {
    const token = localStorage.getItem('superadmin_token');
    if (!token) {
      console.error('No auth token found for WebSocket connection');
      return;
    }

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('SuperAdmin WebSocket connected');
        this.reconnectAttempts = 0;
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
        console.log('SuperAdmin WebSocket disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('SuperAdmin WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max WebSocket reconnection attempts reached');
    }
  }

  private handleMessage(data: any) {
    // Handle different types of real-time updates
    switch (data.type) {
      case 'MARKET_DATA':
        // Update market watch data
        window.dispatchEvent(new CustomEvent('marketDataUpdate', { detail: data.payload }));
        break;
      
      case 'TRADE_UPDATE':
        // Update trade data
        window.dispatchEvent(new CustomEvent('tradeUpdate', { detail: data.payload }));
        break;
      
      case 'POSITION_UPDATE':
        // Update position data
        window.dispatchEvent(new CustomEvent('positionUpdate', { detail: data.payload }));
        break;
      
      case 'USER_UPDATE':
        // Update user data
        window.dispatchEvent(new CustomEvent('userUpdate', { detail: data.payload }));
        break;
      
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

// Export default api instance
export default api;