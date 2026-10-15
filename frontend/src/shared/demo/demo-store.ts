import {
  Shop,
  Product,
  RentalUnit,
  RentalOrder,
  PaymentEntry,
  DepositTransaction,
  IncidentRecord,
  RefundRequest,
  SaleInquiry,
  UserRole,
  UnitCondition,
  FittingAppointment,
  StaffMember,
  CustomerProfile,
  WaitlistEntry,
} from '@/shared/model/domain';

const STORAGE_KEY = 'dipxinh_business_state_v2';

interface StateData {
  currentRole: UserRole;
  currentShopId: string;
  shops: Shop[];
  products: Product[];
  rentalUnits: RentalUnit[];
  orders: RentalOrder[];
  payments: PaymentEntry[];
  depositTransactions: DepositTransaction[];
  incidents: IncidentRecord[];
  refunds: RefundRequest[];
  saleInquiries: SaleInquiry[];
  fittings: FittingAppointment[];
  staffMembers: StaffMember[];
  customers: CustomerProfile[];
  waitlist: WaitlistEntry[];
}

const defaultShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Áo Dài & Dạ Hội Lụa Vàng',
    slug: 'lua-vang',
    phone: '0908 123 456',
    address: '124 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    plan: 'TRIAL',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#713F4B',
    logoUrl: '',
    bannerUrl: '/images/demo/hero-fashion-rental.jpg',
    description: 'Chuyên cho thuê và thiết kế áo dài cách tân, váy dạ hội lụa tơ tằm thượng hạng cho sự kiện, đám cưới và tiệc tối.',
    depositHoldHours: 1,
    allowLocalDelivery: true,
  },
  {
    id: 'shop-2',
    name: 'Maison De Soie - Dạ Hội Cao Cấp',
    slug: 'maison-soie',
    phone: '0938 999 888',
    address: '45 Lý Tự Trọng, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    plan: 'STARTER',
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    accentColor: '#5C303B',
    logoUrl: '',
    bannerUrl: '/images/demo/hero-fashion-rental.jpg',
    description: 'Bộ sưu tập đầm dạ hội couture và veston phong cách Pháp cho các quý cô thanh lịch.',
    depositHoldHours: 2,
    allowLocalDelivery: true,
  },
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    shopId: 'shop-1',
    title: 'Đầm Dạ Hội Lụa Emerald Silk',
    category: 'Váy Dạ Hội',
    description: 'Đầm dạ hội trễ vai dáng cúp ngực tùng xòe thêu đính đá pha lê tinh xảo, chất liệu lụa tơ tằm tự nhiên màu xanh ngọc lục bảo.',
    images: ['/images/demo/product-emerald-gown.jpg'],
    rentalPrice: 850000,
    salePrice: 4200000,
    depositPrice: 1500000,
    featured: true,
    variants: [
      { id: 'var-1-s', size: 'S', color: 'Xanh ngọc', saleStock: 2 },
      { id: 'var-1-m', size: 'M', color: 'Xanh ngọc', saleStock: 3 },
      { id: 'var-1-l', size: 'L', color: 'Xanh ngọc', saleStock: 1 },
    ],
  },
  {
    id: 'prod-2',
    shopId: 'shop-1',
    title: 'Áo Dài Thêu Chỉ Vàng Hoàng Triều',
    category: 'Áo Dài Thiết Kế',
    description: 'Áo dài truyền thống lụa tơ tằm thêu chim phượng bằng chỉ vàng ánh kim, tay dài tà kép bay bổng, đi kèm quạt giấy lụa thủ công.',
    images: ['/images/demo/product-silk-aodai.jpg'],
    rentalPrice: 650000,
    salePrice: 3500000,
    depositPrice: 1200000,
    featured: true,
    variants: [
      { id: 'var-2-s', size: 'S', color: 'Vàng Champagne', saleStock: 1 },
      { id: 'var-2-m', size: 'M', color: 'Vàng Champagne', saleStock: 2 },
    ],
  },
  {
    id: 'prod-3',
    shopId: 'shop-1',
    title: 'Đầm Nhung Velvet Midnight Noir',
    category: 'Đầm Tiệc & Cocktail',
    description: 'Đầm nhung cao cấp cổ chữ V nhấn thắt lưng da kim loại cổ điển, phong cách quý phái thanh lịch cho các buổi tiệc tối trang trọng.',
    images: ['/images/demo/product-velvet-dress.jpg'],
    rentalPrice: 550000,
    salePrice: 2800000,
    depositPrice: 1000000,
    featured: true,
    variants: [
      { id: 'var-3-m', size: 'M', color: 'Espresso Velvet', saleStock: 4 },
      { id: 'var-3-l', size: 'L', color: 'Espresso Velvet', saleStock: 2 },
    ],
  },
];

