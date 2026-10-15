import React, { useState } from 'react';
import {
  Shop,
  Product,
  RentalUnit,
  RentalOrder,
  UnitCondition,
  FittingAppointment,
  WaitlistEntry,
} from '@/shared/model/domain';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  ChevronRight,
  Filter,
  X,
  CreditCard,
  HelpCircle,
  CalendarDays,
} from 'lucide-react';

interface StorefrontPageProps {
  shop: Shop;
  products: Product[];
  rentalUnits: RentalUnit[];
  orders: RentalOrder[];
  fittings?: FittingAppointment[];
  onCreateOrder: (params: {
    shopId: string;
    customer: RentalOrder['customer'];
    items: {
      productId: string;
      variantId: string;
      size: string;
      color: string;
    }[];
    pickupDate: string;
    returnDueDate: string;
    eventDate?: string;
    deliveryMethod: 'STORE_PICKUP' | 'LOCAL_DELIVERY';
    returnMethod: 'STORE_RETURN' | 'LOCAL_RETURN';
    notes?: string;
  }) => { success: boolean; order?: RentalOrder; error?: string };
  onCreateSaleInquiry: (params: {
    shopId: string;
    productId: string;
    productTitle: string;
    variantSize: string;
    customerName: string;
    customerPhone: string;
    notes: string;
  }) => void;
  onCreateFitting?: (params: {
    shopId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    timeSlot: string;
    desiredProductTitle?: string;
    notes?: string;
  }) => void;
  onCreateWaitlist?: (params: {
    shopId: string;
    productId: string;
    productTitle: string;
    size: string;
    customerName: string;
    customerPhone: string;
    desiredDate: string;
  }) => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = ({
  shop,
  products,
  rentalUnits,
  orders,
  fittings = [],
  onCreateOrder,
  onCreateSaleInquiry,
  onCreateFitting,
  onCreateWaitlist,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'fitting' | 'my_orders' | 'about'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'RENTAL' | 'SALE'>('ALL');
  
  // PDP & Booking Wizard Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('2026-10-16');
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [returnDate, setReturnDate] = useState<string>('2026-10-19');
  const [returnTime, setReturnTime] = useState<string>('18:00');
  const [deliveryMethod, setDeliveryMethod] = useState<'STORE_PICKUP' | 'LOCAL_DELIVERY'>('STORE_PICKUP');
  const [returnMethod, setReturnMethod] = useState<'STORE_RETURN' | 'LOCAL_RETURN'>('STORE_RETURN');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [bookingResult, setBookingResult] = useState<RentalOrder | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Sale Inquiry modal
  const [saleInquiryProduct, setSaleInquiryProduct] = useState<Product | null>(null);
  const [saleInquirySuccess, setSaleInquirySuccess] = useState<boolean>(false);

  // Waitlist Modal
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState<boolean>(false);

  // Fitting form state (S-06)
  const [fitName, setFitName] = useState('');
  const [fitPhone, setFitPhone] = useState('');
  const [fitDate, setFitDate] = useState('2026-10-16');
  const [fitSlot, setFitSlot] = useState('10:00 - 11:00');
  const [fitProductTitle, setFitProductTitle] = useState('');
  const [fitSuccess, setFitSuccess] = useState(false);

  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const categories = ['ALL', ...Array.from(new Set(shopProducts.map((p) => p.category)))];

  const filteredProducts = shopProducts.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (selectedType === 'RENTAL' && p.rentalPrice <= 0) return false;
    if (selectedType === 'SALE' && (!p.salePrice || p.salePrice <= 0)) return false;
    return true;
  });

  const handleOpenBooking = (prod: Product) => {
    setSelectedProduct(prod);
    setSelectedVariantId(prod.variants[0]?.id || '');
    setBookingStep(1);
    setBookingError(null);
    setBookingResult(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedProduct) return;
    const variant = selectedProduct.variants.find((v) => v.id === selectedVariantId) || selectedProduct.variants[0];

    const res = onCreateOrder({
      shopId: shop.id,
      customer: {
        name: customerName.trim() || 'Khách hàng',
        phone: customerPhone.trim() || '0901234567',
        address: customerAddress.trim() || 'TP. Hồ Chí Minh',
      },
      items: [
        {
          productId: selectedProduct.id,
          variantId: variant.id,
          size: variant.size,
          color: variant.color,
        },
      ],
      pickupDate: `${pickupDate}T${pickupTime}:00Z`,
      returnDueDate: `${returnDate}T${returnTime}:00Z`,
      deliveryMethod,
      returnMethod,
      notes: customerNotes,
    });

    if (res.success && res.order) {
      setBookingResult(res.order);
      setBookingStep(5);
    } else {
      setBookingError(res.error || 'Có lỗi xảy ra khi gửi yêu cầu đặt đồ');
    }
  };

