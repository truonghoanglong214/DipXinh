import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { demoStore } from '@/shared/demo/demo-store';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/shared/components/ui';
import { Store, Plus, ArrowRight, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import { CreateShopDialog } from '@/features/shop-onboarding/components/CreateShopDialog';

export const ShopSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchShop, refreshShops } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shops, setShops] = useState(() => demoStore.getState().shops);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setShops([...demoStore.getState().shops]);
    };
    window.addEventListener('dipxinh_store_updated', handleUpdate);

    setIsLoading(true);
    refreshShops()
      .catch(() => {})
      .finally(() => setIsLoading(false));

    return () => window.removeEventListener('dipxinh_store_updated', handleUpdate);
  }, [refreshShops]);

  const handleSelect = (slug: string) => {
    switchShop(slug);
    navigate(`/dashboard/${slug}`);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            Không Gian Làm Việc Đa Cửa Hàng
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink tracking-tight">
            Chọn Boutique Thời Trang Để Quản Trị
          </h1>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            Xin chào <strong className="text-ink">{user?.displayName || 'Chủ Shop'}</strong>, vui lòng chọn cửa hàng bạn muốn làm việc trong phiên này.
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-ink-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm">Đang tải danh sách boutique của bạn...</p>
          </div>
        ) : (
          /* Shop Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="group hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => handleSelect(shop.slug)}
              >
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base group-hover:scale-105 transition-transform shadow-xs"
                      style={{ backgroundColor: shop.accentColor || '#713F4B' }}
                    >
                      {shop.name.charAt(0)}
                    </div>
                    <Badge tone="success" styleVariant="soft" size="sm">
                      <ShieldCheck className="w-3 h-3 mr-1 inline" />
                      Đang Hoạt Động
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {shop.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    <span className="truncate">{shop.address || 'Hồ Chí Minh, Việt Nam'}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 border-t border-border-default/40 mt-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-ink-muted">/shop/{shop.slug}</span>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(shop.slug);
                    }}
                  >
                    Vào Quản Lý
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Create new shop card */}
            <div
              onClick={() => setIsCreateOpen(true)}
              className="border-2 border-dashed border-border-default hover:border-primary/60 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-surface-subtle transition-all duration-300 group min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-full bg-surface border border-border-default flex items-center justify-center text-ink-muted group-hover:text-primary group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-ink group-hover:text-primary text-base">Mở Thêm Boutique Mới</h3>
                <p className="text-xs text-ink-muted mt-1">Đăng ký thêm chi nhánh hoặc thương hiệu thời trang mới</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateShopDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(created) => {
          setIsCreateOpen(false);
          handleSelect(created.slug);
        }}
      />
    </div>
  );
};