const defaultRentalUnits: RentalUnit[] = [
  // Product 1
  {
    id: 'unit-em-01',
    productId: 'prod-1',
    variantId: 'var-1-s',
    qrCode: 'DX-EM-01',
    size: 'S',
    color: 'Xanh ngọc',
    condition: 'EXCELLENT',
    physicalStatus: 'RENTED',
    currentOrderId: 'ord-2',
    lastInspectedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'unit-em-02',
    productId: 'prod-1',
    variantId: 'var-1-m',
    qrCode: 'DX-EM-02',
    size: 'M',
    color: 'Xanh ngọc',
    condition: 'EXCELLENT',
    physicalStatus: 'READY',
    lastInspectedAt: '2026-10-11T14:30:00Z',
  },
  {
    id: 'unit-em-03',
    productId: 'prod-1',
    variantId: 'var-1-m',
    qrCode: 'DX-EM-03',
    size: 'M',
    color: 'Xanh ngọc',
    condition: 'GOOD',
    physicalStatus: 'READY',
    lastInspectedAt: '2026-10-09T09:00:00Z',
  },
  {
    id: 'unit-em-04',
    productId: 'prod-1',
    variantId: 'var-1-l',
    qrCode: 'DX-EM-04',
    size: 'L',
    color: 'Xanh ngọc',
    condition: 'EXCELLENT',
    physicalStatus: 'READY',
  },
  // Product 2
  {
    id: 'unit-ad-01',
    productId: 'prod-2',
    variantId: 'var-2-s',
    qrCode: 'DX-AD-01',
    size: 'S',
    color: 'Vàng Champagne',
    condition: 'EXCELLENT',
    physicalStatus: 'READY',
  },
  {
    id: 'unit-ad-02',
    productId: 'prod-2',
    variantId: 'var-2-m',
    qrCode: 'DX-AD-02',
    size: 'M',
    color: 'Vàng Champagne',
    condition: 'GOOD',
    physicalStatus: 'WASHING',
    expectedReadyAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    lastInspectedAt: '2026-10-12T08:00:00Z',
  },
  // Product 3
  {
    id: 'unit-vn-01',
    productId: 'prod-3',
    variantId: 'var-3-m',
    qrCode: 'DX-VN-01',
    size: 'M',
    color: 'Espresso Velvet',
    condition: 'EXCELLENT',
    physicalStatus: 'READY',
  },
  {
    id: 'unit-vn-02',
    productId: 'prod-3',
    variantId: 'var-3-m',
    qrCode: 'DX-VN-02',
    size: 'M',
    color: 'Espresso Velvet',
    condition: 'GOOD',
    physicalStatus: 'RENTED',
    currentOrderId: 'ord-2',
  },
];

