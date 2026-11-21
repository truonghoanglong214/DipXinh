# DANH MỤC NHIỆM VỤ FRONTEND CHI TIẾT (FRONTEND TASK BACKLOG)
## Dự án: Dịp Xinh — Nền tảng SaaS Quản lý & Cho thuê Thời trang
**Tài liệu:** `docs/frontend-planning/04_FRONTEND_TASK_BACKLOG.md`  
**Phiên bản:** 1.0 | **Ngày lập:** 08/11/2026  
**Quy chuẩn áp dụng:** 63 Nhiệm vụ chuẩn Handbook v3.1 (`F01-F05`) + 12 Nhiệm vụ bổ trợ kỹ thuật (`SUP-F01-F12`) + Gói mở rộng AI (`A01/A02`)

---

## 1. QUY CHUẨN ĐỊNH DẠNG TASK (TASK SPECIFICATION SCHEMA)

Mỗi nhiệm vụ trong backlog được chuẩn hóa theo 13 trường dữ liệu bắt buộc:
1. **Task ID:** Mã định danh chính thức theo Handbook (`Fxx-xx`) hoặc mã bổ trợ (`SUP-Fxx`).
2. **Task Name & Module:** Tên nhiệm vụ tiếng Việt & Phân hệ quản lý.
3. **Status:** `Todo` | `In Progress` | `Mock Complete` | `Blocked` | `Done`.
4. **Priority:** `P0` (Bắt buộc cho MVP/Core), `P1` (Quan trọng cao), `P2` (Tiện ích chuẩn), `P3` (Hậu phát hành).
5. **Phase & Vertical Slice:** Phase mapping (Phase 0-10) và Vertical Slice (`VS00`-`VS13`).
6. **Routes & Scope:** Đường dẫn URL trình duyệt và phạm vi ảnh hưởng.
7. **Components:** Danh sách components hiện có hoặc cần xây dựng mới.
8. **Prerequisites & Dependencies:** Task phụ thuộc trước đó và trạng thái Backend API.
9. **API Contract Target:** Phương thức HTTP, Endpoint, Payload/DTO chính.
10. **Mock Strategy:** Chiến lược mock dữ liệu độc lập khi backend chưa hoàn thành.
11. **Design System & Taste:** Hướng dẫn thẩm mỹ, token màu, typography và spacing.
12. **GSAP & Motion Rule:** Có/Không sử dụng GSAP, chỉ số micro-interaction, yêu cầu accessibility.
13. **Definition of Done (DoD):** Tiêu chí kiểm thử, loại bỏ mock, typecheck, review giao diện.

---

## 2. MA TRẬN TỔNG HỢP TOÀN BỘ BACKLOG (MASTER SUMMARY TABLE)

