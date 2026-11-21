import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import type { UserRole } from '@/features/auth/types/auth.types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  const userRole = user?.role;
  const isAllowed =
    userRole &&
    allowedRoles.some(
      (role) => role.replace(/^ROLE_/, '') === userRole.replace(/^ROLE_/, '')
    );

  if (!isAllowed) {
    return (
      <AccessDeniedPage
        requiredRole={allowedRoles.join(' hoặc ')}
        currentRole={user?.role || 'Khách vãng lai'}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
