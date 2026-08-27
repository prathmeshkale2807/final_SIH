import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const loginFarmer = async (cred) => {
    setLoading(true);
    try {
      const res = await authService.loginFarmer(cred);
      if (res.success) setUser(res.user);
      return res;
    } finally { setLoading(false); }
  };

  const loginBuyer = async (cred) => {
    setLoading(true);
    try {
      const res = await authService.loginBuyer(cred);
      if (res.success) setUser(res.user);
      return res;
    } finally { setLoading(false); }
  };

  const loginAdmin = async (cred) => {
    setLoading(true);
    try {
      const res = await authService.loginAdmin(cred);
      if (res.success) setUser(res.user);
      return res;
    } finally { setLoading(false); }
  };

  const registerFarmer = async (d) => {
    setLoading(true);
    try {
      const res = await authService.registerFarmer(d);
      if (res.success) setUser(res.user);
      return res;
    } finally { setLoading(false); }
  };

  const registerBuyer = async (d) => {
    setLoading(true);
    try {
      const res = await authService.registerBuyer(d);
      if (res.success) setUser(res.user);
      return res;
    } finally { setLoading(false); }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('krishak_auth_user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      updateUser,
      isAuthenticated: !!user,
      isFarmer: user?.role === 'farmer',
      isBuyer: user?.role === 'buyer',
      isAdmin: user?.role === 'admin',
      loading,
      loginFarmer,
      loginBuyer,
      loginAdmin,
      registerFarmer,
      registerBuyer,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
