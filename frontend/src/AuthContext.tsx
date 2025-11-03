import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface AuthTokens {
  access: string;
  refresh: string;
}


interface AuthContextType {
  tokens: AuthTokens | null;
  login: (data: AuthTokens) => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType |
  undefined>(undefined);





export const AuthProvider = ({ children }: {
  children:
  ReactNode
}) => {
  const [tokens, setTokens] = useState<AuthTokens | null>
    (() => {
      const storedTokens =
        localStorage.getItem('authTokens');
      return storedTokens ? JSON.parse(storedTokens) : null;
    });

  useEffect(() => {
    if (tokens) {
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('authTokens');
    }
  }, [tokens]);

  const login = (data: AuthTokens) => {
    setTokens(data);
  };

  const logout = () => {
    setTokens(null);
  }

  return (
    <AuthContext.Provider value={{ tokens, login, logout }}>
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
}











