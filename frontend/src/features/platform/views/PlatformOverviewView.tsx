import React from 'react';
import { NavLink } from 'react-router-dom';
import { demoStore } from '@/shared/demo/demo-store';
import { Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui';
import {
  Server,
  Building2,
  PackageCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Activity,
  DollarSign,
} from 'lucide-react';

export const PlatformOverviewView: React.FC = () => {
  const storeState = demoStore.getState();
  const shops = storeState.shops;

  const platformKpis = [
    {
      label: 'Tổng Cửa Hàng (Tenants)',
      value: shops.length,
      unit: 'cửa hàng đăng ký',
      icon: <Building2 className="w-5 h-5 text-zinc-300" />,
    },
    {
      label: 'Cửa Hàng Dùng Thử (Trial)',
      value: shops.filter((s) => s.plan === 'TRIAL').length,
      unit: '14 ngày miễn phí',
      icon: <PackageCheck className="w-5 h-5 text-amber-400" />,
    },
    {
      label: 'Hóa Đơn SaaS Chờ Đối Soát',
      value: '2 hóa đơn',
      unit: 'thanh toán chuyển khoản',
      icon: <CreditCard className="w-5 h-5 text-blue-400" />,
    },
    {
      label: 'Trạng Thái Hàng Đợi Outbox',
      value: '0 lỗi / 24 xử lý',
      unit: 'Tự động retry 5 lần',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Platform Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              Platform Administration Console
            </span>
            <Badge tone="primary" styleVariant="solid" size="sm">
              SaaS Central
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Vận Hành & Điều Phối Nền Tảng DịpXinh
          </h1>
          <p className="text-xs text-zinc-600 mt-1 max-w-xl leading-relaxed">
            Quản trị danh mục gói dịch vụ, kích hoạt/đình chỉ cửa hàng đối tác, xác minh hóa đơn thanh toán SaaS và giám sát độ tin cậy của hàng đợi sự kiện.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Đang làm mới trạng thái cluster')}
          >
            Làm Mới Trạng Thái
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Mở cấu hình hạn mức gói SaaS')}
          >
            Cấu Hình Gói Dịch Vụ
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 leading-tight">
                {kpi.label}
              </span>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                {kpi.icon}
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-zinc-900 tabular-nums tracking-tight block">
                {kpi.value}
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono">
                {kpi.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Directory Table (F04-02 & F04-03) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Danh Sách Cửa Hàng Đối Tác (Tenants)
            </h2>
            <p className="text-xs text-zinc-500">Giám sát trạng thái gói, hạn dùng thử và thao tác kích hoạt/đình chỉ</p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">F04-02 Specimen</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Cửa Hàng</TableHead>
              <TableHead>Slug Đường Dẫn</TableHead>
              <TableHead>Gói SaaS</TableHead>
              <TableHead>Hạn Dùng Thử</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Tác Vụ Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-semibold text-zinc-900">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: s.accentColor || '#713F4B' }}
                    />
                    <span>{s.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-600">
                  /shop/{s.slug}
                </TableCell>
                <TableCell>
                  <Badge tone="primary" styleVariant="soft" size="sm">
                    {s.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-500">
                  Còn 14 ngày (Hết hạn 22/11/2026)
                </TableCell>
                <TableCell>
                  <Badge tone="success" styleVariant="soft" size="sm" withDot>
                    Đang hoạt động
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Đã gửi yêu cầu kiểm tra hạn mức cho ${s.name}`)}
                    >
                      Hạn mức
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => alert(`Xác nhận đình chỉ (Suspend) hoạt động của shop ${s.name}?`)}
                    >
                      Đình chỉ
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const PlatformSubpagePlaceholder: React.FC<{ title: string; specId: string; description: string }> = ({
  title,
  specId,
  description,
}) => {
  return (
    <div className="p-8 rounded-2xl border border-dashed border-zinc-300 bg-white/70 text-center space-y-3">
      <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-600">
        <Server className="w-6 h-6 stroke-[1.25]" />
      </div>
      <div>
        <Badge tone="neutral" styleVariant="outline" size="sm" className="font-mono mb-1">
          {specId}
        </Badge>
        <h2 className="text-lg font-semibold text-zinc-900 mt-1">{title}</h2>
      </div>
      <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">{description}</p>
    </div>
  );
};
