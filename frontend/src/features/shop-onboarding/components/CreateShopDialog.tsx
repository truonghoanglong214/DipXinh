import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Shop } from '@/shared/model/domain';
import { shopApi, type BackendShopResponse, ApiClientError } from '@/shared/api';
import { demoStore } from '@/shared/demo/demo-store';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Store, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CreateShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShop?: (shopData: Omit<Shop, 'id' | 'trialEndsAt'>) => void;
  onSuccess?: (createdShop: BackendShopResponse) => void;
}

export const CreateShopDialog: React.FC<CreateShopDialogProps> = ({
  isOpen,
  onClose,
  onCreateShop,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { switchShop, refreshShops } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#713F4B');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Tự động sinh slug chuẩn SEO & regex backend: ^[a-z0-9]+(-[a-z0-9]+)*$
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSlugChange = (val: string) => {
    const sanitized = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    setSlug(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().replace(/^-+|-+$/g, '');

    if (!trimmedName) {
      setErrorMessage('Vui lòng nhập tên cửa hàng.');
      return;
    }

    if (!normalizedSlug) {
      setErrorMessage('Vui lòng nhập đường dẫn (slug) hợp lệ.');
      return;
    }

    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!slugRegex.test(normalizedSlug)) {
      setErrorMessage('Slug chỉ chứa chữ thường không dấu, số và dấu gạch nối giữa các từ (ví dụ: aurora-boutique).');
      return;
    }

    setIsSubmitting(true);

    try {
      let createdShop: BackendShopResponse;

      try {
        // 1. Gọi API Backend Spring Boot
        createdShop = await shopApi.createShop({
          name: trimmedName,
          slug: normalizedSlug,
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          if (err.status === 409) {
            throw new Error(`Đường dẫn slug "${normalizedSlug}" đã được sử dụng. Vui lòng chọn slug khác.`);
          }
          if (err.status === 401 || err.status === 403) {
            throw new Error('Phiên đăng nhập đã hết hạn hoặc bạn không có quyền tạo cửa hàng.');
          }
          if (err.isNetworkError) {
            // Fallback sang local store nếu offline
            const fallback = demoStore.createShop({
              name: trimmedName,
              slug: normalizedSlug,
              phone: phone.trim() || '0901 000 000',
              address: address.trim() || 'Hồ Chí Minh, Việt Nam',
              description: description.trim() || 'Cửa hàng cho thuê trang phục dạ hội & áo dài cao cấp.',
              accentColor,
              plan: 'TRIAL',
              bannerUrl: '/images/demo/hero-fashion-rental.jpg',
            });
            createdShop = {
              id: fallback.id,
              name: fallback.name,
              slug: fallback.slug,
              status: 'ACTIVE',
              ownerUserId: 'local-user',
              createdAt: new Date().toISOString(),
            };
          } else {
            throw new Error(err.message || 'Không thể tạo cửa hàng.');
          }
        } else if (err instanceof Error) {
          throw err;
        } else {
          throw new Error('Lỗi không xác định khi tạo cửa hàng.');
        }
      }

      // Đồng bộ vào DemoStore để tất cả views đều nhận diện được
      demoStore.syncBackendShops([createdShop]);
      demoStore.updateShopSettings(createdShop.id, {
        phone: phone.trim() || '0901 000 000',
        address: address.trim() || 'Hồ Chí Minh, Việt Nam',
        description: description.trim() || 'Cửa hàng cho thuê trang phục dạ hội & áo dài cao cấp.',
        accentColor,
      });
      demoStore.setShop(createdShop.id);

      if (onCreateShop) {
        onCreateShop({
          name: trimmedName,
          slug: normalizedSlug,
          phone: phone.trim() || '0901 000 000',
          address: address.trim() || 'Hồ Chí Minh, Việt Nam',
          description: description.trim() || 'Cửa hàng cho thuê trang phục dạ hội & áo dài cao cấp.',
          accentColor,
          plan: 'TRIAL',
          bannerUrl: '/images/demo/hero-fashion-rental.jpg',
        });
      }

      if (onSuccess) {
        onSuccess(createdShop);
      }

      await refreshShops().catch(() => {});
      switchShop(createdShop.slug);
      onClose();
      navigate(`/dashboard/${createdShop.slug}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi tạo cửa hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDFC] border border-[#E8DFD8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
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
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">
              Tên cửa hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Áo Dài Thêu Sen Vàng"
              className="w-full px-3.5 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B] disabled:opacity-60"
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
                disabled={isSubmitting}
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="sen-vang"
                className="w-full px-3 py-2 bg-transparent text-sm focus:outline-none disabled:opacity-60"
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
                disabled={isSubmitting}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0908 123 456"
                className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#302824] mb-1">Màu thương hiệu nhấn</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={isSubmitting}
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-[#E8DFD8] cursor-pointer disabled:opacity-60"
                />
                <span className="text-xs font-mono text-[#756A64] uppercase">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">Địa chỉ cửa hàng</label>
            <input
              type="text"
              disabled={isSubmitting}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: 88 Pasteur, Phường Bến Nghé, Quận 1"
              className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B] disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302824] mb-1">Mô tả ngắn</label>
            <textarea
              rows={2}
              disabled={isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu phong cách và các dòng trang phục chủ đạo của shop..."
              className="w-full px-3 py-2 text-sm bg-[#FCF9F5] border border-[#E8DFD8] rounded-lg focus:outline-none focus:border-[#713F4B] disabled:opacity-60"
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
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#756A64] hover:text-[#302824] rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-[#FCF9F5] bg-[#302824] hover:bg-[#3F3330] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang Khởi Tạo...
                </>
              ) : (
                'Hoàn Tất & Mở Dashboard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
