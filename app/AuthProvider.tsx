// AuthProvider.tsx
import React, { FC, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  token: null,
  setToken: async () => {},
  logout: async () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) {
        setTokenState(savedToken);
      }
    };

    loadToken();
  }, []);

  const setToken = async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
    } else {
      await AsyncStorage.removeItem('token');
    }
    setTokenState(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setTokenState(null);
    router.push('/');
  };

  const authContextValue: AuthContextType = {
    token,
    setToken,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
