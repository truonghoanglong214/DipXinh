import type { FC } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import type { Shop, UserRole } from '@/shared/model/domain';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Store,
  LayoutDashboard,
  Sparkles,
  Calendar,
  Package,
  Settings,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  ChevronDown,
} from 'lucide-react';

interface AppHeaderProps {
  currentView?: string;
  onViewChange?: (view: any) => void;
  shops: Shop[];
  currentShop: Shop;
  onSelectShop: (shopId: string) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenCreateShop?: () => void;
  onResetData: () => void;
}

export const AppHeader: FC<AppHeaderProps> = ({
  shops,
  currentShop,
  onSelectShop,
  currentRole,
  onSelectRole,
  onResetData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, setDemoRole, switchShop, logout } = useAuth();

  const handleRoleChange = (role: UserRole) => {
    onSelectRole(role);
    const mappedRole =
      role === 'PLATFORM_ADMIN'
        ? 'ROLE_PLATFORM_ADMIN'
        : role === 'SHOP_STAFF'
        ? 'ROLE_SHOP_STAFF'
        : 'ROLE_SHOP_OWNER';
    setDemoRole(mappedRole, currentShop.slug);
  };

  const handleShopChange = (shopId: string) => {
    onSelectShop(shopId);
    const targetShop = shops.find((s) => s.id === shopId);
    if (targetShop) {
      switchShop(targetShop.slug);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8DFD8] bg-[#FCF9F5]/95 backdrop-blur-md shadow-2xs">
      {/* ── Top Bar: Environment, Role Switcher & Tenant Scope ── */}
      <div className="border-b border-[#E8DFD8] bg-[#FFFDFC]/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 overflow-hidden px-4 py-1.5 text-[11px] text-[#756A64] sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SaaS v2.1 Live
            </span>
            <p className="hidden md:inline">
              Đang thao tác tại <span className="font-semibold text-[#302824]">{currentShop.name}</span>
              <span className="mx-2 text-[#C79A97]">·</span>
              Gói {currentShop.plan}
            </p>
          </div>

          <div className="ml-auto flex w-full min-w-0 items-center justify-between gap-2.5 sm:w-auto sm:justify-end sm:gap-4">
            {/* Role Simulator */}
            <label className="flex min-w-0 items-center gap-1.5">
              <span className="hidden lg:inline text-ink-muted">Vai trò:</span>
              <select
                value={currentRole}
                onChange={(event) => handleRoleChange(event.target.value as UserRole)}
                className="rounded border border-[#E8DFD8] bg-[#FFFDFC] px-2 py-0.5 text-[11px] font-medium text-[#302824] focus:border-[#713F4B] focus:outline-none"
              >
                <option value="SHOP_OWNER">Chủ cửa hàng (Owner)</option>
                <option value="SHOP_MANAGER">Quản lý (Manager)</option>
                <option value="SHOP_STAFF">Nhân viên quầy (Staff)</option>
                <option value="CUSTOMER">Khách hàng (Customer)</option>
                <option value="PLATFORM_ADMIN">Quản trị sàn (Admin)</option>
              </select>
            </label>

            {/* Shop Selector */}
            <label className="flex min-w-0 items-center gap-1.5">
              <span className="hidden lg:inline text-ink-muted">Cửa hàng:</span>
              <select
                value={currentShop.id}
                onChange={(event) => handleShopChange(event.target.value)}
                className="max-w-[8.5rem] rounded border border-[#E8DFD8] bg-[#FFFDFC] px-2 py-0.5 text-[11px] font-medium text-[#302824] focus:border-[#713F4B] focus:outline-none sm:max-w-44"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </label>

            <Link
              to={isAuthenticated ? "/dashboard/select-shop" : "/register"}
              className="hidden font-medium text-[#713F4B] transition-colors hover:text-[#5C303B] md:inline"
            >
              + Mở Shop Mới
            </Link>

            <button
              type="button"
              onClick={onResetData}
              className="hidden text-[#928780] transition-colors hover:text-[#302824] lg:inline text-[10px]"
              title="Đặt lại dữ liệu mẫu ban đầu"
            >
              Đặt lại demo
            </button>

            {currentRole === 'PLATFORM_ADMIN' && (
              <Link
                to="/platform"
                className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase tracking-wider transition-colors hover:bg-emerald-100"
              >
                Console Sàn →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 text-left sm:gap-3"
          aria-label="Về trang chủ DịpXinh"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11">
            <img
              src="/brand/dipxinh-mark.png"
              alt="DịpXinh Atelier"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105"
            />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[1.65rem] font-medium italic leading-none tracking-[-0.025em] text-[#302824] transition-colors group-hover:text-[#713F4B] sm:text-[1.85rem]">
              DịpXinh
            </span>
            <span className="mt-0.5 block whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.2em] text-[#A98758]">
              Atelier Operations
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden h-full items-center gap-6 lg:gap-8 md:flex" aria-label="Điều hướng chính">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative flex h-full items-center text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-[#713F4B] after:transition-transform ${
                isActive
                  ? 'font-semibold text-[#302824] after:scale-x-100'
                  : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
              }`
            }
          >
            Trang Chủ
          </NavLink>

          <NavLink
            to={`/shop/${currentShop.slug}/catalog`}
            className={({ isActive }) =>
              `relative flex h-full items-center text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-[#713F4B] after:transition-transform ${
                isActive || location.pathname.startsWith('/shop')
                  ? 'font-semibold text-[#302824] after:scale-x-100'
                  : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
              }`
            }
          >
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#713F4B]" />
              Storefront Khách ({currentShop.name})
            </span>
          </NavLink>

          <NavLink
            to={`/dashboard/${currentShop.slug}`}
            className={({ isActive }) =>
              `relative flex h-full items-center text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-[#713F4B] after:transition-transform ${
                isActive || location.pathname.startsWith('/dashboard')
                  ? 'font-semibold text-[#302824] after:scale-x-100'
                  : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
              }`
            }
          >
            <span className="flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#713F4B]" />
              Quản Trị Shop
            </span>
          </NavLink>

          <NavLink
            to={`/dashboard/${currentShop.slug}/availability`}
            className={({ isActive }) =>
              `relative flex h-full items-center text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-[#713F4B] after:transition-transform ${
                isActive
                  ? 'font-semibold text-[#302824] after:scale-x-100'
                  : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
              }`
            }
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              Lịch Trống
            </span>
          </NavLink>

          <a
            href="/#gsap-showcase"
            className="relative flex h-full items-center text-sm transition-colors text-[#713F4B] hover:text-[#5C303B]"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECDAD8]/50 border border-[#C79A97]/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              GSAP Showroom
            </span>
          </a>

          <NavLink
            to="/showcase"
            className={({ isActive }) =>
              `relative flex h-full items-center text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-[#713F4B] after:transition-transform ${
                isActive
                  ? 'font-semibold text-[#302824] after:scale-x-100'
                  : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
              }`
            }
          >
            Design System
          </NavLink>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-[#302824]">
                {user?.displayName}
              </span>
              <button
                type="button"
                onClick={() => logout().then(() => navigate('/login'))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#756A64] hover:text-red-700 hover:bg-red-50 rounded transition-all cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Đăng Xuất</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#713F4B] border border-[#713F4B]/30 hover:border-[#713F4B] hover:bg-[#713F4B]/5 rounded transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Đăng Nhập
            </Link>
          )}

          <Link
            to={`/dashboard/${currentShop.slug}`}
            className="inline-flex items-center gap-2 border border-[#713F4B] bg-[#713F4B] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#5C303B] shadow-2xs rounded active:scale-98"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Vào Quản Trị</span>
            <span aria-hidden="true" className="ml-0.5">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
