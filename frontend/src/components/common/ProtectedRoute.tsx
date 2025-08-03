// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenPayload } from '../../utils/jwtUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'consultant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const payload = getTokenPayload();

  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && payload.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
