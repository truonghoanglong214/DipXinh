import React, { useState } from 'react';
import { Shop } from '@/shared/model/domain';
import { Store, X, CheckCircle2 } from 'lucide-react';

interface CreateShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShop: (shopData: Omit<Shop, 'id' | 'trialEndsAt'>) => void;
}

export const CreateShopDialog: React.FC<CreateShopDialogProps> = ({ isOpen, onClose, onCreateShop }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#713F4B');
  const [plan] = useState<'TRIAL'>('TRIAL');

  if (!isOpen) return null;

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    onCreateShop({
      name: name.trim(),
      slug: slug.trim(),
      phone: phone.trim() || '0901 000 000',
      address: address.trim() || 'Hồ Chí Minh, Việt Nam',
      description: description.trim() || 'Cửa hàng cho thuê trang phục dạ hội & áo dài cao cấp.',
      accentColor,
      plan,
      bannerUrl: '/images/demo/hero-fashion-rental.jpg',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#FCF9F5] px-6 py-5 border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ECDAD8] text-[#302824] flex items-center justify-center">
              <Store className="w-5 h-5 text-[#5C303B]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#302824]">Khởi Tạo Cửa Hàng DịpXinh</h3>
              <p className="text-xs text-[#756A64]">Bắt đầu dùng thử gói Trial 14 ngày miễn phí</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">
              Tên cửa hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Áo Dài Thêu Sen Vàng"
              className="w-full px-3.5 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">
              Đường dẫn Storefront công khai (Slug) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg overflow-hidden">
              <span className="px-3 text-xs text-[#756A64] bg-[#ECDAD8]/40 border-r border-[#E8DFD8] py-2">
                /shop/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sen-vang"
                className="w-full px-3 py-2 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[#756A64] mt-1">
              Storefront khách truy cập: <code className="text-[#713F4B]">/shop/{slug || 'ten-shop'}</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#302824] mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0908 123 456"
                className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#302824] mb-1">Màu thương hiệu nhấn</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-[#E8DFD8] cursor-pointer"
                />
                <span className="text-xs font-mono text-[#756A64] uppercase">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">Địa chỉ cửa hàng</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: 88 Pasteur, Phường Bến Nghé, Quận 1"
              className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">Mô tả ngắn</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu phong cách và các dòng trang phục chủ đạo của shop..."
              className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B]"
            />
          </div>

          <div className="p-3 bg-[#ECDAD8]/30 rounded-xl border border-[#E8DFD8] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#38705A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#302824]">
              <strong>Kích hoạt Gói Trial (14 ngày miễn phí)</strong>: Không cần thẻ tín dụng. Bao gồm đầy đủ tính năng tạo danh mục, in mã QR vật lý, quản lý ký quỹ và nhận diện Storefront.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#756A64] hover:text-[#302824] rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Hoàn tất &amp; Mở Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
