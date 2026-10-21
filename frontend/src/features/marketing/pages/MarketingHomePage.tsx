import type { FC } from 'react';
import type { Shop } from '@/shared/model/domain';

interface MarketingHomePageProps {
  onGoToStorefront: () => void;
  onGoToDashboard: () => void;
  onOpenCreateShop: () => void;
  currentShop: Shop;
}

const operationalPillars = [
  {
    number: '01',
    title: 'Nhận diện từng trang phục',
    description:
      'Mỗi chiếc váy có một mã QR và vòng đời riêng — từ sẵn sàng, giữ chỗ, đang thuê đến giặt ủi và phục hồi.',
    outcome: 'Lịch thuê được kiểm soát trên từng hiện vật.',
  },
  {
    number: '02',
    title: 'Nhận trả theo đúng thực tế',
    description:
      'Theo dõi từng món trong combo, hỗ trợ trả nhiều đợt và ghi nhận tình trạng ngay tại quầy mà không làm mất dấu lịch sử.',
    outcome: 'Nhân viên biết món nào đã về và món nào còn ở khách.',
  },
  {
    number: '03',
    title: 'Ký quỹ minh bạch',
    description:
      'Tiền thuê, ký quỹ, khoản khấu trừ và hoàn trả được tách bạch để cửa hàng đối soát rõ ràng với khách hàng.',
    outcome: 'Mỗi biến động đều có ngữ cảnh và người thực hiện.',
  },
];

const workflowSteps = [
  ['01', 'Lên bộ sưu tập', 'Thiết lập mẫu, biến thể, giá thuê và mã QR cho từng hiện vật.'],
  ['02', 'Nhận lịch thuê', 'Khách chọn ngày trên storefront; cửa hàng duyệt và phân bổ đúng trang phục.'],
  ['03', 'Bàn giao & nhận trả', 'Quét QR tại quầy, kiểm tra chất lượng và theo dõi các lượt trả một phần.'],
  ['04', 'Đối soát', 'Chốt sự cố, hoàn ký quỹ và lưu lại toàn bộ lịch sử giao dịch.'],
];

const lookbookPieces = [
  {
    number: '01',
    name: 'Emerald Evening',
    category: 'Đầm dạ hội',
    image: '/images/demo/product-emerald-gown.jpg',
  },
  {
    number: '02',
    name: 'Lụa Việt',
    category: 'Áo dài',
    image: '/images/demo/product-silk-aodai.jpg',
  },
  {
    number: '03',
    name: 'Velvet Nocturne',
    category: 'Đầm nhung',
    image: '/images/demo/product-velvet-dress.jpg',
  },
];

const plans = [
  {
    name: 'Trial',
    price: '0đ',
    cadence: '14 ngày',
    description: 'Khám phá trọn vẹn một vòng vận hành.',
    features: ['50 đơn vị QR', 'Storefront riêng', 'Luồng bàn giao và ký quỹ'],
    featured: true,
  },
  {
    name: 'Starter',
    price: '490.000đ',
    cadence: 'tháng',
    description: 'Cho boutique cho thuê độc lập.',
    features: ['250 đơn vị QR', '3 tài khoản nhân viên', 'Báo cáo vận hành và dòng tiền'],
    featured: false,
  },
  {
    name: 'Growth',
    price: '990.000đ',
    cadence: 'tháng',
    description: 'Cho showroom có đội ngũ vận hành lớn hơn.',
    features: ['Không giới hạn QR', 'Phân quyền chi tiết', 'Hỗ trợ ưu tiên'],
    featured: false,
  },
];

