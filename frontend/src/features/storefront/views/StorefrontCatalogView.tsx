import React, { useState, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Shop, Product, ProductVariant } from '@/shared/model/domain';
import { demoStore } from '@/shared/demo/demo-store';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, FormField, Select } from '@/shared/components/ui';
import {
  Filter,
  Search,
  Sparkles,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  Star,
  SlidersHorizontal,
} from 'lucide-react';

export const StorefrontCatalogView: React.FC = () => {
  const { shop } = useOutletContext<{ shop: Shop }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load products of this shop
  const allProducts = demoStore.getState().products.filter((p) => p.shopId === shop.id || !p.shopId);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [priceTier, setPriceTier] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSizeForRental, setSelectedSizeForRental] = useState<string>('S');
  const [selectedColorForRental, setSelectedColorForRental] = useState<string>('Đỏ Rượu');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [allProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchSize =
          selectedSize === 'ALL' || p.variants.some((v) => v.size === selectedSize);
        const matchColor =
          selectedColor === 'ALL' || p.variants.some((v) => v.color === selectedColor);

        let matchPrice = true;
        if (priceTier === 'UNDER_500') matchPrice = p.rentalPrice < 500000;
        else if (priceTier === '500_1000')
          matchPrice = p.rentalPrice >= 500000 && p.rentalPrice <= 1000000;
        else if (priceTier === 'OVER_1000') matchPrice = p.rentalPrice > 1000000;

        return matchSearch && matchCategory && matchSize && matchColor && matchPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.rentalPrice - b.rentalPrice;
        if (sortBy === 'price-desc') return b.rentalPrice - a.rentalPrice;
        return 0; // popular default
      });
  }, [allProducts, searchQuery, selectedCategory, selectedSize, selectedColor, priceTier, sortBy]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const openQuickView = (p: Product) => {
    setQuickViewProduct(p);
    setSelectedSizeForRental(p.variants[0]?.size || 'S');
    setSelectedColorForRental(p.variants[0]?.color || 'Đỏ Rượu');
  };

  const handleAddToCart = () => {
    if (!quickViewProduct) return;
    alert(
      `Đã thêm "${quickViewProduct.title}" (Size ${selectedSizeForRental} · ${selectedColorForRental}) vào giỏ thuê!`
    );
    setQuickViewProduct(null);
  };

  return (
    <div className="bg-[#FCF9F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Editorial Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-ink text-white p-8 sm:p-12 shadow-sm border border-border-default">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-soft bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              Bộ Sưu Tập Thiết Kế · {shop.name}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Tủ Đồ Thời Trang Cho Thuê Cao Cấp
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              Mỗi thiết kế đều được gán mã định danh QR riêng, kiểm định chất lượng sau từng lượt thuê và bảo đảm tiệt trùng trước khi giao.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/images/demo/hero-fashion-rental.jpg')" }} />
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-border-default p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm mẫu đầm, áo dài, chất liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border-default bg-[#FFFCFA] text-ink outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Pill Filters */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-surface-subtle text-ink-muted hover:text-ink'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất Cả Mẫu' : cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'popular', label: 'Phổ biến nhất' },
                  { value: 'price-asc', label: 'Giá thuê: Thấp → Cao' },
                  { value: 'price-desc', label: 'Giá thuê: Cao → Thấp' },
                ]}
              />
            </div>
          </div>

          {/* Secondary Sub-filters: Size, Color & Price Range */}
          <div className="pt-3 border-t border-border-default flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Size selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted font-medium">Kích cỡ:</span>
                {['ALL', 'S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      selectedSize === sz
                        ? 'border-primary bg-primary-soft text-primary font-bold'
                        : 'border-border-default text-ink-muted hover:text-ink'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Price Tier selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-ink-muted font-medium">Tầm giá:</span>
                <select
                  value={priceTier}
                  onChange={(e) => setPriceTier(e.target.value)}
                  className="bg-surface text-ink border border-border-default rounded px-2 py-0.5 text-[11px] outline-none"
                >
                  <option value="ALL">Mọi mức giá</option>
                  <option value="UNDER_500">Dưới 500.000đ</option>
                  <option value="500_1000">500.000đ - 1.000.000đ</option>
                  <option value="OVER_1000">Trên 1.000.000đ</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] text-ink-muted">
              Hiển thị <strong className="text-ink">{filteredProducts.length}</strong> thiết kế sẵn sàng
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-border-default bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-subtle">
                  <img
                    src={product.images[0] || '/images/demo/product-emerald-gown.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <Badge tone="primary" styleVariant="solid" size="sm" className="shadow-xs">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Hover Quick View Trigger */}
                  <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => openQuickView(product)}
                      className="px-3.5 py-2 rounded-xl bg-white text-ink text-xs font-semibold shadow-md hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem Nhanh
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif font-bold text-sm text-ink group-hover:text-primary transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-[11px] text-ink-muted line-clamp-1">
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-border-default/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-ink font-mono">
                        {formatCurrency(product.rentalPrice)}
                      </span>
                      <span className="text-[10px] text-ink-muted block">/ Gói 3 ngày</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-ink-muted block">Tiền cọc:</span>
                      <span className="text-[11px] font-mono font-medium text-emerald-700">
                        {formatCurrency(product.depositPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:border-primary group-hover:text-primary"
                  onClick={() => openQuickView(product)}
                >
                  Chọn Thuê Trang Phục
                </Button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-2xl border border-border-default">
              <div className="w-12 h-12 rounded-full bg-surface-subtle text-ink-muted mx-auto flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-ink">Không có trang phục phù hợp</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Vui lòng thử điều chỉnh lại bộ lọc kích cỡ, khoảng giá hoặc từ khóa tìm kiếm.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSize('ALL');
                  setPriceTier('ALL');
                  setSearchQuery('');
                }}
              >
                Xóa Bộ Lọc
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK VIEW MODAL (Task SUP-F06) ── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-border-default shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative grid grid-cols-1 md:grid-cols-2">
              {/* Image Preview */}
              <div className="relative aspect-[3/4] md:aspect-auto bg-surface-subtle">
                <img
                  src={quickViewProduct.images[0] || '/images/demo/product-emerald-gown.jpg'}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 text-ink hover:bg-white md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rental Options & Details */}
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge tone="primary" size="sm">
                      {quickViewProduct.category}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(null)}
                      className="text-ink-muted hover:text-ink hidden md:block"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-ink tracking-tight">
                    {quickViewProduct.title}
                  </h2>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border-default/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">Giá thuê 3 ngày:</span>
                      <strong className="text-sm font-mono text-ink">
                        {formatCurrency(quickViewProduct.rentalPrice)}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">Tiền cọc hoàn lại:</span>
                      <strong className="text-xs font-mono text-emerald-700">
                        {formatCurrency(quickViewProduct.depositPrice)}
                      </strong>
                    </div>
                  </div>

                  {/* Size selection */}
                  <div>
                    <span className="text-xs font-medium text-ink block mb-1.5">Chọn kích cỡ:</span>
                    <div className="flex gap-2">
                      {['S', 'M', 'L'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSizeForRental(sz)}
                          className={`w-9 h-9 rounded-lg text-xs font-bold font-mono border transition-colors ${
                            selectedSizeForRental === sz
                              ? 'bg-primary text-white border-primary'
                              : 'border-border-default text-ink hover:border-primary'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-default space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={handleAddToCart}
                  >
                    Thêm Vào Giỏ Thuê
                  </Button>
                  <p className="text-[10px] text-center text-ink-muted">
                    Miễn phí chỉnh sửa số đo eo & gấu váy theo yêu cầu tại showroom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
