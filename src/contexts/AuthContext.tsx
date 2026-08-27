import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authStorage, initStorage } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  loginAsDemo: () => void;
  register: (data: Omit<User, 'id' | 'createdAt'>) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  resetDemoData: () => void;
  clearUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStorage();
    const currentUser = authStorage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email: string, _password?: string): boolean => {
    const existing = authStorage.login(email);
    if (existing) {
      setUser(existing);
      return true;
    }
    return false;
  };

  const loginAsDemo = () => {
    authStorage.resetToDemo();
    const demoUser = authStorage.getCurrentUser();
    setUser(demoUser);
  };

  const register = (data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = authStorage.register(data);
    setUser(newUser);
  };

  const logout = () => {
    authStorage.setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    const updated = authStorage.updateProfile(data);
    if (updated) {
      setUser(updated);
    }
  };

  const resetDemoData = () => {
    authStorage.resetToDemo();
    setUser(authStorage.getCurrentUser());
  };

  const clearUserData = () => {
    if (user?.id) {
      authStorage.clearUserData(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-sm">Carregando OrçaFácil...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        resetDemoData,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