const defaultOrders: RentalOrder[] = [
  {
    id: 'ord-1',
    code: 'ORD-9821',
    shopId: 'shop-1',
    customer: {
      name: 'Trần Mai Phương',
      phone: '0912 345 678',
      email: 'maiphuong@example.com',
      address: '280 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    },
    items: [
      {
        id: 'item-1-1',
        productId: 'prod-1',
        variantId: 'var-1-m',
        productTitle: 'Đầm Dạ Hội Lụa Emerald Silk',
        productImage: '/images/demo/product-emerald-gown.jpg',
        size: 'M',
        color: 'Xanh ngọc',
        rentalPrice: 850000,
        depositPrice: 1500000,
      },
    ],
    pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    returnDueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    eventDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryMethod: 'STORE_PICKUP',
    returnMethod: 'STORE_RETURN',
    status: 'PENDING_REVIEW',
    rentalTotal: 850000,
    advanceRequired: 300000,
    advancePaid: 0,
    balanceDue: 550000,
    balancePaid: 0,
    depositRequired: 1500000,
    depositPaid: 0,
    proposedIncidentsTotal: 0,
    finalizedIncidentsTotal: 0,
    refundReserved: 0,
    refundVerified: 0,
    notes: 'Khách cần mặc sự kiện Gala Dinner, mong muốn shop hỗ trợ ủi phẳng tà váy trước.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-2',
    code: 'ORD-9818',
    shopId: 'shop-1',
    customer: {
      name: 'Lê Hoàng Yến',
      phone: '0934 567 890',
      email: 'hoangyen.le@gmail.com',
      address: '72 Lê Thánh Tôn, Bến Nghé, Quận 1',
    },
    items: [
      {
        id: 'item-2-1',
        productId: 'prod-1',
        variantId: 'var-1-s',
        productTitle: 'Đầm Dạ Hội Lụa Emerald Silk',
        productImage: '/images/demo/product-emerald-gown.jpg',
        size: 'S',
        color: 'Xanh ngọc',
        rentalPrice: 850000,
        depositPrice: 1500000,
        assignedUnitId: 'unit-em-01',
        assignedQrCode: 'DX-EM-01',
      },
      {
        id: 'item-2-2',
        productId: 'prod-3',
        variantId: 'var-3-m',
        productTitle: 'Đầm Nhung Velvet Midnight Noir',
        productImage: '/images/demo/product-velvet-dress.jpg',
        size: 'M',
        color: 'Espresso Velvet',
        rentalPrice: 550000,
        depositPrice: 1000000,
        assignedUnitId: 'unit-vn-02',
        assignedQrCode: 'DX-VN-02',
      },
    ],
    pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    returnDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryMethod: 'STORE_PICKUP',
    returnMethod: 'STORE_RETURN',
    status: 'ACTIVE',
    handoverAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rentalTotal: 1400000,
    advanceRequired: 500000,
    advancePaid: 500000,
    balanceDue: 0,
    balancePaid: 900000,
    depositRequired: 2500000,
    depositPaid: 2500000,
    proposedIncidentsTotal: 0,
    finalizedIncidentsTotal: 0,
    refundReserved: 0,
    refundVerified: 0,
    notes: 'Khách thuê 2 bộ cho buổi chụp kỷ niệm.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultPayments: PaymentEntry[] = [
  {
    id: 'pay-1',
    orderId: 'ord-2',
    type: 'ADVANCE',
    amount: 500000,
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261008001',
    status: 'VERIFIED',
    actor: 'Lê Hoàng Yến',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Cọc giữ chỗ 2 bộ',
  },
  {
    id: 'pay-2',
    orderId: 'ord-2',
    type: 'RENTAL_BALANCE',
    amount: 900000,
    method: 'CASH',
    referenceCode: 'CASH-9818',
    status: 'VERIFIED',
    actor: 'ShopStaff Thu Ngân',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Thu nốt tiền thuê khi bàn giao đồ',
  },
  {
    id: 'pay-3',
    orderId: 'ord-2',
    type: 'SECURITY_DEPOSIT',
    amount: 2500000,
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261010089',
    status: 'VERIFIED',
    actor: 'Lê Hoàng Yến',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Ký quỹ tài sản 2 bộ đồ trước khi bàn giao',
  },
];

const defaultDepositTransactions: DepositTransaction[] = [
  {
    id: 'dt-1',
    orderId: 'ord-2',
    type: 'COLLECTED',
    amount: 2500000,
    actor: 'ShopManager Đối Soát',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Đã nhận đủ 2.500.000đ ký quỹ chuyển khoản đã đối soát ngân hàng',
  },
];

const defaultFittings: FittingAppointment[] = [
  {
    id: 'fit-1',
    shopId: 'shop-1',
    customerName: 'Nguyễn Bích Ngọc',
    customerPhone: '0988 111 222',
    date: '2026-10-15',
    timeSlot: '10:00 - 11:00',
    status: 'SCHEDULED',
    desiredProductTitle: 'Đầm Dạ Hội Lụa Emerald Silk',
    notes: 'Khách đến thử size M cho tiệc cưới cuối tuần',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fit-2',
    shopId: 'shop-1',
    customerName: 'Vũ Thảo Vy',
    customerPhone: '0977 333 444',
    date: '2026-10-15',
    timeSlot: '14:30 - 15:30',
    status: 'SCHEDULED',
    desiredProductTitle: 'Áo Dài Thêu Chỉ Vàng Hoàng Triều',
    notes: 'Thử áo dài chụp ảnh kỷ yếu cùng bạn bè',
    createdAt: new Date().toISOString(),
  },
];

const defaultStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    shopId: 'shop-1',
    name: 'Hoàng Minh Châu',
    email: 'chau.hm@dipxinh.com',
    phone: '0908 123 456',
    role: 'SHOP_OWNER',
    active: true,
    permissions: ['ALL_PERMISSIONS', 'MANAGE_STAFF', 'APPROVE_REFUNDS', 'CONFIG_POLICIES'],
  },
  {
    id: 'staff-2',
    shopId: 'shop-1',
    name: 'Nguyễn Văn Đạt',
    email: 'dat.nv@dipxinh.com',
    phone: '0912 888 999',
    role: 'SHOP_MANAGER',
    active: true,
    permissions: ['VIEW_FINANCE', 'APPROVE_ORDERS', 'VERIFY_PAYMENTS', 'MANAGE_UNITS'],
  },
  {
    id: 'staff-3',
    shopId: 'shop-1',
    name: 'Phạm Thu Trang',
    email: 'trang.pt@dipxinh.com',
    phone: '0933 555 777',
    role: 'SHOP_STAFF',
    active: true,
    permissions: ['SCAN_QR', 'HANDOVER_ORDERS', 'RECEIVE_RETURNS', 'RECORD_PAYMENTS'],
  },
];

