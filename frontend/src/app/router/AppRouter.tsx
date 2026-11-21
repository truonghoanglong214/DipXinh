import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { StorefrontLayout } from '@/app/layouts/StorefrontLayout';
import { ShopDashboardLayout } from '@/app/layouts/ShopDashboardLayout';
import { PlatformAdminLayout } from '@/app/layouts/PlatformAdminLayout';

// Guards & Special Pages
import { PlatformRoleGuard } from '@/app/guards/PlatformRoleGuard';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { AccessDeniedPage } from '@/app/pages/AccessDeniedPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { ServerErrorPage } from '@/app/pages/ServerErrorPage';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

// Views & Placeholders
import { StorefrontHomeView } from '@/features/storefront/views/StorefrontHomeView';
import { StorefrontCatalogView } from '@/features/storefront/views/StorefrontCatalogView';
import {
  ShopDashboardHomeView,
  DashboardSubpagePlaceholder,
} from '@/features/shop-dashboard/views/ShopDashboardHomeView';
import { ShopInventoryView } from '@/features/shop-dashboard/views/inventory/ShopInventoryView';
import { RentalPoliciesView } from '@/features/shop-dashboard/views/policies/RentalPoliciesView';
import { AvailabilityInspectorView } from '@/features/shop-dashboard/views/availability/AvailabilityInspectorView';
import {
  PlatformOverviewView,
  PlatformSubpagePlaceholder,
} from '@/features/platform/views/PlatformOverviewView';

// Existing standalone pages & Auth pages
import App from '@/app/App';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ShopSelectorPage } from '@/features/shop-dashboard/pages/ShopSelectorPage';
import { UIShowcasePage } from '@/features/showcase/pages/UIShowcasePage';
import { demoStore } from '@/shared/demo/demo-store';

