import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRole, redirectPath }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    let fallback = '/login/farmer';
    if (allowedRole === 'admin') fallback = '/login/admin';
    else if (allowedRole === 'buyer') fallback = '/login/buyer';
    return <Navigate to={redirectPath || fallback} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={user?.role === 'buyer' ? '/buyer/dashboard' : '/farmer/dashboard'} replace />;
  }

  return <Outlet />;
};
