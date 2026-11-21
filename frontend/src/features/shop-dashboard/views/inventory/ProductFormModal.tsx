import React, { useState } from 'react';
import { Product, ProductVariant } from '@/shared/model/domain';
import { Button, Input, FormField, Select } from '@/shared/components/ui';
import { X, Sparkles, Plus, Trash2, Image, Layers, QrCode } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  onSave: (
    product: Omit<Product, 'id'>,
    initialUnits: { size: string; color: string; count: number }[]
  ) => void;
}

const CATEGORIES = [
  'Váy Dạ Hội',
  'Áo Dài Thiết Kế',
  'Váy Cưới Cô Dâu',
  'Đầm Tiệc & Cocktail',
  'Trang Phục Kỷ Yếu',
  'Phụ Kiện Đi Kèm',
];

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'Freesize'];
const AVAILABLE_COLORS = ['Đỏ Rượu', 'Trắng Kem', 'Xanh Emerald', 'Vàng Gold', 'Đen Huyền Bí'];

const SAMPLE_IMAGES = [
  '/images/demo/product-emerald-gown.jpg',
  '/images/demo/product-silk-aodai.jpg',
  '/images/demo/product-velvet-dress.jpg',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  shopId,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [rentalPrice, setRentalPrice] = useState<number>(650000);
  const [salePrice, setSalePrice] = useState<number>(2500000);
  const [depositPrice, setDepositPrice] = useState<number>(1500000);
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0]);

  // Variant generator state
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Đỏ Rượu', 'Trắng Kem']);

  // Inventory matrix counts: key = `${size}-${color}` -> count
  const [matrixCounts, setMatrixCounts] = useState<Record<string, number>>({
    'S-Đỏ Rượu': 2,
    'M-Đỏ Rượu': 2,
    'S-Trắng Kem': 1,
    'M-Trắng Kem': 1,
  });

  if (!isOpen) return null;

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== color));
      }
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleRentalPriceChange = (val: number) => {
    setRentalPrice(val);
    // Gợi ý cọc = ~70% giá trị ước tính
    if (!depositPrice || depositPrice === rentalPrice * 2) {
      setDepositPrice(Math.round(val * 2.2));
    }
  };

  const handleCountChange = (size: string, color: string, count: number) => {
    setMatrixCounts((prev) => ({
      ...prev,
      [`${size}-${color}`]: Math.max(0, count),
    }));
  };

  const calculateTotalUnits = () => {
    let total = 0;
    selectedSizes.forEach((s) => {
      selectedColors.forEach((c) => {
        total += matrixCounts[`${s}-${c}`] || 0;
      });
    });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Build variants
    const variants: ProductVariant[] = [];
    const initialUnits: { size: string; color: string; count: number }[] = [];

    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        const key = `${size}-${color}`;
        const count = matrixCounts[key] || 1;
        const variantId = `var-${Date.now()}-${size}-${color}`;

        variants.push({
          id: variantId,
          size,
          color,
          saleStock: 2,
        });

        initialUnits.push({
          size,
          color,
          count,
        });
      });
    });

    const newProduct: Omit<Product, 'id'> = {
      shopId,
      title: title.trim(),
      category,
      description: description.trim() || 'Trang phục thời trang cao cấp.',
      images: [selectedImage],
      rentalPrice,
      salePrice: salePrice > 0 ? salePrice : undefined,
      depositPrice,
      variants,
      featured: true,
    };

    onSave(newProduct, initialUnits);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-border-default shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Thêm Mẫu Trang Phục Thiết Kế Mới</h2>
              <p className="text-xs text-ink-muted">
                Tạo sản phẩm, ma trận biến thể và tự động sinh mã QR cho từng chiếc váy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 1. Thông Tin Trang Phục
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField label="Tên mẫu thiết kế *" required>
                  <Input
                    placeholder="VD: Đầm Dạ Hội Lụa Tơ Tằm Hoàng Kim"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Danh mục trang phục">
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Chất liệu & Mô tả chi tiết">
              <textarea
                className="w-full px-3 py-2 text-xs rounded-lg border border-border-default bg-surface text-ink outline-none focus:border-primary transition-colors h-20 resize-none"
                placeholder="VD: Vải lụa tơ tằm dệt thủ công, đính kết pha lê Swarovski ở ngực, tà xòe mềm mại..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
          </div>

          {/* 2. Pricing & Deposit */}
          <div className="space-y-4 pt-4 border-t border-border-default">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2. Chính Sách Giá Thuê & Tiền Ký Quỹ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Giá thuê 3 ngày (VND) *" required>
                <Input
                  type="number"
                  step="50000"
                  value={rentalPrice}
                  onChange={(e) => handleRentalPriceChange(Number(e.target.value))}
                  required
                />
              </FormField>

              <FormField label="Tiền cọc thế chân (VND) *" required>
                <Input
                  type="number"
                  step="100000"
                  value={depositPrice}
                  onChange={(e) => setDepositPrice(Number(e.target.value))}
                  required
                />
              </FormField>

              <FormField label="Giá bán đứt (VND - Tùy chọn)">
                <Input
                  type="number"
                  step="100000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              </FormField>
            </div>
          </div>

          {/* 3. Media Upload */}
          <div className="space-y-4 pt-4 border-t border-border-default">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" /> 3. Hình Ảnh Sản Phẩm Mẫu
            </h3>

            <div className="flex items-center gap-3">
              {SAMPLE_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === img
                      ? 'border-primary ring-2 ring-primary/20 scale-105'
                      : 'border-border-default opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Variant Matrix Generator */}
          <div className="space-y-4 pt-4 border-t border-border-default">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" /> 4. Ma Trận Biến Thể & Nhập Kho Ban Đầu
              </h3>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tổng sinh: <strong>{calculateTotalUnits()} chiếc váy vật lý (Mã QR)</strong>
              </span>
            </div>

            {/* Sizes selector */}
            <div>
              <span className="text-xs font-medium text-ink-muted block mb-1.5">Kích Cỡ (Sizes):</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      selectedSizes.includes(sz)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-subtle text-ink-muted border-border-default hover:text-ink'
                    }`}
                  >
                    Size {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors selector */}
            <div>
              <span className="text-xs font-medium text-ink-muted block mb-1.5">Màu Sắc:</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleColor(col)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      selectedColors.includes(col)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-subtle text-ink-muted border-border-default hover:text-ink'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Matrix Table */}
            <div className="border border-border-default rounded-xl overflow-hidden mt-3 bg-surface">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-subtle border-b border-border-default text-ink-muted uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="p-3">Kích Cỡ</th>
                    <th className="p-3">Màu Sắc</th>
                    <th className="p-3">Số Lượng Vật Lý Nhập Kho (QR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {selectedSizes.map((sz) =>
                    selectedColors.map((col) => {
                      const key = `${sz}-${col}`;
                      const count = matrixCounts[key] ?? 1;

                      return (
                        <tr key={key} className="hover:bg-surface-subtle/50 transition-colors">
                          <td className="p-3 font-semibold text-ink">Size {sz}</td>
                          <td className="p-3 text-ink-muted">{col}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="50"
                                value={count}
                                onChange={(e) => handleCountChange(sz, col, Number(e.target.value))}
                                className="w-20 px-2 py-1 rounded border border-border-default text-xs text-center font-bold text-ink bg-surface focus:border-primary outline-none"
                              />
                              <span className="text-[11px] text-ink-muted">chiếc (mã QR riêng)</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-border-default flex items-center justify-end gap-3 sticky bottom-0 bg-surface py-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Hủy Bỏ
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              leftIcon={<QrCode className="w-3.5 h-3.5" />}
            >
              Lưu Sản Phẩm & Sinh {calculateTotalUnits()} Mã QR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
