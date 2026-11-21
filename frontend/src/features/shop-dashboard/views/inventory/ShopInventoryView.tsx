import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Product, RentalUnit, UnitPhysicalStatus, UnitCondition, Shop } from '@/shared/model/domain';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Input, Select } from '@/shared/components/ui';
import {
  Package,
  QrCode,
  Printer,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { BatchQrPrintModal } from './BatchQrPrintModal';

export const ShopInventoryView: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [activeTab, setActiveTab] = useState<'catalog' | 'units'>('catalog');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const shop: Shop =
    storeState.shops.find((s) => s.slug === shopSlug) ||
    storeState.shops[0] ||
    demoStore.getCurrentShop();

  const products = storeState.products.filter((p) => p.shopId === shop.id || !p.shopId);
  const units = storeState.rentalUnits.filter((u) => {
    // Lấy các units thuộc các products của shop này
    const pIds = products.map((p) => p.id);
    return pIds.includes(u.productId);
  });

  const handleUpdateUnit = (
    unitId: string,
    status: UnitPhysicalStatus,
    condition?: UnitCondition
  ) => {
    demoStore.updateUnitStatus(unitId, status, condition);
    setStoreState({ ...demoStore.getState() });
  };

  const handleSaveProduct = (
    product: Omit<Product, 'id'>,
    initialUnits: { size: string; color: string; count: number }[]
  ) => {
    demoStore.addProduct(product, initialUnits);
    setStoreState({ ...demoStore.getState() });
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredUnits = units.filter((u) => {
    const product = products.find((p) => p.id === u.productId);
    const matchSearch =
      u.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || u.physicalStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // Status counts for units
  const readyCount = units.filter((u) => u.physicalStatus === 'READY').length;
  const rentedCount = units.filter((u) => u.physicalStatus === 'RENTED').length;
  const washingCount = units.filter((u) => u.physicalStatus === 'WASHING').length;
  const maintenanceCount = units.filter((u) => u.physicalStatus === 'MAINTENANCE').length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getStatusBadge = (status: UnitPhysicalStatus) => {
    switch (status) {
      case 'READY':
        return (
          <Badge tone="success" styleVariant="soft" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Sẵn Sàng Thuê
          </Badge>
        );
      case 'RENTED':
        return (
          <Badge tone="primary" styleVariant="soft" size="sm">
            <Clock className="w-3 h-3 mr-1 inline" /> Đang Ở Khách
          </Badge>
        );
      case 'WASHING':
        return (
          <Badge tone="info" styleVariant="soft" size="sm">
            <RotateCcw className="w-3 h-3 mr-1 inline" /> Đang Giặt Hấp
          </Badge>
        );
      case 'MAINTENANCE':
        return (
          <Badge tone="warning" styleVariant="soft" size="sm">
            <Wrench className="w-3 h-3 mr-1 inline" /> Bảo Dưỡng / Sửa
          </Badge>
        );
      case 'DAMAGED':
        return (
          <Badge tone="danger" styleVariant="soft" size="sm">
            <AlertTriangle className="w-3 h-3 mr-1 inline" /> Hư Hại Nặng
          </Badge>
        );
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const getConditionBadge = (cond: UnitCondition) => {
    switch (cond) {
      case 'EXCELLENT':
        return <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Mới 99% (Xuất Sắc)</span>;
      case 'GOOD':
        return <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Tốt 90%</span>;
      case 'MINOR_WEAR':
        return <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Hao Mòn Nhẹ</span>;
      case 'DAMAGED':
        return <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Hư Hỏng Cần Sửa</span>;
      default:
        return <span>{cond}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
              Task F02-02 & F02-04
            </span>
            <span className="text-xs text-ink-muted">· {shop.name}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-ink tracking-tight">
            Quản Lý Danh Mục Trang Phục & Serialized QR Units
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Số hóa mẫu thiết kế, theo dõi vòng đời từng chiếc váy bằng mã QR độc bản và in nhãn chuẩn may mặc.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to={`/dashboard/${shop.slug}/availability`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Kiểm Tra Khả Dụng
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => setIsPrintModalOpen(true)}
          >
            In Mã QR Hàng Loạt
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm Trang Phục Mới
          </Button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="subtle" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Tổng Mẫu Thiết Kế</p>
            <p className="text-xl font-bold text-ink">{products.length} Mẫu</p>
          </div>
        </Card>

        <Card variant="subtle" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">QR Sẵn Sàng Cho Thuê</p>
            <p className="text-xl font-bold text-emerald-700">{readyCount} Chiếc</p>
          </div>
        </Card>

        <Card variant="subtle" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Khách Đang Mặc Thuê</p>
            <p className="text-xl font-bold text-blue-700">{rentedCount} Chiếc</p>
          </div>
        </Card>

        <Card variant="subtle" className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Đang Giặt Hấp Khử Khuẩn</p>
            <p className="text-xl font-bold text-amber-700">{washingCount} Chiếc</p>
          </div>
        </Card>
      </div>

      {/* Main Tab Controls & Filter Bar */}
      <div className="bg-surface rounded-xl border border-border-default shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border-default px-5 pt-3 bg-surface-subtle">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <Package className="w-4 h-4" />
              Mẫu Thiết Kế / Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'units'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Từng Hiện Vật QR Vật Lý ({units.length})
            </button>
          </div>

          <div className="pb-2 hidden sm:block">
            <span className="text-[11px] font-mono text-ink-muted">
              Tổng thực thể kiểm kê: <strong>{units.length} mã QR</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-border-default bg-surface flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder={
                activeTab === 'catalog'
                  ? 'Tìm kiếm theo tên mẫu thiết kế...'
                  : 'Tìm theo mã QR (VD: DX-EM-01) hoặc tên váy...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border-default bg-surface text-ink outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === 'catalog' ? (
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả danh mục' },
                  { value: 'Váy Dạ Hội', label: 'Váy Dạ Hội' },
                  { value: 'Áo Dài Thiết Kế', label: 'Áo Dài Thiết Kế' },
                  { value: 'Đầm Tiệc & Cocktail', label: 'Đầm Tiệc & Cocktail' },
                ]}
              />
            ) : (
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái QR' },
                  { value: 'READY', label: 'Sẵn Sàng Cho Thuê' },
                  { value: 'RENTED', label: 'Đang Ở Khách' },
                  { value: 'WASHING', label: 'Đang Giặt Hấp' },
                  { value: 'MAINTENANCE', label: 'Bảo Dưỡng / Sửa' },
                ]}
              />
            )}
          </div>
        </div>

        {/* Tab 1: Product Catalog View */}
        {activeTab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle border-b border-border-default text-ink-muted uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-4">Mẫu Thiết Kế</th>
                  <th className="p-4">Phân Loại</th>
                  <th className="p-4">Giá Thuê 3 Ngày</th>
                  <th className="p-4">Tiền Ký Quỹ</th>
                  <th className="p-4">Tổ Hợp Biến Thể</th>
                  <th className="p-4">Hiện Vật QR Trong Kho</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredProducts.map((product) => {
                  const productUnits = units.filter((u) => u.productId === product.id);
                  const availableUnits = productUnits.filter((u) => u.physicalStatus === 'READY').length;

                  return (
                    <tr key={product.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0] || '/images/demo/product-emerald-gown.jpg'}
                            alt={product.title}
                            className="w-12 h-14 rounded-lg object-cover border border-border-default shrink-0"
                          />
                          <div>
                            <p className="font-bold text-ink text-sm hover:text-primary transition-colors">
                              {product.title}
                            </p>
                            <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge size="sm" tone="primary" styleVariant="soft">
                          {product.category}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-ink">
                          {formatCurrency(product.rentalPrice)}
                        </span>
                        <span className="text-[10px] text-ink-muted block">/ đợt 3 ngày</span>
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-medium text-ink">
                          {formatCurrency(product.depositPrice)}
                        </span>
                        <span className="text-[10px] text-emerald-700 block">Hoàn trả sau trả đồ</span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {product.variants.map((v) => (
                            <span
                              key={v.id}
                              className="text-[10px] bg-surface-subtle px-1.5 py-0.5 rounded border border-border-default text-ink font-mono"
                            >
                              {v.size} · {v.color}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-bold text-ink text-sm">
                            {productUnits.length} chiếc
                          </span>
                          <span className="text-[10px] text-emerald-700 block font-medium">
                            {availableUnits} sẵn sàng thuê
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Printer className="w-3 h-3" />}
                          onClick={() => setIsPrintModalOpen(true)}
                        >
                          In Tem QR
                        </Button>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-ink-muted">
                      Không tìm thấy mẫu trang phục nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Serialized Units Inventory View */}
        {activeTab === 'units' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-subtle border-b border-border-default text-ink-muted uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-4">Mã QR Định Danh</th>
                  <th className="p-4">Trang Phục & Biến Thể</th>
                  <th className="p-4">Tình Trạng Ngoại Quan</th>
                  <th className="p-4">Trạng Thái Vòng Đời</th>
                  <th className="p-4">Đơn Hàng Hiện Tại</th>
                  <th className="p-4 text-right">Thao Tác Vận Hành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredUnits.map((unit) => {
                  const product = products.find((p) => p.id === unit.productId);

                  return (
                    <tr key={unit.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-primary bg-primary-soft px-2 py-1 rounded border border-primary/20">
                            {unit.qrCode}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-ink">
                          {product?.title || 'Trang Phục Cho Thuê'}
                        </p>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Kích cỡ: <strong>{unit.size}</strong> · Màu sắc: <strong>{unit.color}</strong>
                        </p>
                      </td>

                      <td className="p-4">{getConditionBadge(unit.condition)}</td>

                      <td className="p-4">{getStatusBadge(unit.physicalStatus)}</td>

                      <td className="p-4">
                        {unit.currentOrderId ? (
                          <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            #{unit.currentOrderId}
                          </span>
                        ) : (
                          <span className="text-ink-muted text-[11px]">Trống lịch</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {unit.physicalStatus === 'WASHING' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              onClick={() => handleUpdateUnit(unit.id, 'READY')}
                            >
                              Đã Sấy Xong (READY)
                            </Button>
                          )}

                          {unit.physicalStatus === 'READY' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateUnit(unit.id, 'WASHING')}
                            >
                              Gửi Giặt Hấp
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPrintModalOpen(true)}
                            title="In lại tem nhãn"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUnits.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-ink-muted">
                      Không tìm thấy chiếc váy nào phù hợp với bộ lọc trạng thái.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        shopId={shop.id}
        onSave={handleSaveProduct}
      />

      <BatchQrPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        units={units}
        products={products}
        shop={shop}
      />
    </div>
  );
};
