import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for demo purposes
// In a real app, this would connect to a backend service
const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password123', name: 'Demo User' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password before saving to state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = mockUsers.some(u => u.email === email);
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // In a real app, this would send a request to your API
    const newUser = { id: String(mockUsers.length + 1), name, email, password };
    mockUsers.push(newUser);
    
    // Remove password before saving to state
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
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