| Task ID | Tên nhiệm vụ | Phân hệ | Phase | Priority | Trạng thái hiện tại | Phụ thuộc BE |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `F01-01` | Cấu hình Tailwind CSS & Dynamic CSS Variables | Foundation | P0 | P0 | **Done** | Không |
| `F01-02` | Tích hợp Typography Tiếng Việt (Be Vietnam Pro) | Foundation | P0 | P0 | **Done** | Không |
| `F01-03` | Xây dựng Base Components Primitives | Foundation | P0 | P0 | **Done** | Không |
| `F01-04` | Xây dựng Feedback & Overlay Components | Foundation | P0 | P0 | **Done** | Không |
| `F01-05` | Xây dựng Data Display Primitives (Table/State) | Foundation | P0 | P0 | **Done** | Không |
| `F01-06` | Xây dựng Shell & Layout Containers | Foundation | P0 | P0 | **Done** | Không |
| `F01-07` | HTTP Client, Interceptors & Refresh Token | Foundation | P0 | P0 | **Done** | `B01-01` |
| `F01-08` | Global Error Boundary & HTTP Error Pages | Foundation | P0 | P1 | **Done** | Không |
| `F01-09` | Form Đăng nhập & Đăng ký Shop Owner | Shared Auth | P1 | P0 | **Done** | `B01-01` |
| `F01-10` | Quản lý vòng đời Auth Token (Zustand In-memory) | Shared Auth | P1 | P0 | **Done** | `B01-01` |
| `F01-11` | Phân quyền RBAC & Route Guards | Shared Auth | P1 | P0 | **Done** | `B01-01` |
| `F01-12` | Multi-tenant Shop Selector & Context Provider | Shared Auth | P1 | P0 | **Done** | `B01-02` |
| `SUP-F01`| Thiết lập Mock Service Worker (MSW) Contracts | Foundation | P0 | P1 | Todo | Không |
| `SUP-F02`| GSAP Utility Registry & prefers-reduced-motion | Foundation | P0 | P1 | **Done** | Không |
| `SUP-F03`| Customer Social Login & OTP Verification | Shared Auth | P1 | P2 | Todo | `B01-03` |
| `F02-01` | Shop Dashboard Home & Real-time Operations | Dashboard | P8 | P0 | **Mock Complete** | `B03-02`, `B10-01` |
| `F02-02` | Quản lý danh mục sản phẩm (Product Catalog) | Dashboard | P2 | P0 | **Done** | `B03-01` |
| `F02-03` | Form tạo/sửa sản phẩm & Ma trận biến thể | Dashboard | P2 | P0 | **Done** | `B03-01` |
| `F02-04` | Quản lý Serialized Rental Units & Vòng đời | Dashboard | P2 | P0 | **Done** | `B03-02` |
| `F02-05` | Sinh nhãn in QR Code & Modal in hàng loạt | Dashboard | P2 | P1 | **Done** | `B03-03` |
| `F02-06` | Cấu hình chính sách cho thuê & Tiền cọc | Dashboard | P3 | P1 | **Done** | `B04-01` |
| `F02-07` | Lịch trực quan kiểm tra khả dụng (Availability) | Dashboard | P3 | P0 | **Done** | `B04-02` |
| `F02-08` | Tạo đơn tại quầy siêu tốc (Fast Walk-in POS) | Dashboard | P5 | P0 | **Mock Complete** | `B07-01` |
| `F02-09` | Lịch hẹn thử đồ phòng fitting & Điều phối | Dashboard | P6 | P1 | Todo | `B07-02` |
| `F02-10` | Danh sách xử lý đơn & Pipeline vận hành | Dashboard | P7 | P0 | Todo | `B08-01` |
| `F02-11` | Modal quy trình bàn giao đồ & Quét QR xác nhận | Dashboard | P7 | P0 | Todo | `B08-02` |
| `F02-12` | Giao diện thu hồi & Biên bản kiểm định hư hại | Dashboard | P7 | P0 | Todo | `B09-01` |
| `F02-13` | Tính toán tự động phụ phí trễ hạn & Đền bù | Dashboard | P7 | P0 | Todo | `B09-02` |
| `F02-14` | Xác nhận quyết toán & Hoàn cọc điện tử | Dashboard | P7 | P0 | Todo | `B09-03` |
| `F02-15` | Báo cáo doanh thu thuê & Bán lẻ chi tiết | Dashboard | P8 | P1 | Todo | `B10-01` |
| `F02-16` | Báo cáo hiệu suất lấp đầy trang phục | Dashboard | P8 | P2 | Todo | `B10-02` |
| `F02-17` | Quản lý nhân viên cửa hàng & Phân quyền | Dashboard | P8 | P1 | Todo | `B11-01` |
| `F02-18` | Trình tùy biến nhận diện thương hiệu Storefront | Dashboard | P8 | P1 | Todo | `B11-02` |
| `SUP-F04`| Tiện ích nén & Cắt ảnh trước khi tải lên MinIO | Dashboard | P2 | P2 | Todo | Không |
| `SUP-F05`| Bộ chọn ngày kiểm soát Buffer phục hồi đồ | Dashboard | P3 | P1 | **Done** | Không |
| `SUP-F08`| Drawer điều phối nhân viên & Sức chứa phòng thử | Dashboard | P6 | P2 | Todo | `B07-02` |
| `SUP-F09`| Camera / Hardware QR Scanner Module | Dashboard | P7 | P0 | Todo | Không |
| `F03-01` | Shell giao diện Storefront & Boutique Navigation | Storefront | P4 | P0 | **Done** | `B05-01` |
| `F03-02` | Hero Section thời trang & Bộ sưu tập gợi ý | Storefront | P4 | P0 | **Done** | `B05-01` |
| `F03-03` | Lưới sản phẩm & Bộ lọc đa chiều (Dịp, Size) | Storefront | P4 | P0 | **Done** | `B05-02` |
| `F03-04` | Card sản phẩm cao cấp (Huy hiệu Thuê/Mua) | Storefront | P4 | P0 | **Done** | `B05-02` |
| `F03-05` | Trang chi tiết sản phẩm (PDP) & Thư viện ảnh | Storefront | P4 | P0 | **Done** | `B05-03` |
| `F03-06` | Bộ chọn cấu hình thuê (Ngày nhận, Trả, Cọc) | Storefront | P4 | P0 | **Done** | `B05-03` |
| `F03-07` | Giỏ hàng trượt (Slide-over Cart Drawer) | Storefront | P4 | P0 | **Done** | `B05-04` |
| `F03-08` | Thông tin Boutique, Bảng size & Footer | Storefront | P4 | P1 | **Done** | `B05-01` |
| `F03-09` | Luồng đặt cọc & Thanh toán (Checkout Stepper) | Storefront | P5 | P0 | Todo | `B06-01` |
| `F03-10` | Bảng kê chi phí minh bạch (Thuê + Cọc) | Storefront | P5 | P0 | Todo | `B06-01` |
| `F03-11` | Trình ký hợp đồng cho thuê điện tử | Storefront | P5 | P0 | Todo | `B06-02` |
| `F03-12` | Trang xác nhận đơn & Trạng thái VietQR Live | Storefront | P5 | P0 | Todo | `B06-03` |
| `F03-13` | Widget đặt lịch thử đồ tại showroom | Storefront | P6 | P1 | Todo | `B07-02` |
| `F03-14` | Cổng thông tin tài khoản khách hàng cá nhân | Storefront | P8 | P2 | Todo | `B10-03` |
| `F03-15` | Tra cứu trạng thái đơn hàng & Quản lý cọc | Storefront | P8 | P2 | Todo | `B10-03` |
| `SUP-F06`| Modal xem nhanh sản phẩm (Quick View) | Storefront | P4 | P2 | **Done** | `B05-02` |
| `SUP-F07`| Modal thanh toán VietQR động kèm Polling | Storefront | P5 | P1 | Todo | `B06-03` |
| `SUP-F13`| Tái thiết kế Homepage & GSAP Featured Boutiques Showcase | Public Landing | P4 | P1 | **Done** | `B05-01` |
| `F04-01` | Shell giao diện Quản trị nền tảng (Platform) | Admin | P9 | P0 | **Done** | `B12-01` |
| `F04-02` | Dashboard Tổng quan Nền tảng & Chỉ số Tenant | Admin | P9 | P0 | Todo | `B12-01` |
| `F04-03` | Wizard Khởi tạo & Onboarding Shop mới | Admin / Auth | P1 | P0 | Todo | `B02-01` |
| `F04-04` | Quản lý vòng đời Shop (Phê duyệt, Tạm dừng) | Admin | P9 | P0 | Todo | `B12-02` |
| `F04-05` | Quản lý Gói cước SaaS & Phân bổ tính năng | Admin | P9 | P1 | Todo | `B13-01` |
| `F04-06` | Quản lý người dùng toàn sàn & Phân quyền Admin | Admin | P9 | P1 | Todo | `B12-03` |
| `F04-07` | Trình tra cứu Audit Logs hệ thống | Admin | P9 | P1 | Todo | `B13-02` |
| `F04-08` | Giám sát trạng thái & Tích hợp dịch vụ ngoại vi | Admin | P9 | P2 | Todo | `B13-03` |
| `SUP-F10`| Banner Impersonation & Đổi vai trò kiểm thử | Admin | P9 | P2 | Todo | `B12-01` |
| `F05-01` | Hồ sơ khách hàng & Lịch sử thuê chi tiết | Shared/User | P8 | P2 | Todo | `B10-03` |
| `F05-02` | Theo dõi số dư tiền cọc & Yêu cầu hoàn cọc | Shared/User | P8 | P2 | Todo | `B10-03` |
| `F05-03` | Quản lý & Hủy lịch hẹn thử đồ của khách | Shared/User | P8 | P2 | Todo | `B07-02` |
| `F05-04` | Trung tâm thông báo & Chuông báo vận hành | Dashboard | P8 | P1 | Todo | `B10-04` |
| `F05-05` | Tối ưu hóa giao diện di động cho Dashboard | Dashboard | P8 | P1 | **Done** | Không |
| `F05-06` | Trợ lý AI Styling Advisor (Chat Widget) | Post-launch | P10 | P3 | Todo | `AI-01` |
| `F05-07` | Khung phối đồ thông minh (Mix-and-Match Canvas)| Post-launch | P10 | P3 | Todo | `AI-01` |
| `F05-08` | Bảng dự báo nhu cầu & Tối ưu giá thuê AI | Post-launch | P10 | P3 | Todo | `AI-02` |
| `F05-09` | Cấu hình máy in tem nhãn nhiệt & Máy quét POS | Post-launch | P10 | P3 | Todo | Không |
| `F05-10` | Cơ chế Offline-first cho đơn bán lẻ tại quầy | Post-launch | P10 | P3 | Todo | Không |
| `SUP-F11`| Drag-and-drop Outfit Canvas Primitives | Post-launch | P10 | P3 | Todo | Không |
| `SUP-F12`| Trình điều khiển Web Serial / Bluetooth ESC/POS | Post-launch | P10 | P3 | Todo | Không |

