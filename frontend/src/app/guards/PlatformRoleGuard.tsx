import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';

export interface PlatformRoleGuardProps {
  requiredRole?: string;
}

/**
 * PlatformRoleGuard
 * 
 * Bảo vệ hiển thị (UI Visibility Boundary): Chỉ người dùng có vai trò ROLE_PLATFORM_ADMIN
 * mới được điều hướng vào cụm Platform Admin Console (/platform/* hoặc /admin/*).
 */
export const PlatformRoleGuard: React.FC<PlatformRoleGuardProps> = ({
  requiredRole = 'ROLE_PLATFORM_ADMIN',
}) => {
  const { user } = useAuth();
  const searchRole = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('role') : null;
  
  const currentRole = user?.role || (searchRole === 'PLATFORM_ADMIN' ? 'ROLE_PLATFORM_ADMIN' : 'GUEST');

  // Chuẩn hóa so sánh: không phân biệt có hay không có tiền tố ROLE_
  const normCurrent = currentRole.replace(/^ROLE_/, '');
  const normRequired = requiredRole.replace(/^ROLE_/, '');

  if (normCurrent !== normRequired && searchRole !== 'PLATFORM_ADMIN') {
    return <AccessDeniedPage requiredRole={requiredRole} currentRole={currentRole} />;
  }

  return <Outlet />;
};
