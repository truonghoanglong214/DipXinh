import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  FormField,
  Label,
  Select,
  DropdownMenu,
  Dialog,
  ConfirmDialog,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Badge,
  useToast,
  Skeleton,
  LoadingState,
  EmptyState,
  ErrorState,
  useStoreTheme,
} from '@/shared/components/ui';
import {
  Sparkles,
  Search,
  Mail,
  Lock,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ShoppingBag,
  Palette,
  Sliders,
  Type,
  Grid,
  ShieldCheck,
  Check,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const UIShowcasePage: React.FC = () => {
  const { activeTheme, setThemeById, setCustomTheme, presets } = useStoreTheme();
  const { toast } = useToast();

  // Dialog & Modal states
  const [isSampleDialogOpen, setIsSampleDialogOpen] = useState(false);
  const [confirmDialogType, setConfirmDialogType] = useState<'danger' | 'warning' | 'primary' | null>(null);

  // Button loading simulation
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  // Form states
  const [inputVal, setInputVal] = useState('Đầm lụa tơ tằm thêu tay cung đình');
  const [emailVal, setEmailVal] = useState('atelier.contact@dipxinh.vn');
  const [hasFormError, setHasFormError] = useState(false);

  // Table state
  const [tableFilter, setTableFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sampleTableData = [
    {
      qr: 'DX-LUA-01',
      title: 'Đầm Dạ Hội Hoàng Gia Phối Ren',
      category: 'Dạ hội cao cấp',
      size: 'M',
      color: 'Đỏ rượu vang',
      colorHex: '#713F4B',
      status: 'RENTED' as const,
      rentalPrice: '1.200.000 ₫',
      deposit: '3.000.000 ₫',
    },
    {
      qr: 'DX-LUA-02',
      title: 'Áo Dài Gấm Tơ Tằm Cung Đình',
      category: 'Áo dài lễ tiệc',
      size: 'S',
      color: 'Ngọc lục bảo',
      colorHex: '#235347',
      status: 'READY' as const,
      rentalPrice: '950.000 ₫',
      deposit: '2.500.000 ₫',
    },
    {
      qr: 'DX-LUA-03',
      title: 'Đầm Lụa Satin Cúp Ngực Tối Giản',
      category: 'Tiệc cocktail',
      size: 'L',
      color: 'Đen Noir',
      colorHex: '#18181B',
      status: 'HELD' as const,
      rentalPrice: '850.000 ₫',
      deposit: '2.000.000 ₫',
    },
    {
      qr: 'DX-LUA-04',
      title: 'Váy Cưới Tối Giản Dáng Chữ A',
      category: 'Váy cưới atelier',
      size: 'M',
      color: 'Trắng kem',
      colorHex: '#C79A97',
      status: 'WASHING' as const,
      rentalPrice: '2.500.000 ₫',
      deposit: '6.000.000 ₫',
    },
    {
      qr: 'DX-LUA-05',
      title: 'Bộ Suit Nữ Nhung Tuyết Cao Cấp',
      category: 'Sự kiện thảm đỏ',
      size: 'S',
      color: 'Xanh sapphire',
      colorHex: '#1E3A5F',
      status: 'MAINTENANCE' as const,
      rentalPrice: '1.400.000 ₫',
      deposit: '3.500.000 ₫',
    },
  ];

  const filteredData = sampleTableData.filter((item) => {
    const matchesFilter = tableFilter === 'ALL' || item.status === tableFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Feedback display mode
  const [feedbackMode, setFeedbackMode] = useState<'content' | 'loading' | 'empty' | 'error'>('content');

  return (
    <div className="min-h-screen bg-canvas pb-28 text-ink antialiased">
      {/* ── Studio Header Specimen Banner ── */}
      <header className="border-b border-border-default bg-surface/90 backdrop-blur-md pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-subtle border border-border-default text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-3.5">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                DịpXinh Atelier Design System · Specimen v1.0
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight leading-[1.15]">
                Hệ Thống Thiết Kế DịpXinh Atelier
              </h1>
              <p className="font-display italic text-lg sm:text-xl text-primary font-normal mt-1 tracking-normal">
                Atelier Haute Couture & Rental Operations System
              </p>
              <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed max-w-2xl">
                Được thiết kế cho phần mềm quản lý thời trang cao cấp: thanh lịch, tối giản và chú trọng
                công năng. Tách biệt hoàn toàn nhận diện thương hiệu giữa nền tảng trung tâm và từng cửa hàng.
              </p>
            </div>

            {/* Specimen Metrics Pill Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-surface text-xs font-medium text-ink shadow-2xs">
                <span
                  className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: activeTheme.primary }}
                />
                <span>Màu hoạt động:</span>
                <span className="font-mono font-semibold text-primary">{activeTheme.primary}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-border-default bg-surface text-xs font-medium text-ink-muted shadow-2xs">
                13 Nhóm Thành Phần
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-[#BFE3D4] bg-[#EAF5F0] text-xs font-semibold text-[#1E5844] shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5F]" />
                WCAG 2.1 AA Verified
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* ── SECTION 1: Tenant Branding Studio & Live Preview ── */}
        <section className="rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-2xs">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border-default pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-ink tracking-tight">
                  1. Studio Nhận Diện Thương Hiệu Đa Cửa Hàng (Tenant Branding Isolation)
                </h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Nền tảng tuyệt đối không gắn cứng màu sắc của bất kỳ cửa hàng nào. Lựa chọn bảng màu dưới đây để kiểm chứng:
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setThemeById('dipxinh-atelier')}
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            >
              Đặt Lại Mặc Định
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Presets List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presets.map((preset) => {
                  const isSelected = activeTheme.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setThemeById(preset.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-surface shadow-xs'
                          : 'border-border-default hover:border-ink-muted bg-surface-subtle/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="text-xs font-semibold text-ink truncate">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-border-default/60 flex items-center justify-between text-[10px] font-mono text-ink-subtle">
                        <span>HEX: {preset.primary}</span>
                        <span className="font-sans text-[10px] font-medium text-ink-muted">Tương phản AAA</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom HEX Picker Bar */}
              <div className="p-3.5 rounded-xl border border-border-default bg-surface-subtle flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activeTheme.primary}
                    onChange={(e) =>
                      setCustomTheme({
                        id: 'custom-picker',
                        name: 'Màu Nhận Diện Tùy Chỉnh',
                        primary: e.target.value,
                      })
                    }
                    className="w-9 h-9 rounded-lg border border-border-default cursor-pointer p-0.5 bg-surface"
                    title="Chọn màu bất kỳ"
                  />
                  <div>
                    <span className="text-xs font-semibold text-ink block">
                      Thử nghiệm mã màu HEX tùy chọn
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Đang kích hoạt: <span className="font-mono font-semibold text-ink">{activeTheme.primary}</span>
                    </span>
                  </div>
                </div>
                <Badge tone="primary" styleVariant="soft" size="sm">
                  Dynamic Custom
                </Badge>
              </div>
            </div>

            {/* Live Tenant Preview Card (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl border border-border-default bg-surface-subtle/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Kính Ngắm Cửa Hàng (Live Preview)
                </span>
                <span className="text-[10px] text-ink-subtle font-mono">Real-time sync</span>
              </div>

              {/* Mini Tenant Garment Card */}
              <div className="p-4 rounded-xl border border-border-default bg-surface shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                      Áo dài lễ tiệc cao cấp
                    </span>
                    <h4 className="text-sm font-semibold text-ink leading-snug">
                      Áo Dài Gấm Tơ Tằm Cung Đình
                    </h4>
                  </div>
                  <Badge tone="success" styleVariant="soft" size="sm" withDot>
                    Sẵn sàng
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs tabular-nums text-ink-muted pt-1">
                  <div>
                    <span className="text-[10px] block text-ink-subtle">Giá thuê 3 ngày:</span>
                    <span className="text-sm font-semibold text-ink">950.000 ₫</span>
                  </div>
                  <div className="border-l border-border-default pl-4">
                    <span className="text-[10px] block text-ink-subtle">Tiền cọc giữ chỗ:</span>
                    <span className="text-sm font-medium text-ink">2.500.000 ₫</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-default flex items-center justify-between gap-3">
                  <span className="text-[11px] text-ink-muted">Mã: <code className="font-mono font-semibold text-ink">DX-LUA-02</code></span>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() =>
                      toast.success('Đã lưu cấu hình giữ chỗ!', {
                        description: `Áp dụng thành công màu ${activeTheme.name} (${activeTheme.primary}).`,
                      })
                    }
                  >
                    Giữ Chỗ Đơn Thuê
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-ink-muted leading-relaxed">
                Khi cửa hàng cập nhật mã màu nhận diện trong phần cài đặt, toàn bộ nút bấm chính, nhãn thương hiệu và viền nét focus sẽ lập tức thích ứng như thẻ mẫu trên mà không cần biên dịch lại mã nguồn.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Foundations: Color Tokens & Typography ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Color Tokens Matrix (6 cols) */}
          <section className="lg:col-span-6 rounded-2xl border border-border-default bg-surface p-6 sm:p-7 shadow-2xs h-full">
            <div className="flex items-center gap-3 mb-5 border-b border-border-default pb-4">
              <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                <Grid className="w-4 h-4 text-ink-muted" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink tracking-tight">
                  2. Hệ Thống Mã Màu (Color Tokens)
                </h3>
                <p className="text-xs text-ink-muted">Bảng màu trung tính ấm áp phối cùng tông màu thời trang</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2">
                  Nền & Khung Viền (Canvas & Surface)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Canvas', hex: '#FCF9F5', role: 'Nền tổng thể' },
                    { label: 'Surface', hex: '#FFFDFC', role: 'Nền thẻ card' },
                    { label: 'Subtle', hex: '#F7F2EC', role: 'Header bảng' },
                    { label: 'Border', hex: '#E8DFD8', role: 'Viền mảnh' },
                  ].map((t) => (
                    <div key={t.label} className="p-2.5 rounded-lg border border-border-default bg-surface">
                      <div className="w-full h-8 rounded border border-black/5 mb-1.5 shadow-2xs" style={{ backgroundColor: t.hex }} />
                      <span className="block text-xs font-semibold text-ink leading-tight">{t.label}</span>
                      <span className="block text-[10px] font-mono text-ink-muted">{t.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2">
                  Chữ Viết & Mực In (Ink Typography)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Ink Primary', hex: '#302824', role: 'Chữ chính (AAA)' },
                    { label: 'Ink Muted', hex: '#756A64', role: 'Chữ phụ, nhãn' },
                    { label: 'Ink Subtle', hex: '#A89F99', role: 'Placeholder' },
                  ].map((t) => (
                    <div key={t.label} className="p-2.5 rounded-lg border border-border-default bg-surface">
                      <div className="w-full h-8 rounded border border-black/5 mb-1.5 shadow-2xs" style={{ backgroundColor: t.hex }} />
                      <span className="block text-xs font-semibold text-ink leading-tight">{t.label}</span>
                      <span className="block text-[10px] font-mono text-ink-muted">{t.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2">
                  Trạng Thái Vận Hành (Operational Status)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Success', hex: '#2E7D5F', bg: '#EAF5F0', text: '#1E5844' },
                    { label: 'Warning', hex: '#C2781E', bg: '#FDF6EC', text: '#7C4E10' },
                    { label: 'Danger', hex: '#B93838', bg: '#FCEFEF', text: '#8B2E2E' },
                    { label: 'Info', hex: '#3A7799', bg: '#EBF3F8', text: '#29546B' },
                  ].map((t) => (
                    <div key={t.label} className="p-2.5 rounded-lg border border-border-default bg-surface">
                      <div className="w-full h-8 rounded border border-black/5 mb-1.5 shadow-2xs flex items-center justify-center text-[11px] font-semibold" style={{ backgroundColor: t.bg, color: t.text }}>
                        {t.label}
                      </div>
                      <span className="block text-[10px] font-mono text-ink-muted text-center">{t.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Typography Hierarchy (6 cols) */}
          <section className="lg:col-span-6 rounded-2xl border border-border-default bg-surface p-6 sm:p-7 shadow-2xs h-full">
            <div className="flex items-center gap-3 mb-5 border-b border-border-default pb-4">
              <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                <Type className="w-4 h-4 text-ink-muted" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink tracking-tight">
                  3. Kiểu Chữ & Căn Chỉnh Số Liệu (Typography)
                </h3>
                <p className="text-xs text-ink-muted">Kết hợp kiểu chữ tiêu đề và giao diện có dấu tiếng Việt chuẩn xác</p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-border-default text-xs">
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block mb-1">
                  Editorial Headline · Playfair Display Serif (Italic)
                </span>
                <p className="font-display italic text-2xl sm:text-3xl font-medium text-ink tracking-tight">
                  Atelier Haute Couture & Rental Suite
                </p>
                <p className="font-sans text-sm font-semibold text-ink tracking-tight mt-1">
                  Thời Trang Cho Thuê & Bán Cao Cấp
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block mb-1">
                  Interface Heading · Be Vietnam Pro Sans
                </span>
                <p className="text-base font-semibold text-ink tracking-tight">
                  Không Gian Vận Hành DịpXinh Atelier Studio
                </p>
                <div className="mt-1.5">
                  <span className="editorial-kicker">Bộ sưu tập thu đông 2026</span>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block mb-1">
                  Body Sans · Be Vietnam Pro
                </span>
                <p className="text-xs text-ink leading-relaxed">
                  Mỗi trang phục tại DịpXinh đều được định danh bằng mã QR vật lý độc bản, theo dõi
                  từng vòng đời thuê, tình trạng giặt ủi và đối soát cọc tự động nhằm đảm bảo chất
                  lượng phục vụ hoàn hảo nhất cho khách hàng.
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block mb-1">
                  Tabular Numbers · Số Liệu Đối Soát (.tabular-nums)
                </span>
                <div className="p-3 rounded-lg border border-border-default bg-surface-subtle space-y-1.5 text-xs tabular-nums">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted">Doanh thu thuê ngày:</span>
                    <span className="font-semibold text-primary font-mono">24.500.000 ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted">Tiền cọc giữ chỗ đang khóa:</span>
                    <span className="font-semibold text-ink font-mono">85.000.000 ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted">Tồn kho thực thể sẵn sàng:</span>
                    <span className="font-semibold text-[#1E5844] font-mono">142 / 160 sản phẩm</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── SECTION 3: Component Atelier: Buttons, Badges, Forms, Selects ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Buttons & Status Badges (6 cols) */}
          <section className="lg:col-span-6 rounded-2xl border border-border-default bg-surface p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                  <Sliders className="w-4 h-4 text-ink-muted" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink tracking-tight">
                    4. Các Loại Nút Bấm & Trạng Thái
                  </h3>
                  <p className="text-xs text-ink-muted">6 biến thể công năng và kích cỡ</p>
                </div>
              </div>

              <label className="text-xs text-ink-muted font-medium flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBtnLoading}
                  onChange={(e) => setIsBtnLoading(e.target.checked)}
                  className="rounded text-primary focus:ring-primary cursor-pointer"
                />
                Mô phỏng Loading
              </label>
            </div>

            {/* Buttons Variants */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2.5">
                Biến Thể (Button Variants)
              </span>
              <div className="p-3.5 rounded-xl border border-border-default/80 bg-surface-subtle/50 flex flex-wrap items-center gap-2.5">
                <Button variant="primary" isLoading={isBtnLoading}>
                  Primary Action
                </Button>
                <Button variant="secondary" isLoading={isBtnLoading}>
                  Secondary Action
                </Button>
                <Button variant="outline" isLoading={isBtnLoading}>
                  Outline Action
                </Button>
                <Button variant="ghost" isLoading={isBtnLoading}>
                  Ghost Action
                </Button>
                <Button variant="destructive" isLoading={isBtnLoading}>
                  Hủy / Xóa
                </Button>
                <Button variant="link">Liên kết</Button>
              </div>
            </div>

            {/* Sizes & Icons */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2.5">
                Kích Cỡ & Biểu Tượng
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Nhỏ (sm)
                </Button>
                <Button size="md" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                  Chuẩn (md)
                </Button>
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Lớn (lg)
                </Button>
                <Button size="icon" variant="outline" aria-label="Nút xoay">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button size="iconSm" variant="secondary" aria-label="Nút tìm kiếm nhỏ">
                  <Search className="w-3.5 h-3.5" />
                </Button>
                <Button disabled variant="primary">
                  Vô hiệu hóa
                </Button>
              </div>
            </div>

            {/* Status Badges Section */}
            <div className="pt-4 border-t border-border-default">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted block mb-2.5">
                9. Nhãn Trạng Thái Vòng Đời Thuê (Status Badges)
              </span>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success" styleVariant="soft" withDot>Sẵn sàng giao</Badge>
                  <Badge tone="warning" styleVariant="soft" withDot>Đang giữ chỗ</Badge>
                  <Badge tone="primary" styleVariant="soft" withDot>Đang cho thuê</Badge>
                  <Badge tone="info" styleVariant="soft" withDot>Đang hấp sấy</Badge>
                  <Badge tone="danger" styleVariant="soft" withDot>Cần bảo dưỡng</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="primary" styleVariant="solid">Hot Trend 2026</Badge>
                  <Badge tone="success" styleVariant="solid">Đã đối soát cọc</Badge>
                  <Badge tone="danger" styleVariant="solid">Quá hạn trả</Badge>
                  <Badge tone="neutral" styleVariant="outline">Size L · Gấm Tơ</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Forms, Inputs & Selects (6 cols) */}
          <section className="lg:col-span-6 rounded-2xl border border-border-default bg-surface p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                  <Edit className="w-4 h-4 text-ink-muted" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink tracking-tight">
                    5 & 6. Biểu Mẫu, Nhập Liệu & Bộ Chọn
                  </h3>
                  <p className="text-xs text-ink-muted">Tích hợp nhãn bắt buộc, icon và thông báo lỗi ngữ nghĩa</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setHasFormError((prev) => !prev)}
              >
                {hasFormError ? 'Tắt Lỗi' : 'Bật Báo Lỗi'}
              </Button>
            </div>

            <div className="space-y-4">
              <FormField
                label="Tên trang phục thời trang"
                required
                helperText="Nhập tên chính thức hiển thị trên bộ sưu tập"
                errorMessage={hasFormError ? 'Tên trang phục không được để trống' : undefined}
              >
                <Input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  placeholder="Ví dụ: Đầm dạ hội lụa..."
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email quản trị atelier"
                  required
                  errorMessage={hasFormError ? 'Định dạng email chưa hợp lệ' : undefined}
                >
                  <Input
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </FormField>

                <FormField
                  label="Mật khẩu bảo mật"
                  helperText="Tối thiểu 8 ký tự"
                >
                  <Input
                    type="password"
                    defaultValue="secretPass123"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label className="mb-1.5">Phân loại bộ sưu tập</Label>
                  <Select
                    options={[
                      { value: 'da-hoi', label: 'Đầm dạ hội cao cấp' },
                      { value: 'ao-dai', label: 'Áo dài cung đình & lễ cưới' },
                      { value: 'cocktail', label: 'Váy tiệc cocktail nhẹ nhàng' },
                      { value: 'suit-nu', label: 'Âu phục may đo riêng' },
                    ]}
                  />
                </div>

                <div>
                  <Label className="mb-1.5">Trình đơn tác vụ</Label>
                  <DropdownMenu
                    trigger={
                      <Button variant="outline" className="w-full justify-between" rightIcon={<MoreVertical className="w-4 h-4" />}>
                        Thao Tác Nhanh
                      </Button>
                    }
                    items={[
                      {
                        id: 'view',
                        label: 'Xem chi tiết định danh QR',
                        icon: <Eye className="w-4 h-4" />,
                        onClick: () => toast.info('Đã mở chi tiết sản phẩm QR'),
                      },
                      {
                        id: 'edit',
                        label: 'Chỉnh sửa thông số may đo',
                        icon: <Edit className="w-4 h-4" />,
                        onClick: () => toast.info('Mở hộp thoại chỉnh sửa số đo'),
                      },
                      { id: 'div1', label: '', isDivider: true },
                      {
                        id: 'delete',
                        label: 'Thanh lý / Đưa vào bảo dưỡng',
                        icon: <Trash2 className="w-4 h-4" />,
                        destructive: true,
                        onClick: () => setConfirmDialogType('danger'),
                      },
                    ]}
                  />
                </div>
              </div>

              <FormField
                label="Chỉ dẫn bảo quản & giặt hấp đặc biệt"
                helperText="Ghi chú kỹ thuật cho bộ phận xưởng may giặt là"
              >
                <Textarea
                  rows={2}
                  placeholder="Lưu ý: Chỉ giặt khô bằng dung môi hữu cơ, bảo quản bằng túi lụa thoáng khí..."
                />
              </FormField>
            </div>
          </section>
        </div>

        {/* ── SECTION 4: Operations: Data Table & Modal Center ── */}
        <section className="rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-default pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                <Grid className="w-5 h-5 text-ink-muted" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink tracking-tight">
                  8. Bảng Dữ Liệu Thực Thể & Phân Trang (Data Table & Pagination)
                </h3>
                <p className="text-xs text-ink-muted">Thiết kế tối ưu cho kiểm kê tồn kho và đối soát tài chính theo mã QR</p>
              </div>
            </div>

            {/* Status Filter Tabs & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-lg border border-border-default p-0.5 bg-surface-subtle text-xs">
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'READY', label: 'Sẵn sàng' },
                  { id: 'RENTED', label: 'Đang thuê' },
                  { id: 'HELD', label: 'Giữ chỗ' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTableFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      tableFilter === tab.id
                        ? 'bg-surface text-ink font-semibold shadow-2xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <Input
                sizeVariant="sm"
                placeholder="Tìm mã QR, tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
                className="w-48"
              />
            </div>
          </div>

          {/* Table Container */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã QR Thực Thể</TableHead>
                <TableHead>Tên Trang Phục</TableHead>
                <TableHead>Phân Loại</TableHead>
                <TableHead>Size / Màu</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Giá Thuê (3 ngày)</TableHead>
                <TableHead className="text-right">Tiền Cọc</TableHead>
                <TableHead className="text-right">Tác Vụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.qr}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {item.qr}
                  </TableCell>
                  <TableCell className="font-medium text-ink max-w-[240px] truncate">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2 shrink-0 border border-black/10 align-middle"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="align-middle">{item.title}</span>
                  </TableCell>
                  <TableCell className="text-ink-muted text-xs">{item.category}</TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-ink">{item.size}</span> · {item.color}
                  </TableCell>
                  <TableCell>
                    {item.status === 'READY' && (
                      <Badge tone="success" styleVariant="soft" size="sm" withDot>
                        Sẵn sàng
                      </Badge>
                    )}
                    {item.status === 'RENTED' && (
                      <Badge tone="primary" styleVariant="soft" size="sm" withDot>
                        Đang cho thuê
                      </Badge>
                    )}
                    {item.status === 'HELD' && (
                      <Badge tone="warning" styleVariant="soft" size="sm" withDot>
                        Đang giữ chỗ
                      </Badge>
                    )}
                    {item.status === 'WASHING' && (
                      <Badge tone="info" styleVariant="soft" size="sm" withDot>
                        Đang hấp sấy
                      </Badge>
                    )}
                    {item.status === 'MAINTENANCE' && (
                      <Badge tone="danger" styleVariant="soft" size="sm" withDot>
                        Bảo dưỡng
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-ink tabular-nums">
                    {item.rentalPrice}
                  </TableCell>
                  <TableCell className="text-right text-ink-muted tabular-nums">{item.deposit}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => toast.info(`Đang xem thông số chi tiết của ${item.qr}`)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={4}
            totalItems={19}
            pageSize={5}
            onPageChange={(page) => setCurrentPage(page)}
          />

          {/* Dialog Triggers Bar */}
          <div className="pt-6 border-t border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-ink block">
                7. Trung Tâm Hộp Thoại & Xác Nhận (Dialogs & Confirmation)
              </span>
              <span className="text-[11px] text-ink-muted">
                Hỗ trợ phím Escape, bẫy focus bàn phím và làm mờ nền
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsSampleDialogOpen(true)}>
                Xem Quy Trình Bàn Giao
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmDialogType('primary')}>
                Duyệt Đơn Thuê
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmDialogType('warning')}>
                Cảnh Báo Đổi Lịch
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setConfirmDialogType('danger')}>
                Hủy Đơn & Giải Phóng Cọc
              </Button>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: Feedback & Reliability: Toast & States ── */}
        <section className="rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-default pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
                <CheckCircle2 className="w-5 h-5 text-ink-muted" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink tracking-tight">
                  10 & 11. Phản Hồi Vận Hành: Thông Báo Toast & Trạng Thái Hệ Thống
                </h3>
                <p className="text-xs text-ink-muted">Toast tự đóng sau 4s và các kịch bản tải, trống hoặc báo lỗi</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border-default bg-surface-subtle">
              {(['content', 'loading', 'empty', 'error'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFeedbackMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    feedbackMode === mode
                      ? 'bg-surface text-ink shadow-2xs font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {mode === 'content' && 'Bình thường'}
                  {mode === 'loading' && 'Skeleton'}
                  {mode === 'empty' && 'Trống'}
                  {mode === 'error' && 'Báo lỗi'}
                </button>
              ))}
            </div>
          </div>

          {/* Toast Notification Trigger Bar */}
          <div className="p-4 rounded-xl border border-border-default bg-surface-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-ink block">Kích Hoạt Toast Thực Tế</span>
              <span className="text-[11px] text-ink-muted">Thông báo sẽ xuất hiện tại góc dưới bên phải màn hình</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success('Duyệt cọc thành công!', {
                    description: 'Đơn thuê #DX-9821 đã được ghi nhận tiền cọc 3.000.000 ₫.',
                  })
                }
              >
                Toast Thành Công
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.warning('Sắp đến hạn trả đồ', {
                    description: 'Khách hàng hẹn trả đầm dạ hội vào 18:00 chiều nay.',
                  })
                }
              >
                Toast Cảnh Báo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.error('Không thể bàn giao', {
                    description: 'Trang phục chưa qua quy trình hấp sấy vệ sinh đạt chuẩn.',
                  })
                }
              >
                Toast Báo Lỗi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info('Lịch hẹn thử đồ mới', {
                    description: 'Khách hàng Mai Linh đã đặt lịch thử đầm vào 15:30 ngày mai.',
                  })
                }
              >
                Toast Thông Tin
              </Button>
            </div>
          </div>

          {/* Dynamic Feedback Sandbox Viewport */}
          <div className="p-5 rounded-xl border border-border-default bg-surface-subtle/30">
            {feedbackMode === 'content' && (
              <div className="p-5 bg-surface rounded-xl border border-border-default flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                    DX
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Bộ Sưu Tập Thu Đông 2026 Đang Hoạt Động</h4>
                    <p className="text-xs text-ink-muted mt-0.5">38 mẫu thiết kế đã sẵn sàng phục vụ khách thuê và đặt may.</p>
                  </div>
                </div>
                <Badge tone="success" styleVariant="soft" size="sm" withDot>
                  Hệ thống ổn định
                </Badge>
              </div>
            )}

            {feedbackMode === 'loading' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton variant="rounded" className="w-12 h-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="pt-2 flex justify-center">
                  <LoadingState message="Đang đồng bộ dữ liệu đối soát cọc từ xưởng may..." />
                </div>
              </div>
            )}

            {feedbackMode === 'empty' && (
              <EmptyState
                title="Chưa Có Đơn Thuê Nào Chờ Bàn Giao Hôm Nay"
                description="Tất cả các trang phục cho ngày hôm nay đã được khách hàng nhận hoặc trả đúng hạn. Hãy kiểm tra lại lịch hẹn vào ngày mai."
                actionLabel="Tạo Đơn Thuê Mới Tại Cửa Hàng"
                onAction={() => toast.info('Mở tạo đơn thuê trực tiếp')}
              />
            )}

            {feedbackMode === 'error' && (
              <div className="space-y-4">
                <ErrorState
                  compact
                  message="Lỗi kết nối máy chủ đối soát ngân hàng. Mã lỗi: ERR_PAYMENT_GATEWAY_TIMEOUT"
                  onRetry={() => toast.info('Đang kết nối lại cổng thanh toán...')}
                />
                <ErrorState
                  title="Không Thể Tải Báo Cáo Doanh Thu"
                  message="Đã xảy ra sự cố khi truy vấn cơ sở dữ liệu cọc. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau vài giây."
                  onRetry={() => setFeedbackMode('content')}
                />
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 6: Accessibility & System Specs ── */}
        <section className="rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-3 mb-5 border-b border-border-default pb-4">
            <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-ink shrink-0">
              <ShieldCheck className="w-4 h-4 text-ink-muted" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink tracking-tight">
                12 & 13. Quy Chuẩn Truy Cập (A11y) & Hiển Thị Linh Hoạt (Responsive)
              </h3>
              <p className="text-xs text-ink-muted">Quy tắc thiết kế đảm bảo độ tương thích và trải nghiệm mượt mà</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-ink leading-relaxed">
            <div className="p-4 rounded-xl border border-border-default bg-surface-subtle/40 space-y-2">
              <span className="font-semibold text-ink block text-xs">Viền Focus Tương Phản Cao</span>
              <p className="text-ink-muted">
                Mọi phần tử tương tác đều có viền <code className="font-mono text-primary font-semibold">outline: 2px solid var(--dx-primary)</code> kèm offset 2px khi điều hướng qua phím Tab.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border-default bg-surface-subtle/40 space-y-2">
              <span className="font-semibold text-ink block text-xs">Thuộc Tính Ngữ Nghĩa ARIA</span>
              <p className="text-ink-muted">
                Liên kết đầy đủ <code className="font-mono text-ink">aria-invalid</code>, <code className="font-mono text-ink">aria-describedby</code>, <code className="font-mono text-ink">role="dialog"</code>, <code className="font-mono text-ink">role="status"</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border-default bg-surface-subtle/40 space-y-2">
              <span className="font-semibold text-ink block text-xs">Vùng Chạm Cảm Ứng</span>
              <p className="text-ink-muted">
                Nút bấm và input có chiều cao tối thiểu 38px - 44px, bảng cuộn ngang tự nhiên trên thiết bị di động.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Modals & Dialogs ── */}
      <Dialog
        isOpen={isSampleDialogOpen}
        onClose={() => setIsSampleDialogOpen(false)}
        title="Quy Trình Giữ Chỗ & Bàn Giao DịpXinh"
        description="Tiêu chuẩn vận hành đối soát cọc và bàn giao trang phục cao cấp"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsSampleDialogOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsSampleDialogOpen(false);
                toast.success('Đã lưu cấu hình quy trình bàn giao!');
              }}
            >
              Áp Dụng Quy Trình
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
          <p>
            Trang phục sau khi được duyệt đơn sẽ tự động giữ chỗ trong vòng 60 phút để khách hàng
            hoàn tất đặt cọc. Quản trị viên có thể điều chỉnh thời gian giữ chỗ linh hoạt trong
            mục Cài đặt Cửa hàng.
          </p>
          <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
            <span className="font-semibold text-ink block mb-1">Kiểm tra bàn giao:</span>
            • Quét mã QR thực thể trên mác vải áo.<br />
            • Kiểm tra tình trạng nguyên vẹn đường chỉ và đính kết.<br />
            • Chụp ảnh lưu trữ biên bản bàn giao điện tử.
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={confirmDialogType === 'danger'}
        onClose={() => setConfirmDialogType(null)}
        onConfirm={() => {
          setConfirmDialogType(null);
          toast.error('Đã hủy bỏ đơn thuê và giải phóng mã QR');
        }}
        variant="danger"
        title="Xác nhận hủy đơn thuê trang phục?"
        description="Hành động này sẽ giải phóng trạng thái giữ chỗ của sản phẩm và hoàn trả tiền cọc cho khách hàng theo chính sách hiện hành."
        confirmLabel="Xác Nhận Hủy"
      />

      <ConfirmDialog
        isOpen={confirmDialogType === 'warning'}
        onClose={() => setConfirmDialogType(null)}
        onConfirm={() => {
          setConfirmDialogType(null);
          toast.warning('Đã gửi thông báo thay đổi lịch hẹn tới khách hàng');
        }}
        variant="warning"
        title="Dời lịch hẹn thử đồ?"
        description="Khách hàng sẽ nhận được thông báo SMS/Zalo về khung giờ mới đã được cập nhật trên hệ thống."
        confirmLabel="Dời Lịch"
      />

      <ConfirmDialog
        isOpen={confirmDialogType === 'primary'}
        onClose={() => setConfirmDialogType(null)}
        onConfirm={() => {
          setConfirmDialogType(null);
          toast.success('Đã duyệt đơn và khóa mã QR thành công!');
        }}
        variant="primary"
        title="Duyệt đơn và giữ đồ?"
        description="Mã QR thực thể sẽ được chuyển sang trạng thái GIỮ CHỖ và bắt đầu đếm ngược thời gian thanh toán cọc."
        confirmLabel="Duyệt Đơn Ngay"
      />
    </div>
  );
};
