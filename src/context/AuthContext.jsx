import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const login = (newToken, newIsAdmin) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAdmin', newIsAdmin);
    setToken(newToken);
    setIsAdmin(newIsAdmin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setToken(null);
    setIsAdmin(false);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAdmin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
