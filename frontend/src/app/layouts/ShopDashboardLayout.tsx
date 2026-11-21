import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Shop, UserRole } from '@/shared/model/domain';
import { Button, Badge, DropdownMenu } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context/AuthContext';
import { CreateShopDialog } from '@/features/shop-onboarding/components/CreateShopDialog';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  CreditCard,
  Users,
  Settings,
  Store,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  Shield,
  Layers,
  ChevronDown,
  Sparkles,
  LogOut,
  Calendar,
} from 'lucide-react';

export const ShopDashboardLayout: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreState({ ...demoStore.getState() });
    };
    window.addEventListener('dipxinh_store_updated', handleUpdate);
    return () => window.removeEventListener('dipxinh_store_updated', handleUpdate);
  }, []);

  // Resolve active shop
  const shop: Shop =
    storeState.shops.find((s) => s.slug === shopSlug) ||
    storeState.shops[0] ||
    demoStore.getCurrentShop();

  const currentRole = storeState.currentRole;

  // Sidebar navigation links filtered by active user role
  const allNavItems = [
    {
      label: 'Tổng Quan Vận Hành',
      path: `/dashboard/${shop.slug}`,
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'SHOP_STAFF', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Quản Lý Trang Phục QR',
      path: `/dashboard/${shop.slug}/inventory`,
      icon: <Package className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'SHOP_STAFF', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Đơn Thuê & Giữ Cọc',
      path: `/dashboard/${shop.slug}/orders`,
      icon: <CalendarCheck className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'SHOP_STAFF', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Lịch Hẹn Thử Đồ',
      path: `/dashboard/${shop.slug}/fittings`,
      icon: <Calendar className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'SHOP_STAFF', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Đối Soát & Hoàn Tiền',
      path: `/dashboard/${shop.slug}/finance`,
      icon: <CreditCard className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Nhân Viên & Phân Quyền',
      path: `/dashboard/${shop.slug}/staff`,
      icon: <Users className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'PLATFORM_ADMIN'],
    },
    {
      label: 'Cấu Hình Cửa Hàng',
      path: `/dashboard/${shop.slug}/settings`,
      icon: <Settings className="w-4 h-4" />,
      allowedRoles: ['SHOP_OWNER', 'SHOP_MANAGER', 'PLATFORM_ADMIN'],
    },
  ];

  const navItems = allNavItems.filter((item) => item.allowedRoles.includes(currentRole));

  // Dynamic breadcrumbs based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { label: 'Cửa hàng', path: `/dashboard/${shop.slug}` },
    { label: shop.name, path: `/dashboard/${shop.slug}` },
  ];

  if (pathSegments.length > 2) {
    const subpage = pathSegments[2];
    const matched = navItems.find((n) => n.path.endsWith(subpage));
    if (matched) {
      breadcrumbItems.push({ label: matched.label, path: matched.path });
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row antialiased selection:bg-primary-soft selection:text-primary">
      {/* ── 1. SIDEBAR (Fixed Desktop & Responsive Drawer Mobile) ── */}
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen bg-surface border-r border-border-default flex flex-col justify-between transition-all duration-200 ease-in-out ${
          isCollapsed ? 'md:w-18' : 'w-64'
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Brand Header */}
          <div className="h-16 px-4 border-b border-border-default flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs"
                style={{ backgroundColor: shop.accentColor || '#713F4B' }}
              >
                {shop.name.charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="font-semibold text-xs text-ink truncate block">
                    {shop.name}
                  </span>
                  <span className="text-[10px] text-ink-muted uppercase tracking-wider block">
                    Atelier Operations
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-ink-muted hover:text-ink"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shop Switcher Dropdown */}
          {!isCollapsed && (
            <div className="p-3 border-b border-border-default bg-surface-subtle/50 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                <span>Không gian làm việc</span>
                <NavLink
                  to="/dashboard/select-shop"
                  className="text-primary hover:underline lowercase font-normal"
                  title="Danh sách tất cả Boutique"
                >
                  tất cả →
                </NavLink>
              </div>
              <select
                value={shop.id}
                onChange={(e) => {
                  if (e.target.value === '__NEW_SHOP__') {
                    setIsCreateOpen(true);
                    return;
                  }
                  const targetShop = storeState.shops.find((s) => s.id === e.target.value || s.slug === e.target.value);
                  if (targetShop) {
                    demoStore.setShop(targetShop.id);
                    navigate(`/dashboard/${targetShop.slug}`);
                  }
                }}
                className="w-full text-xs font-medium text-ink bg-surface border border-border-default rounded-md px-2.5 py-1.5 focus:border-primary focus:outline-none cursor-pointer"
              >
                {storeState.shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.plan})
                  </option>
                ))}
                <option value="__NEW_SHOP__">+ Mở Boutique Mới...</option>
              </select>
            </div>
          )}

          {/* Nav Items */}
          <nav aria-label="Điều hướng quản trị cửa hàng" className="p-3 space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={item.label}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Quota & Storefront Link */}
          {!isCollapsed && (
            <div className="p-3 border-t border-border-default bg-surface-subtle/40 space-y-3 shrink-0">
              {/* Plan Quota Card */}
              <div className="p-2.5 rounded-lg border border-border-default bg-surface space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-ink-muted">Gói Đăng Ký</span>
                  <Badge tone="primary" styleVariant="soft" size="sm">
                    {shop.plan}
                  </Badge>
                </div>
                <div className="text-[11px] text-ink-muted">
                  Hạn dùng: <span className="font-semibold text-ink">14 ngày dùng thử</span>
                </div>
                <div className="w-full bg-[#EFE7DE] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '35%' }} />
                </div>
                <div className="text-[10px] text-ink-subtle flex justify-between">
                  <span>Mã QR: 35 / 50</span>
                  <span>70% hạn mức</span>
                </div>
              </div>

              {/* View Public Storefront Button */}
              <NavLink
                to={`/shop/${shop.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-default bg-surface hover:bg-surface-subtle text-xs font-medium text-ink transition-colors"
                title="Mở giao diện khách hàng"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-primary" />
                  <span>Xem Cửa Hàng</span>
                </span>
                <ExternalLink className="w-3 h-3 text-ink-muted" />
              </NavLink>
            </div>
          )}
        </div>
      </aside>

      {/* ── 2. MAIN WORKSPACE AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── HEADER & SHOP CONTEXT DISPLAY ── */}
        <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur-md border-b border-border-default px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle"
              aria-label="Mở thanh điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Đường dẫn phân cấp" className="hidden sm:flex items-center gap-1.5 text-xs text-ink-muted">
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

          {/* Right: Shop Context, Role Indicator, User Actions */}
          <div className="flex items-center gap-3">
            {/* Context Badge: Active Plan & Shop */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-border-default bg-surface-subtle text-xs">
              <span className="w-2 h-2 rounded-full bg-[#2E7D5F]" />
              <span className="font-medium text-ink">{shop.name}</span>
              <span className="text-ink-subtle">·</span>
              <span className="font-semibold text-primary">{shop.plan}</span>
            </div>

            {/* Role Switcher Pill */}
            <label className="flex items-center gap-1.5 text-xs text-ink-muted bg-surface-subtle px-2.5 py-1 rounded-lg border border-border-default">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <select
                value={currentRole}
                onChange={(e) => demoStore.setRole(e.target.value as UserRole)}
                className="bg-transparent border-0 font-medium text-ink focus:outline-none cursor-pointer text-xs"
                title="Thay đổi vai trò người dùng (Demo)"
              >
                <option value="SHOP_OWNER">Chủ Cửa Hàng</option>
                <option value="SHOP_MANAGER">Quản Lý</option>
                <option value="SHOP_STAFF">Nhân Viên</option>
                <option value="PLATFORM_ADMIN">Quản Trị Nền Tảng</option>
              </select>
            </label>

            {/* Notification Bell */}
            <button
              type="button"
              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle relative"
              aria-label="Thông báo vận hành"
              onClick={() => alert('Thông báo mới: Có 2 đơn cọc đang chờ đối soát.')}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            </button>

            {/* User Account / Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border-default">
                <span
                  className="hidden sm:inline text-xs font-medium text-ink truncate max-w-[130px]"
                  title={user.displayName}
                >
                  {user.displayName}
                </span>
                <button
                  type="button"
                  onClick={() => logout().then(() => navigate('/login'))}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-surface-subtle transition-colors cursor-pointer"
                  title="Đăng xuất khỏi hệ thống"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── 3. CONTENT CONTAINER ── */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet context={{ shop }} />
        </main>
      </div>

      <CreateShopDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(created) => {
          setIsCreateOpen(false);
          navigate(`/dashboard/${created.slug}`);
        }}
      />
    </div>
  );
};
