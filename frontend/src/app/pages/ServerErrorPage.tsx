import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import { demoStore } from '@/shared/demo/demo-store';

interface ServerErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const currentShop = demoStore.getCurrentShop();

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border-default shadow-lg p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-danger-subtle border border-danger/20 text-danger mx-auto flex items-center justify-center">
          <ServerCrash className="w-7 h-7 stroke-[1.5]" />
        </div>
        <div>
          <span className="text-xs font-semibold text-danger uppercase tracking-wider block mb-1">
            Lỗi 500 · Máy Chủ Gián Đoạn
          </span>
          <h1 className="text-xl font-bold text-ink">Hệ thống gặp sự cố ngoài ý muốn</h1>
          <p className="text-xs text-ink-muted mt-2 leading-relaxed">
            Đội ngũ kỹ thuật Dịp Xinh đã ghi nhận sự cố và đang tiến hành khắc phục. Quý khách vui lòng tải lại trang hoặc thử lại sau ít phút.
          </p>
          {error && import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-surface-subtle rounded-lg border border-border-default text-left overflow-x-auto text-[11px] font-mono text-danger">
              <p className="font-semibold">{error.name}: {error.message}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 pt-3">
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleRetry}>
            Thử Lại Ngay
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />} onClick={() => navigate(`/shop/${currentShop.slug}`)}>
            Về Cửa Hàng
          </Button>
        </div>
      </div>
    </div>
  );
};
