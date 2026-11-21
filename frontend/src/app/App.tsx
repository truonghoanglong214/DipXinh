import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { AppHeader } from '@/app/layouts/AppHeader';
import { MarketingHomePage } from '@/features/marketing/pages/MarketingHomePage';
import { CreateShopDialog } from '@/features/shop-onboarding/components/CreateShopDialog';
import { ThemeProvider, ToastProvider } from '@/shared/components/ui';
import { demoStore } from '@/shared/demo/demo-store';

export default function App() {
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isCreateShopOpen, setIsCreateShopOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreState({ ...demoStore.getState() });
    };
    window.addEventListener('dipxinh_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('dipxinh_store_updated', handleUpdate);
    };
  }, []);

  const currentShop = demoStore.getCurrentShop();

  // Backward compatibility: If a legacy URL includes ?view=..., redirect to real modular routes
  const viewParam = searchParams.get('view');
  if (viewParam === 'dashboard') {
    return <Navigate to={`/dashboard/${currentShop.slug}`} replace />;
  }
  if (viewParam === 'storefront') {
    return <Navigate to={`/shop/${currentShop.slug}/catalog`} replace />;
  }
  if (viewParam === 'showcase') {
    return <Navigate to="/showcase" replace />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#FCF9F5] flex flex-col font-sans">
          <AppHeader
            shops={storeState.shops}
            currentShop={currentShop}
            onSelectShop={(shopId) => demoStore.setShop(shopId)}
            currentRole={storeState.currentRole}
            onSelectRole={(role) => demoStore.setRole(role)}
            onOpenCreateShop={() => setIsCreateShopOpen(true)}
            onResetData={() => {
              if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu mẫu ban đầu?')) {
                demoStore.resetToDefault();
              }
            }}
          />

          <main className="flex-1">
            <MarketingHomePage
              currentShop={currentShop}
              onGoToStorefront={() => navigate(`/shop/${currentShop.slug}/catalog`)}
              onGoToDashboard={() => navigate(`/dashboard/${currentShop.slug}`)}
              onOpenCreateShop={() => navigate('/register')}
            />
          </main>

          <CreateShopDialog
            isOpen={isCreateShopOpen}
            onClose={() => setIsCreateShopOpen(false)}
            onCreateShop={(shopData) => {
              demoStore.createShop(shopData);
              navigate(`/dashboard/${shopData.slug}`);
            }}
          />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
