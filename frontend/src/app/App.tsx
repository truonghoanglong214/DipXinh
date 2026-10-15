import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/app/layouts/AppHeader';
import { MarketingHomePage } from '@/features/marketing/pages/MarketingHomePage';
import { ShopDashboardPage } from '@/features/shop-dashboard/pages/ShopDashboardPage';
import { CreateShopDialog } from '@/features/shop-onboarding/components/CreateShopDialog';
import { StorefrontPage } from '@/features/storefront/pages/StorefrontPage';
import { demoStore } from '@/shared/demo/demo-store';

export default function App() {
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [currentView, setCurrentView] = useState<'marketing' | 'storefront' | 'dashboard'>('marketing');
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

  return (
    <div className="min-h-screen bg-[#FCF9F5] flex flex-col font-sans">
      <AppHeader
        currentView={currentView}
        onViewChange={setCurrentView}
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

      {currentView === 'marketing' && (
        <MarketingHomePage
          currentShop={currentShop}
          onGoToStorefront={() => setCurrentView('storefront')}
          onGoToDashboard={() => setCurrentView('dashboard')}
          onOpenCreateShop={() => setIsCreateShopOpen(true)}
        />
      )}

      {currentView === 'storefront' && (
        <StorefrontPage
          shop={currentShop}
          products={storeState.products}
          rentalUnits={storeState.rentalUnits}
          orders={storeState.orders}
          fittings={storeState.fittings}
          onCreateOrder={(params) => demoStore.createRentalOrder(params)}
          onCreateSaleInquiry={(params) => demoStore.createSaleInquiry(params)}
          onCreateFitting={(params) => demoStore.createFitting(params)}
          onCreateWaitlist={(params) => demoStore.createWaitlistEntry(params)}
        />
      )}

      {currentView === 'dashboard' && (
        <ShopDashboardPage
          shop={currentShop}
          shops={storeState.shops}
          currentRole={storeState.currentRole}
          products={storeState.products}
          rentalUnits={storeState.rentalUnits}
          orders={storeState.orders}
          payments={storeState.payments}
          depositTransactions={storeState.depositTransactions}
          incidents={storeState.incidents}
          refunds={storeState.refunds}
          fittings={storeState.fittings}
          staffMembers={storeState.staffMembers}
          customers={storeState.customers}
          waitlist={storeState.waitlist}
          onAddProduct={(prod, initialUnits) => demoStore.addProduct(prod, initialUnits)}
          onUpdateUnitStatus={(unitId, status, condition) => demoStore.updateUnitStatus(unitId, status, condition)}
          onApproveOrderAndHold={(orderId, assignments) => demoStore.approveOrderAndHold(orderId, assignments)}
          onRecordPayment={(orderId, type, amount, method, ref, notes) =>
            demoStore.recordPayment(orderId, type, amount, method, ref, notes)
          }
          onVerifyPayment={(paymentId) => demoStore.verifyPayment(paymentId)}
          onHandoverOrder={(orderId) => demoStore.handoverOrder(orderId)}
          onProcessReturnBatch={(orderId, returnedItems) => demoStore.processReturnBatch(orderId, returnedItems)}
          onCreateIncident={(orderId, itemId, type, fee, notes) =>
            demoStore.createIncident(orderId, itemId, type, fee, notes)
          }
          onFinalizeIncident={(incidentId, finalizedFee) => demoStore.finalizeIncident(incidentId, finalizedFee)}
          onRequestRefund={(params) => demoStore.requestRefund(params)}
          onVerifyRefund={(refundId) => demoStore.verifyRefund(refundId)}
          onCreateWalkInOrder={(params) => demoStore.createWalkInOrder(params)}
          onUpdateFittingStatus={(id, status) => demoStore.updateFittingStatus(id, status)}
          onToggleStaffActive={(id) => demoStore.toggleStaffActive(id)}
          onAddStaffMember={(staff) => demoStore.addStaffMember(staff)}
          onUpdateShopSettings={(shopId, settings) => demoStore.updateShopSettings(shopId, settings)}
        />
      )}

      <CreateShopDialog
        isOpen={isCreateShopOpen}
        onClose={() => setIsCreateShopOpen(false)}
        onCreateShop={(shopData) => {
          demoStore.createShop(shopData);
          setCurrentView('dashboard');
        }}
      />
    </div>
  );
}
