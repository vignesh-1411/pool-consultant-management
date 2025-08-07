


import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';

import ConsultantDashboard from './pages/ConsultantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/consultant/dashboard"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


