import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, wsService } from '../services/api';
import { toast } from 'react-toastify';

// Allowed roles for this panel
const ALLOWED_ROLES = ['ADMIN', 'SUPER_MASTER', 'MASTER'];

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: {
    canTrade: boolean;
    canCreateUsers: boolean;
    canCreditDebit: boolean;
    canBanScripts: boolean;
    canOverrideMargins: boolean;
    canOverrideLimits: boolean;
    canViewReports: boolean;
    canManageSystem: boolean;
  };
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string; expectedRole?: string }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('superadmin_token'),
  isLoading: true,
  isAuthenticated: false,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('superadmin_token');
      
      if (token) {
        try {
          const response = await authApi.getProfile();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.data.user,
              token,
            },
          });
          
          // Connect WebSocket
          wsService.connect();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          localStorage.removeItem('superadmin_token');
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: { email: string; password: string; expectedRole?: string }) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authApi.login({ email: credentials.email, password: credentials.password });
      const { user, accessToken } = response.data.data;
      
      // Validate user role - only ADMIN, SUPER_MASTER, MASTER can access this panel
      if (!ALLOWED_ROLES.includes(user.role)) {
        throw new Error('Access denied. You do not have permission to access this panel.');
      }
      
      // Validate that user role matches the selected role (if expectedRole is provided)
      if (credentials.expectedRole && user.role !== credentials.expectedRole) {
        const roleLabels: Record<string, string> = {
          ADMIN: 'Super Admin',
          SUPER_MASTER: 'Admin',
          MASTER: 'Master',
        };
        throw new Error(`Access denied. You selected ${roleLabels[credentials.expectedRole] || credentials.expectedRole} but your account is ${roleLabels[user.role] || user.role}.`);
      }
      
      localStorage.setItem('superadmin_token', accessToken);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: accessToken },
      });
      
      // Connect WebSocket
      wsService.connect();
      
      toast.success(`Welcome back, ${user.firstName || user.email}!`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('superadmin_token');
      dispatch({ type: 'LOGOUT' });
      
      // Disconnect WebSocket
      wsService.disconnect();
      
      toast.info('You have been logged out');
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('superadmin_refresh_token');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshToken(storedRefreshToken);
      const { user, token } = response.data.data;
      
      localStorage.setItem('superadmin_token', token);
      
      dispatch({
        type: 'REFRESH_TOKEN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Auto refresh token every 15 minutes
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        refreshToken();
      }, 15 * 60 * 1000); // 15 minutes

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/signin';
      return null;
    }

    return <Component {...props} />;
  };
};

// Permission checker hook
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: keyof User['permissions']) => {
    return user?.permissions[permission] || false;
  };
  
  const hasRole = (role: string) => {
    return user?.role === role;
  };
  
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };
  
  return {
    hasPermission,
    hasRole,
    isAdmin,
    permissions: user?.permissions,
  };
};