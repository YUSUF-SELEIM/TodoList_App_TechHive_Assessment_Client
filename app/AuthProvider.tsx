import React, { createContext, useState, useEffect, ReactNode, FC, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

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
      console.log("token stored", token);
    } else {
      await AsyncStorage.removeItem('token');
    }
    setTokenState(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
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
