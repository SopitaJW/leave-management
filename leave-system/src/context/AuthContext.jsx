// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // เช็ค localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ฟังก์ชัน Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ฟังก์ชัน Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // เช็คว่าเป็นหัวหน้าหรือไม่
  const isManager = () => {
    return user?.role === 'manager' || user?.role === 'admin';
  };

  // เช็คว่าเป็นพนักงานหรือไม่
  const isEmployee = () => {
    return user?.role === 'employee';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isManager, 
      isEmployee,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};