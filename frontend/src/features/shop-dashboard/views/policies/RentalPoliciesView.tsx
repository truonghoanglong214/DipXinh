import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Shop } from '@/shared/model/domain';
import { Button, Input, FormField, Select, Card, CardHeader, CardTitle, CardContent, Badge } from '@/shared/components/ui';
import {
  FileText,
  Clock,
  ShieldAlert,
  Save,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const RentalPoliciesView: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [storeState, setStoreState] = useState(() => demoStore.getState());
  const [isSaved, setIsSaved] = useState(false);

  const shop: Shop =
    storeState.shops.find((s) => s.slug === shopSlug) ||
    storeState.shops[0] ||
    demoStore.getCurrentShop();

  // Policy Form State
  const [standardRentalDays, setStandardRentalDays] = useState(shop.standardRentalDays || 3);
  const [depositRate, setDepositRate] = useState(shop.depositRate ? shop.depositRate * 100 : 70);
  const [depositHoldHours, setDepositHoldHours] = useState(shop.depositHoldHours || 1);
  const [turnaroundBufferHours, setTurnaroundBufferHours] = useState(shop.turnaroundBufferHours || 24);
  const [lateFeeDaily, setLateFeeDaily] = useState(shop.lateFeeDaily || 150000);
  const [allowIdCardDeposit, setAllowIdCardDeposit] = useState(shop.allowIdCardDeposit !== false);

  // Cancellation tiers
  const [minorStainFee, setMinorStainFee] = useState(80000);
  const [tearRepairFee, setTearRepairFee] = useState(150000);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    demoStore.updateShopSettings(shop.id, {
      standardRentalDays,
      depositRate: depositRate / 100,
      depositHoldHours,
      turnaroundBufferHours,
      lateFeeDaily,
      allowIdCardDeposit,
    });
    setStoreState({ ...demoStore.getState() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
              Task F02-06 · Vertical Slice VS04
            </span>
            <span className="text-xs text-ink-muted">· {shop.name}</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-ink tracking-tight">
            Chính Sách Cho Thuê, Ký Quỹ & Phục Hồi Trang Phục
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Cấu hình thời hạn gói thuê, tỷ lệ giữ cọc, bộ đệm giặt hấp khử khuẩn và biểu phí phát sinh áp dụng toàn cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã lưu chính sách thành công!
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            Lưu Thay Đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Forms */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Section 1: Standard Duration */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
              <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">1. Gói Thời Gian Thuê Chuẩn (Rental Period)</h3>
                <p className="text-[11px] text-ink-muted">Quy định số ngày một lượt thuê trọn gói</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FormField label="Số ngày thuê chuẩn của một đợt" required>
                  <Select
                    value={String(standardRentalDays)}
                    onChange={(e) => setStandardRentalDays(Number(e.target.value))}
                    options={[
                      { value: '3', label: '3 Ngày (Gói Tiệc Cuối Tuần - Chuẩn)' },
                      { value: '5', label: '5 Ngày (Gói Sự Kiện Xa / Chụp Ảnh)' },
                      { value: '7', label: '7 Ngày (Gói Tuần Lễ Thời Trang / Tour)' },
                    ]}
                  />
                </FormField>
                <p className="text-[11px] text-ink-muted mt-1.5 leading-relaxed">
                  Ví dụ: Khách nhận váy lúc 10:00 Thứ 6 thì hạn trả đồ chuẩn là 10:00 Thứ 2 tuần sau.
                </p>
              </div>

              <div>
                <FormField label="Thời hạn giữ cọc trực tuyến (Countdown)" required>
                  <Select
                    value={String(depositHoldHours)}
                    onChange={(e) => setDepositHoldHours(Number(e.target.value))}
                    options={[
                      { value: '0.25', label: '15 Phút (Giữ chỗ hỏa tốc)' },
                      { value: '0.5', label: '30 Phút (Chuẩn)' },
                      { value: '1', label: '60 Phút (Mặc định khuyến nghị)' },
                      { value: '2', label: '120 Phút' },
                    ]}
                  />
                </FormField>
                <p className="text-[11px] text-ink-muted mt-1.5 leading-relaxed">
                  Sau thời gian này nếu khách không thanh toán cọc VietQR, lịch trống sẽ tự giải phóng.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: Deposit & Security */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">2. Chính Sách Tiền Cọc & Thế Chân (Security Deposit)</h3>
                <p className="text-[11px] text-ink-muted">Bảo chứng giữ gìn trang phục khi ra khỏi cửa hàng</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FormField label="Tỷ lệ tiền cọc mặc định (% giá trị váy)" required>
                  <div className="relative">
                    <Input
                      type="number"
                      min="30"
                      max="100"
                      value={depositRate}
                      onChange={(e) => setDepositRate(Number(e.target.value))}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-muted">
                      %
                    </span>
                  </div>
                </FormField>
                <p className="text-[11px] text-ink-muted mt-1.5">
                  Khuyến nghị: 70% giá trị thiết kế để bảo đảm an toàn đối với các mẫu dạ hội đắt tiền.
                </p>
              </div>

              <div className="flex flex-col justify-center space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowIdCardDeposit}
                    onChange={(e) => setAllowIdCardDeposit(e.target.checked)}
                    className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block">
                      Hỗ trợ giữ CCCD / Hộ chiếu gốc
                    </span>
                    <span className="text-[11px] text-ink-muted leading-relaxed block">
                      Khách hàng có thể xuất trình CCCD gắn chip đối soát để giảm 50% tiền cọc mặt tại showroom.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Section 3: Turnaround Buffer */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">3. Thời Gian Đệm Giặt Hấp Phục Hồi (Turnaround Buffer)</h3>
                <p className="text-[11px] text-ink-muted">
                  Khoảng thời gian khử khuẩn kỹ thuật bắt buộc giữa 2 khách thuê cùng 1 chiếc váy
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Thời gian đệm kỹ thuật tối thiểu" required>
                  <Select
                    value={String(turnaroundBufferHours)}
                    onChange={(e) => setTurnaroundBufferHours(Number(e.target.value))}
                    options={[
                      { value: '12', label: '12 Giờ (Giặt hấp cấp tốc)' },
                      { value: '24', label: '24 Giờ (1 Ngày - Tiêu chuẩn khuyến nghị)' },
                      { value: '48', label: '48 Giờ (2 Ngày - Với váy cưới ren nhiều tầng)' },
                    ]}
                  />
                </FormField>

                <div className="bg-surface-subtle p-3 rounded-lg border border-border-default/60 flex items-start gap-2 text-xs text-ink-muted">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Cơ chế khóa lịch thông minh:</strong> Khi khách trả váy lúc 12:00 ngày T, hệ thống Availability Engine tự động khóa mã QR đó và không cho khách sau đặt trước 12:00 ngày T+1.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4: Late Fees & Damage Deductions */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-default">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">4. Biểu Phí Phạt Trễ Hạn & Khấu Trừ Hư Hao (Penalties)</h3>
                <p className="text-[11px] text-ink-muted">Bảng tính tự động khi nhân viên làm thủ tục nhận trả đồ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Phí trễ hạn mỗi ngày (VND) *" required>
                <Input
                  type="number"
                  step="20000"
                  value={lateFeeDaily}
                  onChange={(e) => setLateFeeDaily(Number(e.target.value))}
                  required
                />
              </FormField>

              <FormField label="Phí xử lý vết ố nhẹ (VND)">
                <Input
                  type="number"
                  step="10000"
                  value={minorStainFee}
                  onChange={(e) => setMinorStainFee(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Phí may lại đường rách (VND)">
                <Input
                  type="number"
                  step="20000"
                  value={tearRepairFee}
                  onChange={(e) => setTearRepairFee(Number(e.target.value))}
                />
              </FormField>
            </div>
          </Card>
        </form>

        {/* Right Column: Live Policy Summary Card (What Customer Sees) */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <Card className="border-primary/30 shadow-md overflow-hidden">
              <div className="bg-primary text-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-soft block">
                  Bản Xem Trước Hợp Đồng Khách Xem
                </span>
                <h4 className="text-base font-bold font-serif mt-0.5">
                  Chính Sách Thuê Đồ Tại {shop.name}
                </h4>
              </div>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Item 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-ink block">Thời Hạn Gói Thuê:</strong>
                    <span className="text-ink-muted">
                      Mỗi đợt thuê kéo dài <strong>{standardRentalDays} ngày</strong>. Trả trễ phụ thu{' '}
                      <strong>{formatCurrency(lateFeeDaily)}/ngày</strong>.
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-ink block">Ký Quỹ Thế Chân:</strong>
                    <span className="text-ink-muted">
                      Khách hàng thanh toán tiền cọc tương đương <strong>{depositRate}%</strong> giá trị trang phục. Tiền cọc được hoàn lại 100% qua VietQR ngay khi trả đồ.
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-ink block">Bảo Chứng Giặt Hấp:</strong>
                    <span className="text-ink-muted">
                      Mọi trang phục đều được tiệt trùng <strong>{turnaroundBufferHours} giờ</strong> trong buồng sấy ozone trước khi bàn giao cho quý khách.
                    </span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-ink block">Chính Sách Hủy Lịch:</strong>
                    <span className="text-ink-muted">
                      Hủy trước 72h hoàn 100% cọc; hủy trước 24h hoàn 50%; hủy trong ngày sự kiện mất cọc.
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-default">
                  <Button variant="primary" size="sm" className="w-full" onClick={handleSave}>
                    Lưu Áp Dụng Toàn Cửa Hàng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
