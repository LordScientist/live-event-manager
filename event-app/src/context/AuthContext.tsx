/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, AccountType } from '../types';

export interface AuthContextType {
  currentUser: UserProfile;
  accountType: AccountType;
  switchAccountType: (type: AccountType) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  login: (type?: AccountType, userOverrides?: Partial<UserProfile>) => void;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;
}

// Default mock profiles for demonstration and testing both experiences
export const MOCK_REGULAR_USER: UserProfile = {
  id: 'usr-101-regular',
  email: 'participant@example.com',
  first_name: 'Alex',
  last_name: 'Rivera',
  phone: '+233 24 555 7890',
  organization: 'Tech For All Collective',
  job_title: 'Attendee',
  account_type: 'user',
  created_at: '2026-01-15T09:00:00Z'
};

// Manager profile updated with the name Roland (Prompt requirement)
export const MOCK_EVENT_MANAGER: UserProfile = {
  id: 'usr-202-manager',
  email: 'roland.adjei@knust.edu.gh',
  first_name: 'Roland',
  last_name: 'Adjei',
  phone: '+233 24 555 1234',
  organization: 'KNUST Event Operations',
  job_title: 'Head of Event Management',
  account_type: 'manager',
  created_at: '2025-11-20T10:30:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session check: only keep session alive when explicitly authenticated in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('current_user_profile');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // Fall back to role preset
      }
    }
    const savedRole = localStorage.getItem('active_account_type');
    return savedRole === 'manager' ? MOCK_EVENT_MANAGER : MOCK_REGULAR_USER;
  });

  const accountType = currentUser.account_type;

  const login = (type: AccountType = 'user', userOverrides?: Partial<UserProfile>) => {
    const baseUser = type === 'manager' ? MOCK_EVENT_MANAGER : MOCK_REGULAR_USER;
    const finalUser: UserProfile = userOverrides
      ? { ...baseUser, ...userOverrides, account_type: type }
      : baseUser;

    setIsAuthenticated(true);
    setCurrentUser(finalUser);
    localStorage.setItem('is_authenticated', 'true');
    localStorage.setItem('active_account_type', type);
    localStorage.setItem('current_user_profile', JSON.stringify(finalUser));
  };

  const signup = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: userData.email || 'user@example.com',
      first_name: userData.first_name || 'Participant',
      last_name: userData.last_name || 'User',
      phone: userData.phone || '',
      organization: userData.organization || 'General Community',
      job_title: userData.job_title || 'Attendee',
      account_type: 'user',
      created_at: new Date().toISOString()
    };

    setIsAuthenticated(true);
    setCurrentUser(newUser);
    localStorage.setItem('is_authenticated', 'true');
    localStorage.setItem('active_account_type', 'user');
    localStorage.setItem('current_user_profile', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
  };

  const switchAccountType = (type: AccountType) => {
    localStorage.setItem('active_account_type', type);
    const targetUser = type === 'manager' ? MOCK_EVENT_MANAGER : MOCK_REGULAR_USER;
    setCurrentUser(targetUser);
    localStorage.setItem('current_user_profile', JSON.stringify(targetUser));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('current_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem('active_account_type', currentUser.account_type);
  }, [currentUser.account_type]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        accountType,
        switchAccountType,
        updateProfile,
        isAuthenticated,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