---

## 3. CHI TIẾT TỪNG PHÂN HỆ VÀ NHIỆM VỤ (DETAILED TASK BREAKDOWN)

---

### PHÂN HỆ 1: FOUNDATION & SHARED AUTH (`F01-01` -> `F01-12`, `SUP-F01` -> `SUP-F03`)

#### `F01-07`: HTTP Client, Interceptors & Refresh Token Lifecycle
- **Phân hệ:** Foundation Core | **Priority:** `P0` | **Phase:** `PHASE-00` & `PHASE-01`
- **Routes:** Toàn bộ ứng dụng.
- **Components:** `src/shared/api/client.ts`, `src/shared/api/interceptors.ts`, `src/features/auth/stores/authStore.ts`.
- **Prerequisites & Backend:** `POST /api/v1/auth/refresh` (HttpOnly Cookie xoay vòng).
- **API Contract:**
  - Request Header: `Authorization: Bearer <accessToken>` (Lưu in-memory tại Zustand).
  - Response 401 Interception: Kích hoạt `single-flight` refresh request. Toàn bộ các request đồng thời khác đưa vào hàng đợi `failedQueue` và retry sau khi refresh thành công.
- **Mock Strategy:** Sử dụng mock handler kiểm tra timer 15 phút và giả lập cấp token mới.
- **GSAP & Taste:** Không áp dụng chuyển động.
- **Definition of Done (DoD):**
  - [ ] Không có Access Token lưu trong `localStorage` hay `sessionStorage`.
  - [ ] Kiểm thử luồng gửi 5 requests song song khi token hết hạn: chỉ có duy nhất 1 request `refresh` được phát đi, cả 5 requests đều retry thành công mà không bị logout.
  - [ ] Xử lý triệt để mã lỗi chuẩn Spring Boot RFC-7807 (`fieldErrors`).

