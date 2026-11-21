import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#FCF9F5] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[#76675F] hover:text-[#49362F] transition-colors"
        >
          ← Quay lại đăng nhập
        </Link>

        <div className="rounded-3xl border border-[#E9DFD7] bg-white px-8 py-9 shadow-sm sm:px-10">
          <div className="mb-7 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#A88A79]">
              DịpXinh · Khôi Phục Tài Khoản
            </p>

            <h1 className="mb-2 font-serif text-3xl text-[#3E302C] tracking-tight">
              Đặt lại mật khẩu
            </h1>

            <p className="text-xs leading-5 text-[#85756D]">
              Nhập email tài khoản của bạn để nhận liên kết khôi phục mật khẩu bảo mật.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm">Đã gửi hướng dẫn khôi phục</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Vui lòng kiểm tra hòm thư <strong className="text-ink">{email}</strong> và làm theo hướng dẫn để đặt lại mật khẩu.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block mt-4 text-xs font-semibold text-primary hover:underline"
              >
                Trở lại màn hình đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#51413B]">
                  Email đăng ký
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7968B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@dipxinh.vn"
                    required
                    className="w-full rounded-xl border border-[#E6DCD4] bg-[#FFFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9B7868] text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#755548] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#604438] disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {loading ? 'Đang gửi yêu cầu...' : 'Gửi liên kết khôi phục'}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
