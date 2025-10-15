"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FavoritesProvider } from './FavoritesContext';

const getAuthService = async () => {
  const { registerUser, loginUser } = await import('@/services/authService');
  return { registerUser, loginUser };
};

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (authState === 'true' && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { loginUser } = await getAuthService();
      const userData = await loginUser(email, password);
      
      const user: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
      };
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { registerUser } = await getAuthService();
      await registerUser(name, email, password);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}