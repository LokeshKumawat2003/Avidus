import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/authUtils';

function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
}

export default ProtectedRoute;
