import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '@/shared/components/ui';
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound, Lock } from 'lucide-react';
import { demoStore } from '@/shared/demo/demo-store';

export interface AccessDeniedPageProps {
  requiredRole?: string;
  currentRole?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  requiredRole = 'PLATFORM_ADMIN',
  currentRole = demoStore.getState().currentRole,
}) => {
  const navigate = useNavigate();
  const currentShop = demoStore.getCurrentShop();

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface rounded-2xl border border-red-200 shadow-lg p-6 sm:p-8 text-center space-y-6">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-100/80 border border-red-200 text-red-700 mx-auto flex items-center justify-center shadow-2xs">
          <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
            <Lock className="w-3.5 h-3.5" />
            Lỗi 403 · Quyền Truy Cập Bị Từ Chối (Access Denied)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Khu Vực Quản Trị Nền Tảng Giới Hạn
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            Tài khoản hiện tại của bạn không có đặc quyền <code className="font-mono font-semibold text-ink">{requiredRole}</code> để truy cập bảng điều khiển vận hành trung tâm SaaS.
          </p>
        </div>

        {/* Security Notice Box */}
        <div className="p-4 rounded-xl border border-border-default bg-surface-subtle text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Vai trò hiện tại của bạn:</span>
            <Badge tone="warning" styleVariant="soft" withDot>
              {currentRole}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Vai trò yêu cầu:</span>
            <Badge tone="danger" styleVariant="solid">
              {requiredRole}
            </Badge>
          </div>
          <p className="text-[11px] text-ink-subtle pt-2 border-t border-border-default leading-relaxed">
            <strong>Nguyên tắc kiến trúc:</strong> Việc ẩn/chặn đường dẫn tại frontend chỉ phục vụ trải nghiệm người dùng (UX). Toàn bộ bảo mật thực tế được kiểm tra nghiêm ngặt tại tầng Spring Boot Backend API (401/403).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/dashboard/${currentShop.slug}`)}
          >
            Về Dashboard Cửa Hàng
          </Button>
          <Button
            variant="primary"
            leftIcon={<KeyRound className="w-4 h-4" />}
            onClick={() => {
              demoStore.setRole('PLATFORM_ADMIN');
              window.location.reload();
            }}
          >
            Chuyển Role Admin (Demo)
          </Button>
        </div>
      </div>
    </div>
  );
};