  const handleSubmitSaleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleInquiryProduct) return;
    const variant = saleInquiryProduct.variants[0];
    onCreateSaleInquiry({
      shopId: shop.id,
      productId: saleInquiryProduct.id,
      productTitle: saleInquiryProduct.title,
      variantSize: variant?.size || 'M',
      customerName: customerName || 'Khách hỏi mua',
      customerPhone: customerPhone || '0901234567',
      notes: customerNotes || 'Khách quan tâm đặt mua và tư vấn may đo số đo riêng.',
    });
    setSaleInquirySuccess(true);
  };

  const handleSubmitFitting = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateFitting) {
      onCreateFitting({
        shopId: shop.id,
        customerName: fitName.trim() || 'Khách hẹn thử đồ',
        customerPhone: fitPhone.trim() || '0901234567',
        date: fitDate,
        timeSlot: fitSlot,
        desiredProductTitle: fitProductTitle || 'Tư vấn các mẫu dạ hội',
        notes: 'Hẹn đến thử trực tiếp tại showroom',
      });
      setFitSuccess(true);
    }
  };

  const handleSubmitWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateWaitlist && waitlistProduct) {
      onCreateWaitlist({
        shopId: shop.id,
        productId: waitlistProduct.id,
        productTitle: waitlistProduct.title,
        size: 'M',
        customerName: customerName || 'Khách chờ đồ',
        customerPhone: customerPhone || '0901234567',
        desiredDate: '2026-10-25',
      });
      setWaitlistSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#302824] pb-24">
      {/* Shop Brand Header & Banner */}
      <section className="relative bg-[#302824] text-[#FCF9F5] overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={shop.bannerUrl || '/images/demo/hero-fashion-rental.jpg'}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#302824] via-[#302824]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#ECDAD8]">
              Bộ sưu tập trực tuyến
            </div>
            <h1 className="mb-3 font-display text-4xl font-medium italic tracking-[-0.025em] text-white sm:text-5xl md:text-6xl">
              {shop.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
              {shop.description}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ECDAD8]" />
                {shop.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#ECDAD8]" />
                Hotline: {shop.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ECDAD8]" />
                Mở cửa: 09:00 - 21:00 hàng ngày
              </span>
            </div>
          </div>
        </div>

        {/* Storefront Tabs */}
        <div className="relative border-t border-[#493A36] bg-[#302824]/80 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-3.5 px-4 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'border-[#713F4B] text-white font-semibold'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Bộ sưu tập ({shopProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('fitting')}
              className={`py-3.5 px-4 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === 'fitting'
                  ? 'border-[#713F4B] text-white font-semibold'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Đặt lịch thử đồ
            </button>
            <button
              onClick={() => setActiveTab('my_orders')}
              className={`py-3.5 px-4 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === 'my_orders'
                  ? 'border-[#713F4B] text-white font-semibold'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Đơn của tôi ({orders.filter((o) => o.shopId === shop.id).length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 px-4 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'border-[#713F4B] text-white font-semibold'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Quy trình &amp; ký quỹ
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-y border-[#E8DFD8] py-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-[#756A64] mr-1 hidden sm:inline">Danh mục:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`border-b px-1 py-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'border-[#713F4B] font-medium text-[#713F4B]'
                        : 'border-transparent text-[#756A64] hover:text-[#302824]'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#756A64] mr-1">Hình thức:</span>
                <button
                  onClick={() => setSelectedType('ALL')}
                  className={`border-b px-1 py-1 text-xs transition-colors cursor-pointer ${
                    selectedType === 'ALL' ? 'border-[#713F4B] text-[#713F4B]' : 'border-transparent text-[#756A64]'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedType('RENTAL')}
                  className={`border-b px-1 py-1 text-xs transition-colors cursor-pointer ${
                    selectedType === 'RENTAL' ? 'border-[#713F4B] text-[#713F4B]' : 'border-transparent text-[#756A64]'
                  }`}
                >
                  Cho thuê
                </button>
                <button
                  onClick={() => setSelectedType('SALE')}
                  className={`border-b px-1 py-1 text-xs transition-colors cursor-pointer ${
                    selectedType === 'SALE' ? 'border-[#713F4B] text-[#713F4B]' : 'border-transparent text-[#756A64]'
                  }`}
                >
                  Bán thiết kế
                </button>
              </div>
            </div>

            {/* Editorial 4:5 product grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((prod) => {
                const productUnits = rentalUnits.filter((u) => u.productId === prod.id);
                const readyUnitsCount = productUnits.filter((u) => u.physicalStatus === 'READY').length;
                const washingUnitsCount = productUnits.filter((u) => u.physicalStatus === 'WASHING').length;

                return (
                  <article
                    key={prod.id}
                    className="group flex flex-col"
                  >
                    <figure className="relative aspect-[4/5] overflow-hidden bg-[#E8DFD8]">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      />
                      <figcaption className="absolute left-0 top-0 bg-[#FCF9F5]/92 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#713F4B] backdrop-blur-sm">
                        {prod.category}
                      </figcaption>
                    </figure>

                    <div className="flex flex-1 flex-col justify-between pt-5">
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-[#E8DFD8] pb-3 text-[10px]">
                          <span className={readyUnitsCount > 0 ? 'text-[#38705A]' : 'text-[#966421]'}>
                            {readyUnitsCount > 0
                              ? `${readyUnitsCount} chiếc sẵn sàng`
                              : washingUnitsCount > 0
                                ? 'Đang giặt ủi'
                                : 'Chưa có lịch trống'}
                          </span>
                          <span className="text-[#928780]">{productUnits.length} mã QR</span>
                        </div>

                        <h3 className="line-clamp-1 font-display text-2xl font-medium text-[#302824] transition-colors group-hover:text-[#713F4B]">
                          {prod.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-6 text-[#756A64]">
                          {prod.description}
                        </p>

                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#756A64]">
                          <span>Size</span>
                          {prod.variants.map((v, idx) => (
                            <React.Fragment key={v.id}>
                              <span className="font-medium text-[#302824]">{v.size}</span>
                              {idx < prod.variants.length - 1 && <span className="text-[#C79A97]">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 space-y-4 border-t border-[#E8DFD8] pt-4">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <div className="text-[10px] text-[#756A64]">Giá thuê · 3 ngày</div>
                            <div className="mt-0.5 text-base font-semibold text-[#302824] tabular-nums">
                              {prod.rentalPrice.toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                          {prod.salePrice && (
                            <div className="text-right">
                              <div className="text-[10px] text-[#756A64]">Giá bán</div>
                              <div className="mt-0.5 text-xs font-medium text-[#713F4B] tabular-nums">
                                {prod.salePrice.toLocaleString('vi-VN')}đ
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-[10px] leading-5 text-[#756A64]">
                          Ký quỹ <strong className="font-medium text-[#302824]">{prod.depositPrice.toLocaleString('vi-VN')}đ</strong>
                          {' '}· hoàn lại sau khi nhận trả và kiểm tra.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenBooking(prod)}
                            className="w-full bg-[#713F4B] px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#5C303B]"
                          >
                            Đặt thuê
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSaleInquiryProduct(prod);
                              setSaleInquirySuccess(false);
                            }}
                            className="w-full border border-[#302824] px-3 py-2.5 text-xs font-medium text-[#302824] transition-colors hover:bg-[#302824] hover:text-white"
                          >
                            Tư vấn mua
                          </button>
                        </div>

                        {readyUnitsCount === 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setWaitlistProduct(prod);
                              setWaitlistSuccess(false);
                            }}
                            className="w-full border-b border-[#C79A97] py-1 text-[11px] text-[#713F4B]"
                          >
                            Báo cho tôi khi trang phục sẵn sàng
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FITTING APPOINTMENTS (S-06) */}
        {activeTab === 'fitting' && (
          <div className="max-w-2xl mx-auto bg-[#FFFDFC] p-8 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#713F4B] font-semibold">
                Trải nghiệm tại Showroom
              </span>
              <h2 className="font-display text-2xl font-bold text-[#302824] mt-1">
                Đặt lịch thử đồ miễn phí tại showroom
              </h2>
              <p className="text-xs text-[#756A64] mt-1">
                Lưu ý: Lịch hẹn thử đồ hỗ trợ bạn thử trực tiếp tại tiệm nhưng <strong>không tự động giữ mã QR vật lý</strong> trước ngày thuê.
              </p>
            </div>

            {fitSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#38705A] mx-auto" />
                <h4 className="font-display text-base font-bold text-[#38705A]">
                  Đặt Lịch Thử Đồ Thành Công!
                </h4>
                <p className="text-xs text-[#302824]">
                  Cửa hàng {shop.name} đã ghi nhận lịch hẹn của bạn vào ngày <strong>{fitDate}</strong> ({fitSlot}). Địa chỉ: {shop.address}.
                </p>
                <button
                  onClick={() => setFitSuccess(false)}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-[#38705A] rounded-lg"
                >
                  Đặt thêm lịch khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFitting} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">
                      Họ và tên của bạn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fitName}
                      onChange={(e) => setFitName(e.target.value)}
                      placeholder="VD: Nguyễn Bích Ngọc"
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={fitPhone}
                      onChange={(e) => setFitPhone(e.target.value)}
                      placeholder="0988 111 222"
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Ngày mong muốn đến thử</label>
                    <input
                      type="date"
                      value={fitDate}
                      onChange={(e) => setFitDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Khung giờ thử đồ</label>
                    <select
                      value={fitSlot}
                      onChange={(e) => setFitSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold"
                    >
                      <option value="09:30 - 10:30">09:30 - 10:30 (Sáng)</option>
                      <option value="11:00 - 12:00">11:00 - 12:00 (Trưa)</option>
                      <option value="14:30 - 15:30">14:30 - 15:30 (Chiều)</option>
                      <option value="17:00 - 18:00">17:00 - 18:00 (Tối)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Mẫu trang phục dự định thử</label>
                  <select
                    value={fitProductTitle}
                    onChange={(e) => setFitProductTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  >
                    <option value="">-- Tư vấn các mẫu tại showroom --</option>
                    {shopProducts.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-xl transition-colors shadow-xs"
                  >
                    Xác Nhận Lịch Thử Đồ
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: MY ORDERS TRACKING (S-08, S-09) */}
        {activeTab === 'my_orders' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">Theo Dõi Đơn Thuê Của Bạn</h2>
                <p className="text-xs text-[#756A64] mt-1">
                  Kiểm tra tiến trình duyệt, thời hạn giữ chỗ và đối soát hoàn cọc minh bạch.
                </p>
              </div>
            </div>

            {orders.filter((o) => o.shopId === shop.id).length === 0 ? (
              <div className="bg-[#FFFDFC] p-12 text-center rounded-2xl border border-[#E8DFD8]">
                <p className="text-sm text-[#756A64]">Bạn chưa có đơn đặt thuê nào tại shop này.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] rounded-lg"
                >
                  Khám phá bộ sưu tập ngay
                </button>
              </div>
            ) : (
              orders
                .filter((o) => o.shopId === shop.id)
                .map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFD8] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-[#302824]">{ord.code}</span>
                        <span className="text-xs text-[#756A64]">· Đặt ngày {new Date(ord.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div>
                        {ord.status === 'PENDING_REVIEW' && (
                          <div className="px-3 py-1 rounded-md text-xs font-medium bg-[#966421]/10 text-[#966421] border border-[#966421]/30 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Chờ cửa hàng duyệt — Chưa giữ trang phục
                          </div>
                        )}
                        {ord.status === 'HELD' && (
                          <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#713F4B]/15 text-[#5C303B] border border-[#713F4B]/40 flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            Đang giữ chỗ (Vui lòng chuyển cọc trước khi hết hạn)
                          </div>
                        )}
                        {ord.status === 'CONFIRMED' && (
                          <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/30 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Đã xác nhận lịch thuê
                          </div>
                        )}
                        {ord.status === 'ACTIVE' && (
                          <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#416C82]/10 text-[#416C82] border border-[#416C82]/30">
                            Đang thuê trang phục
                          </div>
                        )}
                        {ord.status === 'PARTIALLY_RETURNED' && (
                          <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/30 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Đã trả một phần đồ (Còn đồ cần trả)
                          </div>
                        )}
                        {ord.status === 'COMPLETED' && (
                          <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/30 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Hoàn tất đơn hàng &amp; Quyết toán cọc
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-4 bg-[#FCF9F5] p-3 rounded-xl border border-[#E8DFD8]">
                          <img
                            src={it.productImage}
                            alt={it.productTitle}
                            className="w-14 h-18 object-cover rounded-lg border border-[#E8DFD8]"
                          />
                          <div className="flex-1">
                            <h4 className="font-display text-sm font-semibold text-[#302824]">{it.productTitle}</h4>
                            <div className="text-xs text-[#756A64] mt-0.5">
                              Size: <strong>{it.size}</strong> · Màu: {it.color}
                            </div>
                            {it.assignedQrCode && (
                              <div className="text-xs text-[#713F4B] font-mono mt-1 flex items-center gap-1">
                                Mã QR gán: <strong>{it.assignedQrCode}</strong>
                                {it.returnedAt && (
                                  <span className="text-[#38705A] font-sans ml-2">✓ Đã trả vào {new Date(it.returnedAt).toLocaleDateString('vi-VN')}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right font-mono text-sm font-semibold text-[#302824] tabular-nums">
                            {it.rentalPrice.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FCF9F5] p-3.5 rounded-xl border border-[#E8DFD8]">
                      <div>
                        <span className="text-[#756A64]">Thời gian nhận:</span>{' '}
                        <strong className="text-[#302824]">{new Date(ord.pickupDate).toLocaleString('vi-VN')}</strong>
                      </div>
                      <div>
                        <span className="text-[#756A64]">Hạn trả đồ:</span>{' '}
                        <strong className="text-[#302824]">{new Date(ord.returnDueDate).toLocaleString('vi-VN')}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8DFD8]">
                      <h5 className="text-xs font-semibold text-[#756A64] uppercase tracking-wider mb-2">
                        Bảng Chi Tiết Nghĩa Vụ Tài Chính
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-[#FCF9F5] p-2.5 rounded-lg border border-[#E8DFD8]">
                          <div className="text-[11px] text-[#756A64]">Tổng tiền thuê</div>
                          <div className="font-mono font-bold text-[#302824] mt-0.5 tabular-nums">
                            {ord.rentalTotal.toLocaleString('vi-VN')}đ
                          </div>
                        </div>

                        <div className="bg-[#FCF9F5] p-2.5 rounded-lg border border-[#E8DFD8]">
                          <div className="text-[11px] text-[#756A64]">Cọc giữ chỗ</div>
                          <div className="font-mono font-bold text-[#713F4B] mt-0.5 tabular-nums">
                            {ord.advancePaid.toLocaleString('vi-VN')}đ / {ord.advanceRequired.toLocaleString('vi-VN')}đ
                          </div>
                        </div>

                        <div className="bg-[#FCF9F5] p-2.5 rounded-lg border border-[#E8DFD8]">
                          <div className="text-[11px] text-[#756A64]">Ký quỹ tài sản</div>
                          <div className="font-mono font-bold text-[#38705A] mt-0.5 tabular-nums">
                            {ord.depositPaid.toLocaleString('vi-VN')}đ
                          </div>
                        </div>

                        <div className="bg-[#FCF9F5] p-2.5 rounded-lg border border-[#E8DFD8]">
                          <div className="text-[11px] text-[#756A64]">Đã hoàn cọc</div>
                          <div className="font-mono font-bold text-[#38705A] mt-0.5 tabular-nums">
                            {ord.refundVerified.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      </div>

                      {ord.proposedIncidentsTotal > 0 && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#966421]" />
                          <div>
                            <strong>Phí sự cố đề xuất: {ord.proposedIncidentsTotal.toLocaleString('vi-VN')}đ (Chưa chốt nợ).</strong>{' '}
                            Cửa hàng đang thảo luận với bạn về phương án giặt ủi/sửa chữa trước khi quyết toán cọc.
                          </div>
                        </div>
                      )}

                      {ord.finalizedIncidentsTotal > 0 && (
                        <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
                          <div>
                            <strong>Phí sự cố đã chốt: {ord.finalizedIncidentsTotal.toLocaleString('vi-VN')}đ.</strong>{' '}
                            Đã được khấu trừ vào sổ quỹ tiền cọc.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* TAB 4: ABOUT & POLICIES */}
        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto bg-[#FFFDFC] p-8 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-6">
            <h2 className="font-display text-2xl font-bold text-[#302824]">
              Chính Sách Cho Thuê &amp; Ký Quỹ Tại {shop.name}
            </h2>
            <div className="space-y-4 text-sm text-[#756A64] leading-relaxed">
              <p>
                Nhằm bảo đảm chất lượng trang phục luôn ở tình trạng hoàn hảo nhất cho ngày trọng đại của quý khách, {shop.name} áp dụng quy trình kiểm soát mã QR vật lý độc lập và sổ quỹ ký quỹ minh bạch:
              </p>

              <div className="p-4 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] space-y-2">
                <h4 className="font-semibold text-[#302824] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38705A]" />
                  1. Đặt cọc giữ chỗ (Advance Deposit)
                </h4>
                <p className="text-xs">
                  Khoản cọc giữ chỗ (~35% giá thuê) nhằm khóa lịch độc quyền cho mã QR chiếc đầm của bạn. Nếu hủy lịch trước 3 ngày diễn ra sự kiện, cửa hàng hoàn trả 100% tiền cọc giữ chỗ.
                </p>
              </div>

              <div className="p-4 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] space-y-2">
                <h4 className="font-semibold text-[#302824] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38705A]" />
                  2. Tiền ký quỹ tài sản (Security Deposit)
                </h4>
                <p className="text-xs">
                  Khoản tiền cọc bảo đảm giá trị trang phục được thu khi bạn nhận đồ. Sau khi bạn trả đồ và kiểm tra đạt tiêu chuẩn, cửa hàng chuyển khoản hoàn cọc ngay lập tức và cấp mã ủy nhiệm chi.
                </p>
              </div>

              <div className="p-4 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] space-y-2">
                <h4 className="font-semibold text-[#302824] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38705A]" />
                  3. Xử lý vết bẩn &amp; hư tổn
                </h4>
                <p className="text-xs">
                  Các vết bẩn thông thường có thể giặt sạch đã được tính trong phí giặt ủi của shop. Trường hợp hư hỏng kết cấu vải, shop sẽ lập biên bản sự cố và chỉ khấu trừ phần chi phí sửa chữa sau khi hai bên đã thống nhất.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RENTAL BOOKING WIZARD MODAL (S-04 & S-05) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#FCF9F5] px-6 py-4 border-b border-[#E8DFD8] flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#713F4B] font-semibold">
                  Quy trình đặt thuê · Bước {bookingStep}/4
                </span>
                <h3 className="font-display text-lg font-bold text-[#302824] line-clamp-1">
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {bookingError}
                </div>
              )}

              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-24 h-32 object-cover rounded-xl border border-[#E8DFD8]"
                    />
                    <div>
                      <h4 className="font-display text-base font-semibold text-[#302824]">
                        {selectedProduct.title}
                      </h4>
                      <p className="text-xs text-[#756A64] mt-1">{selectedProduct.description}</p>
                      <div className="font-mono text-base font-bold text-[#713F4B] mt-2">
                        {selectedProduct.rentalPrice.toLocaleString('vi-VN')}đ / đợt
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-2">
                      Chọn Kích Cỡ &amp; Màu Sắc:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {selectedProduct.variants.map((v) => {
                        const unitsForVariant = rentalUnits.filter(
                          (u) => u.productId === selectedProduct.id && u.variantId === v.id
                        );
                        const isReady = unitsForVariant.some((u) => u.physicalStatus === 'READY');

                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedVariantId === v.id
                                ? 'border-[#302824] bg-[#FCF9F5] ring-1 ring-[#302824]'
                                : 'border-[#E8DFD8] hover:border-[#713F4B]'
                            }`}
                          >
                            <div className="font-bold text-sm text-[#302824]">Size {v.size}</div>
                            <div className="text-xs text-[#756A64]">{v.color}</div>
                            <div className="mt-1 text-[10px]">
                              {isReady ? (
                                <span className="text-[#38705A] font-medium">● Có mã sẵn sàng</span>
                              ) : (
                                <span className="text-[#966421]">⏳ Cần xếp lịch giặt</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#302824] mb-1">
                        Ngày nhận trang phục
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#302824] mb-1">
                        Giờ nhận dự kiến
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#302824] mb-1">
                        Hạn trả trang phục
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#302824] mb-1">
                        Giờ trả dự kiến
                      </label>
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-2">
                      Phương thức nhận đồ:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('STORE_PICKUP')}
                        className={`p-3 rounded-xl border text-xs text-left cursor-pointer ${
                          deliveryMethod === 'STORE_PICKUP'
                            ? 'border-[#302824] bg-[#FCF9F5] font-semibold'
                            : 'border-[#E8DFD8]'
                        }`}
                      >
                        Thử và nhận trực tiếp tại shop
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('LOCAL_DELIVERY')}
                        className={`p-3 rounded-xl border text-xs text-left cursor-pointer ${
                          deliveryMethod === 'LOCAL_DELIVERY'
                            ? 'border-[#302824] bg-[#FCF9F5] font-semibold'
                            : 'border-[#E8DFD8]'
                        }`}
                      >
                        Giao tận nơi nội thành
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-1">
                      Họ và tên người thuê <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Trần Mai Phương"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-1">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-1">
                      Địa chỉ nhận hàng (hoặc khu vực)
                    </label>
                    <input
                      type="text"
                      placeholder="280 Nguyễn Đình Chiểu, Quận 3, TP.HCM"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#302824] mb-1">
                      Ghi chú vóc dáng / Căn chỉnh chiều dài
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Cao 1m62, nặng 48kg, mang giày cao gót 7cm..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-[#FCF9F5] p-4 rounded-xl border border-[#E8DFD8] space-y-3">
                    <h4 className="font-display text-sm font-semibold text-[#302824] border-b border-[#E8DFD8] pb-2">
                      Báo Giá Snapshot Chi Tiết (Không Phát Sinh Ẩn)
                    </h4>

                    <div className="flex justify-between text-xs">
                      <span className="text-[#756A64]">Tiền thuê trang phục:</span>
                      <strong className="font-mono text-[#302824] tabular-nums">
                        {selectedProduct.rentalPrice.toLocaleString('vi-VN')}đ
                      </strong>
                    </div>

                    <div className="flex justify-between text-xs text-[#713F4B]">
                      <span>Tiền cọc giữ chỗ (Cần chuyển để xác nhận đơn):</span>
                      <strong className="font-mono tabular-nums">
                        {Math.round(selectedProduct.rentalPrice * 0.35).toLocaleString('vi-VN')}đ
                      </strong>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-[#756A64]">Tiền thuê còn lại khi nhận đồ:</span>
                      <strong className="font-mono text-[#302824] tabular-nums">
                        {(selectedProduct.rentalPrice - Math.round(selectedProduct.rentalPrice * 0.35)).toLocaleString('vi-VN')}đ
                      </strong>
                    </div>

                    <div className="flex justify-between text-xs border-t border-[#E8DFD8] pt-2 text-[#38705A]">
                      <span>Tiền ký quỹ tài sản (Thu khi nhận đồ, hoàn trả sau khi trả đồ):</span>
                      <strong className="font-mono tabular-nums">
                        {selectedProduct.depositPrice.toLocaleString('vi-VN')}đ
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#966421]" />
                    <div>
                      <strong>Lưu ý quan trọng:</strong> Sau khi bấm gửi yêu cầu, đơn hàng sẽ ở trạng thái <strong className="underline">Chờ cửa hàng duyệt (PENDING_REVIEW)</strong>. Cửa hàng sẽ kiểm tra tình trạng vật lý của váy và gán mã QR trước khi bạn chuyển cọc.
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 5 && bookingResult && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 bg-[#FCF9F5] border-2 border-[#713F4B] text-[#713F4B] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#302824]">
                    Yêu Cầu Đặt Thuê Đã Gửi Thành Công!
                  </h3>

                  <div className="inline-block px-3 py-1 bg-[#966421]/10 text-[#966421] border border-[#966421]/30 rounded-lg text-xs font-semibold">
                    Trạng thái: PENDING_REVIEW (Chờ duyệt — Chưa giữ trang phục)
                  </div>

                  <p className="text-xs text-[#756A64] max-w-md mx-auto leading-relaxed">
                    Mã đơn hàng của bạn là <strong className="font-mono text-[#302824]">{bookingResult.code}</strong>. Cửa hàng {shop.name} sẽ xác nhận và thông báo cho bạn để chuyển khoản tiền cọc giữ chỗ.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setActiveTab('my_orders');
                      }}
                      className="px-5 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] rounded-xl hover:bg-[#3F3330]"
                    >
                      Xem đơn thuê trong mục Theo Dõi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {bookingStep < 5 && (
              <div className="bg-[#FCF9F5] px-6 py-4 border-t border-[#E8DFD8] flex items-center justify-between">
                {bookingStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setBookingStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 text-xs font-medium text-[#756A64] hover:text-[#302824]"
                  >
                    Quay lại
                  </button>
                ) : (
                  <span />
                )}

                {bookingStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setBookingStep((prev) => (prev + 1) as any)}
                    className="px-5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-xl transition-colors flex items-center gap-1"
                  >
                    Tiếp tục
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="px-5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-[#ECDAD8]" />
                    Gửi Yêu Cầu Đặt Thuê
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SALE INQUIRY MODAL */}
      {saleInquiryProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[#302824]">
                Tư Vấn Mua Đầm Thiết Kế
              </h3>
              <button
                onClick={() => setSaleInquiryProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saleInquirySuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-[#38705A] mx-auto" />
                <h4 className="font-display text-base font-bold text-[#302824]">
                  Đã Gửi Yêu Cầu Tư Vấn!
                </h4>
                <p className="text-xs text-[#756A64]">
                  Chuyên viên thời trang của {shop.name} sẽ liên hệ lại qua số điện thoại của bạn để tư vấn số đo và đặt lịch thử đồ tại showroom.
                </p>
                <button
                  onClick={() => setSaleInquiryProduct(null)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] rounded-lg"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSaleInquiry} className="space-y-4">
                <div className="text-xs text-[#756A64]">
                  Sản phẩm quan tâm: <strong className="text-[#302824]">{saleInquiryProduct.title}</strong>
                  {saleInquiryProduct.salePrice && (
                    <span className="block font-mono text-[#713F4B] font-bold mt-0.5">
                      Giá niêm yết: {saleInquiryProduct.salePrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302824] mb-1">
                    Họ và tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Lê Hoàng Yến"
                    className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302824] mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0934 567 890"
                    className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302824] mb-1">
                    Yêu cầu may đo / Tư vấn kiểu dáng
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Mong muốn tư vấn độ dài váy, chất liệu lót..."
                    className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSaleInquiryProduct(null)}
                    className="px-4 py-2 text-xs text-[#756A64]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg"
                  >
                    Gửi Thông Tin Cho Shop
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* WAITLIST MODAL (S-07) */}
      {waitlistProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[#302824]">
                Đăng ký nhận thông báo khi có đồ
              </h3>
              <button onClick={() => setWaitlistProduct(null)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {waitlistSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-[#38705A] mx-auto" />
                <h4 className="font-display text-base font-bold text-[#302824]">
                  Đã Đăng Ký Danh Sách Chờ!
                </h4>
                <p className="text-xs text-[#756A64]">
                  Ngay khi mẫu <strong>{waitlistProduct.title}</strong> có mã QR hoàn tất giặt ủi và sẵn sàng cho thuê lại, cửa hàng sẽ gửi tin nhắn thông báo cho bạn.
                </p>
                <button
                  onClick={() => setWaitlistProduct(null)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] rounded-lg"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitWaitlist} className="space-y-4 text-xs">
                <div>
                  Mẫu quan tâm: <strong>{waitlistProduct.title}</strong>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Họ tên của bạn</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Đỗ Hải My"
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Số điện thoại nhận tin</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0945 666 777"
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Lưu ý:</strong> Thông báo có hàng không đảm bảo còn hàng và không tự giữ chỗ.
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setWaitlistProduct(null)} className="px-4 py-2 text-[#756A64]">Hủy</button>
                  <button type="submit" className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] rounded-lg">Đăng Ký</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
