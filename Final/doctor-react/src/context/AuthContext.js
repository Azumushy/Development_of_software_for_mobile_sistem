import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      const userData = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString(),
        avatar: null,
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem(`user_${userData.id}_password`, password);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = await AsyncStorage.getAllKeys();
      const userKeys = users.filter(key => key.startsWith('user_') && !key.includes('_password'));
      
      for (const key of userKeys) {
        const userData = JSON.parse(await AsyncStorage.getItem(key));
        if (userData.email === email) {
          const storedPassword = await AsyncStorage.getItem(`user_${userData.id}_password`);
          if (storedPassword === password) {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
          }
        }
      }
      return { success: false, error: 'Неверный email или пароль' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

