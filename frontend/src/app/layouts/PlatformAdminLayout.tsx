import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Button, Badge, LoadingState, ErrorState } from '@/shared/components/ui';
import {
  Server,
  Building2,
  PackageCheck,
  CreditCard,
  FileCheck,
  Activity,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  RotateCw,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

export interface PlatformAdminLayoutProps {
  simulateLoading?: boolean;
  simulateError?: boolean;
}

export const PlatformAdminLayout: React.FC<PlatformAdminLayoutProps> = ({
  simulateLoading = false,
  simulateError = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(simulateLoading);
  const [isErrorState, setIsErrorState] = useState(simulateError);

  const currentRole = demoStore.getState().currentRole;
  const currentShop = demoStore.getCurrentShop();

  // Platform admin navigation items mapped to F04 specification
  const platformNavItems = [
    {
      label: 'Tổng Quan Nền Tảng',
      path: '/platform',
      icon: <Server className="w-4 h-4" />,
      exact: true,
      description: 'Chỉ số SaaS tổng thể & Sức khỏe hệ thống',
    },
    {
      label: 'Quản Lý Cửa Hàng (Tenants)',
      path: '/platform/shops',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Khảo sát shop, Duyệt, Đình chỉ & Kích hoạt lại',
    },
    {
      label: 'Gói Dịch Vụ & Quota',
      path: '/platform/plans',
      icon: <PackageCheck className="w-4 h-4" />,
      description: 'Cấu hình giá gói Trial, Starter, Growth',
    },
    {
      label: 'Đăng Ký Thuê Bao',
      path: '/platform/subscriptions',
      icon: <Activity className="w-4 h-4" />,
      description: 'Vòng đời gói, Gia hạn & Quản lý Grace Period',
    },
    {
      label: 'Hóa Đơn SaaS & Đối Soát',
      path: '/platform/invoices',
      icon: <CreditCard className="w-4 h-4" />,
      description: 'Xác minh thanh toán chuyển khoản ngân hàng',
    },
    {
      label: 'Sự Kiện Outbox & Retry',
      path: '/platform/system',
      icon: <FileCheck className="w-4 h-4" />,
      description: 'Theo dõi hàng đợi Outbox và Audit logs',
    },
  ];

  // Dynamic breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [{ label: 'Nền tảng SaaS', path: '/platform' }];

  if (pathSegments.length > 1) {
    const subpage = pathSegments[1];
    const matched = platformNavItems.find((n) => n.path.endsWith(subpage));
    if (matched) {
      breadcrumbItems.push({ label: matched.label, path: matched.path });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-ink flex flex-col md:flex-row antialiased selection:bg-zinc-800 selection:text-white">
      {/* ── 1. SEPARATE PLATFORM ADMIN SIDEBAR (High-Authority Dark Carbon) ── */}
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[#18181B] text-zinc-300 border-r border-[#27272A] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Admin Brand Header */}
          <div className="h-16 px-4 border-b border-[#27272A] flex items-center justify-between shrink-0 bg-[#141417]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                DX
              </div>
              <div>
                <span className="font-semibold text-xs text-white tracking-tight block">
                  DịpXinh Console
                </span>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">
                  Platform Admin
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-zinc-400 hover:text-white"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Security Boundary Warning Box */}
          <div className="p-3 mx-3 mt-3 rounded-lg border border-zinc-800 bg-[#202024] text-[10px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform Tenant Scope</span>
            </div>
            <p className="leading-relaxed">
              Khu vực vận hành trung tâm. Không mặc định đọc/ghi dữ liệu đơn thuê hoặc thông tin riêng tư của khách hàng.
            </p>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Điều hướng quản trị nền tảng" className="p-3 space-y-1 flex-1">
            {platformNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-xs border border-zinc-700'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom System Health & Return Link */}
          <div className="p-3 border-t border-[#27272A] bg-[#141417] space-y-2.5 shrink-0">
            {/* System Status Pill */}
            <div className="p-2 rounded-md border border-zinc-800 bg-zinc-900 text-[10px] text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cluster: v1.0.0
              </span>
              <span className="text-emerald-400 font-mono">HEALTHY</span>
            </div>

            {/* Back to Shop Dashboard */}
            <button
              type="button"
              onClick={() => navigate(`/dashboard/${currentShop.slug}`)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về Shop Dashboard</span>
              </span>
              <span className="text-[10px] text-zinc-400">Exit Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. PLATFORM WORKSPACE & HEADER ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-border-default px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle"
              aria-label="Mở menu quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav aria-label="Đường dẫn phân cấp nền tảng" className="hidden sm:flex items-center gap-1.5 text-xs text-ink-muted">
              {breadcrumbItems.map((b, i) => (
                <React.Fragment key={`${b.path}-${i}`}>
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-ink-subtle" />}
                  <span
                    className={
                      i === breadcrumbItems.length - 1
                        ? 'font-semibold text-ink'
                        : 'hover:text-ink cursor-pointer'
                    }
                    onClick={() => navigate(b.path)}
                  >
                    {b.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right: State Simulators & Admin Identity */}
          <div className="flex items-center gap-3">
            {/* Loading & Error State Toggles for Verification */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsLoadingState((prev) => !prev)}
                className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                  isLoadingState
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-surface border-border-default text-ink-muted hover:text-ink'
                }`}
              >
                {isLoadingState ? 'Tắt Loading' : 'Giả lập Loading'}
              </button>

              <button
                type="button"
                onClick={() => setIsErrorState((prev) => !prev)}
                className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                  isErrorState
                    ? 'bg-red-100 border-red-300 text-red-900 font-semibold'
                    : 'bg-surface border-border-default text-ink-muted hover:text-ink'
                }`}
              >
                {isErrorState ? 'Tắt Lỗi' : 'Giả lập Lỗi'}
              </button>
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{currentRole}</span>
            </div>
          </div>
        </header>

        {/* ── 3. MAIN CONTENT CONTAINER (With Loading and Error States) ── */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {isLoadingState ? (
            <div className="py-16">
              <LoadingState message="Đang tải dữ liệu vận hành nền tảng SaaS..." size="lg" />
            </div>
          ) : isErrorState ? (
            <div className="max-w-2xl mx-auto py-12">
              <ErrorState
                title="Sự Cố Kết Nối Dịch Vụ Nền Tảng (Platform Service Failure)"
                message="Không thể đồng bộ danh sách tenant và hàng đợi outbox từ máy chủ Backend. Mã lỗi: ERR_PLATFORM_API_CONNECTION_REFUSED. Vui lòng kiểm tra lại dịch vụ Spring Boot."
                onRetry={() => setIsErrorState(false)}
              />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};
