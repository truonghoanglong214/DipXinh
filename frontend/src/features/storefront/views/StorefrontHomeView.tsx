import React, { useState, useMemo, useRef } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Shop, Product, RentalOrder, RentalUnit } from '@/shared/model/domain';
import { demoStore } from '@/shared/demo/demo-store';
import {
  Button,
  Badge,
  Input,
  FormField,
  Select,
  Dialog,
  useToast,
} from '@/shared/components/ui';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  ArrowRight,
  Check,
  Search,
  Filter,
  ShoppingBag,
  Eye,
  Scissors,
  Heart,
  RefreshCw,
  ChevronRight,
  Info,
  CheckCircle2,
  CalendarDays,
  Sparkle,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

export const StorefrontHomeView: React.FC = () => {
  const { shop } = useOutletContext<{ shop: Shop }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Scoped animation refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const pdpModalRef = useRef<HTMLDivElement>(null);

  // Load products & rental units from demoStore
  const allProducts = demoStore.getState().products.filter((p) => p.shopId === shop.id);
  const allUnits = demoStore.getState().rentalUnits.filter((u) =>
    allProducts.some((p) => p.id === u.productId)
  );

  // Discovery & Filtering States
  const [discoveryMode, setDiscoveryMode] = useState<'ALL' | 'RENTAL' | 'SALE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Synchronize category and search query params from URL
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  React.useEffect(() => {
    if (!categoryParam || categoryParam === 'all') {
      setSelectedCategory('ALL');
    } else if (categoryParam === 'ao-dai') {
      setSelectedCategory('Áo Dài Cung Đình');
    } else if (categoryParam === 'da-hoi') {
      setSelectedCategory('Đầm Dạ Hội Cao Cấp');
    } else if (categoryParam === 'vay-cuoi') {
      setSelectedCategory('Váy Cưới Atelier');
    } else if (categoryParam === 'suit') {
      setSelectedCategory('Âu Phục & Veston');
    } else {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  React.useEffect(() => {
    if (queryParam !== null) {
      setLocalSearch(queryParam);
    }
  }, [queryParam]);

  // Interactive Product Detail & Rental Booking Modal (PDP Modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('2026-11-12');
  const [returnDate, setReturnDate] = useState<string>('2026-11-15');
  const [deliveryMethod, setDeliveryMethod] = useState<'STORE_PICKUP' | 'LOCAL_DELIVERY'>('STORE_PICKUP');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccessOrder, setBookingSuccessOrder] = useState<RentalOrder | null>(null);

  // Fitting Appointment Modal State
  const [isFittingOpen, setIsFittingOpen] = useState<boolean>(false);
  const [fitName, setFitName] = useState<string>('');
  const [fitPhone, setFitPhone] = useState<string>('');
  const [fitDate, setFitDate] = useState<string>('2026-11-14');
  const [fitSlot, setFitSlot] = useState<string>('10:00 - 11:30');
  const [fitProductTitle, setFitProductTitle] = useState<string>('');
  const [fitNotes, setFitNotes] = useState<string>('');

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [allProducts]);

  // Featured Crown Jewel Product
  const featuredProduct = useMemo(() => {
    return allProducts.find((p) => p.featured) || allProducts[0];
  }, [allProducts]);

  // Filtered & Sorted Product Collection
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Mode filter
        if (discoveryMode === 'RENTAL' && p.rentalPrice <= 0) return false;
        if (discoveryMode === 'SALE' && (!p.salePrice || p.salePrice <= 0)) return false;

        // Category filter
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

        // Search filter
        if (localSearch.trim()) {
          const q = localSearch.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.rentalPrice - b.rentalPrice;
        if (sortBy === 'price-desc') return b.rentalPrice - a.rentalPrice;
        return 0; // Default popular order
      });
  }, [allProducts, discoveryMode, selectedCategory, localSearch, sortBy]);

  // Open Product Modal
  const handleOpenProduct = (prod: Product, defaultMode: 'view' | 'rent' = 'view') => {
    setSelectedProduct(prod);
    setSelectedSize(prod.variants[0]?.size || 'M');
    setBookingSuccessOrder(null);
  };

  // Open Fitting Modal
  const handleOpenFitting = (productTitle?: string) => {
    if (productTitle) {
      setFitProductTitle(productTitle);
    }
    setIsFittingOpen(true);
  };

  // Listen for header appointment action
  React.useEffect(() => {
    const handler = () => setIsFittingOpen(true);
    window.addEventListener('open_fitting_modal', handler);
    return () => window.removeEventListener('open_fitting_modal', handler);
  }, []);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(pickupDate).getTime();
      const end = new Date(returnDate).getTime();
      const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
      return diff > 0 ? diff : 3;
    } catch {
      return 3;
    }
  }, [pickupDate, returnDate]);

  // Submit Rental Booking Request
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Vui lòng nhập họ tên và số điện thoại để liên hệ xác nhận đơn!');
      return;
    }

    const variant =
      selectedProduct.variants.find((v) => v.size === selectedSize) ||
      selectedProduct.variants[0];

    setIsSubmitting(true);

    try {
      const res = demoStore.createRentalOrder({
        shopId: shop.id,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: deliveryMethod === 'LOCAL_DELIVERY' ? 'TP. Hồ Chí Minh' : undefined,
        },
        items: [
          {
            productId: selectedProduct.id,
            variantId: variant.id,
            size: variant.size,
            color: variant.color,
          },
        ],
        pickupDate: `${pickupDate}T10:00:00Z`,
        returnDueDate: `${returnDate}T18:00:00Z`,
        deliveryMethod,
        returnMethod: deliveryMethod === 'LOCAL_DELIVERY' ? 'LOCAL_RETURN' : 'STORE_RETURN',
        notes: customerNotes.trim() || undefined,
      });

      if (res.success && res.order) {
        setBookingSuccessOrder(res.order);
        toast.success(
          `Đã tiếp nhận yêu cầu thuê "${selectedProduct.title}"! Nhân viên xưởng sẽ liên hệ trong 30 phút.`
        );
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi tạo đơn thuê');
      }
    } catch (err) {
      toast.error('Không thể hoàn tất đơn đặt đồ lúc này');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Fitting Appointment
  const handleSubmitFitting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fitName.trim() || !fitPhone.trim()) {
      toast.error('Vui lòng nhập họ tên và số điện thoại liên hệ!');
      return;
    }

    try {
      demoStore.createFitting({
        shopId: shop.id,
        customerName: fitName.trim(),
        customerPhone: fitPhone.trim(),
        date: fitDate,
        timeSlot: fitSlot,
        desiredProductTitle: fitProductTitle.trim() || undefined,
        notes: fitNotes.trim() || undefined,
      });

      setIsFittingOpen(false);
      setFitName('');
      setFitPhone('');
      setFitNotes('');
      toast.success(
        `Đã đặt lịch thử đồ thành công vào ngày ${fitDate} (${fitSlot}) tại ${shop.name}!`
      );
    } catch (err) {
      toast.error('Không thể ghi nhận lịch hẹn thử đồ');
    }
  };

  // ── GSAP ANIMATION 1 & 2: Hero Entrance & Staggered Content Animation ──
  useGSAP(
    () => {
      if (!heroSectionRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from('.hero-kicker-badge', {
          opacity: 0,
          y: -12,
          duration: 0.5,
          clearProps: 'transform,opacity',
        })
          .from(
            '.hero-headline',
            {
              opacity: 0,
              y: 28,
              duration: 0.75,
              clearProps: 'transform,opacity',
            },
            '-=0.3'
          )
          .from(
            '.hero-subcopy',
            {
              opacity: 0,
              y: 16,
              duration: 0.6,
              clearProps: 'transform,opacity',
            },
            '-=0.45'
          )
          .from(
            '.hero-action-btn',
            {
              opacity: 0,
              y: 14,
              stagger: 0.1,
              duration: 0.5,
              clearProps: 'transform,opacity',
            },
            '-=0.35'
          )
          .from(
            '.hero-trust-item',
            {
              opacity: 0,
              y: 12,
              stagger: 0.08,
              duration: 0.45,
              clearProps: 'transform,opacity',
            },
            '-=0.25'
          )
          .from(
            '.hero-atmosphere-pane',
            {
              opacity: 0,
              scale: 0.97,
              duration: 0.85,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            '-=0.7'
          )
          .from(
            '.hero-floating-badge',
            {
              opacity: 0,
              y: 20,
              duration: 0.55,
              clearProps: 'transform,opacity',
            },
            '-=0.4'
          );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.hero-kicker-badge',
            '.hero-headline',
            '.hero-subcopy',
            '.hero-action-btn',
            '.hero-trust-item',
            '.hero-atmosphere-pane',
            '.hero-floating-badge',
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
      });
    },
    { scope: heroSectionRef }
  );

  // ── GSAP ANIMATION 2: Featured Masterpiece Stagger ──
  useGSAP(
    () => {
      if (!featuredRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from('.featured-image-box', {
          opacity: 0,
          scale: 0.97,
          duration: 0.7,
          clearProps: 'transform,opacity',
        })
          .from(
            '.featured-content-stagger',
            {
              opacity: 0,
              x: 16,
              stagger: 0.08,
              duration: 0.55,
              clearProps: 'transform,opacity',
            },
            '-=0.45'
          );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.featured-image-box', '.featured-content-stagger'], {
          opacity: 1,
          x: 0,
          scale: 1,
        });
      });
    },
    { scope: featuredRef }
  );

  // ── GSAP ANIMATION 3: Subtle Product-Grid Reveal ──
  useGSAP(
    () => {
      if (!productGridRef.current) return;
      const cards = productGridRef.current.querySelectorAll('.product-card-item');
      if (!cards.length) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, y: 0 });
      });
    },
    { dependencies: [filteredProducts], scope: productGridRef }
  );

  // ── GSAP ANIMATION 4: Product Gallery Transition in Modal ──
  useGSAP(
    () => {
      if (!selectedProduct || !pdpModalRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from('.pdp-gallery-frame', {
          opacity: 0,
          scale: 0.96,
          duration: 0.45,
          clearProps: 'transform,opacity',
        })
          .from(
            '.pdp-stagger-field',
            {
              opacity: 0,
              y: 12,
              stagger: 0.04,
              duration: 0.35,
              clearProps: 'transform,opacity',
            },
            '-=0.25'
          );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.pdp-gallery-frame', '.pdp-stagger-field'], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
      });
    },
    { dependencies: [selectedProduct], scope: pdpModalRef }
  );

  return (
    <div className="space-y-16 sm:space-y-24 w-full overflow-hidden">
      {/* ──────────────────────────────────────────────────────────
          AREA 2: BOUTIQUE INTRODUCTION / HERO (EDITORIAL LOOKBOOK)
          ────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        aria-label="Giới thiệu xưởng may"
        className="relative rounded-3xl overflow-hidden border border-border-default bg-surface shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          {/* Editorial Copy Stage */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between space-y-6 sm:space-y-8 z-10">
            <div className="space-y-4 sm:space-y-5">
              {/* Season & Atelier Kicker */}
              <div className="hero-kicker-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-subtle border border-border-default text-xs font-medium text-ink-muted">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: shop.accentColor || '#713F4B' }}
                />
                <span className="font-semibold uppercase tracking-wider text-[11px] text-ink">
                  BỘ SƯU TẬP THU ĐÔNG ATELIER
                </span>
                <span className="text-ink-subtle">·</span>
                <span className="text-ink-muted">Haute Couture</span>
              </div>

              {/* Main Headline */}
              <h1 className="hero-headline font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-snug">
                Nghệ Thuật Lụa & Gấm Cung Đình Độc Bản
              </h1>

              {/* Sub-copy */}
              <p className="hero-subcopy text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
                {shop.description} Mỗi trang phục được định danh mã QR thực thể minh bạch, hấp sấy
                tiệt trùng y tế trước khi giao và chăm sóc tỉ mỉ theo tiêu chuẩn xưởng may đo cao cấp.
              </p>
            </div>

            {/* Action Row & Atelier Credentials */}
            <div className="space-y-6 pt-4 border-t border-border-default/60">
              <div className="flex flex-wrap items-center gap-3">
                <a href="#collection" className="hero-action-btn">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-sm"
                  >
                    Khám Phá Bộ Sưu Tập
                  </Button>
                </a>
                <div className="hero-action-btn">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<CalendarDays className="w-4 h-4 text-primary" />}
                    onClick={() => handleOpenFitting()}
                  >
                    Đặt Lịch Thử Đồ Tại Xưởng
                  </Button>
                </div>
              </div>

              {/* Trust Credentials */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-ink-muted">
                <div className="hero-trust-item flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5F] shrink-0" />
                  <span>100% Lụa Tự Nhiên</span>
                </div>
                <div className="hero-trust-item flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Định Danh Mã QR</span>
                </div>
                <div className="hero-trust-item flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Clock className="w-4 h-4 text-[#C2781E] shrink-0" />
                  <span>Hoàn Cọc Nhanh 2H</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Visual Atmosphere Canvas */}
          <div className="hero-atmosphere-pane lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-surface-subtle overflow-hidden">
            <img
              src={shop.bannerUrl || '/images/demo/hero-fashion-rental.jpg'}
              alt="Không gian thử đồ Atelier Lụa Vàng"
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface lg:via-transparent lg:to-transparent" />

            {/* Floating Atelier Badge */}
            <div className="hero-floating-badge absolute bottom-6 right-6 left-6 lg:left-auto lg:max-w-xs p-4 rounded-2xl bg-surface/95 backdrop-blur-md border border-border-default/80 shadow-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                <span>Không Gian Thử Đồ</span>
                <span className="text-primary font-bold">Quận 1, TP. HCM</span>
              </div>
              <p className="text-ink font-medium leading-snug">
                Phòng thử VIP riêng tư với stylist hỗ trợ cân chỉnh số đo hoàn hảo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          AREA 3: FEATURED CLOTHING COLLECTION (MASTERPIECE SPOTLIGHT)
          ────────────────────────────────────────────────────────── */}
      {featuredProduct && (
        <section ref={featuredRef} aria-labelledby="featured-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border-default pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block mb-1">
                KIỆT TÁC ATELIER NỔI BẬT
              </span>
              <h2 id="featured-heading" className="font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Thiết Kế Tiêu Biểu Mùa Lễ Hội
              </h2>
            </div>
            <span className="text-xs text-ink-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Chế tác thủ công bởi nghệ nhân may đo</span>
            </span>
          </div>

          <div className="rounded-3xl border border-border-default bg-surface overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Signature Garment Photography */}
            <div className="featured-image-box lg:col-span-5 relative bg-surface-subtle overflow-hidden flex items-center justify-center p-6 sm:p-10 group">
              <div className="relative aspect-3/4 w-full max-w-sm rounded-2xl overflow-hidden shadow-md">
                <img
                  src={featuredProduct.images[0] || '/images/demo/product-silk-aodai.jpg'}
                  alt={featuredProduct.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <Badge tone="warning" styleVariant="solid" size="sm">
                    Độc Bản Atelier
                  </Badge>
                  <span className="px-2 py-0.5 rounded-md bg-surface/90 backdrop-blur-md text-[10px] font-mono font-bold text-ink border border-border-default">
                    QR: DX-AT-01
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Craft Story & Transparent Pricing */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="featured-content-stagger flex items-center gap-2 text-xs font-medium text-ink-muted">
                  <Badge tone="primary" styleVariant="soft" size="sm">
                    {featuredProduct.category}
                  </Badge>
                  <span>·</span>
                  <span>Định danh thực thể vật lý</span>
                </div>

                <h3 className="featured-content-stagger font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  {featuredProduct.title}
                </h3>

                <p className="featured-content-stagger text-sm text-ink-muted leading-relaxed">
                  {featuredProduct.description}
                </p>

                {/* Craftsmanship Specs Grid */}
                <div className="featured-content-stagger grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/80">
                    <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                      Chất Liệu Vải
                    </span>
                    <span className="text-xs font-semibold text-ink mt-0.5 block">
                      Lụa tơ tằm dệt tay
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/80">
                    <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                      Size Sẵn Có
                    </span>
                    <span className="text-xs font-semibold text-ink mt-0.5 block">
                      {featuredProduct.variants.map((v) => v.size).join(', ')} (Form chuẩn)
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default/80">
                    <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                      Kèm Theo
                    </span>
                    <span className="text-xs font-semibold text-ink mt-0.5 block">
                      Quạt lụa & Mấn đội đầu
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown & CTAs */}
              <div className="featured-content-stagger pt-6 border-t border-border-default space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block">
                      Giá Thuê 3 Ngày
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-primary tabular-nums block mt-0.5">
                      {featuredProduct.rentalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block">
                      Tiền Cọc Đối Soát
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-ink tabular-nums block mt-0.5">
                      {featuredProduct.depositPrice.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="text-[10px] text-ink-subtle">Hoàn 100% khi trả đồ</span>
                  </div>
                  {featuredProduct.salePrice && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block">
                        May Đo Sở Hữu
                      </span>
                      <span className="text-lg font-semibold text-ink tabular-nums block mt-0.5">
                        {featuredProduct.salePrice.toLocaleString('vi-VN')} ₫
                      </span>
                      <span className="text-[10px] text-ink-subtle">May theo số đo riêng</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={() => handleOpenProduct(featuredProduct, 'rent')}
                  >
                    Thuê Trang Phục Này
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<Calendar className="w-4 h-4 text-primary" />}
                    onClick={() => handleOpenFitting(featuredProduct.title)}
                  >
                    Hẹn Lịch Thử Áo Này
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          AREA 4: RENTAL AND PURCHASE DISCOVERY TOOLBAR
          ────────────────────────────────────────────────────────── */}
      <section id="collection" aria-label="Bộ lọc bộ sưu tập" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border-default pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block mb-1">
              DANH MỤC TRANG PHỤC ATELIER
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Khám Phá Toàn Bộ Bộ Sưu Tập
            </h2>
          </div>
          <span className="text-xs text-ink-muted">
            Hiển thị <strong className="text-ink font-semibold">{filteredProducts.length}</strong> thiết kế sẵn sàng tại xưởng
          </span>
        </div>

        {/* Discovery Dual-Mode Filter Controls */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
          {/* Top Row: Service Mode Toggles + Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Mode Pills: Rental vs Sale */}
            <div className="w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <div className="inline-flex p-1 rounded-xl bg-surface-subtle border border-border-default min-w-max">
                <button
                  type="button"
                  onClick={() => setDiscoveryMode('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    discoveryMode === 'ALL'
                      ? 'bg-surface text-ink shadow-xs border border-border-default'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Tất Cả Mẫu Mã
                </button>
                <button
                  type="button"
                  onClick={() => setDiscoveryMode('RENTAL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    discoveryMode === 'RENTAL'
                      ? 'bg-surface text-ink shadow-xs border border-border-default'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Cho Thuê Sự Kiện (3-7 Ngày)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscoveryMode('SALE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    discoveryMode === 'SALE'
                      ? 'bg-surface text-ink shadow-xs border border-border-default'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  May Đo Sở Hữu
                </button>
              </div>
            </div>

            {/* In-Collection Search Input */}
            <div className="w-full md:w-72">
              <Input
                sizeVariant="sm"
                placeholder="Tìm kiếm theo tên hoặc chất liệu..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          {/* Bottom Row: Category Filter Chips & Sort Select */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border-default/70 w-full min-w-0">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full min-w-0 max-w-full">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-primary" /> Phân loại:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'bg-surface-subtle text-ink-muted hover:text-ink hover:bg-border-default/50'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-ink-muted">Sắp xếp:</span>
              <div className="w-44">
                <Select
                  sizeVariant="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  options={[
                    { value: 'popular', label: 'Thiết kế nổi bật' },
                    { value: 'price-asc', label: 'Giá thuê: Thấp → Cao' },
                    { value: 'price-desc', label: 'Giá thuê: Cao → Thấp' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            AREA 5: BOUTIQUE PRODUCT CARDS GRID
            ────────────────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-border-default bg-surface/50 text-center space-y-3">
            <Tag className="w-8 h-8 text-ink-muted mx-auto stroke-[1.25]" />
            <h3 className="text-base font-semibold text-ink">Không tìm thấy thiết kế phù hợp</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để xem thêm trang phục sẵn có tại xưởng.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('ALL');
                setDiscoveryMode('ALL');
                setLocalSearch('');
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        ) : (
          <div ref={productGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <article
                key={prod.id}
                className="product-card-item group rounded-2xl border border-border-default bg-surface overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Aspect 3:4 High-Fashion Portrait Image */}
                  <div
                    className="relative aspect-3/4 bg-surface-subtle overflow-hidden cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:ring-inset"
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem chi tiết trang phục ${prod.title}`}
                    onClick={() => handleOpenProduct(prod)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenProduct(prod);
                      }
                    }}
                  >
                    <img
                      src={prod.images[0] || '/images/demo/product-emerald-gown.jpg'}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                      <Badge tone="primary" styleVariant="solid" size="sm">
                        {prod.category}
                      </Badge>
                      {prod.featured && (
                        <Badge tone="warning" styleVariant="soft" size="sm">
                          Tiêu biểu
                        </Badge>
                      )}
                    </div>

                    {/* Stock/Readiness Indicator */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-[10px] font-semibold text-ink border border-border-default/80 flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5F]" />
                        Mới 98% · Sẵn sàng
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-[10px] font-mono font-medium text-ink-muted border border-border-default/80">
                        QR Active
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-5 space-y-2.5">
                    <h3
                      className="font-medium text-base text-ink leading-snug line-clamp-1 group-hover:text-primary transition-colors cursor-pointer focus:outline-hidden focus:underline"
                      role="button"
                      tabIndex={0}
                      aria-label={`Xem chi tiết ${prod.title}`}
                      onClick={() => handleOpenProduct(prod)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenProduct(prod);
                        }
                      }}
                    >
                      {prod.title}
                    </h3>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Size & Fabric Metadata */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default/60 text-[11px] font-medium text-ink">
                        <Tag className="w-3 h-3 text-primary" />
                        Size: {prod.variants.map((v) => v.size).join(', ')}
                      </span>
                      <span className="text-ink-subtle">·</span>
                      <span className="text-[11px] truncate">Lụa tơ tằm thượng hạng</span>
                    </div>
                  </div>
                </div>

                {/* Card Pricing Footer & Action */}
                <div className="p-5 pt-3 border-t border-border-default/70 mt-2 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                        Giá thuê 3 ngày
                      </span>
                      <span className="text-base font-bold text-ink tabular-nums block">
                        {prod.rentalPrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-ink-muted block">
                        Tiền cọc đối soát
                      </span>
                      <span className="text-xs font-semibold text-ink-muted tabular-nums block">
                        {prod.depositPrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenProduct(prod, 'view')}
                    >
                      Chi Tiết
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenProduct(prod, 'rent')}
                    >
                      Thuê Đồ
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          AREA 6: ATELIER SERVICE STANDARDS & VISIT INFORMATION
          ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="standards-heading" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary block">
            TIÊU CHUẨN XƯỞNG MAY
          </span>
          <h2 id="standards-heading" className="font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Cam Kết Dịch Vụ & Chăm Sóc Trang Phục
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Mỗi lượt thuê đồ là một trải nghiệm trọn vẹn từ chất liệu tinh xảo đến sự an tâm tuyệt đối về vệ sinh và hoàn cọc minh bạch.
          </p>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-ink">Hấp Sấy & Khử Khuẩn Y Tế</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Toàn bộ trang phục được khử khuẩn bằng hơi nước nhiệt độ cao và bảo quản trong bao áo lụa chống bụi trước khi giao đến tay bạn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-ink">Thử Đồ & Chỉnh Số Đo</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Trải nghiệm thử đồ trực tiếp cùng stylist riêng tại xưởng may; hỗ trợ cân chỉnh tà và eo tạm thời mà không ảnh hưởng dáng áo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-ink">Định Danh QR Minh Bạch</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Mỗi sản phẩm thực thể được gắn mã QR duy nhất, ghi lại lịch sử bảo dưỡng và tình trạng vải rõ ràng, tránh tranh chấp cọc đồ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-ink">Hoàn Cọc Trong 2 Giờ</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Quy trình kiểm tra nhận đồ nhanh chóng trong 15 phút. Tiền cọc được hoàn trả 100% qua chuyển khoản ngân hàng ngay khi hoàn tất.
            </p>
          </div>
        </div>

        {/* Studio Visit & Appointment Prompt Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-border-default bg-surface-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
              GHÉ THĂM XƯỞNG MAY TRỰC TIẾP
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-ink">
              Trải Nghiệm Thử Đồ Tại {shop.name}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Địa chỉ: <strong className="text-ink">{shop.address}</strong>. Mở cửa từ 09:00 đến 21:00 hàng ngày.
              Stylist xưởng luôn sẵn sàng đón tiếp và tư vấn trang phục phù hợp nhất cho sự kiện của bạn.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={() => handleOpenFitting()}
            className="shrink-0 shadow-sm"
          >
            Đặt Lịch Hẹn Ngay
          </Button>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          INTERACTIVE PRODUCT DETAIL & BOOKING MODAL (PDP DIALOG)
          ────────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <Dialog
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setBookingSuccessOrder(null);
          }}
          maxWidth="2xl"
          title={
            <div className="flex items-center gap-2">
              <Badge tone="primary" styleVariant="soft" size="sm">
                {selectedProduct.category}
              </Badge>
              <span className="text-base font-semibold text-ink truncate">
                {selectedProduct.title}
              </span>
            </div>
          }
          description="Thông tin chi tiết thiết kế, quy chuẩn chọn size và đặt lịch giữ chỗ"
        >
          {bookingSuccessOrder ? (
            /* Booking Success Receipt Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EAF5F0] text-[#1E5844] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-ink">
                  Đã Gửi Yêu Cầu Thuê Thành Công!
                </h4>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Mã đơn thuê của bạn là{' '}
                  <strong className="font-mono text-primary font-bold">
                    {bookingSuccessOrder.code || bookingSuccessOrder.id.toUpperCase()}
                  </strong>
                  . Nhân viên xưởng may {shop.name} sẽ gọi điện xác nhận trong vòng 30 phút.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle border border-border-default text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Khách hàng:</span>
                  <span className="font-medium text-ink">{customerName} ({customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Thời gian thuê:</span>
                  <span className="font-medium text-ink">{pickupDate} → {returnDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Tiền thuê 3 ngày:</span>
                  <span className="font-medium text-ink tabular-nums">{selectedProduct.rentalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between border-t border-border-default pt-2">
                  <span className="text-ink-muted">Cọc hoàn lại khi trả đồ:</span>
                  <span className="font-semibold text-ink tabular-nums">{selectedProduct.depositPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setSelectedProduct(null);
                  setBookingSuccessOrder(null);
                }}
              >
                Hoàn Tất & Tiếp Tục Xem Đồ
              </Button>
            </div>
          ) : (
            /* Main PDP & Booking Screen */
            <div ref={pdpModalRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Garment Visual & QR Stamp */}
              <div className="pdp-gallery-frame md:col-span-5 space-y-3">
                <div className="relative aspect-3/4 rounded-xl bg-surface-subtle overflow-hidden border border-border-default">
                  <img
                    src={selectedProduct.images[0] || '/images/demo/product-emerald-gown.jpg'}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-surface/90 backdrop-blur-sm text-[10px] font-mono font-semibold text-ink border border-border-default">
                    QR ID: DX-EM-01
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle border border-border-default text-xs space-y-1.5 text-ink-muted">
                  <div className="flex items-center gap-1.5 font-medium text-ink">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D5F]" />
                    <span>Chứng chỉ vệ sinh xưởng</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Đã hấp sấy khử khuẩn y tế nhiệt độ cao và kiểm định độ bền đường may.
                  </p>
                </div>
              </div>

              {/* Right Column: Specifications & Booking Form */}
              <div className="md:col-span-7 space-y-5">
                <div className="pdp-stagger-field">
                  <h4 className="font-sans text-xl font-bold text-ink leading-snug">
                    {selectedProduct.title}
                  </h4>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Size Selection */}
                <div className="pdp-stagger-field space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-ink">Chọn Kích Thước (Size)</label>
                    <span className="text-[11px] text-ink-muted">Bảng size may đo chuẩn Việt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedSize(v.size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSize === v.size
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-surface text-ink border-border-default hover:border-ink-muted'
                        }`}
                      >
                        Size {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Form Inputs */}
                <form onSubmit={handleSubmitBooking} className="pdp-stagger-field space-y-4 pt-2 border-t border-border-default">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Ngày Nhận Đồ" required>
                      <Input
                        type="date"
                        sizeVariant="sm"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label="Ngày Trả Đồ" required>
                      <Input
                        type="date"
                        sizeVariant="sm"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Họ và Tên" required>
                      <Input
                        sizeVariant="sm"
                        placeholder="Nguyễn Thị Mai..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </FormField>
                    <FormField label="Số Điện Thoại" required>
                      <Input
                        sizeVariant="sm"
                        placeholder="0908 123 456"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  {/* Delivery Method Selection */}
                  <FormField label="Hình Thức Nhận Trang Phục">
                    <Select
                      sizeVariant="sm"
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                      options={[
                        { value: 'STORE_PICKUP', label: `Đến thử và nhận tại xưởng (${shop.address})` },
                        { value: 'LOCAL_DELIVERY', label: 'Giao hỏa tốc tận nơi có bảo hiểm cọc (Nội thành HCM)' },
                      ]}
                    />
                  </FormField>

                  {/* Pricing Breakdown Card */}
                  <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-ink-muted">
                      <span>Tiền thuê ({rentalDays} ngày):</span>
                      <span className="font-medium text-ink tabular-nums">
                        {selectedProduct.rentalPrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-ink-muted">
                      <span className="flex items-center gap-1">
                        Tiền cọc đảm bảo:
                        <Info className="w-3 h-3 text-ink-subtle" />
                      </span>
                      <span className="font-medium text-ink tabular-nums">
                        {selectedProduct.depositPrice.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border-default/80 pt-1.5 text-ink font-semibold">
                      <span>Tổng thanh toán tạm tính:</span>
                      <span className="text-sm font-bold text-primary tabular-nums">
                        {(selectedProduct.rentalPrice + selectedProduct.depositPrice).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-subtle block italic">
                      * Tiền cọc được hoàn lại 100% qua tài khoản ngân hàng ngay khi hoàn tất kiểm tra trả đồ.
                    </span>
                  </div>

                  {/* Form Submission CTAs */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenFitting(selectedProduct.title)}
                    >
                      Hẹn Thử Đồ Trước
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isSubmitting}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {isSubmitting ? 'Đang Xử Lý...' : 'Gửi Yêu Cầu Thuê Đồ'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Dialog>
      )}

      {/* ──────────────────────────────────────────────────────────
          INTERACTIVE FITTING APPOINTMENT DIALOG
          ────────────────────────────────────────────────────────── */}
      <Dialog
        isOpen={isFittingOpen}
        onClose={() => setIsFittingOpen(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>Đặt Lịch Thử Đồ Tại Xưởng May</span>
          </div>
        }
        description={`Trải nghiệm không gian thử đồ riêng tư cùng stylist tại ${shop.name}`}
      >
        <form onSubmit={handleSubmitFitting} className="space-y-4 pt-2">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-default text-xs space-y-1">
            <span className="font-semibold text-ink flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {shop.address}
            </span>
            <span className="text-ink-muted block">
              Giờ phục vụ: 09:00 - 21:00 hàng ngày · Hotline: {shop.phone}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Họ và Tên" required>
              <Input
                placeholder="Nguyễn Thùy Dương..."
                value={fitName}
                onChange={(e) => setFitName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Số Điện Thoại" required>
              <Input
                placeholder="0912 345 678"
                value={fitPhone}
                onChange={(e) => setFitPhone(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ngày Hẹn Thử" required>
              <Input
                type="date"
                value={fitDate}
                onChange={(e) => setFitDate(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Khung Giờ" required>
              <Select
                value={fitSlot}
                onChange={(e) => setFitSlot(e.target.value)}
                options={[
                  { value: '09:30 - 10:30', label: '09:30 - 10:30 (Sáng)' },
                  { value: '11:00 - 12:00', label: '11:00 - 12:00 (Trưa)' },
                  { value: '14:30 - 15:30', label: '14:30 - 15:30 (Chiều)' },
                  { value: '16:30 - 17:30', label: '16:30 - 17:30 (Chiều muộn)' },
                  { value: '18:30 - 19:30', label: '18:30 - 19:30 (Tối)' },
                ]}
              />
            </FormField>
          </div>

          <FormField label="Mẫu Trang Phục Muốn Thử (Nếu có)">
            <Input
              placeholder="VD: Áo Dài Thêu Chỉ Vàng Hoàng Triều..."
              value={fitProductTitle}
              onChange={(e) => setFitProductTitle(e.target.value)}
            />
          </FormField>

          <FormField label="Ghi Chú Thêm (Số đo chiều cao, cân nặng...)">
            <Input
              placeholder="Cao 1m65, nặng 50kg, thử cho tiệc cưới..."
              value={fitNotes}
              onChange={(e) => setFitNotes(e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
            <Button type="button" variant="ghost" onClick={() => setIsFittingOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Xác Nhận Đặt Lịch
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