export const AppRouter: React.FC = () => {
  const currentShop = demoStore.getCurrentShop();

  return (
    <ErrorBoundary>
      <Routes>
      {/* ── Public Landing & Marketing ── */}
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/register" element={<Navigate to="/register" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/showcase" element={<UIShowcasePage />} />

      {/* ── Multi-tenant Workspace Selection ── */}
      <Route
        path="/dashboard/select-shop"
        element={
          <ProtectedRoute>
            <ShopSelectorPage />
          </ProtectedRoute>
        }
      />

      {/* ── 1. CUSTOMER STOREFRONT (Public Layout: /shop/:slug) ── */}
      <Route path="/shop/:slug" element={<StorefrontLayout />}>
        <Route index element={<StorefrontHomeView />} />
        <Route path="catalog" element={<StorefrontCatalogView />} />
        <Route
          path="fitting"
          element={
            <DashboardSubpagePlaceholder
              title="Đặt Lịch Hẹn Thử Đồ Trực Tiếp"
              description="Chọn ngày và khung giờ để đến xưởng may thử trang phục trực tiếp cùng stylist."
            />
          }
        />
        <Route
          path="about"
          element={
            <DashboardSubpagePlaceholder
              title="Về Thương Hiệu Atelier"
              description="Câu chuyện thương hiệu, đội ngũ thiết kế và quy trình bảo chứng chất lượng vải tơ tằm."
            />
          }
        />
      </Route>

      {/* Convenience shortcut to default storefront */}
      <Route path="/shop" element={<Navigate to={`/shop/${currentShop.slug}`} replace />} />

      {/* ── 2. SHOP DASHBOARD (Protected Shop Staff Layout: /dashboard/:shopSlug) ── */}
      <Route
        path="/dashboard/:shopSlug"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['ROLE_SHOP_OWNER', 'ROLE_SHOP_STAFF', 'ROLE_PLATFORM_ADMIN']}>
              <ShopDashboardLayout />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<ShopDashboardHomeView />} />
        <Route path="inventory" element={<ShopInventoryView />} />
        <Route path="products" element={<ShopInventoryView />} />
        <Route path="inventory/units" element={<ShopInventoryView />} />
        <Route
          path="orders"
          element={
            <DashboardSubpagePlaceholder
              title="Quản Lý Đơn Thuê & Giữ Chỗ"
              description="Duyệt đơn, gán mã QR thực thể, kích hoạt countdown giữ cọc 60 phút và xác nhận đơn thuê."
            />
          }
        />
        <Route
          path="finance"
          element={
            <DashboardSubpagePlaceholder
              title="Đối Soát Tài Chính & Hoàn Ký Quỹ"
              description="Nhật ký chuyển khoản cọc, biên bản trừ phí hư hại và lệnh hoàn cọc ngân hàng đã xác minh."
            />
          }
        />
        <Route
          path="fittings"
          element={
            <DashboardSubpagePlaceholder
              title="Quản Lý Lịch Hẹn Thử Đồ"
              description="Sắp xếp thời gian tiếp đón khách hàng đến thử trang phục tại showroom atelier."
            />
          }
        />
        <Route
          path="staff"
          element={
            <DashboardSubpagePlaceholder
              title="Nhân Viên & Phân Quyền Vận Hành"
              description="Cấu hình danh mục quyền hạn cho vai trò Quản lý (Manager) và Nhân viên (Staff)."
            />
          }
        />
        <Route path="settings" element={<RentalPoliciesView />} />
        <Route path="settings/policies" element={<RentalPoliciesView />} />
        <Route path="availability" element={<AvailabilityInspectorView />} />
        <Route path="inventory/availability" element={<AvailabilityInspectorView />} />
      </Route>

      {/* Convenience shortcut to default shop dashboard */}
      <Route
        path="/dashboard"
        element={<Navigate to={`/dashboard/${currentShop.slug}`} replace />}
      />

      {/* ── 3. PLATFORM ADMINISTRATION (Protected Console Layout: /platform/*) ── */}
      {/* Follows Project Route Specification in F01-03 & F04-01..08 */}
      <Route element={<PlatformRoleGuard requiredRole="ROLE_PLATFORM_ADMIN" />}>
        <Route path="/platform" element={<PlatformAdminLayout />}>
          <Route index element={<PlatformOverviewView />} />
          <Route
            path="shops"
            element={
              <PlatformSubpagePlaceholder
                title="Quản Lý Danh Sách Tenants Cửa Hàng"
                specId="F04-02 / F04-03"
                description="Khảo sát shop theo trạng thái trial/plan/quota, phê duyệt đối tác mới, đình chỉ hoặc kích hoạt lại shop."
              />
            }
          />
          <Route
            path="plans"
            element={
              <PlatformSubpagePlaceholder
                title="Cấu Hình Gói Dịch Vụ SaaS & Quota"
                specId="F04-04"
                description="Cấu hình bảng giá gói Trial, Starter, Growth, hạn mức staff/QR unretired và chính sách hạ gói."
              />
            }
          />
          <Route
            path="subscriptions"
            element={
              <PlatformSubpagePlaceholder
                title="Quản Lý Đăng Ký Thuê Bao"
                specId="F04-05"
                description="Giám sát kỳ hạn thanh toán, thời gian ân hạn 3 ngày (grace period) và lịch sử chuyển đổi gói."
              />
            }
          />
          <Route
            path="invoices"
            element={
              <PlatformSubpagePlaceholder
                title="Hóa Đơn SaaS & Đối Soát Ngân Hàng"
                specId="F04-06"
                description="Chỉ SystemAdmin được đối soát và xác minh phí SaaS thanh toán qua ủy nhiệm chi ngân hàng."
              />
            }
          />
          <Route
            path="system"
            element={
              <PlatformSubpagePlaceholder
                title="Trạng Thái Hệ Thống & Hàng Đợi Outbox"
                specId="F04-07"
                description="Giám sát tiến trình retry tự động của transactional outbox worker và lịch sử kiểm toán audit log."
              />
            }
          />
        </Route>
      </Route>

      {/* Project Spec Route Alias: /admin/* redirects to /platform/* */}
      <Route path="/admin" element={<Navigate to="/platform" replace />} />
      <Route path="/admin/*" element={<Navigate to="/platform" replace />} />

      {/* Access Denied Direct Route */}
      <Route path="/403" element={<AccessDeniedPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/platform/access-denied" element={<AccessDeniedPage />} />

      {/* Server Error Route */}
      <Route path="/500" element={<ServerErrorPage />} />

      {/* ── 404 Catch All ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </ErrorBoundary>
);
};
