import React, { useState } from 'react';
import { RentalUnit, Product, Shop } from '@/shared/model/domain';
import { Button, Badge } from '@/shared/components/ui';
import { Printer, X, CheckSquare, Square, QrCode, Sparkles } from 'lucide-react';

interface BatchQrPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: RentalUnit[];
  products: Product[];
  shop: Shop;
}

export const BatchQrPrintModal: React.FC<BatchQrPrintModalProps> = ({
  isOpen,
  onClose,
  units,
  products,
  shop,
}) => {
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>(() =>
    units.map((u) => u.id)
  );

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedUnitIds.length === units.length) {
      setSelectedUnitIds([]);
    } else {
      setSelectedUnitIds(units.map((u) => u.id));
    }
  };

  const toggleUnit = (id: string) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter((item) => item !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const printableUnits = units.filter((u) => selectedUnitIds.includes(u.id));

  const getProductForUnit = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs print:p-0 print:bg-white print:static">
      <div className="bg-surface rounded-2xl border border-border-default shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Modal Header - Hidden when printing */}
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-subtle print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">In Tem Nhãn QR Code Vật Lý</h2>
              <p className="text-xs text-ink-muted">
                Chuẩn tem tag vải thời trang 50x30mm · Gán trực tiếp lên từng chiếc váy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              {selectedUnitIds.length === units.length ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 mr-1" /> Bỏ Chọn Tất Cả
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 mr-1" /> Chọn Tất Cả ({units.length})
                </>
              )}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
              disabled={printableUnits.length === 0}
            >
              In {printableUnits.length} Tem Nhãn
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-canvas print:p-0 print:bg-white">
          <div className="mb-4 text-xs text-ink-muted flex items-center justify-between print:hidden">
            <span>
              Xem trước khổ tem in nhiệt: <strong className="text-ink">{printableUnits.length} tem</strong> đã chọn
            </span>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Mẹo: Chọn tỉ lệ "Fit to printable area" trong cài đặt máy in nhiệt
            </span>
          </div>

          {/* Grid of QR Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
            {units.map((unit) => {
              const product = getProductForUnit(unit.productId);
              const isSelected = selectedUnitIds.includes(unit.id);

              return (
                <div
                  key={unit.id}
                  onClick={() => toggleUnit(unit.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer select-none bg-white print:border-black print:rounded-none print:shadow-none ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-sm print:ring-0'
                      : 'border-border-default opacity-50 print:hidden'
                  }`}
                >
                  {/* Selection checkbox indicator - Hidden when printing */}
                  <div className="absolute top-2.5 right-2.5 print:hidden">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-muted" />
                    )}
                  </div>

                  {/* Physical Tag Layout */}
                  <div className="space-y-3">
                    {/* Tag Header */}
                    <div className="border-b border-border-default pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary print:text-black">
                          DỊP XINH · BOUTIQUE
                        </span>
                        <Badge tone="primary" styleVariant="soft" size="sm" className="print:border-black print:text-black">
                          Size {unit.size}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-ink truncate mt-0.5 print:text-black">
                        {product?.title || 'Trang Phục Cho Thuê'}
                      </h4>
                      <p className="text-[10px] text-ink-muted truncate print:text-gray-700">
                        {shop.name} · Màu {unit.color}
                      </p>
                    </div>

                    {/* Tag Body: Simulated QR Code & Serial */}
                    <div className="flex items-center gap-3">
                      {/* High-contrast QR visual box */}
                      <div className="w-16 h-16 bg-white border border-black p-1 rounded-sm flex flex-col justify-between shrink-0">
                        {/* 4 corner positioning squares of standard QR */}
                        <div className="flex justify-between">
                          <div className="w-3.5 h-3.5 bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white" />
                          </div>
                          <div className="w-3.5 h-3.5 bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white" />
                          </div>
                        </div>
                        <div className="flex justify-center items-center py-0.5">
                          <div className="w-2 h-2 bg-black" />
                          <div className="w-1.5 h-1.5 bg-white" />
                          <div className="w-2 h-2 bg-black" />
                        </div>
                        <div className="flex justify-between">
                          <div className="w-3.5 h-3.5 bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white" />
                          </div>
                          <div className="w-2 h-2 bg-black" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-ink-muted uppercase block print:text-gray-700">Mã Serial Tag:</span>
                        <p className="font-mono text-sm font-bold text-ink tracking-wider bg-surface-subtle px-1.5 py-0.5 rounded border border-border-default print:border-none print:bg-transparent print:p-0 print:text-black">
                          {unit.qrCode}
                        </p>
                        <span className="text-[9px] text-emerald-700 flex items-center gap-1 print:text-black">
                          <Sparkles className="w-2.5 h-2.5 print:hidden" /> Định Danh Độc Bản
                        </span>
                      </div>
                    </div>

                    {/* Tag Footer */}
                    <div className="border-t border-dashed border-border-default pt-1.5 text-center">
                      <p className="text-[8px] text-ink-muted print:text-black">
                        Quét mã xác thực tình trạng & hạn trả đồ tại quầy
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
