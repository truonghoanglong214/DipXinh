import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Shop } from '@/shared/model/domain';
import { FeaturedBoutiquesShowcase } from '../components/FeaturedBoutiquesShowcase';
import {
  Sparkles,
  Store,
  LayoutDashboard,
  Calendar,
  Package,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Layers,
  Award,
} from 'lucide-react';

interface MarketingHomePageProps {
  onGoToStorefront: () => void;
  onGoToDashboard: () => void;
  onOpenCreateShop: () => void;
  currentShop: Shop;
}

const operationalPillars = [
  {
    number: '01',
    title: 'Nhận diện từng trang phục',
    description:
      'Mỗi chiếc váy có một mã QR và vòng đời riêng — từ sẵn sàng, giữ chỗ, đang thuê đến giặt ủi và phục hồi.',
    outcome: 'Lịch thuê được kiểm soát trên từng hiện vật vật lý.',
  },
  {
    number: '02',
    title: 'Nhận trả theo đúng thực tế',
    description:
      'Theo dõi từng món trong combo, hỗ trợ trả nhiều đợt và ghi nhận tình trạng ngay tại quầy mà không làm mất dấu lịch sử.',
    outcome: 'Nhân viên biết món nào đã về và món nào còn ở khách.',
  },
  {
    number: '03',
    title: 'Ký quỹ minh bạch',
    description:
      'Tiền thuê, ký quỹ, khoản khấu trừ và hoàn trả được tách bạch để cửa hàng đối soát rõ ràng với khách hàng.',
    outcome: 'Mỗi biến động đều có ngữ cảnh và người thực hiện.',
  },
];

const workflowSteps = [
  ['01', 'Lên bộ sưu tập', 'Thiết lập mẫu, biến thể, giá thuê và mã QR cho từng hiện vật.'],
  ['02', 'Nhận lịch thuê', 'Khách chọn ngày trên storefront; cửa hàng duyệt và phân bổ đúng trang phục.'],
  ['03', 'Bàn giao & nhận trả', 'Quét QR tại quầy, kiểm tra chất lượng và theo dõi các lượt trả một phần.'],
  ['04', 'Đối soát', 'Chốt sự cố, hoàn ký quỹ và lưu lại toàn bộ lịch sử giao dịch.'],
];

const lookbookPieces = [
  {
    number: '01',
    name: 'Emerald Evening',
    category: 'Đầm dạ hội',
    image: '/images/demo/product-emerald-gown.jpg',
  },
  {
    number: '02',
    name: 'Lụa Việt Hoàng Triều',
    category: 'Áo dài',
    image: '/images/demo/product-silk-aodai.jpg',
  },
  {
    number: '03',
    name: 'Velvet Nocturne',
    category: 'Đầm nhung',
    image: '/images/demo/product-velvet-dress.jpg',
  },
];

const plans = [
  {
    name: 'Trial',
    price: '0đ',
    cadence: '14 ngày',
    description: 'Khám phá trọn vẹn một vòng vận hành thực tế.',
    features: ['50 đơn vị QR', 'Storefront riêng biệt', 'Luồng bàn giao và ký quỹ'],
    featured: true,
  },
  {
    name: 'Starter',
    price: '490.000đ',
    cadence: 'tháng',
    description: 'Cho boutique cho thuê độc lập.',
    features: ['250 đơn vị QR', '3 tài khoản nhân viên', 'Báo cáo vận hành và dòng tiền'],
    featured: false,
  },
  {
    name: 'Growth',
    price: '990.000đ',
    cadence: 'tháng',
    description: 'Cho showroom có đội ngũ vận hành lớn hơn.',
    features: ['Không giới hạn QR', 'Phân quyền chi tiết', 'Hỗ trợ ưu tiên 24/7'],
    featured: false,
  },
];