#### `F01-09`: Form Đăng nhập & Đăng ký Shop Owner
- **Phân hệ:** Shared Auth | **Priority:** `P0` | **Phase:** `PHASE-01`
- **Routes:** `/auth/login`, `/auth/register`.
- **Components:** `LoginForm.tsx`, `RegisterOwnerForm.tsx`, `AuthLayout.tsx`, `PasswordStrengthMeter.tsx`.
- **Prerequisites & Backend:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register-owner`.
- **API Contract:**
  - Login Request: `{ email: string, password: string }`
  - Login Response: `{ accessToken: string, user: { id, email, fullName, role, shopIds } }`
- **Mock Strategy:** Fixture `mockAuthResponse` với 3 vai trò: Admin, Owner, Staff.
- **Design System & Taste:** Layout thanh lịch, chia 2 cột (Editorial Fashion Showcase bên trái, Form bên phải), font chữ Be Vietnam Pro sắc nét, input viền mỏng cao cấp.
- **GSAP:** GSAP Stagger Fade-in nhẹ nhàng (duration: 0.4s) khi form tải lần đầu.
- **DoD:** Form validation đầy đủ bằng Zod; hiển thị đúng lỗi từ Spring Boot (ví dụ: `Tài khoản hoặc mật khẩu không chính xác`).

#### `F01-11`: Phân quyền RBAC & Route Guards
- **Phân hệ:** Shared Auth | **Priority:** `P0` | **Phase:** `PHASE-01`
- **Components:** `ProtectedRoute.tsx`, `RoleGuard.tsx`, `TenantGuard.tsx`.
- **Routes:** Áp dụng bao bọc toàn bộ `/dashboard/:shopSlug/*` và `/admin/*`.
- **Prerequisites:** `F01-10`.
- **DoD:** 
  - Khách chưa đăng nhập vào `/dashboard/aurora-boutique` bị chuyển hướng về `/auth/login?redirect=...`.
  - User có role `ROLE_SHOP_STAFF` truy cập `/admin` bị chặn và hiển thị trang Access Denied (`/403`).
  - User truy cập shopSlug mà mình không thuộc quyền quản lý sẽ bị từ chối truy cập.

#### `F01-12`: Multi-tenant Shop Selector & Context Provider
- **Phân hệ:** Shared Auth | **Priority:** `P0` | **Phase:** `PHASE-01`
- **Routes:** `/dashboard/select-shop`.
- **Components:** `ShopSelectorModal.tsx`, `TenantContext.tsx`, `ShopCardItem.tsx`.
- **Prerequisites & Backend:** `GET /api/v1/me/shops`.
- **DoD:** Nếu chủ shop quản lý 3 cửa hàng khác nhau, hiển thị danh sách cho phép chọn shop để làm việc; lưu `currentShopId` vào Tenant Context.

---

### PHÂN HỆ 2: SHOP DASHBOARD & VẬN HÀNH (`F02-01` -> `F02-18`, `SUP-F04`, `SUP-F05`, `SUP-F08`, `SUP-F09`)

#### `F02-02` & `F02-03`: Quản lý Sản phẩm & Ma trận Biến thể
- **Phân hệ:** Shop Dashboard | **Priority:** `P0` | **Phase:** `PHASE-02`
- **Routes:** `/dashboard/:shopSlug/products`, `/dashboard/:shopSlug/products/new`, `/dashboard/:shopSlug/products/:id/edit`.
- **Components:** `ProductTable.tsx`, `ProductForm.tsx`, `VariantMatrixEditor.tsx`, `ImageUploader.tsx`.
- **Prerequisites & Backend:** `GET/POST/PUT /api/v1/shops/:shopId/products`.
- **API Contract:** DTO chứa `name`, `category`, `rentPrice3Days`, `retailPrice`, `depositRate`, `variants: [{ size, color, sku }]`.
- **Mock Strategy:** Fixture `mockCatalogProducts` đầy đủ trạng thái.
- **Design System:** Table phân cấp rõ ràng, Badge trạng thái (Đang kinh doanh, Hết hàng, Tạm ngừng), bộ lọc Dropdown chuẩn shadcn/ui.
- **GSAP:** Không dùng animation trên bảng dữ liệu để giữ tốc độ phản hồi bàn phím tối đa.
- **DoD:** Tạo được sản phẩm có tổ hợp Size (S, M, L) và Màu (Đỏ, Trắng), tự động sinh 6 hàng biến thể để nhập giá và kích thước.

#### `F02-04` & `F02-05`: Serialized Rental Units & In Nhãn QR
- **Phân hệ:** Shop Dashboard | **Priority:** `P0` | **Phase:** `PHASE-02`
- **Routes:** `/dashboard/:shopSlug/inventory/units`.
- **Components:** `SerializedUnitTable.tsx`, `UnitStatusBadge.tsx`, `BatchQrPrintModal.tsx`, `QrLabelPreview.tsx`.
- **Prerequisites & Backend:** `GET /api/v1/shops/:shopId/rental-units`, `POST /api/v1/shops/:shopId/rental-units/batch-qr`.
- **DoD:** 
  - Mỗi đơn vị váy có mã Serial QR độc nhất (VD: `DX-2026-AUR-0042`).
  - Hỗ trợ in nhãn trực tiếp qua lệnh in trình duyệt với CSS `@media print`, chuẩn kích thước tem tem 50mm x 30mm.

#### `F02-06` & `F02-07`: Chính sách Cho thuê & Lịch Khả dụng Trực quan
- **Phân hệ:** Shop Dashboard | **Priority:** `P0` | **Phase:** `PHASE-03`
- **Routes:** `/dashboard/:shopSlug/settings/rental-policies`, `/dashboard/:shopSlug/inventory/availability`.
- **Components:** `RentalPolicyForm.tsx`, `AvailabilityCalendar.tsx`, `TimelineInspector.tsx`.
- **Prerequisites & Backend:** `B04-01`, `B04-02`.
- **DoD:**
  - Trực quan hóa tiến trình cho thuê trên trục thời gian: Ngày chuẩn bị (T-1) -> Ngày nhận (T) -> Ngày thuê (T..T+2) -> Ngày trả (T+3) -> Ngày giặt ủi phục hồi (T+4).
  - Tự động khóa các ngày trong khoảng thời gian trên, ngăn chặn triệt để xung đột lịch.

#### `F02-08`: Tạo Đơn tại Quầy Siêu tốc (Walk-in Fast Order / POS)
- **Phân hệ:** Shop Dashboard | **Priority:** `P0` | **Phase:** `PHASE-05`
- **Routes:** Khởi chạy từ nút tác vụ nhanh trên Dashboard hoặc route `/dashboard/:shopSlug/pos`.
- **Components:** `WalkInRentalModal.tsx`, `QuickProductLookup.tsx`, `DepositCalculator.tsx`.
- **Prerequisites & Backend:** `POST /api/v1/shops/:shopId/orders/walk-in`.
- **Hiện trạng:** **Đã có Mock Component chạy tốt** (`WalkInRentalModal.tsx` tại Dashboard). Cần thay mock bằng API kết nối thực tế khi Backend sẵn sàng.
- **DoD:** Nhân viên gõ tìm kiếm SKU -> Chọn ngày thuê -> Hệ thống tự tính tổng tiền thuê và tiền cọc -> Bấm "Tạo đơn" hoàn thành dưới 60 giây.

#### `F02-10` -> `F02-14`: Chuỗi Vận hành Giao nhận, Quét QR & Quyết toán Cọc
- **Phân hệ:** Shop Dashboard Operations | **Priority:** `P0` | **Phase:** `PHASE-07`
- **Routes:** `/dashboard/:shopSlug/orders`, `/dashboard/:shopSlug/orders/:id/handover`, `/dashboard/:shopSlug/orders/:id/return-qc`.
- **Components:** 
  - `FulfillmentPipeline.tsx`: Kanban/Bảng phân loại đơn (Chờ chuẩn bị, Cần bàn giao hôm nay, Cần thu hồi hôm nay, Đang trễ hạn).
  - `HandoverQrModal.tsx`: Quét mã QR sản phẩm vật lý trước khi xuất kho.
  - `ReturnQcScreen.tsx`: Bảng kiểm định 6 tiêu chí (Rách vải, Ố màu, Mất cúc, Mùi lạ, Trễ hạn, Hỏng khóa).
  - `DepositSettlementCard.tsx`: Tự động tính tiền cọc hoàn lại = `Tiền cọc ban đầu - Phí trễ hạn - Phí đền bù hư tổn`.
- **Prerequisites & Backend:** `B08-01`, `B08-02`, `B09-01`, `B09-02`, `B09-03`.
- **DoD:**
  - Hoàn tất 1 quy trình trả đồ: Quét QR khớp đơn -> Tích chọn "Ố bẩn nhẹ (-50.000đ)" -> Hệ thống trừ cọc và sinh lệnh hoàn tiền qua VietQR tự động.

---

### PHÂN HỆ 3: CUSTOMER STOREFRONT (`F03-01` -> `F03-15`, `SUP-F06`, `SUP-F07`)

#### `F03-01` -> `F03-08`: Trải nghiệm Cửa hàng Boutique Trực tuyến
- **Phân hệ:** Customer Storefront | **Priority:** `P0` | **Phase:** `PHASE-04`
- **Routes:** `/shop/:slug`, `/shop/:slug/catalog`, `/shop/:slug/products/:productId`.
- **Components:** `StorefrontShell.tsx`, `BoutiqueHero.tsx`, `ProductGrid.tsx`, `ProductCard.tsx`, `PdpModal.tsx`, `CartDrawer.tsx`, `StorefrontFooter.tsx`.
- **Hiện trạng:** **Đã hoàn thành xuất sắc bản Prototype với đầy đủ GSAP micro-interactions và Taste Design System**.
- **Kế hoạch tiếp theo:**
  - Tách `PdpModal` thành trang chi tiết độc lập `/shop/:slug/products/:productId` (hỗ trợ SEO và chia sẻ liên kết) song song với chế độ xem nhanh Quick View.
  - Kết nối dữ liệu động từ API `GET /api/v1/public/shops/:slug/products` thay cho mock data trong `demo-store.ts`.
- **DoD:** Không còn phụ thuộc `demoStore`; các bộ lọc sự kiện, màu sắc, khoảng giá lọc chính xác theo API backend.

#### `F03-09` -> `F03-12`: Luồng Đặt Cọc & Thanh toán (Checkout Stepper)
- **Phân hệ:** Customer Storefront | **Priority:** `P0` | **Phase:** `PHASE-05`
- **Routes:** `/shop/:slug/checkout`, `/shop/:slug/orders/:id/confirmation`.
- **Components:** `CheckoutStepper.tsx`, `CustomerDeliveryForm.tsx`, `RentalAgreementViewer.tsx`, `VietQrLivePayment.tsx`.
- **Prerequisites & Backend:** `B06-01`, `B06-02`, `B06-03`.
- **API Contract:** 
  - `POST /api/v1/public/shops/:slug/orders/rental-checkout`
  - Body: `{ customerName, phone, deliveryMethod, rentalItems: [{ productId, startDate, endDate }], agreementSigned: true }`
- **Mock Strategy:** Fixture sinh mã đơn hàng `DX-ORD-2026-X89` kèm VietQR tĩnh cho phép bấm nút "Giả lập thanh toán thành công".
- **Design System:** Tinh giản, không phân tâm (Distraction-free Checkout), bảng tóm tắt chi phí gắn cố định (Sticky Order Summary).
- **GSAP:** Chuyển bước nhẹ nhàng với `fade` và `slideX` (duration: 0.35s). **Tuyệt đối không dùng GSAP trên nút bấm thanh toán hoặc quá trình gọi API**.
- **DoD:**
  - Bắt buộc cuộn xem hoặc tích xác nhận Hợp đồng điện tử trước khi thanh toán.
  - Hiển thị mã QR ngân hàng động kèm đồng hồ đếm ngược 15:00 phút; lắng nghe trạng thái thanh toán tự động chuyển sang trang thành công.

#### `SUP-F13`: Tái thiết kế Platform Homepage & GSAP Featured Boutiques Showcase
- **Phân hệ:** Public Landing & Discovery | **Priority:** `P1` | **Phase:** `PHASE-04`
- **Routes:** `/` (Trang chủ Nền tảng Dịp Xinh).
- **Mục tiêu UX & Nghiệp vụ:**
  - Nâng cấp diện mạo Trang chủ từ dạng tĩnh sang trải nghiệm thời trang cao cấp sống động, thu hút cả khách hàng tìm đồ thuê lẫn chủ boutique muốn mở shop trên sàn.
  - Trình diễn hình ảnh các Boutique nổi bật (Featured Boutiques) với hiệu ứng lướt qua lại (Sliding/Marquee/Carousel) mượt mà chuẩn 60 FPS bằng GSAP, phản ánh đúng đặc thù đa dạng của từng cửa hàng thời trang (váy cưới, đầm dạ hội, áo dài truyền thống).
- **Components xây dựng:**
  - `PlatformLandingPage.tsx`: Layout tổng thể trang chủ với phân tầng thị giác tạp chí thời trang (Editorial Fashion).
  - `HeroEditorialSlider.tsx`: Hero banner với hiệu ứng chuyển trang phục so le (Staggered Split-reveal).
  - `FeaturedBoutiquesMarquee.tsx`: Dải ruy-băng lướt vô tận đa chiều (Dual-direction Infinite Marquee).
  - `InteractiveBoutiqueCarousel.tsx`: Băng chuyền lướt shop nổi bật hỗ trợ vuốt chạm/kéo thả có quán tính (Draggable & Momentum Snap).
  - `OccasionShowcaseTabs.tsx`: Bộ chuyển đổi nhanh theo dịp mặc (Dạ tiệc, Đám cưới, Kỷ yếu, Lễ hội) lật card bằng GSAP FLIP/AutoAlpha.
  - `BoutiqueCardPreview.tsx`: Thẻ xem trước Shop hiển thị ảnh lookbook, huy hiệu "Đã xác thực QR", số lượng mẫu sẵn sàng và nút "Ghé thăm Boutique" dẫn tới `/shop/:slug`.
- **Hiệu ứng GSAP chi tiết:**
  - **1. Infinite Parallax Ribbon:** 2 hàng ảnh thời trang trượt ngang vô tận ngược chiều nhau bằng `gsap.to(..., { xPercent: -100, repeat: -1, ease: 'none' })`. Tự động giảm tốc êm ái khi hover (`quickTo`), phóng nhẹ `scale: 1.03`, tạm dừng khi người dùng chuyển tab trình duyệt (`visibilitychange`).
  - **2. Interactive Momentum Carousel:** Hỗ trợ kéo chuột/vuốt ngón tay với quán tính vật lý (inertia), hít tự động (snap) vào tâm từng thẻ Shop, hiển thị 3 mẫu trang phục tiêu biểu của shop đó.
  - **3. Occasion Filter Morphing:** Khi người dùng chọn tab dịp (VD: từ "Dạ hội" sang "Áo dài cưới"), các thẻ shop lật nhẹ (stagger 0.08s, `y: 16 -> 0`, `opacity: 0 -> 1`).
- **Prerequisites & Backend:** `B05-01` (`GET /api/v1/public/featured-shops`).
- **Mock Strategy:** Fixture `mockFeaturedBoutiques` gồm 5 shop mẫu: *Aurora Atelier* (Dạ tiệc), *Tiệm Váy Ánh Trăng* (Công chúa/Sự kiện), *Gấm Việt* (Áo dài tơ tằm), *Bella Bridal* (Váy cưới), *Nocturne Studio* (Vest & Thiết kế).
- **DoD:**
  - [ ] Đạt chuẩn 60 FPS, không gây giật lag (CLS = 0).
  - [ ] Hỗ trợ vuốt chạm mượt mà trên di động (Mobile Touch Swipe) và chuột kéo thả trên Desktop.
  - [ ] Bấm vào thẻ Shop chuyển hướng chính xác đến `/shop/:slug`.
  - [ ] Tôn trọng tùy chọn `prefers-reduced-motion` (chuyển sang dạng trượt ngang CSS tĩnh có nút bấm).

---

### PHÂN HỆ 4: PLATFORM ADMINISTRATION (`F04-01` -> `F04-08`, `SUP-F10`)

#### `F04-01` -> `F04-04`: Quản lý Tenants & Vòng đời Shop
- **Phân hệ:** Platform Admin | **Priority:** `P0` | **Phase:** `PHASE-09`
- **Routes:** `/admin`, `/admin/shops`, `/admin/shops/:id`.
- **Components:** `AdminLayoutShell.tsx`, `TenantListTable.tsx`, `ShopApprovalModal.tsx`, `TenantStatusBadge.tsx`.
- **Prerequisites & Backend:** `B12-01`, `B12-02`.
- **DoD:** 
  - Admin có thể duyệt các shop mới đăng ký từ trạng thái `PENDING` sang `ACTIVE`.
  - Có thể khóa (`SUSPEND`) một shop vi phạm chính sách; toàn bộ nhân viên và Storefront của shop đó bị vô hiệu hóa ngay lập tức.

#### `F04-05`: Quản trị Gói cước SaaS & Feature Matrix
- **Phân hệ:** Platform Admin | **Priority:** `P1` | **Phase:** `PHASE-09`
- **Routes:** `/admin/subscriptions`.
- **Components:** `PlanMatrixEditor.tsx`, `PlanCard.tsx`, `QuotaLimitDialog.tsx`.
- **Prerequisites & Backend:** `B13-01`.
- **DoD:** Thiết lập giới hạn: Gói `Tập sự` (Tối đa 50 váy, 2 nhân viên), Gói `Boutique Chuyên nghiệp` (Không giới hạn váy, 10 nhân viên, mở tính năng AI).

---

### PHÂN HỆ 5: USER PROFILE, NOTIFICATIONS & POST-LAUNCH AI (`F05-01` -> `F05-10`, `A01`, `A02`)

#### `F05-01` -> `F05-03`: Customer Portal (Cổng Thông tin Khách hàng)
- **Phân hệ:** Storefront & User Portal | **Priority:** `P2` | **Phase:** `PHASE-08`
- **Routes:** `/shop/:slug/account/rentals`, `/shop/:slug/account/deposits`.
- **Components:** `CustomerOrderHistory.tsx`, `DepositRefundTracker.tsx`, `AppointmentList.tsx`.
- **DoD:** Khách hàng theo dõi được trạng thái: "Đang giao đồ", "Đang giữ cọc 1.500.000đ", "Đã hoàn cọc 1.500.000đ vào STK xxxx".

#### `F05-06` & `F05-07`: Trợ lý AI Styling Advisor (Post-Launch Phase 10)
- **Phân hệ:** AI Enhancement | **Priority:** `P3` | **Phase:** `PHASE-10`
- **Routes:** Tích hợp Floating Widget trên Storefront `/shop/:slug`.
- **Components:** `AiStylingDrawer.tsx`, `OutfitMixCanvas.tsx`, `OccasionQuiz.tsx`.
- **DoD:** Khách nhập "Tôi đi đám cưới ngoài trời tại Đà Lạt vào tháng 12, cao 1m62", AI trả về set đồ gồm Váy dạ hội ấm + Khăn choàng lông có sẵn tại shop.

---

## 4. CHIẾN LƯỢC QUẢN LÝ MOCK FIXTURES & ĐỘC LẬP TÁC VỤ

1. **Vị trí lưu trữ quy chuẩn:**  
   Toàn bộ mock fixtures phải đặt tại thư mục `src/shared/fixtures/` và được export có tiền tố rõ ràng (Ví dụ: `mockProductList`, `mockTodayOperations`).
2. **Không phụ thuộc ngầm:**  
   Mọi component sử dụng mock data phải có cờ cảnh báo trực quan:
   ```tsx
   {isMockData && (
     <div className="bg-amber-500/10 text-amber-700 text-xs px-2 py-0.5 rounded border border-amber-500/20">
       Dữ liệu mẫu thử nghiệm (Mock Fixture)
     </div>
   )}
   ```
3. **Cơ chế chuyển đổi (API Switch):**  
   Mỗi Service API có cấu trúc cắm rút:
   ```typescript
   export const getTodayOperations = async (shopId: string): Promise<TodayOperationsDTO> => {
     if (import.meta.env.VITE_USE_MOCK_API === 'true') {
       return mockTodayOperations;
     }
     const res = await apiClient.get(`/api/v1/shops/${shopId}/dashboard/metrics`);
     return res.data;
   };
   ```