const defaultCustomers: CustomerProfile[] = [
  {
    id: 'cust-1',
    shopId: 'shop-1',
    name: 'Trần Mai Phương',
    phone: '0912 345 678',
    email: 'maiphuong@example.com',
    height: 162,
    weight: 49,
    bust: 84,
    waist: 64,
    hip: 90,
    totalRentals: 3,
    notes: 'Khách quen chuộng phong cách váy xòe lụa tơ tằm, hay mặc size M.',
  },
  {
    id: 'cust-2',
    shopId: 'shop-1',
    name: 'Lê Hoàng Yến',
    phone: '0934 567 890',
    email: 'hoangyen.le@gmail.com',
    height: 167,
    weight: 52,
    bust: 86,
    waist: 66,
    hip: 92,
    totalRentals: 5,
    notes: 'Thường thuê đồ dạ hội cho sự kiện công ty, thanh toán nhanh chóng.',
  },
];

const defaultWaitlist: WaitlistEntry[] = [
  {
    id: 'wait-1',
    shopId: 'shop-1',
    productId: 'prod-2',
    productTitle: 'Áo Dài Thêu Chỉ Vàng Hoàng Triều',
    size: 'M',
    customerName: 'Đỗ Hải My',
    customerPhone: '0945 666 777',
    desiredDate: '2026-10-20',
    notified: false,
    createdAt: new Date().toISOString(),
  },
];

class StoreService {
  private data: StateData;

  constructor() {
    this.data = this.loadState();
  }

