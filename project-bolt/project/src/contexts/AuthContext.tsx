import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, logoutUser, getCurrentUser, registerUser, updateUserProfile } from '../services/authService';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'distributor' | 'consumer';
  phone?: string;
  profileImage?: string;
}

interface RegisterResult {
  success: boolean;
}

interface UpdateUserData {
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  register: (userData: { name: string; email: string; password: string; role: 'admin' | 'distributor' | 'consumer' }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser as User);
      }
    };
    loadUser();
  }, []);

  const register = async (userData: { name: string; email: string; password: string; role: 'admin' | 'distributor' | 'consumer' }) => {
    try {
      const result = await registerUser(userData) as RegisterResult;
      if (result.success) {
        const { password: _, ...userWithoutPassword } = userData;
        setUser(userWithoutPassword as User);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser as User);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser as User);
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}