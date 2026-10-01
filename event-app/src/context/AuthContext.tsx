import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, AccountType } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  accountType: AccountType;
  switchAccountType: (type: AccountType) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

// Default mock profiles for demonstration and testing both experiences
export const MOCK_REGULAR_USER: UserProfile = {
  id: 'usr-101-regular',
  email: 'alex.rivera@example.com',
  first_name: 'Alex',
  last_name: 'Rivera',
  phone: '+1 (555) 234-5678',
  organization: 'Tech For All Collective',
  job_title: 'Community Lead',
  account_type: 'user',
  created_at: '2026-01-15T09:00:00Z'
};

export const MOCK_EVENT_MANAGER: UserProfile = {
  id: 'usr-202-manager',
  email: 'sarah.chen@innovateconf.org',
  first_name: 'Sarah',
  last_name: 'Chen',
  phone: '+1 (555) 876-5432',
  organization: 'Global Tech Summits',
  job_title: 'Director of Event Operations',
  account_type: 'manager',
  created_at: '2025-11-20T10:30:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem('active_account_type');
    return savedRole === 'manager' ? MOCK_EVENT_MANAGER : MOCK_REGULAR_USER;
  });

  const accountType = currentUser.account_type;

  const switchAccountType = (type: AccountType) => {
    localStorage.setItem('active_account_type', type);
    if (type === 'manager') {
      setCurrentUser(MOCK_EVENT_MANAGER);
    } else {
      setCurrentUser(MOCK_REGULAR_USER);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates
    }));
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
        isAuthenticated: true
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
