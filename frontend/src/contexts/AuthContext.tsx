import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'creator' | 'artisan' | 'admin';
  bio?: string;
  region?: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  artisanName: string;
  quantity: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  isCartOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('riwayat_token');
    const storedUser = localStorage.getItem('riwayat_user');
    const storedCart = localStorage.getItem('riwayat_cart');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    } else {
      // Default demo user profile if none set
      const demoUser: User = {
        id: 'usr-demo-1',
        name: 'Aarav Sharma',
        email: 'aarav@riwayat.in',
        role: 'creator',
        bio: 'Cultural Journalist & Heritage Photographer',
        region: 'Rajasthan'
      };
      setUser(demoUser);
    }

    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('riwayat_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('riwayat_token', res.data.token);
      localStorage.setItem('riwayat_user', JSON.stringify(res.data.user));
    } catch (e) {
      // Fallback local mock login
      const mockUser: User = {
        id: 'usr-local-' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'creator',
        bio: 'RIWAYAT Heritage Explorer',
        region: 'India'
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('riwayat_token', mockToken);
      localStorage.setItem('riwayat_user', JSON.stringify(mockUser));
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'visitor') => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('riwayat_token', res.data.token);
      localStorage.setItem('riwayat_user', JSON.stringify(res.data.user));
    } catch (e) {
      const mockUser: User = {
        id: 'usr-local-' + Date.now(),
        name,
        email,
        role: (role as any) || 'visitor',
        bio: 'Cultural Enthusiast',
        region: 'India'
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('riwayat_token', mockToken);
      localStorage.setItem('riwayat_user', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('riwayat_token');
    localStorage.removeItem('riwayat_user');
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === (product._id || product.id));
      if (existing) {
        return prev.map((item) =>
          item.id === (product._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product._id || product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          artisanName: product.artisanName,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        cart,
        isCartOpen,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        setIsCartOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};