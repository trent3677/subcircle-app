import React, { createContext, useContext, useState } from 'react';
import { useAuth as useReplitAuth } from '@/hooks/useAuth';
import type { User } from '../../shared/schema';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signInWithGoogle: () => void;
  signInWithReplit: () => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user data for showcasing features
const demoUser: User = {
  id: 'demo-user',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: realUser, isLoading, isAuthenticated: realIsAuthenticated } = useReplitAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Replit Auth uses direct navigation to /api/login
  const signInWithReplit = () => {
    window.location.href = '/api/login';
  };

  // Keep Google auth for compatibility
  const signInWithGoogle = () => {
    window.location.href = '/api/login';
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
  };

  // Replit Auth uses direct navigation to /api/logout for sign out
  const signOut = () => {
    if (isDemoMode) {
      setIsDemoMode(false);
    } else {
      window.location.href = '/api/logout';
    }
  };

  const value = {
    user: isDemoMode ? demoUser : (realUser as User),
    loading: isLoading,
    isAuthenticated: isDemoMode || realIsAuthenticated,
    isDemoMode,
    signInWithGoogle,
    signInWithReplit,
    enterDemoMode,
    exitDemoMode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};