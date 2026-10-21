import type { FC } from 'react';
import type { Shop, UserRole } from '@/shared/model/domain';

interface AppHeaderProps {
  currentView: 'marketing' | 'storefront' | 'dashboard';
  onViewChange: (view: 'marketing' | 'storefront' | 'dashboard') => void;
  shops: Shop[];
  currentShop: Shop;
  onSelectShop: (shopId: string) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenCreateShop: () => void;
  onResetData: () => void;
}

const navigationItems = [
  { id: 'marketing', label: 'Giới thiệu' },
  { id: 'storefront', label: 'Bộ sưu tập' },
  { id: 'dashboard', label: 'Quản trị' },
] as const;

export const AppHeader: FC<AppHeaderProps> = ({
  currentView,
  onViewChange,
  shops,
  currentShop,
  onSelectShop,
  currentRole,
  onSelectRole,
  onOpenCreateShop,
  onResetData,
}) => (
  <header className="sticky top-0 z-40 border-b border-[#E8DFD8] bg-[#FCF9F5]/95 backdrop-blur-md">
    <div className="border-b border-[#E8DFD8] bg-[#FFFDFC]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 overflow-hidden px-4 py-2 text-[11px] text-[#756A64] sm:px-6">
        <p className="hidden sm:block">
          Không gian vận hành của <span className="font-medium text-[#302824]">{currentShop.name}</span>
          <span className="mx-2 text-[#C79A97]">—</span>
          Gói {currentShop.plan}
        </p>

        <div className="ml-auto flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-5">
          <label className="flex min-w-0 items-center gap-2">
            <span className="hidden lg:inline">Vai trò</span>
            <select
              value={currentRole}
              onChange={(event) => onSelectRole(event.target.value as UserRole)}
              className="max-w-[7rem] border-0 border-b border-[#E8DFD8] bg-transparent py-0.5 pr-1 font-medium text-[#302824] focus:border-[#713F4B] focus:outline-none sm:max-w-none"
            >
              <option value="SHOP_OWNER">Chủ cửa hàng</option>
              <option value="SHOP_MANAGER">Quản lý</option>
              <option value="SHOP_STAFF">Nhân viên</option>
              <option value="CUSTOMER">Khách hàng</option>
            </select>
          </label>

          <label className="flex min-w-0 items-center gap-2">
            <span className="hidden lg:inline">Cửa hàng</span>
            <select
              value={currentShop.id}
              onChange={(event) => onSelectShop(event.target.value)}
              className="max-w-[9rem] border-0 border-b border-[#E8DFD8] bg-transparent py-0.5 pr-1 font-medium text-[#302824] focus:border-[#713F4B] focus:outline-none sm:max-w-40"
            >
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onOpenCreateShop}
            className="hidden font-medium text-[#713F4B] transition-colors hover:text-[#5C303B] md:block"
          >
            Tạo cửa hàng
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="hidden text-[#928780] transition-colors hover:text-[#302824] lg:block"
            title="Đặt lại dữ liệu mẫu"
          >
            Đặt lại demo
          </button>
        </div>
      </div>
    </div>

    <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
      <button
        type="button"
        onClick={() => onViewChange('marketing')}
        className="group flex shrink-0 items-center gap-2.5 text-left sm:gap-3"
        aria-label="Về trang giới thiệu DịpXinh"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
          <img
            src="/brand/dipxinh-mark.png"
            alt=""
            className="h-full w-full object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.04]"
          />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[1.65rem] font-medium italic leading-none tracking-[-0.025em] text-[#302824] transition-colors group-hover:text-[#713F4B] sm:text-[1.95rem]">
            DịpXinh
          </span>
          <span className="mt-1 block whitespace-nowrap text-[7px] font-medium uppercase tracking-[0.13em] text-[#A98758] sm:text-[9px] sm:tracking-[0.2em]">
            Atelier operations
          </span>
        </span>
      </button>

      <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Điều hướng chính">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            className={`relative h-full text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[#713F4B] after:transition-transform ${
              currentView === item.id
                ? 'font-medium text-[#302824] after:scale-x-100'
                : 'text-[#756A64] after:scale-x-0 hover:text-[#302824] hover:after:scale-x-100'
            }`}
          >
            {item.id === 'storefront' ? `${item.label} · ${currentShop.slug}` : item.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => onViewChange(currentView === 'dashboard' ? 'storefront' : 'dashboard')}
        className="shrink-0 border border-[#713F4B] bg-[#713F4B] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#5C303B] sm:px-5"
      >
        <span className="sm:hidden">{currentView === 'dashboard' ? 'Cửa hàng' : 'Quản trị'}</span>
        <span className="hidden sm:inline">{currentView === 'dashboard' ? 'Xem cửa hàng' : 'Vào quản trị'}</span>
        <span aria-hidden="true" className="ml-1.5 sm:ml-2">→</span>
      </button>
    </div>
  </header>
);
