import { apiClient} from "@/shared/api";
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, User, Store, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { demoStore } from '@/shared/demo/demo-store';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const slug = shopName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!fullName || !email || !password || !shopName) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(
        '/v1/auth/register',
        {
          email: email.trim().toLowerCase(),
          password,
          displayName: fullName.trim(),
        },
        { skipAuth: true }
      );

      await login(email.trim().toLowerCase(), password);

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');

      setTimeout(() => {
        navigate(shopName ? `/dashboard/${slug || 'my-boutique'}` : '/', { replace: true });
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tạo tài khoản.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCF9F5] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[#76675F] hover:text-[#49362F] transition-colors"
        >
          ← Đã có tài khoản? Quay lại đăng nhập
        </Link>

        <div className="rounded-3xl border border-[#E9DFD7] bg-white px-8 py-9 shadow-sm sm:px-10">
          <div className="mb-7 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#A88A79]">
              DịpXinh · Khởi Tạo Gian Hàng
            </p>

            <h1 className="mb-2 font-serif text-3xl text-[#3E302C] tracking-tight">
              Đăng ký mở Shop Thời Trang
            </h1>

            <p className="text-xs leading-5 text-[#85756D]">
              Bắt đầu số hóa kho trang phục, sinh mã QR độc bản và nhận đơn đặt thuê online.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                Họ và tên chủ thương hiệu *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Lê Thu Thảo"
                  required
                  className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                  Email đăng nhập *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="thuthao@boutique.vn"
                    required
                    className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                  Mật khẩu bảo mật *
                </label>
                <div className="relative">
                  <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0E8E2]">
              <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                Tên cửa hàng / Boutique của bạn *
              </label>
              <div className="relative">
                <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Tiệm Váy Dạ Hội Ánh Trăng"
                  required
                  className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                />
              </div>
              {slug && (
                <p className="mt-1 text-[11px] text-[#A88A79] font-mono">
                  Đường dẫn Storefront: dipxinh.vn/shop/{slug}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                Số điện thoại liên hệ
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 border border-red-200/60 p-2.5 text-xs text-red-700">
                {error}
              </p>
            )}

            {successMsg && (
              <p role="status" className="rounded-lg bg-emerald-50 border border-emerald-200/60 p-2.5 text-xs text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="shrink-0" />
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#755548] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#604438] disabled:opacity-60 cursor-pointer shadow-xs mt-3"
            >
              {loading ? 'Đang tạo cửa hàng...' : 'Hoàn tất & Khởi tạo Shop'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-[#85756D]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
