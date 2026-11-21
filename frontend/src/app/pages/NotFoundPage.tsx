import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import { demoStore } from '@/shared/demo/demo-store';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const currentShop = demoStore.getCurrentShop();

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border-default shadow-lg p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border-default text-ink-muted mx-auto flex items-center justify-center">
          <HelpCircle className="w-7 h-7 stroke-[1.5]" />
        </div>
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Lỗi 404 · Không Tìm Thấy Trang
          </span>
          <h1 className="text-xl font-bold text-ink">Đường dẫn không tồn tại</h1>
          <p className="text-xs text-ink-muted mt-2 leading-relaxed">
            Trang bạn đang truy cập có thể đã được chuyển dời, đổi slug hoặc không tồn tại trên nền tảng DịpXinh.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-3">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={() => navigate(-1)}>
            Quay Lại
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />} onClick={() => navigate(`/shop/${currentShop.slug}`)}>
            Xem Cửa Hàng
          </Button>
        </div>
      </div>
    </div>
  );
};
