// src/components/common/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleBasedRoute = ({ employeeComponent, managerComponent }) => {
  const { user, isManager } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return isManager() ? managerComponent : employeeComponent;
};

export default RoleBasedRoute;