  private loadState(): StateData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      currentRole: 'SHOP_OWNER',
      currentShopId: 'shop-1',
      shops: defaultShops,
      products: defaultProducts,
      rentalUnits: defaultRentalUnits,
      orders: defaultOrders,
      payments: defaultPayments,
      depositTransactions: defaultDepositTransactions,
      incidents: [],
      refunds: [],
      saleInquiries: [],
      fittings: defaultFittings,
      staffMembers: defaultStaffMembers,
      customers: defaultCustomers,
      waitlist: defaultWaitlist,
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('dipxinh_store_updated'));
  }

  getState(): StateData {
    return this.data;
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = {
      currentRole: 'SHOP_OWNER',
      currentShopId: 'shop-1',
      shops: defaultShops,
      products: defaultProducts,
      rentalUnits: defaultRentalUnits,
      orders: defaultOrders,
      payments: defaultPayments,
      depositTransactions: defaultDepositTransactions,
      incidents: [],
      refunds: [],
      saleInquiries: [],
      fittings: defaultFittings,
      staffMembers: defaultStaffMembers,
      customers: defaultCustomers,
      waitlist: defaultWaitlist,
    };
    this.persist();
  }

  // Role & Tenant Switching
  setRole(role: UserRole) {
    this.data.currentRole = role;
    this.persist();
  }

  setShop(shopId: string) {
    this.data.currentShopId = shopId;
    this.persist();
  }

  getCurrentShop(): Shop {
    return this.data.shops.find((s) => s.id === this.data.currentShopId) || this.data.shops[0];
  }

  updateShopSettings(shopId: string, settings: Partial<Shop>) {
    const shop = this.data.shops.find((s) => s.id === shopId);
    if (!shop) return;
    Object.assign(shop, settings);
    this.persist();
  }

  createShop(newShop: Omit<Shop, 'id' | 'trialEndsAt'>): Shop {
    const shop: Shop = {
      ...newShop,
      id: `shop-${Date.now()}`,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.data.shops.push(shop);
    this.data.currentShopId = shop.id;
    this.persist();
    return shop;
  }

  // Products & QR Units
  addProduct(product: Omit<Product, 'id'>, initialUnits: { size: string; color: string; count: number }[]): Product {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    this.data.products.push(newProd);

    let qrIdx = 1;
    for (const group of initialUnits) {
      const variant = newProd.variants.find((v) => v.size === group.size && v.color === group.color) || newProd.variants[0];
      for (let i = 0; i < group.count; i++) {
        const qrCode = `DX-${newProd.title.substring(0, 2).toUpperCase()}-${String(qrIdx++).padStart(2, '0')}`;
        this.data.rentalUnits.push({
          id: `unit-${Date.now()}-${qrIdx}`,
          productId: newProd.id,
          variantId: variant.id,
          qrCode,
          size: group.size,
          color: group.color,
          condition: 'EXCELLENT',
          physicalStatus: 'READY',
          lastInspectedAt: new Date().toISOString(),
        });
      }
    }

    this.persist();
    return newProd;
  }

  updateUnitStatus(unitId: string, status: RentalUnit['physicalStatus'], condition?: UnitCondition, expectedReadyAt?: string) {
    const unit = this.data.rentalUnits.find((u) => u.id === unitId);
    if (!unit) return;
    unit.physicalStatus = status;
    if (condition) unit.condition = condition;
    if (expectedReadyAt !== undefined) unit.expectedReadyAt = expectedReadyAt;
    unit.lastInspectedAt = new Date().toISOString();
    this.persist();
  }

  // Booking Flow: Storefront -> PENDING_REVIEW
  createRentalOrder(params: {
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
  }): { success: boolean; order?: RentalOrder; error?: string } {
    const orderItems: RentalOrder['items'] = [];
    let rentalTotal = 0;
    let depositTotal = 0;

    for (const item of params.items) {
      const product = this.data.products.find((p) => p.id === item.productId);
      if (!product) return { success: false, error: 'Sản phẩm không tồn tại' };

      rentalTotal += product.rentalPrice;
      depositTotal += product.depositPrice;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        variantId: item.variantId,
        productTitle: product.title,
        productImage: product.images[0] || '',
        size: item.size,
        color: item.color,
        rentalPrice: product.rentalPrice,
        depositPrice: product.depositPrice,
      });
    }

    const advanceRequired = Math.round(rentalTotal * 0.35); // Cọc giữ chỗ ~35%
    const balanceDue = rentalTotal - advanceRequired;

    const newOrder: RentalOrder = {
      id: `ord-${Date.now()}`,
      code: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: params.shopId,
      customer: params.customer,
      items: orderItems,
      pickupDate: params.pickupDate,
      returnDueDate: params.returnDueDate,
      eventDate: params.eventDate,
      deliveryMethod: params.deliveryMethod,
      returnMethod: params.returnMethod,
      status: 'PENDING_REVIEW',
      rentalTotal,
      advanceRequired,
      advancePaid: 0,
      balanceDue,
      balancePaid: 0,
      depositRequired: depositTotal,
      depositPaid: 0,
      proposedIncidentsTotal: 0,
      finalizedIncidentsTotal: 0,
      refundReserved: 0,
      refundVerified: 0,
      notes: params.notes,
      createdAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);

    // Also auto-record or update customer profile in CRM
    const existingCust = this.data.customers.find((c) => c.phone === params.customer.phone);
    if (existingCust) {
      existingCust.totalRentals += 1;
    } else {
      this.data.customers.push({
        id: `cust-${Date.now()}`,
        shopId: params.shopId,
        name: params.customer.name,
        phone: params.customer.phone,
        email: params.customer.email,
        totalRentals: 1,
      });
    }

    this.persist();
    return { success: true, order: newOrder };
  }

  // Staff POS Booking: Create walk-in order directly with assigned QR units (D-13)
  createWalkInOrder(params: {
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
  }): { success: boolean; order?: RentalOrder; error?: string } {
    const orderItems: RentalOrder['items'] = [];
    let rentalTotal = 0;
    let depositTotal = 0;

    for (const item of params.items) {
      const product = this.data.products.find((p) => p.id === item.productId);
      const unit = this.data.rentalUnits.find((u) => u.id === item.unitId);
      if (!product || !unit) return { success: false, error: 'Sản phẩm hoặc mã QR không tồn tại' };

      rentalTotal += product.rentalPrice;
      depositTotal += product.depositPrice;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        variantId: item.variantId,
        productTitle: product.title,
        productImage: product.images[0] || '',
        size: item.size,
        color: item.color,
        rentalPrice: product.rentalPrice,
        depositPrice: product.depositPrice,
        assignedUnitId: unit.id,
        assignedQrCode: unit.qrCode,
      });

      unit.physicalStatus = 'HELD';
    }

    const advanceRequired = Math.round(rentalTotal * 0.35);

    const newOrder: RentalOrder = {
      id: `ord-${Date.now()}`,
      code: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: params.shopId,
      customer: params.customer,
      items: orderItems,
      pickupDate: params.pickupDate,
      returnDueDate: params.returnDueDate,
      deliveryMethod: 'STORE_PICKUP',
      returnMethod: 'STORE_RETURN',
      status: 'HELD', // Direct HELD with assigned QR
      holdExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      rentalTotal,
      advanceRequired,
      advancePaid: 0,
      balanceDue: rentalTotal - advanceRequired,
      balancePaid: 0,
      depositRequired: depositTotal,
      depositPaid: 0,
      proposedIncidentsTotal: 0,
      finalizedIncidentsTotal: 0,
      refundReserved: 0,
      refundVerified: 0,
      notes: params.notes || 'Đơn tạo trực tiếp tại quầy showroom (Walk-in)',
      createdAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.persist();
    return { success: true, order: newOrder };
  }

  // Staff Review: Assign Physical QR Units -> Status HELD with expires_at countdown
  approveOrderAndHold(orderId: string, itemAssignments: { itemId: string; unitId: string }[]): { success: boolean; error?: string } {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };

    for (const assign of itemAssignments) {
      const unit = this.data.rentalUnits.find((u) => u.id === assign.unitId);
      if (!unit) return { success: false, error: `Mã đơn vị không tồn tại` };
      if (unit.physicalStatus !== 'READY') {
        return { success: false, error: `Mã ${unit.qrCode} hiện đang ở trạng thái ${unit.physicalStatus}, không thể gán!` };
      }
    }

    for (const assign of itemAssignments) {
      const item = order.items.find((i) => i.id === assign.itemId);
      const unit = this.data.rentalUnits.find((u) => u.id === assign.unitId);
      if (item && unit) {
        item.assignedUnitId = unit.id;
        item.assignedQrCode = unit.qrCode;
        unit.physicalStatus = 'HELD';
        unit.currentOrderId = order.id;
      }
    }

    order.status = 'HELD';
    order.holdExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    this.persist();
    return { success: true };
  }

  recordPayment(orderId: string, type: PaymentEntry['type'], amount: number, method: PaymentEntry['method'], referenceCode?: string, notes?: string): PaymentEntry {
    const entry: PaymentEntry = {
      id: `pay-${Date.now()}`,
      orderId,
      type,
      amount,
      method,
      referenceCode,
      status: 'PENDING_VERIFICATION',
      actor: this.data.currentRole,
      createdAt: new Date().toISOString(),
      notes,
    };
    this.data.payments.unshift(entry);
    this.persist();
    return entry;
  }

  verifyPayment(paymentId: string): { success: boolean; error?: string } {
    const payment = this.data.payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, error: 'Phiếu thu không tồn tại' };
    if (payment.status === 'VERIFIED') return { success: false, error: 'Khoản tiền đã được đối soát trước đó' };

    const order = this.data.orders.find((o) => o.id === payment.orderId);
    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };

    payment.status = 'VERIFIED';
    payment.verifiedAt = new Date().toISOString();

    if (payment.type === 'ADVANCE') {
      order.advancePaid += payment.amount;
      if (order.status === 'HELD' && order.advancePaid >= order.advanceRequired) {
        order.status = 'CONFIRMED';
        order.holdExpiresAt = undefined;
      }
    } else if (payment.type === 'RENTAL_BALANCE') {
      order.balancePaid += payment.amount;
      order.balanceDue = Math.max(0, order.balanceDue - payment.amount);
    } else if (payment.type === 'SECURITY_DEPOSIT') {
      order.depositPaid += payment.amount;
      this.data.depositTransactions.unshift({
        id: `dt-${Date.now()}`,
        orderId: order.id,
        type: 'COLLECTED',
        amount: payment.amount,
        actor: `${this.data.currentRole} (Đối soát)`,
        timestamp: new Date().toISOString(),
        note: `Thu tiền ký quỹ tài sản qua ${payment.method === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'} (${payment.referenceCode || 'N/A'})`,
      });
    }

    this.persist();
    return { success: true };
  }

  handoverOrder(orderId: string): { success: boolean; error?: string } {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };

    const unassigned = order.items.find((i) => !i.assignedUnitId);
    if (unassigned) {
      return { success: false, error: `Món "${unassigned.productTitle}" chưa được gán mã QR vật lý!` };
    }

    for (const item of order.items) {
      if (item.assignedUnitId) {
        const unit = this.data.rentalUnits.find((u) => u.id === item.assignedUnitId);
        if (unit) {
          unit.physicalStatus = 'RENTED';
        }
      }
    }

    order.status = 'ACTIVE';
    order.handoverAt = new Date().toISOString();
    this.persist();
    return { success: true };
  }

  processReturnBatch(
    orderId: string,
    returnedItems: {
      itemId: string;
      condition: UnitCondition;
      needsWashing: boolean;
      incidentNote?: string;
    }[]
  ): { success: boolean; returnedCount: number; remainingCount: number; error?: string } {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, returnedCount: 0, remainingCount: 0, error: 'Đơn không tồn tại' };

    for (const ret of returnedItems) {
      const item = order.items.find((i) => i.id === ret.itemId);
      if (!item) continue;
      item.returnedAt = new Date().toISOString();
      item.returnCondition = ret.condition;
      item.inspectionNotes = ret.incidentNote;

      if (item.assignedUnitId) {
        const unit = this.data.rentalUnits.find((u) => u.id === item.assignedUnitId);
        if (unit) {
          unit.condition = ret.condition;
          unit.physicalStatus = ret.needsWashing ? 'WASHING' : ret.condition === 'DAMAGED' ? 'DAMAGED' : 'READY';
          unit.currentOrderId = undefined;
          unit.lastInspectedAt = new Date().toISOString();
          if (ret.needsWashing) {
            unit.expectedReadyAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          }
        }
      }
    }

    const totalItems = order.items.length;
    const returnedItemsCount = order.items.filter((i) => !!i.returnedAt).length;
    const remainingCount = totalItems - returnedItemsCount;

    if (remainingCount > 0) {
      order.status = 'PARTIALLY_RETURNED';
    } else {
      order.status = 'COMPLETED';
    }

    this.persist();
    return { success: true, returnedCount: returnedItemsCount, remainingCount };
  }

  createIncident(orderId: string, itemId: string, type: IncidentRecord['type'], proposedFee: number, notes: string): IncidentRecord {
    const order = this.data.orders.find((o) => o.id === orderId);
    const item = order?.items.find((i) => i.id === itemId);

    const record: IncidentRecord = {
      id: `inc-${Date.now()}`,
      orderId,
      unitId: item?.assignedUnitId || '',
      qrCode: item?.assignedQrCode || 'N/A',
      productTitle: item?.productTitle || 'Trang phục',
      type,
      proposedFee,
      finalizedFee: 0,
      status: 'PROPOSED',
      notes,
      createdAt: new Date().toISOString(),
    };

    this.data.incidents.unshift(record);
    if (order) {
      order.proposedIncidentsTotal += proposedFee;
    }
    this.persist();
    return record;
  }

  finalizeIncident(incidentId: string, finalizedFee: number): { success: boolean; error?: string } {
    const inc = this.data.incidents.find((i) => i.id === incidentId);
    if (!inc) return { success: false, error: 'Biên bản sự cố không tồn tại' };

    const order = this.data.orders.find((o) => o.id === inc.orderId);
    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };

    inc.finalizedFee = finalizedFee;
    inc.status = 'FINALIZED';

    order.proposedIncidentsTotal = Math.max(0, order.proposedIncidentsTotal - inc.proposedFee);
    order.finalizedIncidentsTotal += finalizedFee;

    this.data.depositTransactions.unshift({
      id: `dt-${Date.now()}`,
      orderId: order.id,
      type: 'CHARGED_INCIDENT',
      amount: finalizedFee,
      actor: `${this.data.currentRole} (Thỏa thuận với khách)`,
      timestamp: new Date().toISOString(),
      note: `Khấu trừ sự cố ${inc.type} mã ${inc.qrCode}: Phí chốt ${finalizedFee.toLocaleString('vi-VN')}đ`,
    });

    this.persist();
    return { success: true };
  }

  requestRefund(params: {
    orderId: string;
    amount: number;
    bankAccount: string;
    bankName: string;
    recipientName: string;
    reason: string;
  }): { success: boolean; refund?: RefundRequest; error?: string } {
    const order = this.data.orders.find((o) => o.id === params.orderId);
    if (!order) return { success: false, error: 'Đơn không tồn tại' };

    const availableToRefund = order.depositPaid - order.finalizedIncidentsTotal - order.refundReserved - order.refundVerified;
    if (params.amount > availableToRefund) {
      return {
        success: false,
        error: `Số tiền yêu cầu (${params.amount.toLocaleString('vi-VN')}đ) vượt quá số dư cọc khả hoàn (${availableToRefund.toLocaleString('vi-VN')}đ)!`,
      };
    }

    const refund: RefundRequest = {
      id: `ref-${Date.now()}`,
      orderId: params.orderId,
      amount: params.amount,
      bankAccount: params.bankAccount,
      bankName: params.bankName,
      recipientName: params.recipientName,
      status: 'PROCESSING',
      reason: params.reason,
      createdAt: new Date().toISOString(),
    };

    order.refundReserved += params.amount;
    this.data.refunds.unshift(refund);

    this.data.depositTransactions.unshift({
      id: `dt-${Date.now()}`,
      orderId: order.id,
      type: 'REFUND_RESERVED',
      amount: params.amount,
      actor: this.data.currentRole,
      timestamp: new Date().toISOString(),
      note: `Khóa giữ chỗ hoàn cọc ${params.amount.toLocaleString('vi-VN')}đ chuyển về TK ${params.bankAccount} (${params.bankName})`,
    });

    this.persist();
    return { success: true, refund };
  }

  verifyRefund(refundId: string): { success: boolean; error?: string } {
    const refund = this.data.refunds.find((r) => r.id === refundId);
    if (!refund) return { success: false, error: 'Lệnh hoàn cọc không tồn tại' };
    if (refund.status === 'VERIFIED') return { success: false, error: 'Lệnh hoàn đã được đối soát thành công trước đó' };

    const order = this.data.orders.find((o) => o.id === refund.orderId);
    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };

    refund.status = 'VERIFIED';
    refund.verifiedAt = new Date().toISOString();

    order.refundReserved = Math.max(0, order.refundReserved - refund.amount);
    order.refundVerified += refund.amount;

    this.data.depositTransactions.unshift({
      id: `dt-${Date.now()}`,
      orderId: order.id,
      type: 'REFUND_VERIFIED',
      amount: refund.amount,
      actor: `${this.data.currentRole} (Ủy nhiệm chi xác nhận)`,
      timestamp: new Date().toISOString(),
      note: `Đã hoàn tiền ${refund.amount.toLocaleString('vi-VN')}đ cho khách (${refund.recipientName}) - Hoàn tất đối soát ngân hàng`,
    });

    this.persist();
    return { success: true };
  }

  createSaleInquiry(inquiry: Omit<SaleInquiry, 'id' | 'createdAt'>): SaleInquiry {
    const newInquiry: SaleInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.saleInquiries.unshift(newInquiry);
    this.persist();
    return newInquiry;
  }

  // P1: Fittings (Lịch thử đồ)
  createFitting(appointment: Omit<FittingAppointment, 'id' | 'status' | 'createdAt'>): FittingAppointment {
    const newFitting: FittingAppointment = {
      ...appointment,
      id: `fit-${Date.now()}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };
    this.data.fittings.unshift(newFitting);
    this.persist();
    return newFitting;
  }

  updateFittingStatus(id: string, status: FittingAppointment['status']) {
    const fit = this.data.fittings.find((f) => f.id === id);
    if (!fit) return;
    fit.status = status;
    this.persist();
  }

  // P1: Staff & Permissions
  addStaffMember(staff: Omit<StaffMember, 'id'>): StaffMember {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
    };
    this.data.staffMembers.push(newStaff);
    this.persist();
    return newStaff;
  }

  toggleStaffActive(staffId: string) {
    const s = this.data.staffMembers.find((m) => m.id === staffId);
    if (!s) return;
    s.active = !s.active;
    this.persist();
  }

  // P1: Customers CRM
  createCustomerProfile(profile: Omit<CustomerProfile, 'id' | 'totalRentals'>): CustomerProfile {
    const newCust: CustomerProfile = {
      ...profile,
      id: `cust-${Date.now()}`,
      totalRentals: 0,
    };
    this.data.customers.unshift(newCust);
    this.persist();
    return newCust;
  }

  updateCustomerProfile(id: string, updates: Partial<CustomerProfile>) {
    const c = this.data.customers.find((cust) => cust.id === id);
    if (!c) return;
    Object.assign(c, updates);
    this.persist();
  }

  // P1: Waitlist
  createWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'notified' | 'createdAt'>): WaitlistEntry {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wait-${Date.now()}`,
      notified: false,
      createdAt: new Date().toISOString(),
    };
    this.data.waitlist.unshift(newEntry);
    this.persist();
    return newEntry;
  }
}

export const demoStore = new StoreService();