export const MarketingHomePage: FC<MarketingHomePageProps> = ({
  onGoToStorefront,
  onGoToDashboard,
  onOpenCreateShop,
  currentShop,
}) => (
  <div className="min-h-screen bg-[#FCF9F5] text-[#302824]">
    <section className="overflow-hidden border-b border-[#E8DFD8]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-7 lg:pr-4">
          <span className="editorial-kicker">Dành riêng cho thời trang cho thuê</span>

          <h1 className="mt-7 max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.035em] text-[#302824] sm:text-6xl lg:text-[5.25rem]">
            Mỗi bộ trang phục
            <span className="block italic text-[#713F4B]">đều có một hành trình.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#756A64] sm:text-base">
            DịpXinh kết nối bộ sưu tập, lịch thuê, mã QR và ký quỹ trong một không gian vận hành thanh lịch — để cửa hàng dành nhiều thời gian hơn cho khách hàng và trang phục.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={onOpenCreateShop}
              className="bg-[#713F4B] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5C303B]"
            >
              Bắt đầu 14 ngày dùng thử <span aria-hidden="true" className="ml-2">→</span>
            </button>
            <button
              type="button"
              onClick={onGoToStorefront}
              className="border-b border-[#713F4B] pb-1 text-sm font-medium text-[#713F4B] transition-colors hover:text-[#5C303B]"
            >
              Xem storefront của {currentShop.name}
            </button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 border-y border-[#E8DFD8] py-5 text-xs text-[#756A64] sm:grid-cols-3">
            {['QR cho từng hiện vật', 'Lịch thuê không chồng chéo', 'Ký quỹ tách bạch'].map((item, index) => (
              <div
                key={item}
                className={`flex items-baseline gap-2 py-2 sm:px-4 sm:py-0 ${index > 0 ? 'sm:border-l sm:border-[#E8DFD8]' : 'sm:pl-0'}`}
              >
                <span className="font-display text-base italic text-[#C79A97]">0{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative isolate lg:col-span-5 lg:pl-4">
          <div className="absolute bottom-0 right-0 top-10 w-4/5 bg-[#713F4B]" aria-hidden="true" />
          <div className="relative mb-7 mr-5 border border-[#C79A97] bg-[#FFFDFC] p-2 sm:mr-8">
            <figure className="relative aspect-[4/5] overflow-hidden bg-[#E8DFD8]">
              <img
                src="/images/demo/hero-fashion-rental.jpg"
                alt="Không gian showroom thời trang cho thuê"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302824]/90 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 max-w-[68%] px-5 pb-5 text-white sm:px-6 sm:pb-6">
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#ECDAD8]">Storefront riêng</p>
                <p className="mt-1 font-display text-xl font-medium italic sm:text-2xl">{currentShop.name}</p>
                <p className="mt-1 text-[10px] text-white/65">/shop/{currentShop.slug}</p>
              </figcaption>

              <div className="absolute bottom-5 right-5 hidden w-[31%] border-[5px] border-[#FFFDFC] bg-[#FFFDFC] sm:block">
                <img
                  src="/images/demo/product-emerald-gown.jpg"
                  alt="Chi tiết đầm dạ hội xanh emerald"
                  className="aspect-[4/5] w-full object-cover"
                />
                <p className="px-2 py-1.5 text-[8px] uppercase tracking-[0.14em] text-[#713F4B]">
                  Look 01 · Emerald
                </p>
              </div>
            </figure>
          </div>
          <p className="absolute bottom-1 right-5 text-[9px] uppercase tracking-[0.22em] text-white/75 sm:right-8">
            DịpXinh · Collection 2026
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-[#E8DFD8] bg-[#FFFDFC]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-3">
          <span className="editorial-kicker">Selected lookbook</span>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.02] tracking-[-0.025em] text-[#302824]">
            Một thoáng trong tủ đồ.
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#756A64]">
            Hình ảnh dẫn lối, còn DịpXinh giữ cho từng lịch thuê phía sau luôn chính xác.
          </p>
          <button
            type="button"
            onClick={onGoToStorefront}
            className="mt-8 border-b border-[#713F4B] pb-1 text-sm font-medium text-[#713F4B] transition-colors hover:text-[#5C303B]"
          >
            Xem toàn bộ sưu tập <span aria-hidden="true" className="ml-2">→</span>
          </button>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-3 lg:col-span-9">
          {lookbookPieces.map((piece, index) => (
            <button
              key={piece.number}
              type="button"
              onClick={onGoToStorefront}
              className={`group text-left ${index === 1 ? 'sm:mt-12' : ''}`}
            >
              <figure className="aspect-[4/5] overflow-hidden bg-[#E8DFD8]">
                <img
                  src={piece.image}
                  alt={`${piece.name} — ${piece.category}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
              </figure>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-[#E8DFD8] pt-3">
                <div>
                  <h3 className="font-display text-xl font-medium italic text-[#302824] group-hover:text-[#713F4B]">
                    {piece.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#756A64]">{piece.category}</p>
                </div>
                <span className="font-display text-lg italic text-[#C79A97]">{piece.number}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-4">
        <span className="editorial-kicker">Vận hành có chiều sâu</span>
        <h2 className="mt-5 max-w-sm font-display text-4xl font-medium leading-tight tracking-[-0.02em] sm:text-5xl">
          Được thiết kế cho đời sống thật của một bộ váy.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-[#756A64]">
          Không chỉ đếm số lượng trong kho. DịpXinh theo sát từng lần giữ chỗ, bàn giao, giặt ủi và trở lại kệ.
        </p>
      </div>

      <div className="border-t border-[#302824] lg:col-span-8">
        {operationalPillars.map((pillar) => (
          <article
            key={pillar.number}
            className="grid gap-4 border-b border-[#E8DFD8] py-8 sm:grid-cols-[3rem_1fr] sm:gap-7"
          >
            <span className="font-display text-xl italic text-[#C79A97]">{pillar.number}</span>
            <div className="grid gap-3 md:grid-cols-2 md:gap-10">
              <div>
                <h3 className="font-display text-2xl font-medium text-[#302824]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#756A64]">{pillar.description}</p>
              </div>
              <p className="self-end border-l border-[#C79A97] pl-4 text-xs leading-6 text-[#713F4B]">
                {pillar.outcome}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="border-y border-[#E8DFD8] bg-[#FFFDFC]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="editorial-kicker">Một vòng thuê hoàn chỉnh</span>
            <h2 className="mt-5 font-display text-4xl font-medium tracking-[-0.02em] sm:text-5xl">
              Từ kệ áo đến ngày trở về.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#756A64]">
            Mỗi bước tiếp nối bước trước, để nhân viên luôn biết cần làm gì và khách hàng luôn hiểu điều gì đang diễn ra.
          </p>
        </div>

        <div className="mt-14 grid border-t border-[#302824] md:grid-cols-4">
          {workflowSteps.map(([number, title, description], index) => (
            <article
              key={number}
              className={`py-7 md:px-6 ${index > 0 ? 'border-t border-[#E8DFD8] md:border-l md:border-t-0' : 'md:pl-0'}`}
            >
              <span className="font-display text-2xl italic text-[#C79A97]">{number}</span>
              <h3 className="mt-8 font-display text-xl font-medium">{title}</h3>
              <p className="mt-3 text-xs leading-6 text-[#756A64]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="border-b border-[#713F4B] pb-1 text-sm font-medium text-[#713F4B]"
          >
            Khám phá không gian vận hành <span aria-hidden="true" className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="max-w-2xl">
        <span className="editorial-kicker">Bắt đầu theo nhịp của bạn</span>
        <h2 className="mt-5 font-display text-4xl font-medium tracking-[-0.02em] sm:text-5xl">
          Một nền tảng, nhiều quy mô cửa hàng.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#756A64]">
          Mức giá bên dưới đang dùng cho bản minh họa và sẽ được xác nhận trước khi phát hành thương mại.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className="group flex min-h-[25rem] flex-col border border-[#E8DFD8] bg-[#FFFDFC] p-7 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#C79A97] hover:bg-[#ECDAD8]/45 sm:p-8"
          >
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl font-medium italic">{plan.name}</h3>
                {plan.featured && <span className="text-[10px] uppercase tracking-[0.16em] text-[#713F4B]">Khởi đầu</span>}
              </div>
              <p className="mt-3 text-xs leading-5 text-[#756A64]">{plan.description}</p>
              <p className="mt-8 text-2xl font-semibold tracking-tight text-[#302824]">
                {plan.price} <span className="text-xs font-normal text-[#756A64]">/ {plan.cadence}</span>
              </p>
              <ul className="mt-8 space-y-3 border-t border-[#E8DFD8] pt-6 text-xs text-[#756A64]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="text-[#C79A97]">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={onOpenCreateShop}
              className="mt-auto w-full border border-[#713F4B] px-5 py-3 text-xs font-medium text-[#713F4B] transition-colors group-hover:bg-[#713F4B] group-hover:text-white hover:!bg-[#5C303B]"
            >
              Chọn {plan.name}
            </button>
          </article>
        ))}
      </div>
    </section>

    <footer className="border-t border-[#493A36] bg-[#302824] py-12 text-[#FCF9F5]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end">
        <div>
          <p className="font-display text-3xl font-medium italic">DịpXinh</p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-white/55">
            Vận hành chỉn chu cho những cửa hàng trân trọng từng bộ trang phục.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/50">
          <span>© 2026 DịpXinh</span>
          <span>Chính sách bảo mật</span>
          <span>Điều khoản dịch vụ</span>
        </div>
      </div>
    </footer>
  </div>
);
