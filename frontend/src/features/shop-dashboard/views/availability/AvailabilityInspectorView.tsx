import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Product, RentalUnit, Shop, RentalOrder } from '@/shared/model/domain';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, FormField, Select } from '@/shared/components/ui';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Layers,
  QrCode,
} from 'lucide-react';

export const AvailabilityInspectorView: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [storeState] = useState(() => demoStore.getState());

  const shop: Shop =
    storeState.shops.find((s) => s.slug === shopSlug) ||
    storeState.shops[0] ||
    demoStore.getCurrentShop();

  const products = storeState.products.filter((p) => p.shopId === shop.id || !p.shopId);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  // Inspection date range picker (Default: 3 days starting tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const returnDate = new Date(tomorrow);
  returnDate.setDate(tomorrow.getDate() + 3);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [startDateStr, setStartDateStr] = useState<string>(formatDateInput(tomorrow));
  const [endDateStr, setEndDateStr] = useState<string>(formatDateInput(returnDate));

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const productUnits = storeState.rentalUnits.filter(
    (u) => u.productId === selectedProduct?.id
  );

  // Buffer giặt hấp theo cấu hình của shop (mặc định 24h = 1 ngày)
  const bufferDays = Math.ceil((shop.turnaroundBufferHours || 24) / 24);

  // Engine kiểm tra xung đột trùng lịch thời gian thực
  const checkAvailability = () => {
    if (!selectedProduct) return { isAvailable: false, conflictingOrders: [], availableUnits: [] };

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (start >= end) {
      return { isAvailable: false, conflictingOrders: [], availableUnits: [], invalidRange: true };
    }

    // Các đơn hàng đang thuê hoặc giữ chỗ có chứa sản phẩm này
    const relevantOrders = storeState.orders.filter((order) => {
      const containsProduct = order.items.some((item) => item.productId === selectedProduct.id);
      const isActiveStatus = ['HELD', 'CONFIRMED', 'ACTIVE', 'PARTIALLY_RETURNED'].includes(
        order.status
      );
      return containsProduct && isActiveStatus;
    });

    const conflictingOrders: { order: RentalOrder; unitId?: string; reason: string }[] = [];
    const busyUnitIds = new Set<string>();

    relevantOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId === selectedProduct.id && item.assignedUnitId) {
          const orderStart = new Date(order.pickupDate);
          const orderEnd = new Date(order.returnDueDate);

          // Cộng thêm thời gian đệm giặt ủi sau ngày trả
          const bufferEnd = new Date(orderEnd);
          bufferEnd.setDate(bufferEnd.getDate() + bufferDays);

          // Điều kiện giao thoa khoảng thời gian (Overlap check)
          const isOverlap = start < bufferEnd && end > orderStart;

          if (isOverlap) {
            busyUnitIds.add(item.assignedUnitId);
            conflictingOrders.push({
              order,
              unitId: item.assignedUnitId,
              reason: `Đơn #${order.code || order.id.slice(-6)} của ${order.customer.name} thuê từ ${order.pickupDate.split('T')[0]} đến ${order.returnDueDate.split('T')[0]} (kèm ${bufferDays} ngày đệm giặt hấp)`,
            });
          }
        }
      });
    });

    // Lọc các units còn trống
    const availableUnits = productUnits.filter((u) => !busyUnitIds.has(u.id));

    return {
      isAvailable: availableUnits.length > 0,
      conflictingOrders,
      availableUnits,
      invalidRange: false,
      totalUnitsCount: productUnits.length,
    };
  };

  const availabilityResult = checkAvailability();

  const calculateDays = () => {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const rentalDays = calculateDays();
  const calculatedRentalPrice = selectedProduct ? selectedProduct.rentalPrice : 0;
  const calculatedDeposit = selectedProduct ? selectedProduct.depositPrice : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Generate 21 upcoming days timeline for visual calendar preview
  const upcomingDays = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
              Task F02-07 & SUP-F05 · Vertical Slice VS04
            </span>
            <span className="text-xs text-ink-muted">· {shop.name}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-ink tracking-tight">
            Công Cụ Kiểm Tra Khả Dụng & Trục Thời Gian Thuê (Availability Inspector)
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Mô phỏng thuật toán tính toán lịch trống thời gian thực, chống trùng lịch (overbooking) kèm thời gian đệm giặt ủi {shop.turnaroundBufferHours || 24}h.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/dashboard/${shop.slug}/inventory`}>
            <Button variant="outline" size="sm" leftIcon={<Layers className="w-3.5 h-3.5" />}>
              Quay Về Quản Lý Kho QR
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector & Date Range Picker */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
              <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">1. Chọn Mẫu Thiết Kế Cần Tra Cứu</h3>
                <p className="text-[11px] text-ink-muted">Chọn trang phục và thời gian khách muốn lấy đồ</p>
              </div>
            </div>

            <div>
              <FormField label="Trang phục thiết kế">
                <Select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  options={products.map((p) => ({
                    value: p.id,
                    label: `${p.title} (${p.category})`,
                  }))}
                />
              </FormField>
            </div>

            {/* Selected Product Snapshot */}
            {selectedProduct && (
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-default flex items-center gap-3">
                <img
                  src={selectedProduct.images[0] || '/images/demo/product-emerald-gown.jpg'}
                  alt={selectedProduct.title}
                  className="w-14 h-16 rounded-lg object-cover border border-border-default shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-ink">{selectedProduct.title}</h4>
                  <p className="text-[11px] text-primary font-bold">
                    {formatCurrency(selectedProduct.rentalPrice)} / đợt 3 ngày
                  </p>
                  <p className="text-[10px] text-ink-muted">
                    Tổng kho: <strong>{productUnits.length} chiếc vật lý (Mã QR)</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Date Range Picker with Live Calculation */}
            <div className="space-y-4 pt-2 border-t border-border-default">
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider text-primary">
                <Clock className="w-3.5 h-3.5" /> 2. Khoảng Ngày Khách Muốn Thuê
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Ngày nhận đồ (Pickup)">
                  <input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-default bg-surface text-ink outline-none focus:border-primary"
                  />
                </FormField>

                <FormField label="Ngày trả đồ (Return)">
                  <input
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-default bg-surface text-ink outline-none focus:border-primary"
                  />
                </FormField>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border-default/60 text-xs text-ink-muted flex items-center justify-between">
                <span>Tổng số ngày giữ trang phục:</span>
                <strong className="text-ink font-bold">{rentalDays} ngày</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Availability Engine Output & Calendar Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result Banner */}
          {availabilityResult.isAvailable ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-white/60 px-2 py-0.5 rounded border border-emerald-300">
                      Availability Engine · Hợp Lệ
                    </span>
                    <h3 className="text-lg font-bold text-emerald-950 mt-0.5">
                      SẴN SÀNG CHO THUÊ (AVAILABLE)
                    </h3>
                  </div>
                </div>
                <Badge tone="success" size="md">
                  Còn {availabilityResult.availableUnits.length} chiếc trống lịch
                </Badge>
              </div>

              <p className="text-xs text-emerald-800 leading-relaxed">
                Chiếc váy này hoàn toàn không vướng lịch thuê nào khác trong khoảng thời gian từ{' '}
                <strong>{startDateStr}</strong> đến <strong>{endDateStr}</strong> (đã tính kèm{' '}
                <strong>{shop.turnaroundBufferHours || 24} giờ</strong> đệm giặt hấp tiệt trùng).
              </p>

              {/* Ready QR Units List */}
              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1.5">
                  Các mã QR vật lý có thể bàn giao ngay:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availabilityResult.availableUnits.map((u) => (
                    <span
                      key={u.id}
                      className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 font-mono text-xs font-bold text-emerald-800 flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" /> {u.qrCode} (Size {u.size} · {u.color})
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                <span>Dự toán: Giá thuê ({formatCurrency(calculatedRentalPrice)}) + Cọc ({formatCurrency(calculatedDeposit)})</span>
                <span className="font-bold text-sm text-emerald-950">
                  Tổng thu: {formatCurrency(calculatedRentalPrice + calculatedDeposit)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-white/60 px-2 py-0.5 rounded border border-rose-300">
                      Availability Engine · Cảnh Báo
                    </span>
                    <h3 className="text-lg font-bold text-rose-950 mt-0.5">
                      XUNG ĐỘT TRÙNG LỊCH (OVERBOOKED)
                    </h3>
                  </div>
                </div>
                <Badge tone="danger" size="md">
                  Toàn bộ {productUnits.length} chiếc đã kín lịch
                </Badge>
              </div>

              <p className="text-xs text-rose-800 leading-relaxed">
                Không thể nhận thêm đơn thuê cho mẫu váy này từ <strong>{startDateStr}</strong> đến{' '}
                <strong>{endDateStr}</strong> do trùng lịch với đơn hàng đã giữ chỗ hoặc trong thời gian đệm giặt hấp.
              </p>

              {/* Conflict details */}
              <div className="bg-white/80 p-3 rounded-xl border border-rose-200 space-y-2 text-xs">
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Lý do xung đột chi tiết:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-rose-800 text-[11px]">
                  {availabilityResult.conflictingOrders.map((c, idx) => (
                    <li key={idx}>{c.reason}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-rose-700">
                Gợi ý: Quý shop vui lòng tư vấn khách lùi lịch hoặc gợi ý mẫu đầm khác cùng phân khúc.
              </div>
            </div>
          )}

          {/* Visual Timeline Schedule (Next 21 days matrix) */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-ink">
                  Trục Thời Gian Khả Dụng 21 Ngày Tới (Visual Timeline)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-ink-muted">Đệm giặt hấp: +{shop.turnaroundBufferHours || 24}h</span>
            </div>

            {/* Timeline Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-ink-muted">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Trống lịch (Available)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Khách mặc thuê (Rented)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Đệm giặt hấp (Buffer)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Khoảng đang chọn
              </span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {upcomingDays.map((date, idx) => {
                const dateStr = formatDateInput(date);
                const dayNum = date.getDate();
                const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];

                const isSelected = dateStr >= startDateStr && dateStr <= endDateStr;

                // Kiểm tra xem ngày này có đơn hàng không
                const hasOrder = storeState.orders.some((o) =>
                  o.items.some((it) => it.productId === selectedProduct?.id) &&
                  dateStr >= o.pickupDate.split('T')[0] &&
                  dateStr <= o.returnDueDate.split('T')[0]
                );

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary-soft text-primary font-bold'
                        : hasOrder
                        ? 'border-blue-200 bg-blue-50 text-blue-900'
                        : 'border-border-default/60 bg-surface text-ink hover:border-primary/40'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider text-ink-muted block">
                      {dayOfWeek}
                    </span>
                    <span className="text-sm font-bold block my-0.5">{dayNum}</span>
                    <span className="text-[8px] font-mono block opacity-75">
                      {hasOrder ? 'Đã Thuê' : isSelected ? 'Đang Chọn' : 'Trống'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
