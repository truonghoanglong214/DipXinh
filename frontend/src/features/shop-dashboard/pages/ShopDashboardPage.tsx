import React, { useState } from 'react';
import {
  Shop,
  Product,
  RentalUnit,
  RentalOrder,
  PaymentEntry,
  DepositTransaction,
  IncidentRecord,
  RefundRequest,
  UserRole,
  UnitCondition,
  FittingAppointment,
  StaffMember,
  CustomerProfile,
  WaitlistEntry,
} from '@/shared/model/domain';
import {
  LayoutDashboard,
  Package,
  QrCode,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Plus,
  Search,
  Filter,
  X,
  ChevronRight,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  User,
  Users,
  Settings,
  CalendarDays,
  Columns,
  Scissors,
  Globe,
  Store,
  Layers,
} from 'lucide-react';

interface ShopDashboardPageProps {
  shop: Shop;
  shops: Shop[];
  currentRole: UserRole;
  products: Product[];
  rentalUnits: RentalUnit[];
  orders: RentalOrder[];
  payments: PaymentEntry[];
  depositTransactions: DepositTransaction[];
  incidents: IncidentRecord[];
  refunds: RefundRequest[];
  fittings: FittingAppointment[];
  staffMembers: StaffMember[];
  customers: CustomerProfile[];
  waitlist: WaitlistEntry[];
  onAddProduct: (product: Omit<Product, 'id'>, initialUnits: { size: string; color: string; count: number }[]) => void;
  onUpdateUnitStatus: (unitId: string, status: RentalUnit['physicalStatus'], condition?: UnitCondition) => void;
  onApproveOrderAndHold: (orderId: string, itemAssignments: { itemId: string; unitId: string }[]) => { success: boolean; error?: string };
  onRecordPayment: (orderId: string, type: PaymentEntry['type'], amount: number, method: PaymentEntry['method'], referenceCode?: string, notes?: string) => void;
  onVerifyPayment: (paymentId: string) => { success: boolean; error?: string };
  onHandoverOrder: (orderId: string) => { success: boolean; error?: string };
  onProcessReturnBatch: (
    orderId: string,
    returnedItems: {
      itemId: string;
      condition: UnitCondition;
      needsWashing: boolean;
      incidentNote?: string;
    }[]
  ) => { success: boolean; returnedCount: number; remainingCount: number; error?: string };
  onCreateIncident: (orderId: string, itemId: string, type: IncidentRecord['type'], proposedFee: number, notes: string) => void;
  onFinalizeIncident: (incidentId: string, finalizedFee: number) => { success: boolean; error?: string };
  onRequestRefund: (params: {
    orderId: string;
    amount: number;
    bankAccount: string;
    bankName: string;
    recipientName: string;
    reason: string;
  }) => { success: boolean; refund?: RefundRequest; error?: string };
  onVerifyRefund: (refundId: string) => { success: boolean; error?: string };
  onCreateWalkInOrder: (params: {
    shopId: string;
    customer: RentalOrder['customer'];
    items: {
      productId: string;
      variantId: string;
      unitId: string;
      size: string;
      color: string;
    }[];
    pickupDate: string;
    returnDueDate: string;
    notes?: string;
  }) => { success: boolean; order?: RentalOrder; error?: string };
  onUpdateFittingStatus: (id: string, status: FittingAppointment['status']) => void;
  onToggleStaffActive: (id: string) => void;
  onAddStaffMember: (staff: Omit<StaffMember, 'id'>) => void;
  onUpdateShopSettings: (shopId: string, settings: Partial<Shop>) => void;
}

const roleLabels: Record<UserRole, string> = {
  PLATFORM_ADMIN: 'Quản trị nền tảng',
  SHOP_OWNER: 'Chủ cửa hàng',
  SHOP_MANAGER: 'Quản lý',
  SHOP_STAFF: 'Nhân viên',
  CUSTOMER: 'Khách hàng',
};

