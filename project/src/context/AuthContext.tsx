import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('token');
    console.log('Initial token from localStorage:', savedToken);
    return savedToken;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify token on mount and token change
  useEffect(() => {
    if (token) {
      console.log('Verifying token on mount/change:', token);
      verifyToken();
    } else {
      console.log('No token found, setting loading to false');
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      console.log('Verifying token...');
      const userData = await authAPI.verify();
      console.log('Token verified, user data:', userData);
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Token verification failed:', err);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('=== Login Process Start ===');
      setLoading(true);
      setError(null);

      console.log('Making login API call...');
      const { token: newToken, user: userData } = await authAPI.login(email, password);
      console.log('Login API response received:', { 
        token: newToken ? 'New token received' : 'No new token', 
        userData 
      });
      
      // Only update token if we got a new one
      if (newToken) {
        console.log('Storing new token in localStorage...');
        localStorage.setItem('token', newToken);
        console.log('Token stored in localStorage:', localStorage.getItem('token') ? 'Success' : 'Failed');
        
        // Set token in state
        console.log('Setting new token in state...');
        setToken(newToken);
      } else {
        console.log('Using existing token');
      }
      
      // Set user data
      console.log('Setting user data in state...');
      setUser(userData);
      console.log('=== Login Process Complete ===');
    } catch (err: any) {
      console.error('Login failed:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Attempting registration...');
      setLoading(true);
      setError(null);
      const { token: newToken, user: userData } = await authAPI.register(name, email, password);
      console.log('Registration successful, received token:', newToken);
      
      // Store token first
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Then set user data
      setUser(userData);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};