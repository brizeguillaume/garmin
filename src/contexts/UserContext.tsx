import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  connectGarmin: (username: string, password: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    if (email && password) {
      // Mock successful login
      setUser({
        id: '1',
        email,
        name: 'John Runner',
        isGarminConnected: false
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    if (name && email && password) {
      setUser({
        id: '1',
        email,
        name,
        isGarminConnected: false
      });
      return true;
    }
    return false;
  };

  const connectGarmin = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would connect to Garmin Connect API
    if (username && password && user) {
      setUser({
        ...user,
        isGarminConnected: true
      });
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      connectGarmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};