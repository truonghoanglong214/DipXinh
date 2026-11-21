# DịpXinh Design System Specification
**Phiên bản:** 1.0.0  
**Tác giả:** Senior SaaS Product Designer & React UI Engineer  
**Lĩnh vực:** Nền tảng SaaS Quản lý & Vận hành Thời trang Hiện đại (Atelier Rental & Retail)  
**Định hướng thẩm mỹ:** Thanh lịch (Elegant), Tối giản (Minimalist), Cao cấp (Luxe), Chú trọng công năng (Functional)

---

## 1. Tầm Nhìn Thiết Kế & Triết Lý Cốt Lõi (Design Philosophy)

DịpXinh là nền tảng SaaS phục vụ các thương hiệu và xưởng may thời trang cao cấp (áo dài, đầm dạ hội, váy cưới, âu phục tiệc). Hệ thống thiết kế được xây dựng dựa trên 4 trụ cột:

1. **Phân cấp thị giác rõ ràng (Clear Visual Hierarchy):** Giao diện quản trị tập trung vào việc đọc nhanh số liệu, theo dõi trạng thái mã QR thực thể và đối soát cọc mà không bị phân tâm bởi các chi tiết trang trí thừa thãi.
2. **Kiểu chữ tinh tế (Refined Typography):** Phối hợp hài hòa giữa kiểu chữ có chân sang trọng (*Cormorant Garamond*) cho các điểm chạm biên tập/tiêu đề và kiểu chữ không chân tối ưu (*Be Vietnam Pro*) cho bảng biểu, trường nhập liệu và nhãn trạng thái.
3. **Nền tảng màu sắc trung tính cao cấp (Warm Luxury Neutrals):** Sử dụng các gam màu canvas ấm áp (#FCF9F5, #FFFDFC, #E8DFD8) cùng sắc mực nâu đen (#302824) thay vì nền xám lạnh công nghiệp, tạo cảm giác sang trọng như chạm vào chất liệu vải lụa tự nhiên.
4. **Không lạm dụng trang trí:** Biểu tượng nét mảnh (stroke 1.5px), góc bo vừa phải (radius 6px - 8px), bóng mờ kín đáo, tôn vinh hình ảnh và chất liệu trang phục của khách hàng.

---

## 2. Nguyên Tắc Cô Lập Nhận Diện Thương Hiệu (Tenant Branding Isolation)

> [!IMPORTANT]
> **Yêu cầu sống còn:** Nền tảng KHÔNG gắn cứng (hardcode) màu sắc hay nhận diện thương hiệu của một cửa hàng cụ thể vào mã nguồn giao diện chung. Giao diện phải hỗ trợ cấu hình nhận diện động cho từng cửa hàng trong các giai đoạn phát triển tiếp theo.

### Cơ Chế Kỹ Thuật (Architecture)
Hệ thống sử dụng **CSS Custom Properties** trừu tượng hóa toàn bộ màu nhấn (*Primary Brand Accent*):
- `--dx-primary`: Màu chủ đạo của cửa hàng / nền tảng (mặc định: DịpXinh Wine `#713F4B`).
- `--dx-primary-hover`: Màu khi di chuột (`#5C303B`).
- `--dx-primary-soft`: Màu nền nhạt (10-15% tint) dùng cho Badge, Highlight, Selection (`#ECDAD8`).
- `--dx-primary-foreground`: Màu chữ tương phản trên nền primary (`#FFFFFF`).
- `--dx-ring`: Màu viền focus accessibility.

Thông qua component `<ThemeProvider>`, bất kỳ cửa hàng nào khi tải cấu hình nhận diện (ví dụ `shop.accentColor = '#235347'`) thì toàn bộ nút bấm, tab điều hướng, nhãn trạng thái và focus ring sẽ tự động biến đổi tức thì mà **không cần sửa một dòng mã nguồn nào của các component giao diện**.

### Bảng Màu Thương Hiệu Tiêu Biểu (Presets Sẵn Có)
| Tên Cấu Hình | Mã Màu Primary | Ý Nghĩa / Định Hướng |
| :--- | :---: | :--- |
| **DịpXinh Atelier (Mặc định)** | `#713F4B` | Rượu vang trầm & lụa cổ điển, đặc trưng thời trang cao cấp. |
| **Ngọc Lục Bảo (Imperial Emerald)** | `#235347` | Hoàng gia, quý phái, phù hợp áo dài & trang sức dạ hội. |
| **Lam Đêm (Midnight Sapphire)** | `#1E3A5F` | Hiện đại, sắc sảo, thích hợp âu phục & đầm tiệc dạ quang. |
| **Đất Nung Tây Âu (Terracotta Chic)** | `#A34836` | Ấm áp, nghệ thuật, gợi cảm hứng may đo thủ công haute couture. |
| **Hắc Sắc Tối Giản (Noir Luxe)** | `#18181B` | Đen carbon nguyên bản, công năng thuần khiết và sắc sảo. |

---

## 3. Hệ Thống 13 Nhóm Thành Phần Chuẩn

### 3.1. Các Mã Màu (Color Tokens)
*Được định nghĩa tại `src/shared/components/ui/theme/tokens.ts` và tích hợp trong Tailwind CSS v4 `@theme` (`src/styles/globals.css`).*

- **Canvas & Surface (Nền):**
  - `--color-canvas` (`#FCF9F5`): Nền tổng thể trang, tạo cảm giác ấm áp và dịu mắt.
  - `--color-surface` (`#FFFDFC`): Nền thẻ thông tin (Card), modal, bảng biểu.
  - `--color-surface-subtle` (`#F7F2EC`): Nền phụ cho header bảng, vùng nhập liệu disabled.
  - `--color-border-default` (`#E8DFD8`): Đường viền phân cách mỏng, tinh tế.
- **Ink Typography (Mực in):**
  - `--color-ink` (`#302824`): Màu chữ chính, tương phản cao trên nền canvas (tỉ lệ > 9:1).
  - `--color-ink-muted` (`#756A64`): Màu chữ phụ, mô tả ngắn, tiêu đề cột.
  - `--color-ink-subtle` (`#A89F99`): Placeholder, văn bản vô hiệu hóa.
- **Trạng thái vận hành (Operational Status Tokens):**
  - **Success:** Chữ `#1E5844` / Nền `#EAF5F0` / Viền `#BFE3D4` (Sẵn sàng, đã duyệt cọc, hoàn tất).
  - **Warning:** Chữ `#7C4E10` / Nền `#FDF6EC` / Viền `#F2D7B2` (Đang giữ chỗ, chờ thanh toán, cần chú ý).
  - **Danger:** Chữ `#8B2E2E` / Nền `#FCEFEF` / Viền `#F5C9C9` (Hỏng hóc, quá hạn trả, hủy đơn).
  - **Info:** Chữ `#29546B` / Nền `#EBF3F8` / Viền `#BFD9E8` (Đang hấp sấy, lịch hẹn mới, thông báo).
  - **Neutral:** Chữ `#554C47` / Nền `#F2EDE8` / Viền `#DDD5CD` (Lưu kho, kích thước, thẻ tag).

---

### 3.2. Kiểu Chữ (Typography)
- **Display Serif:** `"Playfair Display", "Cormorant Garamond", Georgia, serif`
  - Dùng cho: Tiêu đề nghệ thuật cao cấp (`Display 1`, `Display 2`), cụm phụ đề tiếng Anh mang hơi thở thời trang atelier, nhãn dẫn nghệ thuật (`.editorial-kicker`).
- **Interface Sans:** `"Be Vietnam Pro", -apple-system, sans-serif`
  - Dùng cho: Tiêu đề giao diện chính, thẻ điều hướng, nhãn biểu mẫu, nội dung bảng, nút bấm, thông báo. Đảm bảo hỗ trợ hiển thị dấu tiếng Việt sắc nét, không bị lỗi gãy khoảng cách dấu như các font serif thông thường.
- **Tabular Numbers (`.tabular-nums`):**
  - Bắt buộc áp dụng cho toàn bộ số liệu: giá thuê, tiền cọc, số lượng tồn kho, ngày giờ thuê/trả để các con số thẳng hàng hoàn hảo khi hiển thị theo cột.

---

### 3.3. Khoảng Cách & Bố Cục (Spacing & Layout)
- **Hệ lưới căn bản:** Thước đo 4px / 8px (`space-1`: 4px, `space-2`: 8px, `space-3`: 12px, `space-4`: 16px, `space-6`: 24px, `space-8`: 32px, `space-12`: 48px).
- **Thẻ Card & Khối nội dung:** Padding 16px - 24px trên mobile, 24px - 32px trên desktop.
- **Bố cục Studio 2 cột đối xứng:** Gom nhóm các thành phần tương tác liên quan theo cặp (Nút bấm song song Nhãn trạng thái; Biểu mẫu song song Bộ chọn; Bảng dữ liệu song song Hộp thoại) giúp tiết kiệm chiều cao màn hình và tạo nhịp điệu thị giác sang trọng.
- **Bán kính góc bo (Border Radius):**
  - Nhỏ (`sm`: 4px): Badge, icon button nhỏ.
  - Vừa (`md`: 6px): Nút bấm nhỏ, input compact.
  - Chuẩn (`lg`: 8px): Nút bấm chính, input tiêu chuẩn, thẻ card.
  - Lớn (`xl`: 12px): Hộp thoại Modal, Dialog.

---

### 3.4. Các Nút Bấm (Buttons)
*Vị trí tệp: `src/shared/components/ui/buttons/Button.tsx`*

- **Biến thể (Variants):**
  - `primary`: Nền `--dx-primary`, chữ trắng, dùng cho tác vụ chính (Tạo đơn, Duyệt cọc, Lưu).
  - `secondary`: Nền bề mặt nhẹ, viền mảnh, dùng cho tác vụ thứ cấp.
  - `outline`: Nền trong suốt, viền mảnh, dùng cho tác vụ xem xét hoặc hủy nhẹ.
  - `ghost`: Trong suốt hoàn toàn, xuất hiện nền nhẹ khi di chuột.
  - `destructive`: Nền đỏ rượu vang sẫm (`#8B2E2E`), sang trọng và đồng bộ với bảng màu thời trang, không dùng đỏ tươi chói gắt.
  - `link`: Chữ primary gạch chân nhẹ, dùng cho điều hướng inline.
- **Kích cỡ:** `sm` (h-8), `md` (h-10), `lg` (h-11), `icon` (10x10), `iconSm` (8x8).
- **Trạng thái:** Tích hợp `isLoading` (hiển thị spinner SVG tự động khóa click) và `disabled`.

---

### 3.5. Trường Nhập Liệu & Biểu Mẫu (Input & Form Fields)
*Vị trí tệp: `src/shared/components/ui/inputs/`*

- **`Input` & `Textarea`:** Hỗ trợ biểu tượng trái/phải (`leftIcon`, `rightIcon`), viền focus 2px màu `--dx-ring`, trạng thái lỗi (`isError`) đổi viền đỏ và focus đỏ.
- **`Label`:** Tự động hiển thị dấu sao đỏ `*` khi khai báo thuộc tính `required`.
- **`FormField`:** Bọc toàn diện nhãn, input, mô tả hướng dẫn (`helperText`) và thông báo lỗi (`errorMessage`). Tự động liên kết thuộc tính truy cập `aria-invalid` và `aria-describedby`.

---

### 3.6. Thành Phần Chọn & Menu Thả Xuống (Select & Dropdown)
*Vị trí tệp: `src/shared/components/ui/select/Select.tsx` & `dropdown/DropdownMenu.tsx`*

- **`Select`:** Tùy biến kiểu dáng thanh lịch với mũi tên chevron gọn gàng, viền đổi màu mượt mà.
- **`DropdownMenu`:** Menu popover nổi dùng cho danh sách tác vụ (Xem chi tiết, Chỉnh sửa, Đường phân cách, Xóa).
  - Tự động đóng khi nhấn phím `Escape` hoặc nhấp chuột ra ngoài màn hình.
  - Hỗ trợ căn lề `align="left"` hoặc `align="right"`.

---

### 3.7. Hộp Thoại & Xác Nhận (Dialog & Confirmation)
*Vị trí tệp: `src/shared/components/ui/dialog/Dialog.tsx` & `ConfirmDialog.tsx`*

- **`Dialog`:** Render qua React Portal tại `document.body`. Có nền mờ (`backdrop-blur-xs`), hiệu ứng xuất hiện mượt mà, hỗ trợ đóng qua nút X, phím `Esc` và nhấp vào nền đen.
- **`ConfirmDialog`:** Hộp thoại chuyên dụng xác nhận hành động nguy hiểm hoặc quan trọng:
  - `variant="danger"`: Xác nhận hủy đơn thuê, thanh lý trang phục.
  - `variant="warning"`: Cảnh báo dời lịch hẹn, đổi số đo may.
  - `variant="primary"`: Xác nhận duyệt đơn và giữ chỗ mã QR.

---

### 3.8. Bảng Dữ Liệu & Phân Trang (Tables & Pagination)
*Vị trí tệp: `src/shared/components/ui/table/Table.tsx` & `Pagination.tsx`*

- **`Table`:** Thiết kế tối ưu cho SaaS:
  - Header nền taupe nhạt, chữ hoa nhỏ gọn gàng.
  - Dòng dữ liệu nổi bật nhẹ khi di chuột (`hover:bg-surface-subtle/70`).
  - Container cuộn ngang tự động (`overflow-x-auto`) không làm vỡ giao diện trên di động.
  - Số liệu hiển thị dưới dạng `.tabular-nums`.
- **`Pagination`:** Điều hướng trang thông minh:
  - Nút "Trước" / "Sau" kèm icon.
  - Rút gọn danh sách trang bằng dấu chấm lửng (`...`) khi có nhiều trang.
  - Hiển thị tóm tắt: *"Hiển thị 1 - 10 trên 45 kết quả"*.

---

### 3.9. Các Nhãn Trạng Thái (Status Badges)
*Vị trí tệp: `src/shared/components/ui/badge/Badge.tsx`*

- **Hệ thống nhãn vòng đời trang phục cho thuê:**
  - `READY` (Sẵn sàng): Tone `success`, nền ngọc bích nhạt.
  - `HELD` (Đang giữ chỗ): Tone `warning`, nền hổ phách nhạt.
  - `RENTED` (Đang cho thuê): Tone `primary`, nền tone thương hiệu soft.
  - `WASHING` (Đang hấp sấy): Tone `info`, nền lam thanh nhạt.
  - `MAINTENANCE` (Cần bảo dưỡng): Tone `danger`, nền cánh sen trầm.
- **Phong cách hiển thị:**
  - `soft` (Khuyên dùng): Nền màu nhạt dịu mắt, chữ màu sẫm tương phản cao.
  - `solid`: Nền đậm, chữ trắng.
  - `outline`: Viền nét mảnh, nền trong suốt.
  - `withDot`: Hiển thị chấm tròn trạng thái tinh tế.

---

### 3.10. Thông Báo Dạng Toast (Toast Notifications)
*Vị trí tệp: `src/shared/components/ui/toast/ToastProvider.tsx` & `useToast.ts`*

- Hoàn toàn tự phát triển, không phụ thuộc thư viện nặng bên ngoài.
- 4 loại thông báo: `success`, `error`, `warning`, `info`.
- Tự động đóng sau 4 giây (có thể tùy chỉnh qua `duration`).
- Vị trí hiển thị: Góc dưới bên phải màn hình (`bottom-4 right-4`), không che khuất thanh menu hay nội dung chính.
- Khả năng tiếp cận: Khai báo `role="status"` và `aria-live="polite"` để phần mềm đọc màn hình thông báo chính xác.

---

### 3.11. Các Trạng Thái Tải, Trống & Lỗi (Loading, Empty, Error)
*Vị trí tệp: `src/shared/components/ui/feedback/`*

- **`Skeleton`:** Khung hình giữ chỗ dạng sóng xung động ánh sáng (`animate-pulse`) với 3 kiểu dáng (`rectangular`, `rounded`, `circular`).
- **`LoadingState`:** Vòng xoay thanh lịch mảnh mai với màu `primary` và thông điệp vận hành.
- **`EmptyState`:** Khung viền đứt đoạn nhẹ nhàng, biểu tượng mở hộp thời trang, tiêu đề cảm xúc và nút kêu gọi hành động (CTA).
- **`ErrorState`:** Hai chế độ hiển thị (dạng thanh Alert gọn nhẹ hoặc dạng Card lớn đầy đủ) kèm nút "Thử tải lại" (`onRetry`).

---

### 3.12. Khả Năng Hiển Thị Linh Hoạt (Responsive Behavior)
- **Quy chuẩn Breakpoints:**
  - `sm`: 640px (Điện thoại nằm ngang, máy tính bảng nhỏ).
  - `md`: 768px (Máy tính bảng, iPad).
  - `lg`: 1024px (Laptop thông dụng).
  - `xl`: 1280px (Màn hình lớn).
- **Vùng chạm cảm ứng (Touch Targets):** Chiều cao tối thiểu của nút bấm và input là 40px trên màn hình cảm ứng để tránh bấm nhầm.
- **Bảng biểu phức tạp:** Bọc trong container có thanh cuộn ngang mượt mà, tiêu đề cố định hoặc thẻ gập trên điện thoại.

---

### 3.13. Trạng Thái Focus & Khả Năng Truy Cập (Keyboard Accessibility)
- **Quy chuẩn viền Focus:** Toàn bộ thành phần tương tác đều có `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary` rõ ràng. Không bao giờ tắt viền focus khi người dùng thao tác bằng phím Tab.
- **Phím tắt điều hướng:**
  - Phím `Tab` & `Shift + Tab`: Di chuyển tuần tự qua các trường tương tác.
  - Phím `Enter` & `Space`: Kích hoạt nút bấm, mở dropdown menu.
  - Phím `Escape`: Đóng hộp thoại Modal, đóng menu thả xuống ngay lập tức.
- **Chuẩn màu tiếp cận (WCAG 2.1 AA):** Màu chữ `ink` trên nền `canvas` đạt tỉ lệ tương phản trên 9:1, vượt xa yêu cầu tối thiểu 4.5:1 của WCAG.

---

## 4. Hướng Dẫn Sử Dụng Trong Mã Nguồn (Developer Quickstart)

Toàn bộ thành phần được xuất từ một điểm truy cập duy nhất:
```tsx
import {
  Button,
  Input,
  FormField,
  Select,
  DropdownMenu,
  Dialog,
  ConfirmDialog,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Pagination,
  Badge,
  useToast,
  LoadingState,
  Skeleton,
  EmptyState,
  ErrorState,
} from '@/shared/components/ui';
```

### Ví dụ Tạo Biểu Mẫu Nhập Liệu Chuẩn:
```tsx
<FormField
  label="Tên Trang Phục"
  required
  helperText="Nhập tên trang phục chính thức hiển thị trên bộ sưu tập"
  errorMessage={errors.title}
>
  <Input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Đầm dạ hội ánh kim..."
  />
</FormField>
```

### Ví dụ Sử Dụng Toast & ConfirmDialog:
```tsx
const { toast } = useToast();
const [isConfirmOpen, setIsConfirmOpen] = useState(false);

const handleApprove = () => {
  setIsConfirmOpen(false);
  toast.success('Đã duyệt đơn và khóa mã QR thực thể!');
};

return (
  <>
    <Button onClick={() => setIsConfirmOpen(true)}>Duyệt Đơn Thuê</Button>
    <ConfirmDialog
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      onConfirm={handleApprove}
      title="Duyệt đơn thuê #DX-1002?"
      description="Mã QR thực thể sẽ được chuyển sang trạng thái GIỮ CHỖ và đếm ngược cọc."
    />
  </>
);
```

---

## 5. Trải Nghiệm Thực Tế Tại UI Showcase

Hệ thống thiết kế đã được tích hợp hoàn chỉnh và có thể đánh giá trực quan ngay trên giao diện ứng dụng:
1. Mở ứng dụng DịpXinh tại trình duyệt.
2. Trên thanh điều hướng đầu trang (`AppHeader`), nhấp vào mục **"UI Showcase"**.
3. Tại đây, bạn có thể:
   - Thử nghiệm chuyển đổi tức thì giữa các bảng màu thương hiệu khác nhau (Atelier Burgundy, Imperial Emerald, Midnight Sapphire, Noir Luxe, hoặc mã HEX tùy chọn).
   - Kiểm tra tất cả các nút bấm, trạng thái loading, lỗi biểu mẫu.
   - Bấm kích hoạt các loại thông báo Toast thực tế.
   - Mở các hộp thoại Modal và xác nhận ConfirmDialog.
   - Tương tác với bảng phân trang và các trạng thái phản hồi (Skeleton, Empty, Error).

---

## 6. Kiến Trúc 3 Bố Cục Ứng Dụng Độc Lập (Three Separate Application Layouts)

Nhằm đảm bảo phân định rõ ràng giữa khách hàng trải nghiệm mua sắm, chủ shop vận hành cửa hàng thời trang và ban điều hành nền tảng SaaS, hệ thống phân chia thành 3 bố cục hoàn toàn độc lập:

### 6.1. Bố Cục Cửa Hàng Khách Hàng (Customer Storefront Layout)
- **Tuyến đường:** `/shop/:slug/*` (Tệp: `src/app/layouts/StorefrontLayout.tsx`)
- **Đặc điểm & Cấu trúc:**
  1. **Thanh tiện ích đầu trang (Utility Announcement Bar):** Hiển thị địa chỉ thực thể, giờ mở cửa xưởng, hotline và nhãn cam kết thử đồ trực tiếp.
  2. **Thanh điều hướng chính (Storefront Header):** Logo/ký tự viết tắt của xưởng may, tên cửa hàng, thanh tìm kiếm mẫu mã, nút đặt lịch thử đồ và giỏ đồ thuê (Rental Cart Indicator).
  3. **Khu vực nhận diện xưởng (Shop Branding Area):** Sử dụng dải màu gradient vi mô hòa sắc với `--dx-primary` của chính xưởng may (`shop.accentColor`), huy hiệu định danh QR từng sản phẩm thực thể, và thẻ chứng thực tiêu chuẩn phục vụ (hấp sấy diệt khuẩn, hoàn cọc nhanh).
  4. **Thanh danh mục sản phẩm dính (Sticky Product Navigation Bar):** Neo ở đỉnh khi cuộn trang, chia theo các dòng thời trang đặc thù: *Tất cả trang phục, Áo Dài Cung Đình, Đầm Dạ Hội Cao Cấp, Váy Cưới Atelier, Âu Phục & Veston*.
  5. **Vùng nội dung chính (Content Container):** `<Outlet context={{ shop }} />` mở rộng linh hoạt theo dữ liệu sản phẩm.
  6. **Chân trang cửa hàng (Storefront Footer):** Thông tin pháp lý, giờ phục vụ, chính sách bảo quản và cọc đồ, cùng nhãn bảo chứng vận hành "Powered by DịpXinh Platform".
  7. **Thanh điều hướng di động (Fixed Mobile Navigation Bar):** Neo đáy màn hình với 4 điểm chạm ngón tay cái: *Cửa hàng, Danh mục, Hotline, Túi đồ*.

### 6.2. Bố Cục Trang Quản Trị Cửa Hàng (Shop Dashboard Layout)
- **Tuyến đường:** `/dashboard/:shopSlug/*` (Tệp: `src/app/layouts/ShopDashboardLayout.tsx`)
- **Đặc điểm & Cấu trúc:**
  1. **Thanh bên điều hướng (Collapsible Sidebar):**
     - Logo xưởng may và bộ chọn chuyển đổi nhanh giữa các cửa hàng (Shop Switcher).
     - Danh sách 7 phân hệ cốt lõi: *Tổng quan, Kho & Mã QR thực thể, Đơn thuê & Giữ chỗ, Thu chi & Đối soát cọc, Lịch thử đồ, Nhân sự & Ca làm, Cài đặt cửa hàng*.
     - Thẻ thông báo hạn mức gói dịch vụ (Plan Quota Card): Ví dụ `Gói: TRIAL (35/50 QR đã tạo, 14 ngày dùng thử)` kèm nút nâng cấp.
     - Nút xem trước cửa hàng công khai (Xem Storefront).
  2. **Thanh tiêu đề quản trị (Dashboard Header):**
     - Nút mở menu trên thiết bị di động (Mobile Drawer Trigger).
     - Đường dẫn điều hướng động (Dynamic Breadcrumb Trail).
     - Khối thông tin cửa hàng hiện hành (Persistent Shop Context Pill) hiển thị tên xưởng may và mã nhận diện.
     - Bộ chuyển đổi vai trò nhân sự thử nghiệm (*Chủ Cửa Hàng, Quản Lý Cửa Hàng, Thu Ngân / Nhân Viên, Quản Trị Nền Tảng*).
  3. **Vùng nội dung quản trị (Content Area):**
     - Bảng tin KPI vận hành với font chữ số `tabular-nums`.
     - Bảng đơn thuê mới nhất có badge trạng thái và định dạng ngày tháng tiếng Việt `DD/MM/YYYY`.

### 6.3. Bố Cục Quản Trị Nền Tảng Toàn Cục (Platform Administration Layout)
- **Tuyến đường:** `/platform/*` (và đường dẫn chuyển hướng tương thích `/admin/*`) (Tệp: `src/app/layouts/PlatformAdminLayout.tsx`)
- **Đặc điểm & Cấu trúc:**
  1. **Phong cách Dark Carbon tách biệt hoàn toàn:** Sử dụng tone nền than chì đen tối giản (`#18181B`, viền `#27272A`), thể hiện tính thẩm quyền cao và không bị nhầm lẫn với giao diện ấm áp của xưởng may thời trang.
  2. **Thanh điều hướng nền tảng (Platform Navigation - Chuẩn F04):**
     - Tổng quan SaaS (`/platform`)
     - Quản lý Xưởng / Cửa hàng (`/platform/shops`)
     - Gói Dịch vụ & Hạn mức Quota (`/platform/plans`)
     - Đăng ký Thuê bao SaaS (`/platform/subscriptions`)
     - Hóa đơn Nền tảng (`/platform/invoices`)
     - Sự kiện Outbox & Đồng bộ (`/platform/system`)
  3. **Thanh kiểm soát bảo mật:** Huy hiệu nhận diện `PLATFORM_ADMIN` và nút mô phỏng trạng thái tải dữ liệu (`LoadingState`) hoặc lỗi kết nối máy chủ (`ErrorState`).
  4. **Bộ bảo vệ quyền truy cập (PlatformRoleGuard & AccessDeniedPage):**
     - Tệp `PlatformRoleGuard.tsx` kiểm tra vai trò hiện hành. Nếu người dùng mang vai trò cửa hàng (`SHOP_OWNER`, `SHOP_STAFF`...), hệ thống sẽ lập tức hiển thị trang từ chối quyền truy cập 403 chuyên biệt (`AccessDeniedPage.tsx`).
     - Trang 403 giải thích rõ ranh giới bảo mật giữa dữ liệu đa người thuê (Multi-tenant) và quyền quản trị SaaS toàn cục, kèm phím quay lại Dashboard cửa hàng an toàn.

---

## 7. Nguyên Tắc Bảo Mật & Ranh Giới Kiến Trúc

1. **Tách biệt tuyệt đối Public & Protected Layouts:**
   - Khách xem hàng tại `/shop/:slug` không tải bất kỳ mã nguồn thanh bên hay công cụ quản trị nội bộ nào.
   - Giao diện Admin Platform không tái sử dụng layout hay ngữ cảnh của Shop Dashboard.
2. **"Frontend Visibility Is Not Backend Security":**
   - Các Route Guard và vai trò hiển thị trên frontend đóng vai trò tối ưu trải nghiệm người dùng (UX routing, ẩn nút tác vụ không thuộc thẩm quyền).
   - Toàn bộ hành động tác động dữ liệu (tạo mã QR, duyệt cọc, sửa giá, nâng gói) đều được máy chủ backend xác thực JWT và kiểm tra quyền hạn cấp API độc lập.
3. **Sử dụng Placeholder có cấu trúc:**
   - Các trang con chưa hoàn thiện nghiệp vụ chi tiết được bao bọc trong component chuẩn `DashboardSubpagePlaceholder` hoặc `PlatformSubpagePlaceholder`, có icon và mô tả rõ ràng, không tạo mã nguồn giả lập dư thừa.