export const MarketingHomePage: FC<MarketingHomePageProps> = ({
  onGoToStorefront,
  onGoToDashboard,
  onOpenCreateShop,
  currentShop,
}) => (
  <div className="min-h-screen bg-[#FCF9F5] text-[#302824]">
    {/* ── 1. Luxury Editorial Hero Section ── */}
    <section className="relative overflow-hidden border-b border-[#E8DFD8] bg-gradient-to-b from-[#FFFDFC] to-[#FCF9F5]">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ECDAD8]/30 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
        <div className="lg:col-span-7 lg:pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECDAD8]/60 border border-[#C79A97]/40 text-[#713F4B] text-xs font-semibold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nền tảng Vận hành Cho thuê Thời trang & Atelier</span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#302824] sm:text-5xl lg:text-[4.5rem]">
            Mỗi bộ trang phục
            <span className="block italic text-[#713F4B]">đều có một hành trình tỏa sáng.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#756A64] sm:text-base">
            DịpXinh kết nối bộ sưu tập váy dạ hội, áo dài cao cấp với mã QR từng hiện vật, kiểm soát lịch khả dụng tự động trừ 24h buffer giặt ủi và quản lý ký quỹ minh bạch.
          </p>

          {/* Quick Action Navigation CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to={`/shop/${currentShop.slug}/catalog`}
              className="inline-flex items-center gap-2 bg-[#713F4B] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5C303B] shadow-sm rounded active:scale-98"
            >
              <Store className="w-4 h-4" />
              <span>Khám Phá Tủ Đồ Thuê</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to={`/dashboard/${currentShop.slug}`}
              className="inline-flex items-center gap-2 border border-[#713F4B] bg-[#FFFDFC] px-5 py-3 text-sm font-semibold text-[#713F4B] transition-all hover:bg-[#713F4B]/5 rounded active:scale-98"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Vào Bảng Quản Trị Shop</span>
            </Link>

            <a
              href="#gsap-showcase"
              className="inline-flex items-center gap-2 border border-[#C79A97] bg-[#ECDAD8]/30 px-4 py-3 text-sm font-semibold text-[#713F4B] transition-all hover:bg-[#ECDAD8]/70 rounded active:scale-98 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>3 Hiệu Ứng GSAP Showroom ↓</span>
            </a>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-[#756A64] hover:text-[#302824] transition-colors"
            >
              <span>+ Mở Shop Dùng Thử</span>
            </Link>
          </div>

          {/* 3 Core Pillars Minimal Strip */}
          <div className="mt-10 grid max-w-2xl grid-cols-1 border-y border-[#E8DFD8] py-4 text-xs text-[#756A64] sm:grid-cols-3">
            {['QR vật lý từng hiện vật', 'Lịch thuê buffer 24h', 'Ký quỹ cọc tách bạch'].map((item, index) => (
              <div
                key={item}
                className={`flex items-baseline gap-2 py-1.5 sm:px-4 sm:py-0 ${index > 0 ? 'sm:border-l sm:border-[#E8DFD8]' : 'sm:pl-0'}`}
              >
                <span className="font-display text-sm font-semibold italic text-[#C79A97]">0{index + 1}</span>
                <span className="font-medium text-[#302824]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Interactive Visual Showcase */}
        <div className="relative isolate lg:col-span-5 lg:pl-4">
          <div className="absolute -bottom-3 -right-3 top-6 w-full bg-[#713F4B]/10 rounded-2xl -z-10" aria-hidden="true" />
          <div className="relative border border-[#C79A97]/60 bg-[#FFFDFC] p-3 shadow-md rounded-xl">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#E8DFD8]">
              <img
                src="/images/demo/hero-fashion-rental.jpg"
                alt="Không gian showroom thời trang cho thuê cao cấp"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302824]/90 via-[#302824]/20 to-transparent" />
              
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#ECDAD8]">
                    Boutique Trực Tuyến
                  </span>
                  <span className="text-xs text-white/80 font-mono">DX-ATELIER-01</span>
                </div>
                <p className="mt-2 font-display text-2xl font-medium italic sm:text-3xl">{currentShop.name}</p>
                <p className="text-xs text-white/70">/shop/{currentShop.slug}</p>

                {/* Live Stats Floating Tag */}
                <div className="mt-3 flex items-center gap-3 pt-3 border-t border-white/20 text-[11px] text-white/90">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    120+ Mẫu váy tiệc
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    Đánh giá 4.95★
                  </span>
                </div>
              </figcaption>
            </figure>

            {/* Quick jump to Storefront Overlay */}
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-xs text-ink-muted">Trải nghiệm đặt thuê ngay:</span>
              <Link
                to={`/shop/${currentShop.slug}/catalog`}
                className="text-xs font-semibold text-[#713F4B] hover:underline flex items-center gap-1"
              >
                Vào Storefront →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── 2. GSAP FEATURED BOUTIQUES SHOWCASE (Dual Parallax Ribbon & Interactive Carousel) ── */}
    <FeaturedBoutiquesShowcase />

    {/* ── 3. INTERACTIVE PLATFORM MODULE TOUR (Khám Phá Các Phân Hệ Mới Hoàn Thiện) ── */}
    <section className="border-b border-[#E8DFD8] bg-[#FFFDFC] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="editorial-kicker">Phân hệ hoàn chỉnh</span>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Trải nghiệm trực quan các tính năng mới của Dịp Xinh
          </h2>
          <p className="mt-3 text-sm text-[#756A64]">
            Bấm vào từng phân hệ để trải nghiệm giao diện quản trị và storefront đã được nâng cấp hoàn chỉnh.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Storefront */}
          <Link
            to={`/shop/${currentShop.slug}/catalog`}
            className="group relative flex flex-col justify-between border border-[#E8DFD8] bg-[#FCF9F5] p-5 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#713F4B] hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#713F4B]/10 flex items-center justify-center text-[#713F4B] mb-4">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#302824] group-hover:text-[#713F4B]">
                Storefront Khách Hàng
              </h3>
              <p className="mt-2 text-xs text-[#756A64] leading-relaxed">
                Bộ lọc đa chiều theo dịp tiệc, size, màu sắc; xem nhanh Quick View; tính giá thuê và tiền cọc minh bạch.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#713F4B]">
              <span>Khám phá Storefront</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: QR Garment Inventory */}
          <Link
            to={`/dashboard/${currentShop.slug}/inventory`}
            className="group relative flex flex-col justify-between border border-[#E8DFD8] bg-[#FCF9F5] p-5 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#713F4B] hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-800 mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#302824] group-hover:text-[#713F4B]">
                Kho Hiện Vật & In Tem QR
              </h3>
              <p className="mt-2 text-xs text-[#756A64] leading-relaxed">
                Quản lý từng mã QR váy vật lý, in nhãn nhiệt 50x30mm, theo dõi trạng thái Sẵn sàng / Đang thuê / Giặt ủi.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#713F4B]">
              <span>Vào Quản Lý Kho</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Availability Engine */}
          <Link
            to={`/dashboard/${currentShop.slug}/availability`}
            className="group relative flex flex-col justify-between border border-[#E8DFD8] bg-[#FCF9F5] p-5 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#713F4B] hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-800 mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#302824] group-hover:text-[#713F4B]">
                Lịch Khả Dụng (Availability)
              </h3>
              <p className="mt-2 text-xs text-[#756A64] leading-relaxed">
                Động cơ kiểm tra trùng lịch tự động cộng thêm buffer 24h phục hồi, timeline trực quan 21 ngày.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#713F4B]">
              <span>Xem Lịch Trống</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: Rental Policies & Escrow */}
          <Link
            to={`/dashboard/${currentShop.slug}/settings`}
            className="group relative flex flex-col justify-between border border-[#E8DFD8] bg-[#FCF9F5] p-5 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#713F4B] hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-800 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#302824] group-hover:text-[#713F4B]">
                Chính Sách & Ký Quỹ
              </h3>
              <p className="mt-2 text-xs text-[#756A64] leading-relaxed">
                Cấu hình tỷ lệ đặt cọc 70%, phí trễ hạn 150k/ngày, lịch đền bù hư hại vải và bản hợp đồng điện tử.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-[#713F4B]">
              <span>Cấu Hình Chính Sách</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* ── 4. Selected Lookbook Preview ── */}
    <section className="border-b border-[#E8DFD8] bg-[#FFFDFC]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-3">
          <span className="editorial-kicker">Bộ sưu tập tiêu biểu</span>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-[#302824] sm:text-4xl">
            Một thoáng trong tủ đồ.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#756A64]">
            Hình ảnh dẫn lối, còn DịpXinh giữ cho từng lịch thuê phía sau luôn chuẩn xác đến từng hiện vật.
          </p>
          <Link
            to={`/shop/${currentShop.slug}/catalog`}
            className="mt-6 inline-flex items-center gap-1.5 border-b border-[#713F4B] pb-1 text-sm font-semibold text-[#713F4B] transition-colors hover:text-[#5C303B]"
          >
            <span>Xem toàn bộ sưu tập</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-3 lg:col-span-9">
          {lookbookPieces.map((piece, index) => (
            <Link
              key={piece.number}
              to={`/shop/${currentShop.slug}/catalog`}
              className={`group text-left ${index === 1 ? 'sm:mt-10' : ''}`}
            >
              <figure className="aspect-[4/5] overflow-hidden rounded-lg bg-[#E8DFD8]">
                <img
                  src={piece.image}
                  alt={`${piece.name} — ${piece.category}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </figure>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-[#E8DFD8] pt-3">
                <div>
                  <h3 className="font-display text-lg font-medium italic text-[#302824] group-hover:text-[#713F4B]">
                    {piece.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#756A64]">{piece.category}</p>
                </div>
                <span className="font-display text-base italic text-[#C79A97]">{piece.number}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ── 5. Pricing Plans ── */}
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <span className="editorial-kicker">Bắt đầu theo nhịp của bạn</span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Một nền tảng, nhiều quy mô cửa hàng.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#756A64]">
          Mọi gói dịch vụ đều tích hợp sẵn quản lý vòng đời QR vật lý, hợp đồng cho thuê và đối soát ký quỹ.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className="group flex min-h-[24rem] flex-col rounded-xl border border-[#E8DFD8] bg-[#FFFDFC] p-6 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#C79A97] hover:bg-[#ECDAD8]/30 sm:p-7"
          >
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-medium italic">{plan.name}</h3>
                {plan.featured && (
                  <span className="px-2 py-0.5 rounded bg-[#713F4B]/10 text-[10px] font-semibold uppercase tracking-wider text-[#713F4B]">
                    Phổ Biến
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-5 text-[#756A64]">{plan.description}</p>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-[#302824]">
                {plan.price} <span className="text-xs font-normal text-[#756A64]">/ {plan.cadence}</span>
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-[#E8DFD8] pt-5 text-xs text-[#756A64]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-[#C79A97] font-bold">—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-auto block text-center rounded border border-[#713F4B] px-5 py-2.5 text-xs font-semibold text-[#713F4B] transition-colors group-hover:bg-[#713F4B] group-hover:text-white hover:!bg-[#5C303B]"
            >
              Chọn Gói {plan.name}
            </Link>
          </article>
        ))}
      </div>
    </section>

    {/* ── 6. Minimal Footer ── */}
    <footer className="border-t border-[#493A36] bg-[#302824] py-10 text-[#FCF9F5]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-end">
        <div>
          <p className="font-display text-2xl font-medium italic">DịpXinh Atelier</p>
          <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/60">
            Vận hành chỉn chu cho những cửa hàng thời trang trân trọng từng bộ trang phục.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/50">
          <span>© 2026 DịpXinh Platform</span>
          <Link to={`/dashboard/${currentShop.slug}`} className="hover:underline">Bảng Quản Trị</Link>
          <Link to={`/shop/${currentShop.slug}/catalog`} className="hover:underline">Storefront</Link>
          <Link to="/platform" className="hover:underline">Quản Trị Sàn</Link>
        </div>
      </div>
    </footer>
  </div>
);
