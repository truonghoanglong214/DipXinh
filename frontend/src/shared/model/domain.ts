export type UserRole = 'PLATFORM_ADMIN' | 'SHOP_OWNER' | 'SHOP_MANAGER' | 'SHOP_STAFF' | 'CUSTOMER';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  plan: 'TRIAL' | 'STARTER' | 'GROWTH';
  trialEndsAt: string;
  accentColor: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  depositHoldHours?: number; // Thời gian giữ cọc (mặc định 60 phút)
  allowLocalDelivery?: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  saleStock: number; // Tồn kho bán độc lập
}

export interface Product {
  id: string;
  shopId: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  rentalPrice: number;
  salePrice?: number;
  depositPrice: number;
  variants: ProductVariant[];
  featured?: boolean;
}

export type UnitPhysicalStatus = 'READY' | 'HELD' | 'RENTED' | 'WASHING' | 'MAINTENANCE' | 'DAMAGED';
export type UnitCondition = 'EXCELLENT' | 'GOOD' | 'MINOR_WEAR' | 'DAMAGED';

export interface RentalUnit {
  id: string;
  productId: string;
  variantId: string;
  qrCode: string; // Mã QR định danh thực thể vật lý (e.g. DX-LUA-01)
  size: string;
  color: string;
  condition: UnitCondition;
  physicalStatus: UnitPhysicalStatus;
  currentOrderId?: string;
  expectedReadyAt?: string;
  lastInspectedAt?: string;
}

export type OrderStatus =
  | 'PENDING_REVIEW'   // Chờ duyệt — CHƯA GIỮ ĐỒ
  | 'HELD'             // Đã gán QR và có countdown giữ chỗ (expires_at)
  | 'CONFIRMED'        // Đã đối soát cọc giữ chỗ, đơn có hiệu lực
  | 'ACTIVE'           // Đã bàn giao đồ (khách đang thuê)
  | 'PARTIALLY_RETURNED' // Đã trả một phần (ví dụ 1/2 QR)
  | 'COMPLETED'        // Đã trả đủ toàn bộ QR và hoàn cọc
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productTitle: string;
  productImage: string;
  size: string;
  color: string;
  rentalPrice: number;
  depositPrice: number;
  assignedUnitId?: string;
  assignedQrCode?: string;
  returnedAt?: string;
  returnCondition?: UnitCondition;
  inspectionNotes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
}

export interface RentalOrder {
  id: string;
  code: string; // Mã đơn hiển thị (e.g. ORD-9821)
  shopId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  pickupDate: string; // ISO string
  returnDueDate: string; // ISO string
  eventDate?: string;
  deliveryMethod: 'STORE_PICKUP' | 'LOCAL_DELIVERY';
  returnMethod: 'STORE_RETURN' | 'LOCAL_RETURN';
  status: OrderStatus;
  holdExpiresAt?: string;
  handoverAt?: string;
  
  // Tách bạch các khái niệm tài chính
  rentalTotal: number;
  advanceRequired: number;     // Tiền cọc giữ chỗ cần trả để Confirm
  advancePaid: number;         // Tiền cọc giữ chỗ đã verified
  balanceDue: number;          // Tiền thuê còn lại khi nhận đồ
  balancePaid: number;         // Tiền thuê còn lại đã verified
  depositRequired: number;     // Tiền ký quỹ tài sản (cọc đồ)
  depositPaid: number;         // Tiền ký quỹ đã thu và verified
  proposedIncidentsTotal: number;  // Phí sự cố đề xuất (chưa chốt nợ)
  finalizedIncidentsTotal: number; // Phí sự cố đã thỏa thuận chốt
  refundReserved: number;      // Tiền cọc giữ chỗ cho lệnh hoàn đang xử lý
  refundVerified: number;      // Tiền cọc đã hoàn trả thành công

  notes?: string;
  createdAt: string;
}

export interface PaymentEntry {
  id: string;
  orderId: string;
  type: 'ADVANCE' | 'RENTAL_BALANCE' | 'SECURITY_DEPOSIT';
  amount: number;
  method: 'CASH' | 'BANK_TRANSFER';
  referenceCode?: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  actor: string;
  createdAt: string;
  verifiedAt?: string;
  notes?: string;
}

export interface DepositTransaction {
  id: string;
  orderId: string;
  type: 'COLLECTED' | 'CHARGED_INCIDENT' | 'REFUND_RESERVED' | 'REFUND_VERIFIED' | 'REVERSED';
  amount: number;
  actor: string;
  timestamp: string;
  note: string;
}

export interface IncidentRecord {
  id: string;
  orderId: string;
  unitId: string;
  qrCode: string;
  productTitle: string;
  type: 'STAIN' | 'TORN' | 'LATE_RETURN' | 'LOST';
  proposedFee: number;
  finalizedFee: number;
  status: 'PROPOSED' | 'FINALIZED' | 'DEDUCTED';
  evidencePhotoUrl?: string;
  notes: string;
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  amount: number;
  bankAccount: string;
  bankName: string;
  recipientName: string;
  status: 'PROCESSING' | 'VERIFIED' | 'REJECTED';
  reason: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface SaleInquiry {
  id: string;
  shopId: string;
  productId: string;
  productTitle: string;
  variantSize: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  createdAt: string;
}

export interface FittingAppointment {
  id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "09:30 - 10:30"
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  desiredProductTitle?: string;
  notes?: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  shopId: string;
  name: string;
  email: string;
  phone: string;
  role: 'SHOP_OWNER' | 'SHOP_MANAGER' | 'SHOP_STAFF';
  active: boolean;
  permissions: string[];
}

export interface CustomerProfile {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  email?: string;
  height?: number; // cm
  weight?: number; // kg
  bust?: number;   // cm
  waist?: number;  // cm
  hip?: number;    // cm
  totalRentals: number;
  notes?: string;
}

export interface WaitlistEntry {
  id: string;
  shopId: string;
  productId: string;
  productTitle: string;
  size: string;
  customerName: string;
  customerPhone: string;
  desiredDate: string;
  notified: boolean;
  createdAt: string;
}
