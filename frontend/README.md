# DịpXinh Frontend

SPA React, TypeScript, Vite và Tailwind cho ba khu vực sản phẩm của DịpXinh:

- trang giới thiệu sản phẩm;
- storefront công khai của từng shop;
- dashboard vận hành của shop.

## Chạy local

Yêu cầu Node.js và npm.

```bash
npm install
npm run dev
```

Các lệnh kiểm tra:

```bash
npm run typecheck
npm run build
```

## Cấu trúc

```text
frontend/
├── public/images/demo/          # Ảnh tĩnh của prototype
└── src/
    ├── app/                     # Composition root và app-wide layouts
    ├── features/                # Mã nguồn theo khu vực nghiệp vụ
    │   ├── marketing/
    │   ├── shop-dashboard/
    │   ├── shop-onboarding/
    │   └── storefront/
    ├── shared/                  # Model và tiện ích dùng chung, không phụ thuộc feature
    │   ├── demo/                # State giả lập, sẽ được thay bằng typed API client
    │   └── model/
    └── styles/                  # Global styles và design tokens
```

## Quy ước đặt tên

- Thư mục dùng `kebab-case`.
- React component và file component dùng `PascalCase`.
- Module TypeScript không phải component dùng `kebab-case`.
- Import nội bộ dùng alias `@/`, trỏ thẳng tới `src/`.
- Chỉ đặt asset cần URL ổn định/runtime trong `public/`; asset được import bởi component đặt trong `src/assets/` khi phát sinh.
- Mỗi feature có thể mở rộng bằng các segment `api/`, `components/`, `hooks/`, `model/`, `pages/` và `schemas/`; không tạo thư mục rỗng trước khi cần.

`src/shared/demo/demo-store.ts` chỉ phục vụ prototype. Khi nối backend, chuyển từng luồng sang typed client sinh từ OpenAPI và TanStack Query theo handbook; không dùng browser state để quyết định quyền, giá, tồn kho hoặc tính khả dụng.
