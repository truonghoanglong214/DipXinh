import React, { useState, useEffect, useRef } from 'react';
import { useParams, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { demoStore } from '@/shared/demo/demo-store';
import { Shop } from '@/shared/model/domain';
import { ThemeProvider, Button, Badge, Input, useToast } from '@/shared/components/ui';
import { shopApi } from '@/shared/api';
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Menu,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  Heart,
  Store,
  Loader2,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

export const StorefrontLayout: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scoped animation refs for drawers
  const cartDrawerRef = useRef<HTMLDivElement>(null);
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const cartBackdropRef = useRef<HTMLDivElement>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileBackdropRef = useRef<HTMLDivElement>(null);

  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreState({ ...demoStore.getState() });
    };
    window.addEventListener('dipxinh_store_updated', handleUpdate);
    return () => window.removeEventListener('dipxinh_store_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (slug && !storeState.shops.some((s) => s.slug === slug)) {
      setIsCheckingBackend(true);
      shopApi.getBySlug(slug)
        .then((bShop) => {
          if (bShop) {
            demoStore.syncBackendShops([bShop]);
          }
        })
        .catch(() => {})
        .finally(() => setIsCheckingBackend(false));
    }
  }, [slug]);

  // Find shop by slug or fallback to current shop
  const foundShop = storeState.shops.find((s) => s.slug === slug);
  const shop: Shop = foundShop || storeState.shops[0] || demoStore.getCurrentShop();

  const shopOrders = storeState.orders.filter((o) => o.shopId === shop.id);
  const totalCartItems = shopOrders.reduce((sum, order) => sum + order.items.length, 0);

  // If slug is provided in URL but does not exist in platform, render an explicit 404 Shop Not Found state
  if (slug && !foundShop) {
    if (isCheckingBackend) {
      return (
        <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-6 text-center font-sans">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-xs text-ink-muted">Đang tải thông tin xưởng thời trang...</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-surface-subtle border border-border-default flex items-center justify-center mb-4 text-ink-muted shadow-2xs">
          <Store className="w-8 h-8 text-primary" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border-default text-xs font-semibold text-ink-muted mb-3 shadow-2xs">
          Lỗi 404 · Cửa Hàng Không Tồn Tại
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">
          Không tìm thấy xưởng may hoặc cửa hàng
        </h1>
        <p className="text-xs text-ink-muted max-w-md mb-6 leading-relaxed">
          Đường dẫn <code className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border-default font-mono text-ink">/shop/{slug}</code> không tồn tại trên hệ thống DịpXinh Atelier hoặc đã tạm ngưng hoạt động.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <NavLink to={`/shop/${storeState.shops[0]?.slug || 'lua-vang'}`}>
            <Button variant="primary" size="sm">
              Khám Phá Xưởng Mẫu ({storeState.shops[0]?.name || 'Lụa Vàng'})
            </Button>
          </NavLink>
          <NavLink to="/">
            <Button variant="outline" size="sm">
              Về Trang Nền Tảng
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  // Cart Drawer Close Animation
  const handleCloseCart = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsCartDrawerOpen(false);
      return;
    }
    if (!cartPanelRef.current || !cartBackdropRef.current) {
      setIsCartDrawerOpen(false);
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => setIsCartDrawerOpen(false),
    });
    tl.to(cartPanelRef.current, {
      xPercent: 100,
      duration: 0.28,
      ease: 'power3.in',
    }).to(
      cartBackdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  };

  // Cart Drawer Enter Animation with GSAP
  useGSAP(
    () => {
      if (!isCartDrawerOpen) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();
        tl.fromTo(
          cartBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        )
          .fromTo(
            cartPanelRef.current,
            { xPercent: 100 },
            { xPercent: 0, duration: 0.35, ease: 'power3.out' },
            '<'
          )
          .fromTo(
            '.cart-stagger-item',
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: 'power2.out' },
            '-=0.15'
          );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([cartBackdropRef.current, cartPanelRef.current, '.cart-stagger-item'], {
          opacity: 1,
          xPercent: 0,
          y: 0,
        });
      });
    },
    { scope: cartDrawerRef, dependencies: [isCartDrawerOpen] }
  );

  // Mobile Menu Close Animation
  const handleCloseMobileMenu = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsMobileMenuOpen(false);
      return;
    }
    if (!mobilePanelRef.current || !mobileBackdropRef.current) {
      setIsMobileMenuOpen(false);
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => setIsMobileMenuOpen(false),
    });
    tl.to(mobilePanelRef.current, {
      xPercent: -100,
      duration: 0.25,
      ease: 'power3.in',
    }).to(
      mobileBackdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  };

  // Mobile Menu Enter Animation with GSAP
  useGSAP(
    () => {
      if (!isMobileMenuOpen) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();
        tl.fromTo(
          mobileBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        )
          .fromTo(
            mobilePanelRef.current,
            { xPercent: -100 },
            { xPercent: 0, duration: 0.3, ease: 'power3.out' },
            '<'
          )
          .fromTo(
            '.mobile-nav-stagger',
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, ease: 'power2.out' },
            '-=0.1'
          );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([mobileBackdropRef.current, mobilePanelRef.current, '.mobile-nav-stagger'], {
          opacity: 1,
          xPercent: 0,
          x: 0,
        });
      });
    },
    { scope: mobileMenuRef, dependencies: [isMobileMenuOpen] }
  );

  // Keyboard accessibility: ESC key to close active drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCartDrawerOpen) handleCloseCart();
        if (isMobileMenuOpen) handleCloseMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, isMobileMenuOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isCartDrawerOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen, isMobileMenuOpen]);

  // If slug in URL does not match found shop (e.g. visited /shop/unknown), we can show not found or fallback
  const shopBrandTheme = {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    primary: shop.accentColor || '#713F4B',
    primaryHover: shop.accentColor || '#5C303B',
    primarySoft: `${shop.accentColor || '#713F4B'}18`,
    primaryForeground: '#FFFFFF',
  };

  const navCategories = [
    { id: 'all', label: 'Tất cả trang phục', path: `/shop/${shop.slug}` },
    { id: 'ao-dai', label: 'Áo Dài Cung Đình', path: `/shop/${shop.slug}?category=ao-dai` },
    { id: 'da-hoi', label: 'Đầm Dạ Hội Cao Cấp', path: `/shop/${shop.slug}?category=da-hoi` },
    { id: 'vay-cuoi', label: 'Váy Cưới Atelier', path: `/shop/${shop.slug}?category=vay-cuoi` },
    { id: 'suit', label: 'Âu Phục & Veston', path: `/shop/${shop.slug}?category=suit` },
  ];

  const isHomePage =
    location.pathname === `/shop/${shop.slug}` ||
    location.pathname === `/shop/${shop.slug}/`;

  return (
    <ThemeProvider initialTheme={shopBrandTheme}>
      <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary-soft selection:text-primary w-full overflow-x-hidden">
        {/* ── TOP UTILITY ANNOUNCEMENT BAR ── */}
        <aside aria-label="Thông báo cửa hàng" className="border-b border-border-default bg-surface text-[11px] text-ink-muted overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-medium text-ink truncate">{shop.name}</span>
              <span className="hidden md:inline text-ink-subtle">— {shop.address}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                09:00 - 21:00
              </span>
              <a
                href={`tel:${shop.phone}`}
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{shop.phone}</span>
              </a>
            </div>
          </div>
        </aside>

        {/* ── 1. CUSTOMER STOREFRONT HEADER ── */}
        <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2 sm:gap-4">
            {/* Store Brand / Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle"
                aria-label="Mở menu di động"
              >
                <Menu className="w-5 h-5" />
              </button>

              <NavLink
                to={`/shop/${shop.slug}`}
                className="flex items-center gap-2.5 text-left group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: shop.accentColor || '#713F4B' }}
                >
                  {shop.name.charAt(0)}
                </div>
                <div>
                  <span className="font-sans text-xl sm:text-2xl font-bold text-ink leading-none group-hover:text-primary transition-colors block">
                    {shop.name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted block mt-0.5">
                    Haute Couture Atelier
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/shop/${shop.slug}?q=${encodeURIComponent(searchQuery.trim())}#collection`);
                } else {
                  navigate(`/shop/${shop.slug}`);
                }
              }}
              className="hidden lg:block w-72"
              role="search"
            >
              <Input
                sizeVariant="sm"
                placeholder="Tìm áo dài, đầm dạ hội..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
                aria-label="Tìm kiếm trang phục"
              />
            </form>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Calendar className="w-3.5 h-3.5 text-primary" />}
                  onClick={() => window.dispatchEvent(new CustomEvent('open_fitting_modal'))}
                >
                  Hẹn Thử Đồ
                </Button>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                onClick={() => setIsCartDrawerOpen(true)}
                aria-label={`Mở túi đồ thuê (${totalCartItems} món)`}
              >
                <span className="hidden sm:inline">Túi Đồ Thuê</span>
                <Badge tone="neutral" styleVariant="solid" size="sm" className="ml-1 bg-white/20 text-white">
                  {totalCartItems}
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* ── 2. SUBPAGE BRANDING AREA (Shown only on subpages, Home has dedicated editorial hero) ── */}
        {!isHomePage && (
          <section className="relative border-b border-border-default overflow-hidden bg-surface-subtle">
            {/* Subtle Ambient Decorative Gradient using Shop Accent */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${shop.accentColor || '#713F4B'}, transparent 60%)`,
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border-default text-[11px] font-semibold text-ink-muted shadow-2xs">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: shop.accentColor || '#713F4B' }} />
                    Không Gian Thời Trang & Cho Thuê
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
                    {shop.description}
                  </h1>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-ink-muted pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {shop.address}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D5F]" />
                      Định danh mã QR từng sản phẩm thực thể
                    </span>
                  </div>
                </div>

                {/* Atelier Trust Pill Card */}
                <div className="p-4 rounded-xl border border-border-default bg-surface/90 shadow-2xs space-y-2.5 w-full md:w-72 shrink-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block">
                    Tiêu Chuẩn Phục Vụ
                  </span>
                  <ul className="text-xs text-ink space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Hấp sấy diệt khuẩn trước khi giao
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Được thử đồ trực tiếp tại xưởng
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Hoàn cọc nhanh qua ngân hàng
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. PRODUCT NAVIGATION BAR ── */}
        <nav aria-label="Danh mục sản phẩm" className="sticky top-18 z-30 bg-surface/90 backdrop-blur-md border-b border-border-default shadow-2xs w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none w-full min-w-0">
              {navCategories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={cat.path}
                  end={cat.id === 'all'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                    }`
                  }
                >
                  {cat.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* ── 4. MAIN CONTENT CONTAINER ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full min-w-0 max-w-full overflow-hidden pb-20 sm:pb-12">
          <Outlet context={{ shop }} />
        </main>

        {/* ── 5. CUSTOMER STOREFRONT FOOTER ── */}
        <footer className="border-t border-border-default bg-surface-subtle text-ink-muted mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Col 1: Shop details */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-xl font-bold text-ink block">
                  {shop.name}
                </span>
                <p className="text-xs leading-relaxed max-w-sm">
                  {shop.description}
                </p>
                <div className="text-xs space-y-1 pt-1 text-ink-muted">
                  <p><strong>Địa chỉ:</strong> {shop.address}</p>
                  <p><strong>Hotline:</strong> {shop.phone}</p>
                  <p><strong>Giờ phục vụ:</strong> 09:00 - 21:00 hàng ngày</p>
                </div>
              </div>

              {/* Col 2: Policy */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-ink uppercase tracking-wider text-[11px] block mb-2">
                  Chính Sách & Hướng Dẫn
                </span>
                <ul className="space-y-1.5">
                  <li><button type="button" className="hover:text-ink hover:underline">Quy định đặt cọc & hoàn tiền</button></li>
                  <li><button type="button" className="hover:text-ink hover:underline">Quy trình vệ sinh hấp sấy</button></li>
                  <li><button type="button" className="hover:text-ink hover:underline">Hướng dẫn lấy số đo thử đồ</button></li>
                  <li><button type="button" className="hover:text-ink hover:underline">Xử lý sự cố trang phục</button></li>
                </ul>
              </div>

              {/* Col 3: SaaS Platform Credit */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-ink uppercase tracking-wider text-[11px] block mb-2">
                  Hạ Tầng Nền Tảng
                </span>
                <p className="text-[11px] leading-relaxed text-ink-subtle">
                  Cửa hàng được hỗ trợ vận hành bằng hệ thống <strong>DịpXinh Atelier SaaS</strong> — giải pháp công nghệ định danh mã QR và quản lý thuê đồ thời trang.
                </p>
                <div className="pt-2">
                  <NavLink
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <span>Về Nền Tảng DịpXinh</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-subtle">
              <span>© {new Date().getFullYear()} {shop.name}. Tất cả các quyền được bảo lưu.</span>
              <span>Định danh thực thể vật lý & Vận hành đối soát minh bạch</span>
            </div>
          </div>
        </footer>

        {/* ── 6. MOBILE NAVIGATION BAR (Sticky Bottom) ── */}
        <nav
          aria-label="Điều hướng di động"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border-default grid grid-cols-4 h-14 px-1 shadow-lg"
        >
          <NavLink
            to={`/shop/${shop.slug}`}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium flex-1 h-full ${
                isActive ? 'text-primary font-semibold' : 'text-ink-muted'
              }`
            }
          >
            <Store className="w-4 h-4" />
            <span>Cửa hàng</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-ink-muted flex-1 h-full"
          >
            <Sparkles className="w-4 h-4" />
            <span>Danh mục</span>
          </button>

          <a
            href={`tel:${shop.phone}`}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-ink-muted flex-1 h-full"
          >
            <Phone className="w-4 h-4" />
            <span>Hotline</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-primary flex-1 h-full relative"
            aria-label={`Mở túi đồ (${totalCartItems})`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span>Túi đồ ({totalCartItems})</span>
          </button>
        </nav>

        {/* ── 7. GSAP-ANIMATED MOBILE CATEGORY DRAWER ── */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="fixed inset-0 z-50 flex justify-start"
            role="dialog"
            aria-modal="true"
            aria-label="Menu danh mục di động"
          >
            {/* Backdrop */}
            <div
              ref={mobileBackdropRef}
              onClick={handleCloseMobileMenu}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-out Panel */}
            <div
              ref={mobilePanelRef}
              className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-r border-border-default overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-default pb-4 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: shop.accentColor || '#713F4B' }}
                    >
                      {shop.name.charAt(0)}
                    </div>
                    <span className="font-sans text-base font-bold text-ink truncate">
                      {shop.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseMobileMenu}
                    className="shrink-0 p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
                    aria-label="Đóng menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2 px-1">
                    Danh Mục Bộ Sưu Tập
                  </span>
                  {navCategories.map((c) => (
                    <NavLink
                      key={c.id}
                      to={c.path}
                      onClick={handleCloseMobileMenu}
                      className="mobile-nav-stagger block px-3 py-2.5 rounded-lg text-sm text-ink hover:bg-surface-subtle font-medium transition-colors"
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-default space-y-2 text-xs text-ink-muted">
                <p>Hotline: <strong className="text-ink">{shop.phone}</strong></p>
                <p className="line-clamp-2">{shop.address}</p>
                <p className="text-[11px] text-ink-subtle pt-2">© {shop.name} • DịpXinh Atelier</p>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. GSAP-ANIMATED CART DRAWER (TÚI ĐỒ THUÊ ATELIER) ── */}
        {isCartDrawerOpen && (
          <div
            ref={cartDrawerRef}
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Túi đồ thuê Atelier"
          >
            {/* Backdrop */}
            <div
              ref={cartBackdropRef}
              onClick={handleCloseCart}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-in Panel */}
            <div
              ref={cartPanelRef}
              className="relative w-full sm:w-[460px] max-w-full bg-surface h-full shadow-2xl flex flex-col z-10 border-l border-border-default overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-border-default flex items-center justify-between bg-surface-subtle/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center text-primary">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-ink leading-snug">
                      Túi Đồ Thuê Atelier
                    </h2>
                    <p className="text-[11px] text-ink-muted">
                      {shop.name} • {totalCartItems} trang phục đã chọn
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCart}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
                  aria-label="Đóng túi đồ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {shopOrders.length === 0 ? (
                  <div className="cart-stagger-item py-16 text-center space-y-4 max-w-xs mx-auto">
                    <div className="w-16 h-16 rounded-full bg-surface-subtle border border-border-default flex items-center justify-center mx-auto text-ink-muted">
                      <ShoppingBag className="w-7 h-7 text-ink-subtle" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-ink">
                        Túi đồ thuê đang trống
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        Chưa có thiết kế nào được chọn giữ chỗ. Hãy khám phá bộ sưu tập và chọn "Thuê Đồ" để lên lịch!
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-2"
                      onClick={handleCloseCart}
                    >
                      Khám Phá Bộ Sưu Tập
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shopOrders.map((order, orderIdx) => (
                      <div
                        key={order.id || orderIdx}
                        className="cart-stagger-item p-4 rounded-xl border border-border-default bg-canvas/60 space-y-3"
                      >
                        {/* Order Sub-header */}
                        <div className="flex items-center justify-between pb-2 border-b border-border-default/60 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-ink">{order.code}</span>
                            <Badge
                              tone={
                                order.status === 'CONFIRMED'
                                  ? 'success'
                                  : order.status === 'HELD'
                                  ? 'info'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {order.status === 'CONFIRMED'
                                ? 'Đã xác nhận'
                                : order.status === 'HELD'
                                ? 'Đang giữ chỗ'
                                : 'Chờ duyệt'}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-ink-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-primary" />
                            {new Date(order.pickupDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2.5">
                          {order.items.map((item, itemIdx) => (
                            <div
                              key={item.id || itemIdx}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.productImage}
                                alt={item.productTitle}
                                className="w-14 h-18 object-cover rounded-lg border border-border-default shrink-0 bg-surface-subtle"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-ink truncate leading-snug">
                                  {item.productTitle}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5">
                                  <span>Size: <strong className="text-ink">{item.size}</strong></span>
                                  {item.color && <span>• {item.color}</span>}
                                  {item.assignedQrCode && (
                                    <span className="px-1.5 py-0.2 rounded bg-surface border border-border-default text-[10px] font-mono font-medium text-primary">
                                      {item.assignedQrCode}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-xs mt-1.5">
                                  <span className="font-medium text-primary">
                                    {item.rentalPrice.toLocaleString('vi-VN')} đ
                                  </span>
                                  <span className="text-[10px] text-ink-subtle">
                                    Cọc: {item.depositPrice.toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {shopOrders.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-border-default bg-surface-subtle/40 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Tổng phí thuê đồ:</span>
                      <span className="font-medium text-ink">
                        {shopOrders
                          .reduce((sum, o) => sum + (o.rentalTotal || 0), 0)
                          .toLocaleString('vi-VN')}{' '}
                        đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Tổng tiền cọc hoàn lại:</span>
                      <span className="font-medium text-ink">
                        {shopOrders
                          .reduce((sum, o) => sum + (o.depositRequired || 0), 0)
                          .toLocaleString('vi-VN')}{' '}
                        đ
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full shadow-xs"
                      onClick={() => {
                        handleCloseCart();
                        toast.success(
                          'Đơn thuê của bạn đã được ghi nhận vào hệ thống đối soát QR của cửa hàng!'
                        );
                      }}
                    >
                      Xác Nhận & Hoàn Tất Giữ Chỗ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleCloseCart}
                    >
                      Tiếp Tục Chọn Thêm Trang Phục
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};
