import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useOutletContext, NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Shop, RentalOrder, RentalUnit, UserRole, UnitCondition } from '@/shared/model/domain';
import { demoStore } from '@/shared/demo/demo-store';
import {
  Button,
  Badge,
  Input,
  Select,
  Dialog,
  useToast,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  FormField,
} from '@/shared/components/ui';
import {
  Package,
  CalendarCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Phone,
  User,
  Shield,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Check,
  X,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const formatVNDate = (isoStr?: string) => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoStr;
  }
};

export const ShopDashboardHomeView: React.FC = () => {
  const { shop } = useOutletContext<{ shop: Shop }>();
  const { toast } = useToast();
  const [storeState, setStoreState] = useState(() => demoStore.getState());

  // Local interaction states
  const [activeTab, setActiveTab] = useState<'pickups' | 'returns'>('pickups');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInProductId, setWalkInProductId] = useState('');
  const [walkInDays, setWalkInDays] = useState(3);
  const [selectedApprovalOrder, setSelectedApprovalOrder] = useState<RentalOrder | null>(null);

  // Micro-interaction container ref
  const dashboardContainerRef = useRef<HTMLDivElement>(null);
  const scheduleTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreState({ ...demoStore.getState() });
    };
    window.addEventListener('dipxinh_store_updated', handleUpdate);
    return () => window.removeEventListener('dipxinh_store_updated', handleUpdate);
  }, []);

  const currentRole = storeState.currentRole;
  const isManagement = currentRole === 'SHOP_OWNER' || currentRole === 'SHOP_MANAGER' || currentRole === 'PLATFORM_ADMIN';

  // Shop-scoped data
  const shopOrders = useMemo(() => {
    return storeState.orders.filter((o) => o.shopId === shop.id);
  }, [storeState.orders, shop.id]);

  const shopUnits = useMemo(() => {
    const shopProdIds = storeState.products.filter((p) => p.shopId === shop.id).map((p) => p.id);
    return storeState.rentalUnits.filter((u) => shopProdIds.includes(u.productId));
  }, [storeState.rentalUnits, storeState.products, shop.id]);

  // Operational metrics
  const pendingApprovals = useMemo(() => {
    return shopOrders.filter((o) => o.status === 'PENDING_REVIEW' || o.status === 'HELD');
  }, [shopOrders]);

  const activeRentals = useMemo(() => {
    return shopOrders.filter((o) => o.status === 'ACTIVE' || o.status === 'CONFIRMED');
  }, [shopOrders]);

  // Today's Pickups (Giao đồ hôm nay)
  const todayPickups = useMemo(() => {
    return shopOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'HELD');
  }, [shopOrders]);

  // Today's Returns (Nhận trả đồ hôm nay)
  const todayReturns = useMemo(() => {
    return shopOrders.filter((o) => o.status === 'ACTIVE' || o.status === 'PARTIALLY_RETURNED');
  }, [shopOrders]);

  // Operational Conflicts & Urgent Items
  const washingUnits = useMemo(() => {
    return shopUnits.filter((u) => u.physicalStatus === 'WASHING');
  }, [shopUnits]);

  // GSAP micro-interaction: smooth row reveal on tab change
  useGSAP(
    () => {
      if (!scheduleTableRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.schedule-row-item',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.22, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' }
        );
      });
    },
    { dependencies: [activeTab], scope: scheduleTableRef }
  );

  // Quick Action: Confirm Handover
  const handleConfirmHandover = (orderId: string, qrCode?: string) => {
    const targetOrder = shopOrders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Update order status to ACTIVE
    targetOrder.status = 'ACTIVE';
    targetOrder.handoverAt = new Date().toISOString();

    // If unit assigned, update physicalStatus to RENTED
    if (qrCode) {
      const unit = storeState.rentalUnits.find((u) => u.qrCode === qrCode);
      if (unit) {
        demoStore.updateUnitStatus(unit.id, 'RENTED');
      }
    }

    toast.success(`Đã bàn giao trang phục (Mã QR: ${qrCode || 'Định danh'}) cho đơn ${targetOrder.code}!`);
    window.dispatchEvent(new CustomEvent('dipxinh_store_updated'));
  };

  // Quick Action: Confirm Return QC
  const handleConfirmReturn = (orderId: string, unitId?: string) => {
    const targetOrder = shopOrders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    targetOrder.status = 'COMPLETED';
    if (unitId) {
      demoStore.updateUnitStatus(unitId, 'WASHING', 'EXCELLENT', new Date(Date.now() + 12 * 3600 * 1000).toISOString());
    }

    toast.success(`Đã nhận lại trang phục và chuyển vào buồng hấp sấy tiệt trùng!`);
    window.dispatchEvent(new CustomEvent('dipxinh_store_updated'));
  };

  // Quick Action: Approve Pending Order & Assign QR
  const handleApproveOrder = (order: RentalOrder) => {
    const availableUnit = shopUnits.find(
      (u) => u.productId === order.items[0]?.productId && u.physicalStatus === 'READY'
    ) || shopUnits[0];

    if (!availableUnit) {
      toast.error('Không còn thực thể mã QR nào sẵn sàng trong kho cho mẫu này!');
      return;
    }

    const res = demoStore.approveOrderAndHold(order.id, [
      { itemId: order.items[0].id, unitId: availableUnit.id },
    ]);

    if (res.success) {
      toast.success(`Đã duyệt đơn ${order.code} và gán giữ mã QR ${availableUnit.qrCode}!`);
      setSelectedApprovalOrder(null);
    } else {
      toast.error(res.error || 'Không thể duyệt đơn');
    }
  };

  // Quick Action: Resolve Washing Conflict
  const handleMarkReady = (unitId: string, qrCode: string) => {
    demoStore.updateUnitStatus(unitId, 'READY', 'EXCELLENT');
    toast.success(`Thực thể ${qrCode} đã hoàn tất hấp sấy và sẵn sàng bàn giao!`);
  };

  // Quick Action: Submit Walk-In Order
  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim() || !walkInPhone.trim() || !walkInProductId) {
      toast.error('Vui lòng điền đầy đủ tên khách, số điện thoại và chọn trang phục!');
      return;
    }

    const targetProduct = storeState.products.find((p) => p.id === walkInProductId);
    const targetUnit =
      shopUnits.find((u) => u.productId === walkInProductId && u.physicalStatus === 'READY') ||
      shopUnits[0];

    if (!targetProduct || !targetUnit) {
      toast.error('Không tìm thấy thực thể mã QR sẵn sàng trong kho!');
      return;
    }

    const variant = targetProduct.variants[0] || { id: 'var-default', size: 'M', color: 'Tiêu chuẩn' };
    const pickup = new Date();
    const returnDue = new Date(Date.now() + walkInDays * 24 * 3600 * 1000);

    const res = demoStore.createWalkInOrder({
      shopId: shop.id,
      customer: {
        name: walkInName.trim(),
        phone: walkInPhone.trim(),
      },
      items: [
        {
          productId: targetProduct.id,
          variantId: variant.id,
          unitId: targetUnit.id,
          size: variant.size,
          color: variant.color,
        },
      ],
      pickupDate: pickup.toISOString(),
      returnDueDate: returnDue.toISOString(),
    });

    if (res.success && res.order) {
      toast.success(`Đã tạo đơn walk-in ${res.order.code} và gán mã QR ${res.order.items[0]?.assignedQrCode}!`);
      setIsWalkInModalOpen(false);
      setWalkInName('');
      setWalkInPhone('');
    } else {
      toast.error(res.error || 'Không thể tạo đơn walk-in');
    }
  };

  return (
    <div ref={dashboardContainerRef} className="space-y-6 sm:space-y-8 font-sans">
      {/* ──────────────────────────────────────────────────────────
          1. MOCK FIXTURE & DEPENDENCY NOTIFICATION (F02-01 SPEC)
          ────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Thông báo chế độ phát triển"
        className="p-3.5 sm:p-4 rounded-xl border border-amber-300/70 bg-amber-50/70 text-ink text-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-2xs"
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <Badge tone="warning" styleVariant="solid" size="sm" className="shrink-0 font-mono">
            MOCK FIXTURE · F02-01
          </Badge>
          <div className="space-y-0.5">
            <span className="font-semibold text-ink block">
              Chế độ phát triển cô lập giao diện Dashboard vận hành xưởng may
            </span>
            <p className="text-[11px] text-ink-muted">
              Đang xác thực luồng thao tác bằng <code>demoStore</code>. Chưa gọi REST API do phụ thuộc task Backend{' '}
              <strong className="text-ink">B03-02 (Shop Onboarding API)</strong> đang chờ bàn giao.
            </p>
          </div>
        </div>

        {/* Live Role Switcher for verification */}
        <div className="flex items-center gap-2 shrink-0 border-t xl:border-t-0 pt-2 xl:pt-0 border-amber-200">
          <span className="text-[11px] font-medium text-ink-muted flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-primary" /> Phân quyền thử nghiệm:
          </span>
          <select
            value={currentRole}
            onChange={(e) => demoStore.setRole(e.target.value as UserRole)}
            className="text-xs font-semibold text-primary bg-surface border border-border-default rounded-md px-2 py-1 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            <option value="SHOP_OWNER">Chủ Cửa Hàng (Owner)</option>
            <option value="SHOP_MANAGER">Quản Lý (Manager)</option>
            <option value="SHOP_STAFF">Nhân Viên Xưởng (Staff)</option>
          </select>
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────────
          2. WORKSPACE HEADER & QUICK OPERATIONAL ACTIONS
          ────────────────────────────────────────────────────────── */}
      <section className="p-6 rounded-2xl border border-border-default bg-surface shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Bàn Vận Hành Atelier Hàng Ngày
            </span>
            <Badge tone="primary" styleVariant="soft" size="sm">
              Gói {shop.plan}
            </Badge>
            <Badge tone="neutral" styleVariant="outline" size="sm" className="font-mono">
              Vai trò: {currentRole}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {shop.name}
          </h1>
          <p className="text-xs text-ink-muted flex flex-wrap items-center gap-y-1 gap-x-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Hôm nay: <strong>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</strong>
            </span>
            <span>·</span>
            <span>{shop.address}</span>
            <span>·</span>
            <span>Hotline: <strong>{shop.phone}</strong></span>
          </p>
        </div>

        {/* Quick Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQrModalOpen(true)}
            leftIcon={<QrCode className="w-4 h-4 text-primary" />}
            className="shadow-2xs"
          >
            Quét QR Bàn Giao
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWalkInModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-2xs"
          >
            Tạo Đơn Thuê Walk-in
          </Button>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. ROLE-SENSITIVE OPERATIONAL METRICS (F02-01 RULE)
             Owner/Manager: Full operational + financial metrics
             Staff: Strictly operational task execution metrics
          ────────────────────────────────────────────────────────── */}
      <section aria-label="Chỉ số vận hành xưởng">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-xl border border-border-default bg-surface shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted">
                {isManagement ? 'Đơn Chờ Duyệt & Giữ Cọc' : 'Đơn Cần Gán Mã QR'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-ink tabular-nums block">
                {pendingApprovals.length}
              </span>
              <span className="text-[11px] text-ink-muted mt-0.5 block">
                {pendingApprovals.length > 0 ? 'Cần xử lý gán thực thể QR' : 'Đã xử lý xong toàn bộ'}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl border border-border-default bg-surface shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted">
                {isManagement ? 'Lịch Giao Nhận Hôm Nay' : 'Trang Phục Cần Bàn Giao'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-ink tabular-nums block">
                {isManagement ? todayPickups.length + todayReturns.length : todayPickups.length}
              </span>
              <span className="text-[11px] text-ink-muted mt-0.5 block">
                {todayPickups.length} lượt giao · {todayReturns.length} lượt nhận trả
              </span>
            </div>
          </div>

          {/* Card 3: Financial for Management, Operational for Staff */}
          <div className="p-5 rounded-xl border border-border-default bg-surface shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted">
                {isManagement ? 'Tiền Cọc Đang Giữ Đối Soát' : 'Đồ Cần Nhận Trả QC'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                {isManagement ? <CreditCard className="w-4 h-4" /> : <Package className="w-4 h-4" />}
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-ink tabular-nums block">
                {isManagement
                  ? `${shopOrders.reduce((sum, o) => sum + (o.depositPaid || o.depositRequired || 0), 0).toLocaleString('vi-VN')} ₫`
                  : `${todayReturns.length} đơn`}
              </span>
              <span className="text-[11px] text-ink-muted mt-0.5 block">
                {isManagement ? 'Bảo đảm an toàn tài sản xưởng' : 'Kiểm tra đường may và hấp sấy'}
              </span>
            </div>
          </div>

          {/* Card 4: Quota for Management, Washing/Prep for Staff */}
          <div className="p-5 rounded-xl border border-border-default bg-surface shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted">
                {isManagement ? 'Hạn Mức Quota Mã QR' : 'Đang Hấp Sấy Khử Khuẩn'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-surface-subtle text-ink-muted flex items-center justify-center">
                {isManagement ? <QrCode className="w-4 h-4 text-primary" /> : <RefreshCw className="w-4 h-4 text-amber-600" />}
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-ink tabular-nums block">
                {isManagement ? `${shopUnits.length} / 50 QR` : `${washingUnits.length} thực thể`}
              </span>
              <span className="text-[11px] text-ink-muted mt-0.5 block">
                {isManagement ? 'Gói Trial (14 ngày dùng thử)' : 'Buồng hấp nhiệt độ cao'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. OPERATIONAL CONFLICTS & URGENT ATELIER ALERTS
          ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="alerts-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 id="alerts-heading" className="text-sm font-bold text-ink uppercase tracking-wider">
              Xung Đột Vận Hành & Cảnh Báo Gấp ({washingUnits.length > 0 ? '2' : '1'} vụ việc)
            </h2>
          </div>
          <span className="text-xs text-ink-muted">Tự động đối soát lịch thực thể</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conflict 1: Washing delay warning */}
          {washingUnits.length > 0 ? (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge tone="warning" size="sm" withDot>
                    Trễ Hấp Sấy Khử Khuẩn
                  </Badge>
                  <span className="text-[11px] font-mono text-ink-muted">
                    QR: {washingUnits[0].qrCode}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-ink">
                  Thực thể {washingUnits[0].qrCode} đang trong buồng sấy nhưng có lịch giao lúc 14:30
                </h3>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Trang phục vừa trả hôm qua, cần hoàn tất quy trình hấp sấy y tế trước giờ khách đến nhận đồ hoặc đổi sang mã QR dự phòng.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-200/80">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleMarkReady(washingUnits[0].id, washingUnits[0].qrCode)}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Xác Nhận Đã Sấy Xong (READY)
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-2xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-ink">Buồng hấp sấy tiệt trùng an toàn</h3>
                <p className="text-[11px] text-ink-muted">Toàn bộ trang phục cho lịch giao hôm nay đã ở trạng thái READY.</p>
              </div>
            </div>
          )}

          {/* Conflict 2: Expiring Hold alert */}
          <div className="p-4 rounded-xl border border-border-default bg-surface shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge tone="info" size="sm" withDot>
                  Giữ Chỗ Sắp Hết Hạn
                </Badge>
                <span className="text-[11px] font-mono text-amber-700 font-semibold">
                  Còn 35 phút
                </span>
              </div>
              <h3 className="text-xs font-bold text-ink">
                Đơn ORD-9821 chưa thanh toán cọc giữ chỗ (300.000 ₫)
              </h3>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                Khách đặt qua Storefront. Hết thời gian giữ cọc (60 phút), hệ thống sẽ tự động giải phóng thực thể vật lý vào kho sẵn có.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-default/70">
              <span className="text-[11px] text-ink-muted">Khách: Trần Mai Phương (0912 345 678)</span>
              <a
                href="tel:0912345678"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
              >
                <Phone className="w-3 h-3" /> Gọi nhắc cọc
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. TODAY'S OPERATIONAL SCHEDULE (PICKUPS & RETURNS)
          ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="schedule-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="schedule-heading" className="text-base font-bold text-ink tracking-tight">
              Lịch Trình Vận Hành Hôm Nay
            </h2>
            <p className="text-xs text-ink-muted">Danh sách khách nhận đồ và nhận trả trang phục kiểm định QC</p>
          </div>

          {/* Schedule Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border-default shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('pickups')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pickups'
                  ? 'bg-surface text-ink shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Giao Đồ Hôm Nay ({todayPickups.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('returns')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'returns'
                  ? 'bg-surface text-ink shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Nhận Trả Đồ QC ({todayReturns.length})
            </button>
          </div>
        </div>

        {/* Schedule Table Container */}
        <div ref={scheduleTableRef} className="rounded-2xl border border-border-default bg-surface shadow-2xs overflow-hidden">
          {activeTab === 'pickups' ? (
            /* Pickups Table */
            todayPickups.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-semibold text-ink">Không có lịch giao đồ cần xử lý</h3>
                <p className="text-xs text-ink-muted">Toàn bộ khách nhận đồ hôm nay đã hoàn tất bàn giao.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Giờ Hẹn</TableHead>
                    <TableHead>Mã Đơn & Khách Hàng</TableHead>
                    <TableHead>Trang Phục Yêu Cầu</TableHead>
                    <TableHead>Mã QR Định Danh</TableHead>
                    <TableHead>Hình Thức</TableHead>
                    <TableHead className="text-right">Thao Tác Bàn Giao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayPickups.map((ord) => {
                    const item = ord.items[0];
                    const qr = item?.assignedQrCode || 'Chờ gán';
                    return (
                      <TableRow key={ord.id} className="schedule-row-item">
                        <TableCell className="font-semibold text-xs text-ink">
                          10:30 Sáng
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs font-bold text-primary block leading-none mb-0.5">
                            {ord.code}
                          </span>
                          <span className="font-medium text-xs text-ink block">{ord.customer.name}</span>
                          <span className="text-[11px] text-ink-muted block">{ord.customer.phone}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium text-ink block">{item?.productTitle || 'Trang phục'}</span>
                          <span className="text-[11px] text-ink-muted">Size: {item?.size} · {item?.color}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            tone={qr !== 'Chờ gán' ? 'primary' : 'warning'}
                            styleVariant="outline"
                            size="sm"
                            className="font-mono font-semibold"
                          >
                            {qr}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-ink-muted block">
                            {ord.deliveryMethod === 'STORE_PICKUP' ? 'Thử tại xưởng' : 'Giao hỏa tốc'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirmHandover(ord.id, qr !== 'Chờ gán' ? qr : undefined)}
                            leftIcon={<QrCode className="w-3.5 h-3.5" />}
                          >
                            Bàn Giao Đồ
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          ) : (
            /* Returns Table */
            todayReturns.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-semibold text-ink">Chưa có đồ hoàn trả cần kiểm định</h3>
                <p className="text-xs text-ink-muted">Các đơn thuê hiện tại đang trong kỳ sử dụng của khách.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hạn Trả</TableHead>
                    <TableHead>Mã Đơn & Người Trả</TableHead>
                    <TableHead>Mã QR Thu Hồi</TableHead>
                    <TableHead>Trạng Thái Hiện Tại</TableHead>
                    <TableHead className="text-right">Quy Trình Hoàn Đồ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayReturns.map((ord) => {
                    const item = ord.items[0];
                    return (
                      <TableRow key={ord.id} className="schedule-row-item">
                        <TableCell className="font-semibold text-xs text-ink">
                          Hôm nay (18:00)
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs font-bold text-primary block leading-none mb-0.5">
                            {ord.code}
                          </span>
                          <span className="font-medium text-xs text-ink block">{ord.customer.name}</span>
                          <span className="text-[11px] text-ink-muted block">{ord.customer.phone}</span>
                        </TableCell>
                        <TableCell>
                          <Badge tone="primary" size="sm" className="font-mono font-semibold">
                            {item?.assignedQrCode || 'DX-VN-02'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge tone="info" size="sm" withDot>
                            Khách đang thuê
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfirmReturn(ord.id, item?.assignedUnitId)}
                            leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
                          >
                            Kiểm Định & Nhận Đồ
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. PENDING RENTAL APPROVALS (ĐƠN ONLINE CẦN GÁN MÃ QR)
          ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="approvals-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="approvals-heading" className="text-base font-bold text-ink tracking-tight">
              Đơn Thuê Mới Cần Duyệt & Giữ Chỗ
            </h2>
            <p className="text-xs text-ink-muted">
              Đơn từ khách hàng qua Storefront — Cần nhân viên xưởng kiểm tra kho và gán mã QR định danh
            </p>
          </div>
          <span className="text-xs font-medium text-primary">
            {pendingApprovals.length} đơn chờ xử lý
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-border-default bg-surface/60 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-semibold text-ink">Không có đơn thuê nào đang chờ duyệt</h3>
            <p className="text-xs text-ink-muted">Toàn bộ yêu cầu thuê đồ từ storefront đã được xác nhận.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((ord) => {
              const item = ord.items[0];
              const availableUnitsForProduct = shopUnits.filter(
                (u) => u.productId === item?.productId && u.physicalStatus === 'READY'
              );

              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl border border-border-default bg-surface shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border-default pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary block leading-none">
                          {ord.code}
                        </span>
                        <span className="text-[11px] text-ink-muted mt-1 block">
                          Tạo lúc: {formatVNDate(ord.createdAt)}
                        </span>
                      </div>
                      <Badge tone="warning" size="sm" withDot>
                        {ord.status === 'HELD' ? 'Đang giữ chỗ cọc' : 'Chờ duyệt gán QR'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={item?.productImage || '/images/demo/product-emerald-gown.jpg'}
                        alt={item?.productTitle || 'Trang phục'}
                        className="w-14 h-18 object-cover rounded-lg border border-border-default shrink-0 bg-surface-subtle"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-ink truncate leading-snug">
                          {item?.productTitle}
                        </h4>
                        <div className="text-[11px] text-ink-muted space-x-2">
                          <span>Size: <strong className="text-ink">{item?.size}</strong></span>
                          <span>•</span>
                          <span>Thuê: <strong>{formatVNDate(ord.pickupDate)} → {formatVNDate(ord.returnDueDate)}</strong></span>
                        </div>
                        <div className="text-xs font-medium text-primary">
                          Tiền thuê: {ord.rentalTotal.toLocaleString('vi-VN')} ₫
                          {isManagement && (
                            <span className="text-ink-subtle text-[11px] font-normal ml-2">
                              (Cọc: {ord.depositRequired.toLocaleString('vi-VN')} ₫)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-default/80 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-ink">{ord.customer.name}</span>
                      </div>
                      <a href={`tel:${ord.customer.phone}`} className="text-primary hover:underline font-mono text-[11px]">
                        {ord.customer.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-border-default/80">
                    <span className="text-[11px] text-ink-muted">
                      Kho sẵn sàng: <strong className="text-ink">{availableUnitsForProduct.length} thực thể QR</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveOrder(ord)}
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                      >
                        Duyệt & Gán QR
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. MODAL: QUÉT QR BÀN GIAO THỰC THỂ
          ────────────────────────────────────────────────────────── */}
      <Dialog
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" />
            <span>Quét Mã QR Bàn Giao Trang Phục</span>
          </div>
        }
        description="Quét mã QR dán trên nhãn trang phục bằng máy quét hoặc nhập mã định danh vật lý"
      >
        <div className="space-y-4 pt-2">
          <div className="p-6 rounded-xl border border-dashed border-border-default bg-surface-subtle text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-surface border border-border-default flex items-center justify-center mx-auto text-primary shadow-2xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-ink block">
                Camera máy quét đang ở chế độ chờ
              </span>
              <p className="text-[11px] text-ink-muted">
                Hướng camera thiết bị về phía tem định danh mã QR trên trang phục
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">Hoặc nhập mã QR thủ công:</label>
            <div className="flex gap-2">
              <Input
                placeholder="VD: DX-EM-01..."
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="font-mono text-xs uppercase"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!qrInput.trim()) {
                    toast.error('Vui lòng nhập mã QR!');
                    return;
                  }
                  toast.success(`Đã quét mã QR ${qrInput.trim().toUpperCase()}! Trạng thái: READY.`);
                  setIsQrModalOpen(false);
                  setQrInput('');
                }}
              >
                Xác Nhận
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────
          8. MODAL: TẠO ĐƠN THUÊ WALK-IN TRỰC TIẾP TẠI XƯỞNG
          ────────────────────────────────────────────────────────── */}
      <Dialog
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        maxWidth="md"
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span>Tạo Đơn Thuê Walk-in Tại Xưởng</span>
          </div>
        }
        description="Dành cho khách hàng đến trực tiếp xưởng may thử đồ và ký nhận thuê ngay"
      >
        <form onSubmit={handleCreateWalkIn} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tên Khách Hàng" required>
              <Input
                placeholder="VD: Phạm Thu Hà..."
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Số Điện Thoại" required>
              <Input
                placeholder="0918 765 432"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Chọn Trang Phục Thuê" required>
            <Select
              value={walkInProductId}
              onChange={(e) => setWalkInProductId(e.target.value)}
              options={[
                { value: '', label: '-- Chọn trang phục có sẵn trong kho --' },
                ...storeState.products
                  .filter((p) => p.shopId === shop.id)
                  .map((p) => ({
                    value: p.id,
                    label: `${p.title} (${p.rentalPrice.toLocaleString('vi-VN')} ₫ / 3 ngày)`,
                  })),
              ]}
            />
          </FormField>

          <FormField label="Thời Hạn Thuê">
            <Select
              value={String(walkInDays)}
              onChange={(e) => setWalkInDays(Number(e.target.value))}
              options={[
                { value: '3', label: '3 Ngày (Gói tiêu chuẩn dự tiệc)' },
                { value: '5', label: '5 Ngày (Gói đi công tác / sự kiện xa)' },
                { value: '7', label: '7 Ngày (Gói tuần cưới hỏi)' },
              ]}
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
            <Button type="button" variant="ghost" onClick={() => setIsWalkInModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Tạo Đơn & Gán Mã QR
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export const DashboardSubpagePlaceholder: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="p-8 rounded-2xl border border-dashed border-border-default bg-surface/60 text-center space-y-3 font-sans">
      <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center mx-auto text-ink-muted shadow-2xs">
        <Package className="w-6 h-6 stroke-[1.25]" />
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
};