export const ShopDashboardPage: React.FC<ShopDashboardPageProps> = ({
  shop,
  shops,
  currentRole,
  products,
  rentalUnits,
  orders,
  payments,
  depositTransactions,
  incidents,
  refunds,
  fittings,
  staffMembers,
  customers,
  waitlist,
  onAddProduct,
  onUpdateUnitStatus,
  onApproveOrderAndHold,
  onRecordPayment,
  onVerifyPayment,
  onHandoverOrder,
  onProcessReturnBatch,
  onCreateIncident,
  onFinalizeIncident,
  onRequestRefund,
  onVerifyRefund,
  onCreateWalkInOrder,
  onUpdateFittingStatus,
  onToggleStaffActive,
  onAddStaffMember,
  onUpdateShopSettings,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'calendar'
    | 'catalog'
    | 'units'
    | 'kanban'
    | 'pos'
    | 'orders'
    | 'handover'
    | 'returns'
    | 'incidents'
    | 'fittings'
    | 'customers'
    | 'staff'
    | 'finance'
    | 'settings'
    | 'platform'
  >('overview');

  // Filter orders by shop
  const shopOrders = orders.filter((o) => o.shopId === shop.id);
  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const shopProductIds = shopProducts.map((p) => p.id);
  const shopUnits = rentalUnits.filter((u) => shopProductIds.includes(u.productId));
  const shopFittings = fittings.filter((f) => f.shopId === shop.id);
  const shopStaff = staffMembers.filter((s) => s.shopId === shop.id);
  const shopCustomers = customers.filter((c) => c.shopId === shop.id);

  // Selected Order for Detail Drawer
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = shopOrders.find((o) => o.id === selectedOrderId) || null;

  // Filter state for orders
  const [orderFilter, setOrderFilter] = useState<string>('ALL');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [assignQrModalOrderId, setAssignQrModalOrderId] = useState<string | null>(null);
  const [paymentModalOrderId, setPaymentModalOrderId] = useState<string | null>(null);
  const [refundModalOrderId, setRefundModalOrderId] = useState<string | null>(null);
  const [incidentModalParams, setIncidentModalParams] = useState<{ orderId: string; itemId: string } | null>(null);

  // Partial Return Batch Selection
  const [selectedReturnOrderId, setSelectedReturnOrderId] = useState<string>('ord-2');
  const [returnItemStates, setReturnItemStates] = useState<{
    [itemId: string]: { selected: boolean; condition: UnitCondition; needsWashing: boolean; note: string };
  }>({});

  // Walk-in POS state (D-13)
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posSelectedUnitId, setPosSelectedUnitId] = useState('');
  const [posPickupDate, setPosPickupDate] = useState('2026-10-14');
  const [posReturnDate, setPosReturnDate] = useState('2026-10-17');
  const [posNotes, setPosNotes] = useState('');

  // Settings form state
  const [settingsPhone, setSettingsPhone] = useState(shop.phone);
  const [settingsAddress, setSettingsAddress] = useState(shop.address);
  const [settingsAccent, setSettingsAccent] = useState(shop.accentColor);
  const [settingsHoldHours, setSettingsHoldHours] = useState(shop.depositHoldHours || 1);

  // KPI calculations
  const pendingReviewCount = shopOrders.filter((o) => o.status === 'PENDING_REVIEW').length;
  const needsHandoverCount = shopOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'HELD').length;
  const activeRentalsCount = shopOrders.filter((o) => o.status === 'ACTIVE' || o.status === 'PARTIALLY_RETURNED').length;
  const washingUnitsCount = shopUnits.filter((u) => u.physicalStatus === 'WASHING').length;

  return (
    <div className="dashboard-shell min-h-screen bg-[#FCF9F5] text-[#302824] flex flex-col md:flex-row">
      {/* Left navigation */}
      <aside className="w-full md:w-[17rem] bg-[#FFFDFC] border-r border-[#E8DFD8] p-4 flex flex-col justify-between shrink-0 max-h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Shop Context Header */}
          <div className="border-b border-[#E8DFD8] px-2 pb-4">
            <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#713F4B]">
              Cửa hàng tác nghiệp
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-[#302824]">
              {shop.name}
            </div>
            <div className="text-[11px] text-[#756A64] mt-1 flex items-center justify-between">
              <span>Gói <strong>{shop.plan}</strong></span>
              <span className="text-[#38705A] font-medium">● Hoạt động</span>
            </div>
          </div>

          {/* Group 1: Tác nghiệp & Tồn kho */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928780]">
              Vận hành &amp; Tồn kho
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#713F4B]" />
                Tổng quan
              </span>
              {pendingReviewCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#966421] text-white rounded">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#713F4B]" />
                Lịch khả dụng
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#713F4B]" />
                Sản phẩm &amp; Tồn bán
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopProducts.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('units')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'units'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#713F4B]" />
                Đơn vị QR cho thuê
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopUnits.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'kanban'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-[#713F4B]" />
                Giặt ủi &amp; bảo dưỡng
              </span>
              {washingUnitsCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#713F4B] text-white rounded">
                  {washingUnitsCount}
                </span>
              )}
            </button>
          </div>

          {/* Group 2: Đơn thuê & Quầy giao nhận */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928780]">
              Đơn thuê &amp; Quầy
            </div>

            <button
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'pos'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#713F4B]" />
                Tạo đơn tại quầy
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#713F4B]" />
                Đơn thuê &amp; duyệt lịch
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopOrders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('handover')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'handover'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#713F4B]" />
                Bàn giao trang phục
              </span>
              {needsHandoverCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#416C82] text-white rounded">
                  {needsHandoverCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('returns')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'returns'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#713F4B]" />
                Nhận trả đồ theo đợt
              </span>
              {activeRentalsCount > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#5C303B] text-white rounded">
                  {activeRentalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'incidents'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#713F4B]" />
                Sự cố &amp; đề xuất phí
              </span>
              {incidents.length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#A94545] text-white rounded">
                  {incidents.length}
                </span>
              )}
            </button>
          </div>

          {/* Group 3: Khách hàng & Tài chính */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928780]">
              Khách hàng &amp; Tài chính
            </div>

            <button
              onClick={() => setActiveTab('fittings')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'fittings'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#713F4B]" />
                Lịch thử đồ
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopFittings.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'customers'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#713F4B]" />
                Khách hàng &amp; số đo
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopCustomers.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'finance'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#713F4B]" />
                Ký quỹ &amp; Hoàn cọc
              </span>
              {refunds.filter((r) => r.status === 'PROCESSING').length > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#966421] text-white rounded">
                  {refunds.filter((r) => r.status === 'PROCESSING').length}
                </span>
              )}
            </button>
          </div>

          {/* Group 4: Thiết lập & Nền tảng */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928780]">
              Cấu hình &amp; Quản trị
            </div>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'staff'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#713F4B]" />
                Nhân viên &amp; quyền
              </span>
              <span className="text-[11px] font-medium text-[#928780]">{shopStaff.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#713F4B]" />
                Cài đặt &amp; hạn mức
              </span>
            </button>

            <button
              onClick={() => setActiveTab('platform')}
              className={`w-full flex items-center justify-between border-l-2 px-3 py-2.5 text-[13px] font-medium leading-5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'platform'
                  ? 'border-l-[#713F4B] bg-[#ECDAD8]/55 font-semibold text-[#302824]'
                  : 'border-l-transparent text-[#756A64] hover:bg-[#FCF9F5] hover:text-[#302824]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#713F4B]" />
                Quản trị nền tảng
              </span>
              <span className="font-mono text-[10px] px-1 bg-stone-100 text-stone-600 rounded">SaaS</span>
            </button>
          </div>
        </div>

        {/* User Role Card */}
        <div className="pt-4 border-t border-[#E8DFD8] text-xs text-[#756A64] mt-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#713F4B]" />
            <div>
              <div className="font-semibold text-[#302824]">Tài khoản hiện tại</div>
              <div className="text-[11px] text-[#713F4B]">{roleLabels[currentRole]}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW: OVERVIEW (D-01) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#302824]">
                  Tổng quan tác nghiệp hôm nay
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Tập trung vào 4 chỉ số vận hành quan trọng trước khi giao dịch.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pos')}
                  className="px-3.5 py-2 text-xs font-semibold text-[#302824] bg-[#ECDAD8] hover:bg-[#DABFBC] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Scissors className="w-3.5 h-3.5 text-[#5C303B]" />
                  Tạo đơn tại quầy (POS)
                </button>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ECDAD8]" />
                  Thêm sản phẩm mới
                </button>
              </div>
            </div>

            {/* 4 Core Daily KPI Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  setActiveTab('orders');
                  setOrderFilter('PENDING_REVIEW');
                }}
                className="group cursor-pointer border border-[#E8DFD8] border-t-2 border-t-[#966421] bg-[#FFFDFC] p-5 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between text-xs text-[#756A64] mb-2">
                  <span className="font-medium">Đơn chờ duyệt</span>
                  <Clock className="w-4 h-4 text-[#966421]" />
                </div>
                <div className="font-mono text-3xl font-bold text-[#966421] tabular-nums">
                  {pendingReviewCount}
                </div>
                <div className="text-[11px] text-[#756A64] mt-1">Chưa gán mã QR · Cần phản hồi</div>
              </div>

              <div
                onClick={() => setActiveTab('handover')}
                className="group cursor-pointer border border-[#E8DFD8] border-t-2 border-t-[#416C82] bg-[#FFFDFC] p-5 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between text-xs text-[#756A64] mb-2">
                  <span className="font-medium">Cần bàn giao hôm nay</span>
                  <Truck className="w-4 h-4 text-[#416C82]" />
                </div>
                <div className="font-mono text-3xl font-bold text-[#416C82] tabular-nums">
                  {needsHandoverCount}
                </div>
                <div className="text-[11px] text-[#756A64] mt-1">Đã gán QR · Sẵn sàng quét xuất kho</div>
              </div>

              <div
                onClick={() => setActiveTab('returns')}
                className="group cursor-pointer border border-[#E8DFD8] border-t-2 border-t-[#713F4B] bg-[#FFFDFC] p-5 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between text-xs text-[#756A64] mb-2">
                  <span className="font-medium">Đang thuê / Chờ nhận trả</span>
                  <RotateCcw className="w-4 h-4 text-[#5C303B]" />
                </div>
                <div className="font-mono text-3xl font-bold text-[#5C303B] tabular-nums">
                  {activeRentalsCount}
                </div>
                <div className="text-[11px] text-[#756A64] mt-1">Bao gồm đơn trả một phần</div>
              </div>

              <div
                onClick={() => setActiveTab('kanban')}
                className="group cursor-pointer border border-[#E8DFD8] border-t-2 border-t-[#A98758] bg-[#FFFDFC] p-5 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between text-xs text-[#756A64] mb-2">
                  <span className="font-medium">Đồ đang giặt ủi</span>
                  <QrCode className="w-4 h-4 text-[#713F4B]" />
                </div>
                <div className="font-mono text-3xl font-bold text-[#713F4B] tabular-nums">
                  {washingUnitsCount}
                </div>
                <div className="text-[11px] text-[#756A64] mt-1">Mã QR tạm khóa đến khi kiểm tra đạt</div>
              </div>
            </div>

            {/* Quick Action Queue Table */}
            <div className="space-y-4 border border-[#E8DFD8] bg-[#FFFDFC] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-[#302824]">
                  Đơn cần thao tác ngay
                </h3>
                <span className="text-xs text-[#756A64]">{shopOrders.length} đơn trên toàn hệ thống</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Mã đơn</th>
                      <th className="py-2.5 px-3 font-semibold">Khách hàng</th>
                      <th className="py-2.5 px-3 font-semibold">Sản phẩm</th>
                      <th className="py-2.5 px-3 font-semibold">Thời gian nhận</th>
                      <th className="py-2.5 px-3 font-semibold">Trạng thái đơn</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD8]">
                    {shopOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FCF9F5]/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#302824]">{ord.code}</td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[#302824]">{ord.customer.name}</div>
                          <div className="text-[11px] text-[#756A64]">{ord.customer.phone}</div>
                        </td>
                        <td className="py-3 px-3">
                          {ord.items.map((i) => (
                            <div key={i.id} className="text-[#302824]">
                              {i.productTitle} ({i.size})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 text-[#756A64]">
                          {new Date(ord.pickupDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 px-3">
                          {ord.status === 'PENDING_REVIEW' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Chờ duyệt (Chưa gán QR)
                            </span>
                          )}
                          {ord.status === 'HELD' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#713F4B]/15 text-[#5C303B] border border-[#713F4B]/30">
                              Đang giữ chỗ
                            </span>
                          )}
                          {ord.status === 'CONFIRMED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              Đã xác nhận
                            </span>
                          )}
                          {ord.status === 'ACTIVE' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#416C82]/10 text-[#416C82] border border-[#416C82]/20">
                              Đang thuê (Đã giao QR)
                            </span>
                          )}
                          {ord.status === 'PARTIALLY_RETURNED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Đã trả 1 phần
                            </span>
                          )}
                          {ord.status === 'COMPLETED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              Hoàn tất
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrderId(ord.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#302824] bg-[#FCF9F5] hover:bg-[#ECDAD8] border border-[#E8DFD8] rounded transition-colors cursor-pointer"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RENTAL AVAILABILITY CALENDAR (D-11) */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Lịch khả dụng theo từng mã QR
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Lưới thời gian trực quan kiểm tra lịch trống, tránh hoàn toàn lỗi đụng lịch (Overbooking).
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-2.5 rounded-xl border border-[#E8DFD8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm" /> Sẵn sàng (READY)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-500 rounded-sm" /> Giữ chỗ (HELD)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-600 rounded-sm" /> Đang thuê (ACTIVE)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-stone-400 rounded-sm" /> Đang giặt (WASHING)
                </span>
              </div>
            </div>

            {/* Timeline Matrix */}
            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DFD8] bg-[#FCF9F5]">
                      <th className="p-3 font-semibold text-[#302824] min-w-[140px]">Mã QR Đồ Thật</th>
                      <th className="p-3 font-semibold text-[#302824] min-w-[180px]">Tên trang phục</th>
                      {['13/10', '14/10', '15/10', '16/10', '17/10', '18/10', '19/10', '20/10'].map((d) => (
                        <th key={d} className="p-3 text-center font-mono font-semibold text-[#756A64] min-w-[75px]">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD8]">
                    {shopUnits.map((u) => {
                      const prod = products.find((p) => p.id === u.productId);

                      return (
                        <tr key={u.id} className="hover:bg-[#FCF9F5]/40">
                          <td className="p-3 font-mono font-bold text-[#713F4B] whitespace-nowrap">
                            {u.qrCode}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-semibold text-[#302824]">{prod?.title}</div>
                            <div className="text-[11px] text-[#756A64]">Size {u.size} · {u.color}</div>
                          </td>

                          {/* Simulation Slots */}
                          {['13/10', '14/10', '15/10', '16/10', '17/10', '18/10', '19/10', '20/10'].map((d, idx) => {
                            let slotStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                            let slotText = 'Trống';

                            if (u.physicalStatus === 'WASHING' && idx < 3) {
                              slotStyle = 'bg-stone-100 text-stone-600 border-stone-300';
                              slotText = 'Giặt ủi';
                            } else if (u.physicalStatus === 'RENTED' && idx >= 1 && idx <= 4) {
                              slotStyle = 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
                              slotText = 'Đang thuê';
                            } else if (u.physicalStatus === 'HELD' && idx >= 2 && idx <= 5) {
                              slotStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
                              slotText = 'Giữ chỗ';
                            }

                            return (
                              <td key={d} className="p-2 text-center">
                                <div className={`py-1.5 px-2 rounded border text-[11px] ${slotStyle}`}>
                                  {slotText}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: READINESS KANBAN (D-21) */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Kiểm tra &amp; quy trình giặt ủi
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Theo dõi trạng thái vật lý của trang phục sau khi nhận trả từ khách.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Col 1: Cần kiểm tra */}
              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#E8DFD8] flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-2">
                  <h4 className="font-bold text-xs text-[#302824]">1. Cần Kiểm Tra (0)</h4>
                  <span className="w-2 h-2 rounded-full bg-stone-300" />
                </div>
                <div className="space-y-2 text-xs text-[#756A64] py-8 text-center italic">
                  Không có đồ nào đang chờ kiểm tra sơ bộ.
                </div>
              </div>

              {/* Col 2: Đang giặt ủi (WASHING) */}
              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#E8DFD8] flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-2">
                  <h4 className="font-bold text-xs text-[#713F4B]">
                    2. Đang Giặt Ủi ({shopUnits.filter((u) => u.physicalStatus === 'WASHING').length})
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-[#713F4B]" />
                </div>
                <div className="space-y-2">
                  {shopUnits
                    .filter((u) => u.physicalStatus === 'WASHING')
                    .map((u) => {
                      const prod = products.find((p) => p.id === u.productId);
                      return (
                        <div key={u.id} className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] text-xs space-y-2">
                          <div className="font-bold font-mono text-[#713F4B]">{u.qrCode}</div>
                          <div className="font-medium text-[#302824]">{prod?.title}</div>
                          <div className="text-[11px] text-[#756A64]">Size {u.size} · {u.color}</div>
                          <button
                            onClick={() => onUpdateUnitStatus(u.id, 'READY', 'EXCELLENT')}
                            className="w-full py-1.5 px-2 bg-[#38705A] text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            ✓ Đã giặt xong (Sẵn sàng)
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Col 3: Đang sửa chữa (DAMAGED) */}
              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#E8DFD8] flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-2">
                  <h4 className="font-bold text-xs text-[#A94545]">
                    3. Đang Phục Hồi ({shopUnits.filter((u) => u.physicalStatus === 'DAMAGED').length})
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-[#A94545]" />
                </div>
                <div className="space-y-2">
                  {shopUnits
                    .filter((u) => u.physicalStatus === 'DAMAGED')
                    .map((u) => {
                      const prod = products.find((p) => p.id === u.productId);
                      return (
                        <div key={u.id} className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] text-xs space-y-2">
                          <div className="font-bold font-mono text-[#A94545]">{u.qrCode}</div>
                          <div className="font-medium text-[#302824]">{prod?.title}</div>
                          <button
                            onClick={() => onUpdateUnitStatus(u.id, 'READY', 'GOOD')}
                            className="w-full py-1.5 px-2 bg-[#302824] text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            ✓ Đã sửa đạt (Chuyển Sẵn sàng)
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Col 4: Sẵn sàng cho thuê (READY) */}
              <div className="bg-[#FFFDFC] p-4 rounded-2xl border border-[#E8DFD8] flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-2">
                  <h4 className="font-bold text-xs text-[#38705A]">
                    4. Đã Sẵn Sàng ({shopUnits.filter((u) => u.physicalStatus === 'READY').length})
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-[#38705A]" />
                </div>
                <div className="space-y-2">
                  {shopUnits
                    .filter((u) => u.physicalStatus === 'READY')
                    .map((u) => {
                      const prod = products.find((p) => p.id === u.productId);
                      return (
                        <div key={u.id} className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold font-mono text-[#713F4B]">{u.qrCode}</span>
                            <span className="text-[10px] text-[#38705A] font-semibold">Ready</span>
                          </div>
                          <div className="font-medium text-[#302824] mt-1">{prod?.title}</div>
                          <div className="text-[11px] text-[#756A64]">Size {u.size} · {u.condition}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STAFF WALK-IN POS BOOKING (D-13) */}
        {activeTab === 'pos' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#302824]">
                Tạo đơn thuê trực tiếp tại quầy
              </h2>
              <p className="text-xs text-[#756A64] mt-0.5">
                Nhân viên lập hợp đồng cho khách đến thử đồ trực tiếp tại showroom, chọn mã QR sẵn sàng và khóa giữ chỗ ngay.
              </p>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-2xs space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!posSelectedUnitId) {
                    alert('Vui lòng chọn 1 mã QR vật lý sẵn sàng!');
                    return;
                  }
                  const unit = rentalUnits.find((u) => u.id === posSelectedUnitId);
                  if (!unit) return;
                  const prod = products.find((p) => p.id === unit.productId);
                  if (!prod) return;

                  const res = onCreateWalkInOrder({
                    shopId: shop.id,
                    customer: {
                      name: posCustomerName.trim() || 'Khách vãng lai tại quầy',
                      phone: posCustomerPhone.trim() || '0900000000',
                    },
                    items: [
                      {
                        productId: prod.id,
                        variantId: unit.variantId,
                        unitId: unit.id,
                        size: unit.size,
                        color: unit.color,
                      },
                    ],
                    pickupDate: `${posPickupDate}T09:00:00Z`,
                    returnDueDate: `${posReturnDate}T18:00:00Z`,
                    notes: posNotes,
                  });

                  if (res.success) {
                    alert(`Đã tạo đơn tại quầy thành công! Mã đơn: ${res.order?.code}. Mã QR ${unit.qrCode} đã được gán giữ chỗ (HELD).`);
                    setActiveTab('orders');
                  } else {
                    alert(res.error);
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">
                      Họ tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      placeholder="VD: Nguyễn Kiều My"
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={posCustomerPhone}
                      onChange={(e) => setPosCustomerPhone(e.target.value)}
                      placeholder="0918 222 333"
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#302824] mb-1">
                    Chọn trang phục &amp; mã QR sẵn sàng trong kho <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={posSelectedUnitId}
                    onChange={(e) => setPosSelectedUnitId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg text-sm font-mono font-bold"
                  >
                    <option value="">-- Chọn mã QR có sẵn --</option>
                    {shopUnits
                      .filter((u) => u.physicalStatus === 'READY')
                      .map((u) => {
                        const prod = products.find((p) => p.id === u.productId);
                        return (
                          <option key={u.id} value={u.id}>
                            [{u.qrCode}] {prod?.title} - Size {u.size} ({prod?.rentalPrice.toLocaleString('vi-VN')}đ)
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Ngày nhận đồ</label>
                    <input
                      type="date"
                      value={posPickupDate}
                      onChange={(e) => setPosPickupDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Hạn trả đồ</label>
                    <input
                      type="date"
                      value={posReturnDate}
                      onChange={(e) => setPosReturnDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Ghi chú tại quầy</label>
                  <textarea
                    rows={2}
                    value={posNotes}
                    onChange={(e) => setPosNotes(e.target.value)}
                    placeholder="Khách thử vừa in dáng, hẹn lấy thêm khăn quàng..."
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 text-[#ECDAD8]" />
                    Lập Đơn &amp; Khóa Mã QR Giữ Chỗ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: FITTINGS APPOINTMENTS (D-24) */}
        {activeTab === 'fittings' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Lịch thử đồ tại showroom
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Lưu ý nghiệp vụ quan trọng: Đặt lịch thử đồ <strong>KHÔNG GIỮ MÃ QR TRANG PHỤC</strong>.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Khách hẹn</th>
                    <th className="py-3 px-4 font-semibold">Ngày hẹn</th>
                    <th className="py-3 px-4 font-semibold">Khung giờ</th>
                    <th className="py-3 px-4 font-semibold">Mẫu dự định thử</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopFittings.map((f) => (
                    <tr key={f.id} className="hover:bg-[#FCF9F5]/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#302824]">{f.customerName}</div>
                        <div className="text-[11px] text-[#756A64]">{f.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium">{f.date}</td>
                      <td className="py-3.5 px-4 font-mono text-[#713F4B] font-bold">{f.timeSlot}</td>
                      <td className="py-3.5 px-4 text-[#302824]">{f.desiredProductTitle || 'Tư vấn tại shop'}</td>
                      <td className="py-3.5 px-4">
                        {f.status === 'SCHEDULED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Đã đặt lịch
                          </span>
                        )}
                        {f.status === 'COMPLETED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Đã đến thử
                          </span>
                        )}
                        {f.status === 'CANCELLED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] text-stone-500">Đã hủy</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {f.status === 'SCHEDULED' && (
                          <>
                            <button
                              onClick={() => onUpdateFittingStatus(f.id, 'COMPLETED')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#38705A] rounded"
                            >
                              Xác nhận đã đến
                            </button>
                            <button
                              onClick={() => onUpdateFittingStatus(f.id, 'CANCELLED')}
                              className="px-2 py-1 text-[11px] text-stone-500 hover:text-stone-700"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: CUSTOMERS CRM & MEASUREMENTS (D-17) */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Khách hàng &amp; hồ sơ số đo
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Lưu trữ số đo 3 vòng, chiều cao, cân nặng và lịch sử thuê để tư vấn may đo chuẩn xác.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tên khách hàng</th>
                    <th className="py-3 px-4 font-semibold">Liên hệ</th>
                    <th className="py-3 px-4 font-semibold">Chiều cao / Cân nặng</th>
                    <th className="py-3 px-4 font-semibold">Số đo 3 vòng (Ngực-Eo-Mông)</th>
                    <th className="py-3 px-4 font-semibold">Số lần thuê</th>
                    <th className="py-3 px-4 font-semibold">Ghi chú vóc dáng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FCF9F5]/50">
                      <td className="py-3.5 px-4 font-bold text-[#302824]">{c.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[#302824]">{c.phone}</div>
                        {c.email && <div className="text-[11px] text-[#756A64]">{c.email}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {c.height ? `${c.height}cm` : '--'} · {c.weight ? `${c.weight}kg` : '--'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#713F4B]">
                        {c.bust || '--'} · {c.waist || '--'} · {c.hip || '--'} cm
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#38705A]">{c.totalRentals} lần</td>
                      <td className="py-3.5 px-4 text-[#756A64] max-w-xs">{c.notes || 'Chưa có ghi chú.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: STAFF & PERMISSIONS (D-35) */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Nhân viên &amp; phân quyền
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Phân định rõ quyền hạn theo vai trò (Chủ shop, Quản lý, Nhân viên thu ngân/quầy).
                </p>
              </div>

              <button
                onClick={() => {
                  const name = prompt('Nhập họ tên nhân viên mới:');
                  if (name) {
                    const phone = prompt('Nhập SĐT nhân viên:') || '0900000000';
                    onAddStaffMember({
                      shopId: shop.id,
                      name,
                      email: `${name.toLowerCase().replace(/\s+/g, '')}@dipxinh.com`,
                      phone,
                      role: 'SHOP_STAFF',
                      active: true,
                      permissions: ['SCAN_QR', 'HANDOVER_ORDERS', 'RECEIVE_RETURNS'],
                    });
                  }
                }}
                className="px-3.5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#ECDAD8]" />
                Thêm nhân viên
              </button>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Họ tên nhân viên</th>
                    <th className="py-3 px-4 font-semibold">Email &amp; SĐT</th>
                    <th className="py-3 px-4 font-semibold">Vai trò</th>
                    <th className="py-3 px-4 font-semibold">Phạm vi quyền</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FCF9F5]/50">
                      <td className="py-3.5 px-4 font-bold text-[#302824]">{s.name}</td>
                      <td className="py-3.5 px-4 text-[#756A64]">
                        <div>{s.email}</div>
                        <div className="font-mono">{s.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            s.role === 'SHOP_OWNER'
                              ? 'bg-[#302824] text-white'
                              : s.role === 'SHOP_MANAGER'
                              ? 'bg-[#ECDAD8] text-[#5C303B]'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#756A64]">
                        {s.permissions.join(' · ')}
                      </td>
                      <td className="py-3.5 px-4">
                        {s.active ? (
                          <span className="text-[#38705A] font-semibold">● Đang hoạt động</span>
                        ) : (
                          <span className="text-stone-400">Tạm khóa</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {s.role !== 'SHOP_OWNER' && (
                          <button
                            onClick={() => onToggleStaffActive(s.id)}
                            className="px-2 py-1 text-[11px] text-[#756A64] hover:text-[#302824] border border-[#E8DFD8] rounded"
                          >
                            {s.active ? 'Khóa' : 'Mở khóa'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS & QUOTAS (D-36, D-37) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#302824]">
                Cài đặt thương hiệu &amp; hạn mức gói
              </h2>
              <p className="text-xs text-[#756A64] mt-0.5">
                Thiết lập nhận diện Storefront, thời gian giữ chỗ cọc và kiểm tra hạn mức gói dịch vụ.
              </p>
            </div>

            {/* Quota Card */}
            <div className="bg-[#FFFDFC] border-2 border-[#713F4B] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8DFD8] pb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#713F4B] font-semibold">
                    Gói dịch vụ hiện tại
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#302824]">
                    {shop.plan} (Dùng thử 14 ngày)
                  </h3>
                </div>
                <span className="text-xs text-[#38705A] font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Hết hạn: {new Date(shop.trialEndsAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]">
                  <div className="text-[#756A64]">Đơn vị QR vật lý</div>
                  <div className="font-mono text-base font-bold text-[#302824] mt-0.5">
                    {shopUnits.length} / 50 mã
                  </div>
                </div>
                <div className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]">
                  <div className="text-[#756A64]">Tài khoản nhân viên</div>
                  <div className="font-mono text-base font-bold text-[#302824] mt-0.5">
                    {shopStaff.length} / 3 người
                  </div>
                </div>
                <div className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]">
                  <div className="text-[#756A64]">Storefront Subdomain</div>
                  <div className="font-mono text-xs font-bold text-[#713F4B] mt-1 truncate">
                    /shop/{shop.slug}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-display text-base font-bold text-[#302824]">
                Cấu Hình Nhận Diện Storefront
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateShopSettings(shop.id, {
                    phone: settingsPhone,
                    address: settingsAddress,
                    accentColor: settingsAccent,
                    depositHoldHours: settingsHoldHours,
                  });
                  alert('Đã cập nhật cài đặt cửa hàng thành công!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Hotline cửa hàng</label>
                  <input
                    type="text"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Địa chỉ showroom</label>
                  <input
                    type="text"
                    value={settingsAddress}
                    onChange={(e) => setSettingsAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Màu sắc thương hiệu nhấn</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsAccent}
                        onChange={(e) => setSettingsAccent(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-[#E8DFD8] cursor-pointer"
                      />
                      <span className="font-mono uppercase">{settingsAccent}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Thời gian giữ chỗ cọc (Giờ)</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={settingsHoldHours}
                      onChange={(e) => setSettingsHoldHours(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg cursor-pointer"
                  >
                    Lưu Cài Đặt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: PLATFORM SYSTEM ADMIN CONSOLE (P-01..P-05) */}
        {activeTab === 'platform' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Quản trị nền tảng DịpXinh
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Bảng điều khiển dành riêng cho đơn vị vận hành nền tảng SaaS DịpXinh quản lý các shop.
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-[#302824] text-white rounded-md">
                Admin Root Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFDFC] p-5 rounded-2xl border border-[#E8DFD8]">
                <div className="text-xs text-[#756A64]">Tổng số shop đăng ký</div>
                <div className="font-mono text-3xl font-bold text-[#302824] mt-1">{shops.length}</div>
              </div>
              <div className="bg-[#FFFDFC] p-5 rounded-2xl border border-[#E8DFD8]">
                <div className="text-xs text-[#756A64]">Shop đang dùng thử Trial</div>
                <div className="font-mono text-3xl font-bold text-[#713F4B] mt-1">
                  {shops.filter((s) => s.plan === 'TRIAL').length}
                </div>
              </div>
              <div className="bg-[#FFFDFC] p-5 rounded-2xl border border-[#E8DFD8]">
                <div className="text-xs text-[#756A64]">Shop trả phí (Starter/Growth)</div>
                <div className="font-mono text-3xl font-bold text-[#38705A] mt-1">
                  {shops.filter((s) => s.plan !== 'TRIAL').length}
                </div>
              </div>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-[#E8DFD8] font-bold text-xs text-[#302824]">
                Danh sách cửa hàng sử dụng nền tảng
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tên cửa hàng</th>
                    <th className="py-3 px-4 font-semibold">Đường dẫn slug</th>
                    <th className="py-3 px-4 font-semibold">Gói đăng ký</th>
                    <th className="py-3 px-4 font-semibold">Hạn dùng thử</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái SaaS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shops.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FCF9F5]/50">
                      <td className="py-3 px-4 font-bold text-[#302824]">{s.name}</td>
                      <td className="py-3 px-4 font-mono text-[#713F4B]">/shop/{s.slug}</td>
                      <td className="py-3 px-4 font-bold">{s.plan}</td>
                      <td className="py-3 px-4 font-mono">{new Date(s.trialEndsAt).toLocaleDateString('vi-VN')}</td>
                      <td className="py-3 px-4 text-[#38705A] font-semibold">Hoạt động bình thường</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Existing views: CATALOG, UNITS, ORDERS, HANDOVER, RETURNS, INCIDENTS, FINANCE */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Sản Phẩm &amp; Tồn Kho Bán Độc Lập
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Tách bạch tuyệt đối giữa số lượng bán (`sale_stock`) và từng đơn vị QR cho thuê (`rental_units`).
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#ECDAD8]" />
                Thêm sản phẩm mới
              </button>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                    <th className="py-3 px-4 font-semibold">Danh mục</th>
                    <th className="py-3 px-4 font-semibold">Giá thuê / Đợt</th>
                    <th className="py-3 px-4 font-semibold">Tồn kho bán (Sale Stock)</th>
                    <th className="py-3 px-4 font-semibold">Số mã QR cho thuê</th>
                    <th className="py-3 px-4 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopProducts.map((p) => {
                    const linkedUnits = rentalUnits.filter((u) => u.productId === p.id);
                    const totalSaleStock = p.variants.reduce((acc, v) => acc + v.saleStock, 0);

                    return (
                      <tr key={p.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-14 object-cover rounded-md border border-[#E8DFD8]"
                          />
                          <div>
                            <div className="font-semibold text-sm text-[#302824]">{p.title}</div>
                            <div className="text-[11px] text-[#756A64]">
                              {p.variants.map((v) => `${v.size} (${v.color})`).join(' · ')}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#756A64]">{p.category}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#302824] tabular-nums">
                          {p.rentalPrice.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-semibold text-[#5C303B] tabular-nums">
                            {totalSaleStock} cái sẵn bán
                          </div>
                          <div className="text-[10px] text-[#756A64]">
                            {p.variants.map((v) => `${v.size}: ${v.saleStock}`).join(' | ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-[#38705A] tabular-nums">
                            {linkedUnits.length} mã QR vật lý
                          </div>
                          <div className="text-[10px] text-[#756A64]">
                            {linkedUnits.map((u) => u.qrCode).join(', ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setActiveTab('units')}
                            className="px-3 py-1 text-xs text-[#5C303B] bg-[#FCF9F5] hover:bg-[#ECDAD8] border border-[#E8DFD8] rounded-lg transition-colors cursor-pointer"
                          >
                            Xem QR Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Đơn Vị QR Cho Thuê Vật Lý
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Mỗi dòng đại diện cho đúng 1 chiếc váy thật tại cửa hàng mang mã QR định danh độc nhất.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Mã QR Định danh</th>
                    <th className="py-3 px-4 font-semibold">Tên trang phục</th>
                    <th className="py-3 px-4 font-semibold">Size &amp; Màu</th>
                    <th className="py-3 px-4 font-semibold">Tình trạng vật lý</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái khả dụng</th>
                    <th className="py-3 px-4 font-semibold text-right">Cập nhật nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopUnits.map((unit) => {
                    const prod = products.find((p) => p.id === unit.productId);
                    return (
                      <tr key={unit.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#713F4B]">
                          {unit.qrCode}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#302824]">
                          {prod?.title || 'Trang phục'}
                        </td>
                        <td className="py-3.5 px-4 text-[#756A64]">
                          Size <strong>{unit.size}</strong> · {unit.color}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-[#302824]">
                            {unit.condition === 'EXCELLENT' ? 'Xuất sắc (99%)' : unit.condition === 'GOOD' ? 'Tốt (95%)' : 'Hư hại'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {unit.physicalStatus === 'READY' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              ● Sẵn sàng cho thuê
                            </span>
                          )}
                          {unit.physicalStatus === 'HELD' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#713F4B]/15 text-[#5C303B] border border-[#713F4B]/30">
                              🔒 Đang giữ chỗ
                            </span>
                          )}
                          {unit.physicalStatus === 'RENTED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#416C82]/10 text-[#416C82] border border-[#416C82]/20">
                              🚚 Khách đang thuê
                            </span>
                          )}
                          {unit.physicalStatus === 'WASHING' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              ⏳ Đang giặt ủi
                            </span>
                          )}
                          {unit.physicalStatus === 'DAMAGED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#A94545]/10 text-[#A94545] border border-[#A94545]/20">
                              ⚠️ Hỏng / Cần sửa chữa
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {unit.physicalStatus === 'WASHING' ? (
                            <button
                              onClick={() => onUpdateUnitStatus(unit.id, 'READY', 'EXCELLENT')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#38705A] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                            >
                              ✓ Giặt xong (Chuyển Sẵn sàng)
                            </button>
                          ) : unit.physicalStatus === 'READY' ? (
                            <button
                              onClick={() => onUpdateUnitStatus(unit.id, 'WASHING')}
                              className="px-2.5 py-1 text-[11px] text-[#756A64] hover:text-[#302824] hover:bg-[#FCF9F5] border border-[#E8DFD8] rounded transition-colors cursor-pointer"
                            >
                              Gửi giặt ủi
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-400">Đang theo đơn</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Danh Sách Đơn Thuê &amp; Hàng Đợi Duyệt
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Duyệt yêu cầu khách, gán mã QR vật lý, khóa cọc giữ chỗ và đối soát tài chính.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-[#FFFDFC] p-3 rounded-xl border border-[#E8DFD8]">
              <span className="text-xs font-semibold text-[#756A64] mr-2">Bộ lọc trạng thái:</span>
              {[
                { label: 'Tất cả', val: 'ALL' },
                { label: 'Chờ duyệt (PENDING_REVIEW)', val: 'PENDING_REVIEW' },
                { label: 'Đang giữ chỗ (HELD)', val: 'HELD' },
                { label: 'Đã xác nhận (CONFIRMED)', val: 'CONFIRMED' },
                { label: 'Đang thuê (ACTIVE)', val: 'ACTIVE' },
                { label: 'Đã trả 1 phần', val: 'PARTIALLY_RETURNED' },
                { label: 'Hoàn tất (COMPLETED)', val: 'COMPLETED' },
              ].map((f) => (
                <button
                  key={f.val}
                  onClick={() => setOrderFilter(f.val)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === f.val
                      ? 'bg-[#302824] text-[#FCF9F5] font-semibold'
                      : 'bg-[#FCF9F5] text-[#756A64] hover:bg-[#ECDAD8]/50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Mã đơn</th>
                    <th className="py-3 px-4 font-semibold">Khách hàng</th>
                    <th className="py-3 px-4 font-semibold">Món thuê &amp; Mã QR</th>
                    <th className="py-3 px-4 font-semibold">Khoảng ngày thuê</th>
                    <th className="py-3 px-4 font-semibold">Tiền thuê &amp; Ký quỹ</th>
                    <th className="py-3 px-4 font-semibold">Trạng thái đơn</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFD8]">
                  {shopOrders
                    .filter((o) => (orderFilter === 'ALL' ? true : o.status === orderFilter))
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#302824]">
                          {ord.code}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#302824]">{ord.customer.name}</div>
                          <div className="text-[11px] text-[#756A64]">{ord.customer.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {ord.items.map((it) => (
                            <div key={it.id} className="text-[#302824]">
                              {it.productTitle} ({it.size})
                              {it.assignedQrCode ? (
                                <span className="font-mono text-[#713F4B] ml-1.5 font-bold">
                                  [{it.assignedQrCode}]
                                </span>
                              ) : (
                                <span className="text-[#966421] ml-1.5 italic text-[11px]">
                                  (Chưa gán QR)
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 text-[#756A64]">
                          <div>Nhận: {new Date(ord.pickupDate).toLocaleDateString('vi-VN')}</div>
                          <div>Trả: {new Date(ord.returnDueDate).toLocaleDateString('vi-VN')}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[#302824] font-bold tabular-nums">
                            Thuê: {ord.rentalTotal.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="font-mono text-[11px] text-[#38705A] tabular-nums">
                            Cọc: {ord.depositPaid.toLocaleString('vi-VN')}đ / {ord.depositRequired.toLocaleString('vi-VN')}đ
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {ord.status === 'PENDING_REVIEW' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Chờ duyệt
                            </span>
                          )}
                          {ord.status === 'HELD' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#713F4B]/15 text-[#5C303B] border border-[#713F4B]/30">
                              Đang giữ chỗ
                            </span>
                          )}
                          {ord.status === 'CONFIRMED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              Đã xác nhận
                            </span>
                          )}
                          {ord.status === 'ACTIVE' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#416C82]/10 text-[#416C82] border border-[#416C82]/20">
                              Đang thuê
                            </span>
                          )}
                          {ord.status === 'PARTIALLY_RETURNED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Đã trả 1 phần
                            </span>
                          )}
                          {ord.status === 'COMPLETED' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              Hoàn tất
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {ord.status === 'PENDING_REVIEW' && (
                            <button
                              onClick={() => setAssignQrModalOrderId(ord.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded transition-colors cursor-pointer"
                            >
                              Duyệt &amp; Gán QR
                            </button>
                          )}
                          {ord.status === 'HELD' && (
                            <button
                              onClick={() => setPaymentModalOrderId(ord.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#5C303B] bg-[#ECDAD8] hover:bg-[#DABFBC] rounded transition-colors cursor-pointer"
                            >
                              Thu cọc giữ chỗ
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrderId(ord.id)}
                            className="px-2 py-1 text-[11px] text-[#756A64] hover:text-[#302824] border border-[#E8DFD8] rounded transition-colors cursor-pointer"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'handover' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Bàn Giao Trang Phục Cho Khách (Quét QR Xuất Kho)
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Xác nhận quét đúng mã QR vật lý của từng chiếc đầm được gán trước khi giao cho khách.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shopOrders
                .filter((o) => o.status === 'CONFIRMED' || o.status === 'HELD')
                .map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-3">
                      <div>
                        <div className="font-mono font-bold text-base text-[#302824]">{ord.code}</div>
                        <div className="text-xs text-[#756A64]">{ord.customer.name} · {ord.customer.phone}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#38705A]/10 text-[#38705A]">
                        {ord.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang giữ chỗ'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#756A64] uppercase tracking-wider">
                        Danh sách mã QR cần xuất:
                      </div>
                      {ord.items.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]"
                        >
                          <div>
                            <div className="font-medium text-xs text-[#302824]">{it.productTitle}</div>
                            <div className="text-[11px] text-[#756A64]">Size {it.size} · {it.color}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-xs text-[#713F4B] bg-white px-2 py-0.5 rounded border border-[#E8DFD8]">
                              {it.assignedQrCode || 'Chưa gán QR'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#FCF9F5] p-3 rounded-xl border border-[#E8DFD8] text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#756A64]">Tiền thuê còn thu:</span>
                        <strong className="font-mono tabular-nums">{ord.balanceDue.toLocaleString('vi-VN')}đ</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#756A64]">Ký quỹ tài sản:</span>
                        <strong className="font-mono tabular-nums text-[#38705A]">
                          {ord.depositPaid.toLocaleString('vi-VN')}đ / {ord.depositRequired.toLocaleString('vi-VN')}đ
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setPaymentModalOrderId(ord.id)}
                        className="px-3 py-2 text-xs font-medium text-[#302824] bg-[#FCF9F5] hover:bg-[#ECDAD8] border border-[#E8DFD8] rounded-lg transition-colors cursor-pointer"
                      >
                        Ghi phiếu thu tiền
                      </button>
                      <button
                        onClick={() => {
                          const res = onHandoverOrder(ord.id);
                          if (!res.success) {
                            alert(res.error);
                          }
                        }}
                        className="px-4 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#ECDAD8]" />
                        Xác nhận bàn giao đồ
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Nhận Trả Đồ Theo Đợt &amp; Kiểm Tra Chất Lượng
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Khách có thể trả từng đợt (ví dụ trả 1/2 bộ đồ trước). Kiểm tra và đánh dấu vết bẩn/hư hại ngay khi nhận.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFDFC] p-5 rounded-2xl border border-[#E8DFD8] shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-xs font-semibold text-[#302824]">
                  Chọn đơn đang thuê để nhận trả:
                </label>
                <select
                  value={selectedReturnOrderId}
                  onChange={(e) => {
                    setSelectedReturnOrderId(e.target.value);
                    setReturnItemStates({});
                  }}
                  className="px-3 py-1.5 text-xs bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono focus:outline-none"
                >
                  {shopOrders
                    .filter((o) => o.status === 'ACTIVE' || o.status === 'PARTIALLY_RETURNED')
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.code} - {o.customer.name} ({o.items.length} món)
                      </option>
                    ))}
                </select>
              </div>

              {(() => {
                const retOrder = shopOrders.find((o) => o.id === selectedReturnOrderId);
                if (!retOrder) return <p className="text-xs text-[#756A64]">Không có đơn nào đang thuê.</p>;

                return (
                  <div className="space-y-4 pt-2">
                    <div className="bg-[#FCF9F5] p-3 rounded-xl border border-[#E8DFD8] flex justify-between items-center text-xs">
                      <div>
                        Khách: <strong>{retOrder.customer.name}</strong> ({retOrder.customer.phone})
                      </div>
                      <div>
                        Hạn trả chung: <strong className="font-mono">{new Date(retOrder.returnDueDate).toLocaleString('vi-VN')}</strong>
                      </div>
                      <span className="font-semibold text-[#713F4B]">
                        Trạng thái: {retOrder.status === 'PARTIALLY_RETURNED' ? 'Đã trả 1 phần' : 'Đang thuê'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-[#756A64] uppercase tracking-wider">
                        Danh sách trang phục trong đợt trả này:
                      </div>

                      {retOrder.items.map((it) => {
                        const isAlreadyReturned = !!it.returnedAt;
                        const state = returnItemStates[it.id] || {
                          selected: !isAlreadyReturned,
                          condition: 'EXCELLENT',
                          needsWashing: true,
                          note: '',
                        };

                        return (
                          <div
                            key={it.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isAlreadyReturned
                                ? 'bg-stone-50 border-stone-200 opacity-60'
                                : 'bg-[#FFFDFC] border-[#E8DFD8]'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {!isAlreadyReturned && (
                                  <input
                                    type="checkbox"
                                    checked={state.selected}
                                    onChange={(e) =>
                                      setReturnItemStates((prev) => ({
                                        ...prev,
                                        [it.id]: { ...state, selected: e.target.checked },
                                      }))
                                    }
                                    className="w-4 h-4 rounded text-[#713F4B] cursor-pointer"
                                  />
                                )}
                                <div>
                                  <div className="font-bold text-xs text-[#302824]">
                                    {it.productTitle} (Size {it.size})
                                  </div>
                                  <div className="font-mono text-xs text-[#713F4B] mt-0.5">
                                    Mã QR gán: <strong>{it.assignedQrCode}</strong>
                                  </div>
                                </div>
                              </div>

                              {isAlreadyReturned ? (
                                <span className="text-xs font-semibold text-[#38705A]">
                                  ✓ Đã nhận trả vào {new Date(it.returnedAt!).toLocaleDateString('vi-VN')}
                                </span>
                              ) : (
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <span className="text-[#756A64]">Tình trạng:</span>
                                    <select
                                      value={state.condition}
                                      onChange={(e) =>
                                        setReturnItemStates((prev) => ({
                                          ...prev,
                                          [it.id]: { ...state, condition: e.target.value as UnitCondition },
                                        }))
                                      }
                                      className="px-2 py-1 bg-[#FCF9F5] border border-[#E8DFD8] rounded text-xs"
                                    >
                                      <option value="EXCELLENT">Đạt / Đẹp (Xuất sắc)</option>
                                      <option value="GOOD">Bình thường (Đạt)</option>
                                      <option value="MINOR_WEAR">Vết ố nhẹ / Sờn nhẹ</option>
                                      <option value="DAMAGED">Rách / Hỏng hóc vải</option>
                                    </select>
                                  </div>

                                  <label className="flex items-center gap-1.5 text-xs text-[#756A64] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={state.needsWashing}
                                      onChange={(e) =>
                                        setReturnItemStates((prev) => ({
                                          ...prev,
                                          [it.id]: { ...state, needsWashing: e.target.checked },
                                        }))
                                      }
                                      className="rounded"
                                    />
                                    Cần gửi giặt ủi
                                  </label>

                                  {state.condition === 'DAMAGED' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setIncidentModalParams({ orderId: retOrder.id, itemId: it.id })
                                      }
                                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded"
                                    >
                                      + Lập biên bản sự cố
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-[#E8DFD8] flex justify-end">
                      <button
                        onClick={() => {
                          const itemsToProcess = retOrder.items
                            .filter((it) => !it.returnedAt && (returnItemStates[it.id]?.selected ?? true))
                            .map((it) => ({
                              itemId: it.id,
                              condition: returnItemStates[it.id]?.condition || 'EXCELLENT',
                              needsWashing: returnItemStates[it.id]?.needsWashing ?? true,
                              incidentNote: returnItemStates[it.id]?.note,
                            }));

                          if (itemsToProcess.length === 0) {
                            alert('Vui lòng chọn ít nhất 1 món để nhận trả!');
                            return;
                          }

                          const res = onProcessReturnBatch(retOrder.id, itemsToProcess);
                          if (res.success) {
                            alert(`Đã nhận thành công đợt trả! Tổng đã trả: ${res.returnedCount} món. Còn lại: ${res.remainingCount} món.`);
                          }
                        }}
                        className="px-5 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4 text-[#ECDAD8]" />
                        Xác Nhận Đợt Nhận Trả Này
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Biên Bản Sự Cố &amp; Đề Xuất Phí Khấu Trừ
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Phân định tuyệt đối giữa Phí đề xuất (chưa phải nợ phải thu) và Phí đã chốt (thống nhất với khách).
                </p>
              </div>
            </div>

            {incidents.length === 0 ? (
              <div className="bg-[#FFFDFC] p-8 text-center rounded-2xl border border-[#E8DFD8]">
                <p className="text-xs text-[#756A64]">Chưa có biên bản sự cố nào được ghi nhận.</p>
              </div>
            ) : (
              <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Mã đơn &amp; Mã QR</th>
                      <th className="py-3 px-4 font-semibold">Sản phẩm</th>
                      <th className="py-3 px-4 font-semibold">Loại sự cố</th>
                      <th className="py-3 px-4 font-semibold">Phí đề xuất (Chưa chốt)</th>
                      <th className="py-3 px-4 font-semibold">Phí đã chốt</th>
                      <th className="py-3 px-4 font-semibold">Trạng thái</th>
                      <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD8]">
                    {incidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-[#302824]">{inc.orderId}</div>
                          <div className="font-mono text-[#713F4B]">{inc.qrCode}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#302824]">{inc.productTitle}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-700">
                            {inc.type === 'TORN' ? 'Rách vải' : inc.type === 'STAIN' ? 'Vết ố' : 'Trễ hạn'}
                          </span>
                          <div className="text-[11px] text-[#756A64] mt-0.5">{inc.notes}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#966421] tabular-nums">
                          {inc.proposedFee.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#38705A] tabular-nums">
                          {inc.finalizedFee ? `${inc.finalizedFee.toLocaleString('vi-VN')}đ` : 'Chưa chốt'}
                        </td>
                        <td className="py-3.5 px-4">
                          {inc.status === 'PROPOSED' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Đang đề xuất
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              Đã chốt &amp; ghi sổ cọc
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {inc.status === 'PROPOSED' && (
                            <button
                              onClick={() => {
                                const feeInput = prompt('Nhập số tiền phí đã thống nhất với khách (VND):', String(inc.proposedFee));
                                if (feeInput) {
                                  const fee = parseInt(feeInput, 10);
                                  if (!isNaN(fee)) {
                                    onFinalizeIncident(inc.id, fee);
                                  }
                                }
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded transition-colors cursor-pointer"
                            >
                              Chốt phí với khách
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#302824]">
                  Sổ Quỹ Ký Quỹ &amp; Hoàn Cọc Bất Biến
                </h2>
                <p className="text-xs text-[#756A64] mt-0.5">
                  Không coi tiền cọc là doanh thu. Tiền cọc đang chờ hoàn được khóa giữ chỗ (`reserved`).
                </p>
              </div>
            </div>

            {/* Financial Overview Tiles */}
            {(() => {
              const totalCollectedDeposit = shopOrders.reduce((sum, o) => sum + o.depositPaid, 0);
              const totalFinalizedIncidents = shopOrders.reduce((sum, o) => sum + o.finalizedIncidentsTotal, 0);
              const totalRefundReserved = shopOrders.reduce((sum, o) => sum + o.refundReserved, 0);
              const totalRefundVerified = shopOrders.reduce((sum, o) => sum + o.refundVerified, 0);
              const availableDeposit = Math.max(0, totalCollectedDeposit - totalFinalizedIncidents - totalRefundReserved - totalRefundVerified);

              return (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-[#FFFDFC] p-4 rounded-xl border border-[#E8DFD8]">
                    <div className="text-[11px] text-[#756A64]">Tổng cọc đã thu (Verified)</div>
                    <div className="font-mono text-lg font-bold text-[#302824] mt-1 tabular-nums">
                      {totalCollectedDeposit.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="bg-[#FFFDFC] p-4 rounded-xl border border-[#E8DFD8]">
                    <div className="text-[11px] text-rose-700">Khấu trừ sự cố đã chốt</div>
                    <div className="font-mono text-lg font-bold text-rose-700 mt-1 tabular-nums">
                      -{totalFinalizedIncidents.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="bg-[#FFFDFC] p-4 rounded-xl border border-[#E8DFD8]">
                    <div className="text-[11px] text-[#966421]">Đang giữ chỗ hoàn (Reserved)</div>
                    <div className="font-mono text-lg font-bold text-[#966421] mt-1 tabular-nums">
                      {totalRefundReserved.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="bg-[#FFFDFC] p-4 rounded-xl border border-[#E8DFD8]">
                    <div className="text-[11px] text-[#38705A]">Đã hoàn cọc (Verified)</div>
                    <div className="font-mono text-lg font-bold text-[#38705A] mt-1 tabular-nums">
                      {totalRefundVerified.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="bg-[#FFFDFC] p-4 rounded-xl border-2 border-[#713F4B]">
                    <div className="text-[11px] font-semibold text-[#713F4B]">Số dư cọc khả hoàn</div>
                    <div className="font-mono text-xl font-bold text-[#302824] mt-1 tabular-nums">
                      {availableDeposit.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Refund Requests Queue */}
            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#302824]">
                  Hàng Đợi Hoàn Cọc Ngân Hàng (Refund Processing Queue)
                </h3>
              </div>

              {refunds.length === 0 ? (
                <p className="text-xs text-[#756A64]">Chưa có lệnh hoàn cọc nào.</p>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Mã đơn</th>
                      <th className="py-2.5 px-3 font-semibold">Người thụ hưởng</th>
                      <th className="py-2.5 px-3 font-semibold">Tài khoản &amp; Ngân hàng</th>
                      <th className="py-2.5 px-3 font-semibold">Số tiền hoàn</th>
                      <th className="py-2.5 px-3 font-semibold">Trạng thái</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Đối soát</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD8]">
                    {refunds.map((r) => (
                      <tr key={r.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3 px-3 font-mono font-bold text-[#302824]">{r.orderId}</td>
                        <td className="py-3 px-3 font-medium text-[#302824]">{r.recipientName}</td>
                        <td className="py-3 px-3 font-mono text-[#756A64]">
                          {r.bankAccount} ({r.bankName})
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#38705A] tabular-nums">
                          {r.amount.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3 px-3">
                          {r.status === 'PROCESSING' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#966421]/10 text-[#966421] border border-[#966421]/20">
                              Đang xử lý chuyển khoản (Tiền đã khóa reserved)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#38705A]/10 text-[#38705A] border border-[#38705A]/20">
                              ✓ Đã hoàn — Đối soát ngân hàng thành công
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {r.status === 'PROCESSING' && (
                            <button
                              onClick={() => {
                                const res = onVerifyRefund(r.id);
                                if (!res.success) alert(res.error);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded transition-colors cursor-pointer"
                            >
                              Xác nhận ủy nhiệm chi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Immutable Deposit Transactions Ledger */}
            <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-display text-base font-bold text-[#302824]">
                Sổ Nhật Ký Ký Quỹ Bất Biến (Immutable Deposit Ledger)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FCF9F5] text-[#756A64] border-b border-[#E8DFD8]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Thời gian</th>
                      <th className="py-2.5 px-3 font-semibold">Mã đơn</th>
                      <th className="py-2.5 px-3 font-semibold">Loại bút toán</th>
                      <th className="py-2.5 px-3 font-semibold">Số tiền</th>
                      <th className="py-2.5 px-3 font-semibold">Người thực hiện</th>
                      <th className="py-2.5 px-3 font-semibold">Nội dung chứng từ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD8]">
                    {depositTransactions.map((dt) => (
                      <tr key={dt.id} className="hover:bg-[#FCF9F5]/50">
                        <td className="py-3 px-3 font-mono text-[#756A64]">
                          {new Date(dt.timestamp).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#302824]">{dt.orderId}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              dt.type === 'COLLECTED'
                                ? 'bg-emerald-50 text-emerald-800'
                                : dt.type === 'CHARGED_INCIDENT'
                                ? 'bg-rose-50 text-rose-800'
                                : dt.type === 'REFUND_RESERVED'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {dt.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold tabular-nums">
                          {dt.amount.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3 px-3 text-[#756A64]">{dt.actor}</td>
                        <td className="py-3 px-3 text-[#302824]">{dt.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL DRAWER / MODAL FOR SELECTED ORDER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-4">
                <div>
                  <div className="text-[11px] text-[#713F4B] uppercase tracking-wider font-semibold">
                    Chi tiết đơn thuê
                  </div>
                  <h3 className="font-mono text-xl font-bold text-[#302824]">
                    {selectedOrder.code}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 p-4 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] text-xs space-y-1">
                <div className="font-semibold text-sm text-[#302824]">{selectedOrder.customer.name}</div>
                <div className="text-[#756A64]">SĐT: {selectedOrder.customer.phone}</div>
                {selectedOrder.customer.address && (
                  <div className="text-[#756A64]">Địa chỉ: {selectedOrder.customer.address}</div>
                )}
                {selectedOrder.notes && (
                  <div className="pt-2 text-stone-700 border-t border-[#E8DFD8]">
                    Ghi chú: {selectedOrder.notes}
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-[#756A64] uppercase tracking-wider">
                  Trang phục &amp; Mã QR vật lý:
                </div>
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] text-xs flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#302824]">{it.productTitle}</div>
                      <div className="text-[#756A64]">Size {it.size} · {it.color}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[#713F4B] font-bold">
                        {it.assignedQrCode ? `QR: ${it.assignedQrCode}` : 'Chưa gán QR'}
                      </div>
                      <div className="font-mono tabular-nums text-[#302824] font-semibold">
                        {it.rentalPrice.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8] space-y-2 text-xs">
                <div className="font-semibold text-[#302824] border-b border-[#E8DFD8] pb-1">
                  Nghĩa vụ tài chính
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756A64]">Tiền thuê:</span>
                  <strong className="font-mono tabular-nums">{selectedOrder.rentalTotal.toLocaleString('vi-VN')}đ</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756A64]">Cọc giữ chỗ (Cần {selectedOrder.advanceRequired.toLocaleString('vi-VN')}đ):</span>
                  <strong className="font-mono tabular-nums text-[#713F4B]">Đã thu {selectedOrder.advancePaid.toLocaleString('vi-VN')}đ</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#756A64]">Ký quỹ tài sản (Cần {selectedOrder.depositRequired.toLocaleString('vi-VN')}đ):</span>
                  <strong className="font-mono tabular-nums text-[#38705A]">Đã thu {selectedOrder.depositPaid.toLocaleString('vi-VN')}đ</strong>
                </div>
                {selectedOrder.finalizedIncidentsTotal > 0 && (
                  <div className="flex justify-between text-rose-700">
                    <span>Khấu trừ sự cố đã chốt:</span>
                    <strong className="font-mono tabular-nums">-{selectedOrder.finalizedIncidentsTotal.toLocaleString('vi-VN')}đ</strong>
                  </div>
                )}
                {selectedOrder.refundVerified > 0 && (
                  <div className="flex justify-between text-blue-700">
                    <span>Đã hoàn tiền cọc:</span>
                    <strong className="font-mono tabular-nums">{selectedOrder.refundVerified.toLocaleString('vi-VN')}đ</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#E8DFD8] pt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPaymentModalOrderId(selectedOrder.id)}
                className="flex-1 py-2 text-xs font-semibold text-[#302824] bg-[#ECDAD8] hover:bg-[#DABFBC] rounded-lg transition-colors cursor-pointer"
              >
                + Thêm phiếu thu tiền
              </button>
              {selectedOrder.status === 'COMPLETED' || selectedOrder.status === 'PARTIALLY_RETURNED' ? (
                <button
                  onClick={() => setRefundModalOrderId(selectedOrder.id)}
                  className="flex-1 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors cursor-pointer"
                >
                  Tạo lệnh hoàn cọc
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ASSIGN QR & APPROVE */}
      {assignQrModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#302824]">
              Duyệt Đơn &amp; Khóa Mã QR Giữ Chỗ (HELD)
            </h3>
            <p className="text-xs text-[#756A64]">
              Chọn mã QR vật lý có sẵn trong kho để gán cho đơn hàng. Sau khi duyệt, đơn sẽ chuyển sang trạng thái <strong>HELD</strong> với thời hạn giữ chỗ 60 phút.
            </p>

            {(() => {
              const ord = shopOrders.find((o) => o.id === assignQrModalOrderId);
              if (!ord) return null;

              return (
                <div className="space-y-3">
                  {ord.items.map((it) => {
                    const availableUnits = rentalUnits.filter(
                      (u) => u.productId === it.productId && u.size === it.size && u.physicalStatus === 'READY'
                    );

                    return (
                      <div key={it.id} className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]">
                        <div className="font-semibold text-xs text-[#302824]">
                          {it.productTitle} (Size {it.size})
                        </div>
                        <div className="mt-2 text-xs">
                          <label className="block text-[#756A64] mb-1">Mã QR vật lý sẵn sàng:</label>
                          {availableUnits.length > 0 ? (
                            <select
                              id={`assign-select-${it.id}`}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#E8DFD8] rounded-lg font-mono font-bold text-xs"
                            >
                              {availableUnits.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.qrCode} - Tình trạng: {u.condition}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="p-2 bg-rose-50 text-rose-700 rounded text-xs">
                              ⚠️ Không có mã QR nào ở trạng thái READY cho size này!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAssignQrModalOrderId(null)}
                      className="px-4 py-2 text-xs text-[#756A64]"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const assignments = ord.items.map((it) => {
                          const select = document.getElementById(`assign-select-${it.id}`) as HTMLSelectElement;
                          return { itemId: it.id, unitId: select?.value || '' };
                        });

                        const res = onApproveOrderAndHold(ord.id, assignments);
                        if (res.success) {
                          setAssignQrModalOrderId(null);
                        } else {
                          alert(res.error);
                        }
                      }}
                      className="px-5 py-2 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg cursor-pointer"
                    >
                      Xác Nhận Giữ Chỗ (HELD)
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT */}
      {paymentModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#302824]">
              Ghi Phiếu Thu Tiền Thủ Công
            </h3>

            {(() => {
              const ord = shopOrders.find((o) => o.id === paymentModalOrderId);
              if (!ord) return null;

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    const type = form.type.value as PaymentEntry['type'];
                    const amount = parseInt(form.amount.value, 10);
                    const method = form.method.value as PaymentEntry['method'];
                    const ref = form.ref.value;

                    onRecordPayment(ord.id, type, amount, method, ref);
                    setPaymentModalOrderId(null);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Loại khoản tiền:</label>
                    <select
                      name="type"
                      defaultValue={ord.status === 'HELD' ? 'ADVANCE' : 'SECURITY_DEPOSIT'}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    >
                      <option value="ADVANCE">Cọc giữ chỗ (Advance)</option>
                      <option value="RENTAL_BALANCE">Tiền thuê còn lại (Rental Balance)</option>
                      <option value="SECURITY_DEPOSIT">Tiền ký quỹ tài sản (Security Deposit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Số tiền thu (VND):</label>
                    <input
                      name="amount"
                      type="number"
                      required
                      defaultValue={
                        ord.status === 'HELD'
                          ? ord.advanceRequired
                          : ord.depositPaid === 0
                          ? ord.depositRequired
                          : ord.balanceDue
                      }
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#302824] mb-1">Phương thức:</label>
                      <select name="method" className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg">
                        <option value="BANK_TRANSFER">Chuyển khoản</option>
                        <option value="CASH">Tiền mặt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#302824] mb-1">Mã tham chiếu:</label>
                      <input
                        name="ref"
                        type="text"
                        defaultValue={`CK-${Math.floor(1000 + Math.random() * 9000)}`}
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentModalOrderId(null)}
                      className="px-4 py-2 text-[#756A64]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg cursor-pointer"
                    >
                      Tạo Phiếu Thu
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST REFUND */}
      {refundModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#302824]">
              Tạo Lệnh Hoàn Cọc Ngân Hàng
            </h3>

            {(() => {
              const ord = shopOrders.find((o) => o.id === refundModalOrderId);
              if (!ord) return null;

              const maxRefund = ord.depositPaid - ord.finalizedIncidentsTotal - ord.refundReserved - ord.refundVerified;

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    const amount = parseInt(form.amount.value, 10);
                    const bankAccount = form.bankAccount.value;
                    const bankName = form.bankName.value;
                    const recipientName = form.recipientName.value;

                    const res = onRequestRefund({
                      orderId: ord.id,
                      amount,
                      bankAccount,
                      bankName,
                      recipientName,
                      reason: 'Hoàn tiền cọc sau khi kiểm tra trang phục đạt chuẩn.',
                    });

                    if (res.success) {
                      setRefundModalOrderId(null);
                      alert('Đã tạo lệnh hoàn cọc! Tiền được khóa giữ chỗ (Reserved) và đưa vào hàng đợi đối soát.');
                    } else {
                      alert(res.error);
                    }
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="p-3 bg-[#FCF9F5] rounded-xl border border-[#E8DFD8]">
                    <div className="text-[#756A64]">Số dư cọc khả hoàn của đơn này:</div>
                    <div className="font-mono text-base font-bold text-[#38705A] tabular-nums mt-0.5">
                      {maxRefund.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Số tiền hoàn (VND):</label>
                    <input
                      name="amount"
                      type="number"
                      required
                      max={maxRefund}
                      defaultValue={maxRefund}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#302824] mb-1">Tên người thụ hưởng:</label>
                    <input
                      name="recipientName"
                      type="text"
                      required
                      defaultValue={ord.customer.name}
                      className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#302824] mb-1">Số tài khoản:</label>
                      <input
                        name="bankAccount"
                        type="text"
                        required
                        defaultValue="190345678910"
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#302824] mb-1">Ngân hàng:</label>
                      <input
                        name="bankName"
                        type="text"
                        required
                        defaultValue="Techcombank"
                        className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRefundModalOrderId(null)}
                      className="px-4 py-2 text-[#756A64]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg cursor-pointer"
                    >
                      Tạo Lệnh Hoàn
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE INCIDENT RECORD */}
      {incidentModalParams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#302824]">
              Lập Biên Bản Sự Cố Hư Hại
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const type = form.type.value as IncidentRecord['type'];
                const fee = parseInt(form.fee.value, 10);
                const notes = form.notes.value;

                onCreateIncident(incidentModalParams.orderId, incidentModalParams.itemId, type, fee, notes);
                setIncidentModalParams(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#302824] mb-1">Loại sự cố:</label>
                <select name="type" className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg">
                  <option value="STAIN">Vết ố khó giặt</option>
                  <option value="TORN">Sờn rách viền / Đứt đường may</option>
                  <option value="LATE_RETURN">Trễ hạn hoàn trả</option>
                  <option value="LOST">Mất phụ kiện đi kèm</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#302824] mb-1">
                  Mức phí sửa chữa đề xuất (VND) <span className="text-[#966421]">(Chưa chốt nợ)</span>:
                </label>
                <input
                  name="fee"
                  type="number"
                  required
                  defaultValue={150000}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#302824] mb-1">Mô tả chi tiết vết hại:</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue="Bị sờn tà trước khoảng 3cm do cọ xát với giày cao gót."
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIncidentModalParams(null)}
                  className="px-4 py-2 text-[#756A64]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg cursor-pointer"
                >
                  Lập Biên Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-3">
              <h3 className="font-display text-lg font-bold text-[#302824]">
                Thêm Sản Phẩm Mới &amp; Khởi Tạo Mã QR Vật Lý
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const title = form.title.value;
                const category = form.category.value;
                const rentalPrice = parseInt(form.rentalPrice.value, 10);
                const depositPrice = parseInt(form.depositPrice.value, 10);
                const salePrice = parseInt(form.salePrice.value || '0', 10);
                const desc = form.desc.value;

                onAddProduct(
                  {
                    shopId: shop.id,
                    title,
                    category,
                    description: desc,
                    rentalPrice,
                    depositPrice,
                    salePrice: salePrice > 0 ? salePrice : undefined,
                    images: ['/images/demo/product-emerald-gown.jpg'],
                    variants: [
                      { id: `var-${Date.now()}-s`, size: 'S', color: 'Nguyên bản', saleStock: 2 },
                      { id: `var-${Date.now()}-m`, size: 'M', color: 'Nguyên bản', saleStock: 2 },
                    ],
                  },
                  [
                    { size: 'S', color: 'Nguyên bản', count: 2 },
                    { size: 'M', color: 'Nguyên bản', count: 2 },
                  ]
                );

                setIsAddProductOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#302824] mb-1">Tên trang phục <span className="text-red-500">*</span></label>
                <input name="title" required placeholder="VD: Váy Dạ Hội Velvet Ruby" className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg" />
              </div>

              <div>
                <label className="block font-semibold text-[#302824] mb-1">Danh mục</label>
                <select name="category" className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg">
                  <option value="Váy Dạ Hội">Váy Dạ Hội</option>
                  <option value="Áo Dài Thiết Kế">Áo Dài Thiết Kế</option>
                  <option value="Đầm Tiệc &amp; Cocktail">Đầm Tiệc &amp; Cocktail</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Giá thuê / đợt (VND) <span className="text-red-500">*</span></label>
                  <input name="rentalPrice" type="number" required defaultValue={750000} className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-semibold text-[#302824] mb-1">Ký quỹ tài sản (VND) <span className="text-red-500">*</span></label>
                  <input name="depositPrice" type="number" required defaultValue={1500000} className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#302824] mb-1">Giá bán mới (nếu có):</label>
                <input name="salePrice" type="number" defaultValue={3800000} className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg font-mono" />
              </div>

              <div>
                <label className="block font-semibold text-[#302824] mb-1">Mô tả sản phẩm:</label>
                <textarea name="desc" rows={2} defaultValue="Chất liệu lụa satin cao cấp tùng xòe quyến rũ." className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg" />
              </div>

              <div className="p-3 bg-[#ECDAD8]/30 rounded-xl border border-[#E8DFD8] text-xs text-[#302824]">
                Hệ thống sẽ tự động tạo 4 mã QR vật lý mới (2 mã Size S, 2 mã Size M) ở trạng thái <strong>READY</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddProductOpen(false)} className="px-4 py-2 text-[#756A64]">Hủy</button>
                <button type="submit" className="px-5 py-2 font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg">Thêm &amp; In QR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
