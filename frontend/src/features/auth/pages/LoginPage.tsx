import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/shared/components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectUrl = searchParams.get('redirect');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      setSuccessMsg(`Đăng nhập thành công! Đang chuyển hướng...`);

      setTimeout(() => {
        if (redirectUrl) {
          navigate(redirectUrl, { replace: true });
        } else if (user.role === 'ROLE_PLATFORM_ADMIN') {
          navigate('/platform', { replace: true });
        } else {
          navigate(`/dashboard/${user.currentShopSlug || 'aurora-boutique'}`, { replace: true });
        }
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể đăng nhập. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.'
      );
    } finally {
      setLoading(false);
    }
  }

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#FCF9F5] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[#76675F] hover:text-[#49362F] transition-colors"
        >
          ← Quay về trang chủ
        </Link>

        <div className="rounded-3xl border border-[#E9DFD7] bg-white px-8 py-9 shadow-sm sm:px-10">
          <div className="mb-7 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#A88A79]">
              DịpXinh · SaaS Thời Trang
            </p>

            <h1 className="mb-2 font-serif text-3xl text-[#3E302C] tracking-tight">
              Chào mừng trở lại
            </h1>

            <p className="text-xs leading-5 text-[#85756D]">
              Đăng nhập để quản trị cửa hàng cho thuê hoặc duyệt đơn đặt thuê.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-medium text-[#51413B]"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]"
                />

                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@dipxinh.vn"
                  required
                  className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#9B7868] text-ink"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[#51413B]"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#A88A79] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]"
                />

                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-10 text-xs outline-none transition focus:border-[#9B7868] text-ink"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7968B] hover:text-[#51413B]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#755548] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#604438] disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#F0E8E2]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C766C] mb-2.5 uppercase tracking-wider">
              <Sparkles size={13} className="text-amber-600" />
              Chọn tài khoản thử nghiệm nhanh:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('owner@dipxinh.vn', 'Owner@123456')}
                className="px-2 py-1.5 rounded-lg border border-[#E6DCD4] bg-[#FAF6F2] hover:bg-[#EFE7E0] text-[11px] font-medium text-[#55433B] text-center transition-colors"
              >
                Chủ Shop
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('staff@dipxinh.vn', 'Staff@123456')}
                className="px-2 py-1.5 rounded-lg border border-[#E6DCD4] bg-[#FAF6F2] hover:bg-[#EFE7E0] text-[11px] font-medium text-[#55433B] text-center transition-colors"
              >
                Nhân Viên
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@dipxinh.vn', 'Admin@123456')}
                className="px-2 py-1.5 rounded-lg border border-[#E6DCD4] bg-[#FAF6F2] hover:bg-[#EFE7E0] text-[11px] font-medium text-[#55433B] text-center transition-colors"
              >
                Admin Sàn
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-[#85756D]">
              Chưa có tài khoản kinh doanh?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Đăng ký mở Shop ngay
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#9A8980]">
          DịpXinh · Nền tảng quản lý thời trang đa khách thuê chuẩn bảo mật
        </p>
      </div>
    </main>
  );
}
