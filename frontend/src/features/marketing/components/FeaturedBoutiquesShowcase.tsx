import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button, Badge } from '@/shared/components/ui';
import {
  Sparkles,
  Store,
  Star,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Eye,
  CheckCircle2,
  CalendarCheck,
  Flame,
  Award,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

export interface ShowcaseItem {
  name: string;
  image: string;
  price: string;
  qrSerial: string;
  tag: string;
}

export interface FeaturedBoutique {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  occasion: 'Dạ Tiệc & Sự Kiện' | 'Đám Cưới & Phù Dâu' | 'Áo Dài Truyền Thống' | 'Chụp Ảnh Kỷ Yếu';
  categoryLabel: string;
  rating: number;
  rentalsCount: number;
  location: string;
  showroomImage: string;
  featuredItems: ShowcaseItem[];
}

const FEATURED_BOUTIQUES: FeaturedBoutique[] = [
  {
    id: 'boutique-1',
    name: 'Aurora Atelier Dạ Hội',
    slug: 'lua-vang',
    tagline: 'Thời trang dạ tiệc nhung tuyết & lụa tơ tằm thượng hạng cho sự kiện thảm đỏ',
    occasion: 'Dạ Tiệc & Sự Kiện',
    categoryLabel: 'Váy Dạ Hội & Cocktail',
    rating: 4.96,
    rentalsCount: 284,
    location: 'Quận 1, TP. Hồ Chí Minh',
    showroomImage: '/images/demo/hero-fashion-rental.jpg',
    featuredItems: [
      {
        name: 'Đầm Dạ Hội Lụa Emerald Silk',
        image: '/images/demo/product-emerald-gown.jpg',
        price: '650.000đ / 3 ngày',
        qrSerial: 'DX-EM-01',
        tag: 'Hot Pick',
      },
      {
        name: 'Đầm Nhung Velvet Midnight Noir',
        image: '/images/demo/product-velvet-dress.jpg',
        price: '720.000đ / 3 ngày',
        qrSerial: 'DX-VN-02',
        tag: 'Cao Cấp',
      },
      {
        name: 'Váy Tiệc Đính Đá Sparkling Glam',
        image: '/images/demo/hero-fashion-rental.jpg',
        price: '850.000đ / 3 ngày',
        qrSerial: 'DX-SG-03',
        tag: 'Thiết Kế',
      },
    ],
  },
  {
    id: 'boutique-2',
    name: 'Tiệm Váy Cưới Ánh Trăng',
    slug: 'maison-soie',
    tagline: 'Chuyên váy cưới thiết kế công chúa bồng xòe & váy dạ tiệc đính kết pha lê',
    occasion: 'Đám Cưới & Phù Dâu',
    categoryLabel: 'Váy Cưới & Cô Dâu',
    rating: 5.0,
    rentalsCount: 198,
    location: 'Quận 3, TP. Hồ Chí Minh',
    showroomImage: '/images/demo/product-silk-aodai.jpg',
    featuredItems: [
      {
        name: 'Váy Cưới Giọt Sương Pha Lê',
        image: '/images/demo/hero-fashion-rental.jpg',
        price: '1.200.000đ / 3 ngày',
        qrSerial: 'DX-AT-01',
        tag: 'Best Seller',
      },
      {
        name: 'Đầm Dạ Hội Công Chúa Cúp Ngực',
        image: '/images/demo/product-emerald-gown.jpg',
        price: '890.000đ / 3 ngày',
        qrSerial: 'DX-AT-02',
        tag: 'Xu Hướng',
      },
      {
        name: 'Váy Phù Dâu Nhã Lam Pastel',
        image: '/images/demo/product-velvet-dress.jpg',
        price: '480.000đ / 3 ngày',
        qrSerial: 'DX-AT-03',
        tag: 'Combo Ưu Đãi',
      },
    ],
  },
  {
    id: 'boutique-3',
    name: 'Maison De Soie Hà Đông',
    slug: 'maison-soie',
    tagline: 'Tinh hoa lụa tơ tằm tự nhiên Vạn Phúc dệt thủ công theo lối hoàng cung triều Nguyễn',
    occasion: 'Áo Dài Truyền Thống',
    categoryLabel: 'Áo Dài Cung Đình',
    rating: 4.94,
    rentalsCount: 342,
    location: 'Hoàn Kiếm, Hà Nội',
    showroomImage: '/images/demo/product-silk-aodai.jpg',
    featuredItems: [
      {
        name: 'Áo Dài Gấm Tơ Sen Cung Đình',
        image: '/images/demo/product-silk-aodai.jpg',
        price: '600.000đ / 3 ngày',
        qrSerial: 'DX-MS-01',
        tag: 'Di Sản',
      },
      {
        name: 'Áo Dài Thêu Chỉ Vàng Hoàng Triều',
        image: '/images/demo/product-silk-aodai.jpg',
        price: '750.000đ / 3 ngày',
        qrSerial: 'DX-MS-02',
        tag: 'Thủ Công',
      },
      {
        name: 'Áo Dài Phù Dâu Tơ Óng Ngọc',
        image: '/images/demo/hero-fashion-rental.jpg',
        price: '450.000đ / 3 ngày',
        qrSerial: 'DX-MS-03',
        tag: 'Bộ 6 Áo',
      },
    ],
  },
  {
    id: 'boutique-4',
    name: 'Bella Bridal Parisienne',
    slug: 'lua-vang',
    tagline: 'Váy dạ hội satin tối giản sang trọng phong cách Parisienne quyến rũ',
    occasion: 'Đám Cưới & Phù Dâu',
    categoryLabel: 'Dạ Hội & Lễ Cưới',
    rating: 4.89,
    rentalsCount: 176,
    location: 'Hải Châu, Đà Nẵng',
    showroomImage: '/images/demo/product-emerald-gown.jpg',
    featuredItems: [
      {
        name: 'Đầm Lụa Cổ Yếm Champagne',
        image: '/images/demo/product-velvet-dress.jpg',
        price: '680.000đ / 3 ngày',
        qrSerial: 'DX-BB-01',
        tag: 'Minimalist',
      },
      {
        name: 'Váy Dạ Hội Đuôi Cá Nhũ Bạc',
        image: '/images/demo/hero-fashion-rental.jpg',
        price: '820.000đ / 3 ngày',
        qrSerial: 'DX-BB-02',
        tag: 'Thảm Đỏ',
      },
      {
        name: 'Đầm Satin Draping Lệch Vai',
        image: '/images/demo/product-emerald-gown.jpg',
        price: '710.000đ / 3 ngày',
        qrSerial: 'DX-BB-03',
        tag: 'Paris Look',
      },
    ],
  },
  {
    id: 'boutique-5',
    name: 'Heritage Kỷ Yếu & Cổ Phục',
    slug: 'lua-vang',
    tagline: 'Chuyên Việt Phục ngũ thân, Nhật Bình & âu phục thanh lịch chụp ảnh kỷ yếu thanh xuân',
    occasion: 'Chụp Ảnh Kỷ Yếu',
    categoryLabel: 'Việt Phục & Cử Nhân',
    rating: 4.92,
    rentalsCount: 420,
    location: 'Cầu Giấy, Hà Nội',
    showroomImage: '/images/demo/product-silk-aodai.jpg',
    featuredItems: [
      {
        name: 'Áo Nhật Bình Thêu Phượng Hoàng',
        image: '/images/demo/product-silk-aodai.jpg',
        price: '550.000đ / 3 ngày',
        qrSerial: 'DX-NB-01',
        tag: 'Cổ Phục',
      },
      {
        name: 'Áo Tấc Ngũ Thân Tay Chẽn',
        image: '/images/demo/product-emerald-gown.jpg',
        price: '420.000đ / 3 ngày',
        qrSerial: 'DX-NT-02',
        tag: 'Kỷ Yếu',
      },
      {
        name: 'Vest Cổ Điển Oxford Nam/Nữ',
        image: '/images/demo/product-velvet-dress.jpg',
        price: '380.000đ / 3 ngày',
        qrSerial: 'DX-VO-03',
        tag: 'Thanh Xuân',
      },
    ],
  },
  {
    id: 'boutique-6',
    name: 'Nocturne Velvet Gala',
    slug: 'maison-soie',
    tagline: 'Bộ sưu tập đầm nhung tơ Bordeaux & Sapphire quyền quý cho tiệc cocktail cuối năm',
    occasion: 'Dạ Tiệc & Sự Kiện',
    categoryLabel: 'Nhung Tơ & Gala',
    rating: 4.97,
    rentalsCount: 215,
    location: 'Tây Hồ, Hà Nội',
    showroomImage: '/images/demo/product-velvet-dress.jpg',
    featuredItems: [
      {
        name: 'Đầm Nhung Bordeaux Hoàng Gia',
        image: '/images/demo/product-velvet-dress.jpg',
        price: '790.000đ / 3 ngày',
        qrSerial: 'DX-NV-01',
        tag: 'Gala Night',
      },
      {
        name: 'Váy Cúp Ngực Xẻ Tà Sapphire',
        image: '/images/demo/product-emerald-gown.jpg',
        price: '840.000đ / 3 ngày',
        qrSerial: 'DX-NV-02',
        tag: 'Quyến Rũ',
      },
      {
        name: 'Đầm Dạ Hội Ren Pháp Đính Hạt',
        image: '/images/demo/hero-fashion-rental.jpg',
        price: '920.000đ / 3 ngày',
        qrSerial: 'DX-NV-03',
        tag: 'Haute Couture',
      },
    ],
  },
];

// Lookbook ribbons datasets (3:4 magazine ratio)
const RIBBON_ROW_TOP = [
  {
    name: 'Đầm Dạ Hội Emerald Silk',
    boutique: 'Aurora Atelier',
    slug: 'lua-vang',
    category: 'Váy Dạ Hội',
    price: '650.000đ / 3 ngày',
    image: '/images/demo/product-emerald-gown.jpg',
    qr: 'DX-EM-01',
  },
  {
    name: 'Váy Cưới Giọt Sương Pha Lê',
    boutique: 'Tiệm Váy Ánh Trăng',
    slug: 'maison-soie',
    category: 'Váy Cưới',
    price: '1.200.000đ / 3 ngày',
    image: '/images/demo/hero-fashion-rental.jpg',
    qr: 'DX-AT-01',
  },
  {
    name: 'Đầm Nhung Midnight Noir',
    boutique: 'Nocturne Velvet',
    slug: 'maison-soie',
    category: 'Đầm Nhung Tiệc',
    price: '720.000đ / 3 ngày',
    image: '/images/demo/product-velvet-dress.jpg',
    qr: 'DX-VN-02',
  },
  {
    name: 'Váy Satin Cổ Yếm Champagne',
    boutique: 'Bella Bridal',
    slug: 'lua-vang',
    category: 'Dạ Hội Minimalist',
    price: '680.000đ / 3 ngày',
    image: '/images/demo/hero-fashion-rental.jpg',
    qr: 'DX-BB-01',
  },
  {
    name: 'Đầm Dạ Hội Xẻ Tà Sapphire',
    boutique: 'Aurora Atelier',
    slug: 'lua-vang',
    category: 'Váy Dạ Hội',
    price: '840.000đ / 3 ngày',
    image: '/images/demo/product-emerald-gown.jpg',
    qr: 'DX-NV-02',
  },
];

const RIBBON_ROW_BOTTOM = [
  {
    name: 'Áo Dài Gấm Tơ Sen Cung Đình',
    boutique: 'Maison De Soie',
    slug: 'maison-soie',
    category: 'Áo Dài Di Sản',
    price: '600.000đ / 3 ngày',
    image: '/images/demo/product-silk-aodai.jpg',
    qr: 'DX-MS-01',
  },
  {
    name: 'Áo Nhật Bình Thêu Phượng Hoàng',
    boutique: 'Heritage Studio',
    slug: 'lua-vang',
    category: 'Việt Phục Kỷ Yếu',
    price: '550.000đ / 3 ngày',
    image: '/images/demo/product-silk-aodai.jpg',
    qr: 'DX-NB-01',
  },
  {
    name: 'Áo Dài Thêu Chỉ Vàng Triều Nguyễn',
    boutique: 'Maison De Soie',
    slug: 'maison-soie',
    category: 'Áo Dài Thủ Công',
    price: '750.000đ / 3 ngày',
    image: '/images/demo/product-silk-aodai.jpg',
    qr: 'DX-MS-02',
  },
  {
    name: 'Áo Tấc Ngũ Thân Tay Chẽn',
    boutique: 'Heritage Studio',
    slug: 'lua-vang',
    category: 'Cổ Phục Thanh Xuân',
    price: '420.000đ / 3 ngày',
    image: '/images/demo/hero-fashion-rental.jpg',
    qr: 'DX-NT-02',
  },
  {
    name: 'Áo Dài Phù Dâu Pastel Lam',
    boutique: 'Ánh Trăng Atelier',
    slug: 'maison-soie',
    category: 'Áo Dài Cưới Hỏi',
    price: '450.000đ / 3 ngày',
    image: '/images/demo/product-silk-aodai.jpg',
    qr: 'DX-MS-03',
  },
];

const OCCASIONS = [
  'Tất Cả',
  'Dạ Tiệc & Sự Kiện',
  'Đám Cưới & Phù Dâu',
  'Áo Dài Truyền Thống',
  'Chụp Ảnh Kỷ Yếu',
] as const;

export const FeaturedBoutiquesShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeTrack1Ref = useRef<HTMLDivElement>(null);
  const marqueeTrack2Ref = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const [activeOccasion, setActiveOccasion] = useState<string>('Tất Cả');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  // Drag & Inertia state for Carousel
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);

  // Filtered boutiques based on Occasion tab
  const filteredBoutiques =
    activeOccasion === 'Tất Cả'
      ? FEATURED_BOUTIQUES
      : FEATURED_BOUTIQUES.filter((b) => b.occasion === activeOccasion);

  // ─────────────────────────────────────────────────────────────
  // ── GSAP 1: DUAL-DIRECTION INFINITE PARALLAX RIBBON ──
  // ─────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const track1 = marqueeTrack1Ref.current;
      const track2 = marqueeTrack2Ref.current;
      if (!track1 || !track2) return;

      // Track 1: Trượt liên tục từ Phải sang Trái (xPercent: 0 -> -50)
      const tween1 = gsap.fromTo(
        track1,
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: 'none',
          duration: 26,
          repeat: -1,
        }
      );

      // Track 2: Trượt liên tục từ Trái sang Phải (xPercent: -50 -> 0)
      const tween2 = gsap.fromTo(
        track2,
        { xPercent: -50 },
        {
          xPercent: 0,
          ease: 'none',
          duration: 30,
          repeat: -1,
        }
      );

      // Hover interaction: Decelerate smoothly from timeScale: 1 down to timeScale: 0.15
      const handleMouseEnter1 = () => gsap.to(tween1, { timeScale: 0.15, duration: 0.6, ease: 'power2.out' });
      const handleMouseLeave1 = () => gsap.to(tween1, { timeScale: 1.0, duration: 0.6, ease: 'power2.out' });
      const handleMouseEnter2 = () => gsap.to(tween2, { timeScale: 0.15, duration: 0.6, ease: 'power2.out' });
      const handleMouseLeave2 = () => gsap.to(tween2, { timeScale: 1.0, duration: 0.6, ease: 'power2.out' });

      track1.addEventListener('mouseenter', handleMouseEnter1);
      track1.addEventListener('mouseleave', handleMouseLeave1);
      track2.addEventListener('mouseenter', handleMouseEnter2);
      track2.addEventListener('mouseleave', handleMouseLeave2);

      // Auto-pause when user leaves tab to save battery and GPU
      const handleVisibilityChange = () => {
        if (document.hidden) {
          tween1.pause();
          tween2.pause();
        } else {
          tween1.resume();
          tween2.resume();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        track1.removeEventListener('mouseenter', handleMouseEnter1);
        track1.removeEventListener('mouseleave', handleMouseLeave1);
        track2.removeEventListener('mouseenter', handleMouseEnter2);
        track2.removeEventListener('mouseleave', handleMouseLeave2);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        tween1.kill();
        tween2.kill();
      };
    },
    { scope: containerRef }
  );

  // ─────────────────────────────────────────────────────────────
  // ── GSAP 2: OCCASION MOOD STAGGER REVEAL ──
  // ─────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.occasion-boutique-card',
        {
          opacity: 0,
          y: 22,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
        }
      );
    },
    { dependencies: [activeOccasion], scope: containerRef }
  );

  // ─────────────────────────────────────────────────────────────
  // ── GSAP 3: DRAG & MOMENTUM CAROUSEL INTERACTION ──
  // ─────────────────────────────────────────────────────────────
  const snapToCard = useCallback((targetIndex: number) => {
    const container = carouselContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.carousel-shop-card');
    const clampedIndex = Math.max(0, Math.min(targetIndex, cards.length - 1));
    const targetCard = cards[clampedIndex];
    if (targetCard) {
      const targetScroll =
        targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      gsap.to(container, {
        scrollLeft: Math.max(0, targetScroll),
        duration: 0.65,
        ease: 'power2.out',
      });
      setCarouselIndex(clampedIndex);
    }
  }, []);

  const handlePrevCard = () => {
    snapToCard(carouselIndex > 0 ? carouselIndex - 1 : filteredBoutiques.length - 1);
  };

  const handleNextCard = () => {
    snapToCard(carouselIndex < filteredBoutiques.length - 1 ? carouselIndex + 1 : 0);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = carouselContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    lastXRef.current = e.pageX;
    velocityRef.current = 0;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const container = carouselContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    velocityRef.current = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const container = carouselContainerRef.current;
    if (!container) return;
    container.style.cursor = 'grab';
    container.style.removeProperty('user-select');

    // Inertia & Snap
    const momentum = velocityRef.current * 180;
    const targetScroll = container.scrollLeft - momentum;

    // Determine closest card
    const cards = container.querySelectorAll<HTMLElement>('.carousel-shop-card');
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const containerCenter = targetScroll + container.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    snapToCard(closestIndex);
  };

  return (
    <section id="gsap-showcase" ref={containerRef} className="py-20 bg-[#FAF6F2] border-b border-[#E8DFD8] overflow-hidden scroll-mt-16">
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="editorial-kicker flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Boutique Nổi Bật & Tủ Đồ Tuyển Chọn · GSAP Engine
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-ink tracking-tight">
              Khám Phá Showroom <span className="italic text-primary font-serif">Được Yêu Thích Nhất.</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
              Trải nghiệm các dải Lookbook trượt vô tận mượt mà 60 FPS, tương tác chậm dần khi rê chuột và băng chuyền quán tính vật lý (Drag & Momentum).
            </p>
          </div>

          {/* ── HIỆU ỨNG 3: TAB CHUYỂN ĐỔI THEO DỊP MẶC (OCCASION MOOD TABS) ── */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface rounded-2xl border border-border-default shadow-2xs self-start md:self-auto">
            {OCCASIONS.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setActiveOccasion(occ)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeOccasion === occ
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── HIỆU ỨNG 1: DẢI RUY-BĂNG LOOKBOOK CHẠY VÔ TẬN ĐA CHIỀU (DUAL-DIRECTION INFINITE PARALLAX RIBBON) ── */}
      <div className="space-y-5 mb-20 select-none">
        {/* Ribbon Header Tagline */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-ink-muted">
          <span className="flex items-center gap-2 uppercase tracking-widest font-mono text-[10px]">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Dải 01: Váy Dạ Hội & Lễ Cưới (Trượt sang Trái · Hover giảm tốc)
          </span>
          <span className="hidden sm:inline text-[11px] italic">Rê chuột vào ảnh để giảm tốc & xem nhanh giá thuê</span>
        </div>

        {/* Hàng 1: Trượt từ Phải sang Trái (Đầm Dạ Hội & Váy Cưới) */}
        <div className="relative overflow-hidden py-2">
          <div
            ref={marqueeTrack1Ref}
            className="flex gap-5 w-max cursor-pointer"
            style={{ willChange: 'transform' }}
          >
            {[...RIBBON_ROW_TOP, ...RIBBON_ROW_TOP, ...RIBBON_ROW_TOP].map((item, idx) => (
              <div
                key={`track1-${item.qr}-${idx}`}
                onClick={() => navigate(`/shop/${item.slug}/catalog`)}
                className="group relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#E8DFD8] shadow-xs hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.04] hover:z-20 shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity group-hover:opacity-95" />

                {/* Top QR & Category Tag */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold bg-ink/80 text-white px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <QrCode className="w-2.5 h-2.5" />
                    {item.qr}
                  </span>
                  <Badge tone="primary" styleVariant="solid" size="sm" className="shadow-xs backdrop-blur-xs text-[10px]">
                    {item.category}
                  </Badge>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                    {item.boutique}
                  </p>
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-snug truncate group-hover:text-primary-soft transition-colors mt-0.5">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/20 text-xs">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">{item.price}</span>
                    <span className="text-[10px] text-white/90 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-semibold">
                      Khám phá <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ribbon Header Tagline Row 2 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-ink-muted pt-2">
          <span className="flex items-center gap-2 uppercase tracking-widest font-mono text-[10px]">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Dải 02: Áo Dài Di Sản & Việt Phục Kỷ Yếu (Trượt sang Phải · Ngược chiều)
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            60 FPS GPU-Accelerated
          </span>
        </div>

        {/* Hàng 2: Trượt từ Trái sang Phải (Áo Dài & Cổ Phục Kỷ Yếu) */}
        <div className="relative overflow-hidden py-2">
          <div
            ref={marqueeTrack2Ref}
            className="flex gap-5 w-max cursor-pointer"
            style={{ willChange: 'transform' }}
          >
            {[...RIBBON_ROW_BOTTOM, ...RIBBON_ROW_BOTTOM, ...RIBBON_ROW_BOTTOM].map((item, idx) => (
              <div
                key={`track2-${item.qr}-${idx}`}
                onClick={() => navigate(`/shop/${item.slug}/catalog`)}
                className="group relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#E8DFD8] shadow-xs hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.04] hover:z-20 shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity group-hover:opacity-95" />

                {/* Top QR & Verified Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold bg-ink/80 text-white px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <QrCode className="w-2.5 h-2.5" />
                    {item.qr}
                  </span>
                  <Badge tone="success" styleVariant="soft" size="sm" className="bg-white/95 text-emerald-800 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-0.5 inline text-emerald-600" />
                    Đã Gắn QR
                  </Badge>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                    {item.boutique}
                  </p>
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-snug truncate group-hover:text-primary-soft transition-colors mt-0.5">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/20 text-xs">
                    <span className="font-bold text-amber-300 font-mono text-[11px]">{item.price}</span>
                    <span className="text-[10px] text-white/90 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-semibold">
                      Xem mẫu <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HIỆU ỨNG 2: BĂNG CHUYỀN LƯỚT SHOP NỔI BẬT CÓ QUÁN TÍNH (INTERACTIVE DRAG & MOMENTUM CAROUSEL) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Store className="w-4 h-4" />
              <span>Tiêu Điểm Showroom Nổi Bật Nhất Tuần</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink">
              Kéo chuột để lướt qua các Boutique (Drag & Momentum)
            </h3>
          </div>

          {/* Carousel Next/Prev Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="w-10 h-10 rounded-full border border-border-default bg-white hover:border-primary hover:text-primary flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Shop trước đó"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="w-10 h-10 rounded-full border border-border-default bg-white hover:border-primary hover:text-primary flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              aria-label="Shop kế tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Momentum Drag Container */}
        <div
          ref={carouselContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: 'auto' }}
        >
          {filteredBoutiques.map((boutique, idx) => (
            <div
              key={boutique.id}
              className="carousel-shop-card occasion-boutique-card w-[340px] sm:w-[420px] rounded-3xl border border-[#E8DFD8] bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 shrink-0 flex flex-col justify-between"
            >
              {/* Boutique Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-ink truncate max-w-[200px]">
                        {boutique.name}
                      </h4>
                      <p className="text-[11px] text-ink-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ink-muted" />
                        <span className="truncate">{boutique.location}</span>
                      </p>
                    </div>
                  </div>

                  <Badge tone="success" styleVariant="soft" size="sm" className="bg-emerald-50 text-emerald-800 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-0.5 inline text-emerald-600" />
                    Xác Thực QR
                  </Badge>
                </div>

                <p className="text-xs text-ink-muted line-clamp-2 mb-4 leading-relaxed">
                  {boutique.tagline}
                </p>

                {/* 3 Hot items of this boutique */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {boutique.featuredItems.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shop/${boutique.slug}/catalog`);
                      }}
                      className="group/item relative rounded-xl border border-border-default overflow-hidden bg-surface-subtle aspect-[3/4] cursor-pointer hover:border-primary transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-108 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-1.5 left-1.5">
                        <span className="text-[8px] font-mono font-bold bg-ink/80 text-white px-1.5 py-0.5 rounded">
                          {item.qrSerial}
                        </span>
                      </div>

                      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white">
                        <p className="text-[9px] font-bold truncate leading-tight">{item.name}</p>
                        <p className="text-[8px] text-amber-300 font-mono font-bold">{item.price.split(' ')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutique Footer Action */}
              <div className="pt-4 border-t border-[#F0E8E2] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{boutique.rating}</span>
                  <span className="text-[10px] text-ink-muted font-normal">
                    ({boutique.rentalsCount} lượt thuê)
                  </span>
                </div>

                <Link to={`/shop/${boutique.slug}/catalog`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs py-1.5 px-3 rounded-xl shadow-2xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Xem Tủ Đồ
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
