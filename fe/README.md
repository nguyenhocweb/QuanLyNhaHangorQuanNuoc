# 🌟 Frontend Architecture & Cấu Trúc Hệ Sinh Thái (Multi-Tenant UI)

Frontend của dự án được xây dựng bằng `Next.js (App Router)` và `React`, áp dụng một trong những kiến trúc phân tầng khắt khe nhất hiện nay là **Feature-Sliced Design (FSD)**. Hệ thống không gom code theo loại (gom tất cả components vào 1 folder) mà chia nhỏ theo **Vai trò (Role) -> Tính năng (Feature) -> Mối quan tâm kỹ thuật (Technical Concern)**.

---

## 🌳 Biểu Diễn Cấu Trúc Thư Mục (FSD Tree)

Dưới đây là cây thư mục cốt lõi bên trong `fe/src/features`. Cấu trúc này đảm bảo code của từng nhóm quyền hoàn toàn độc lập, không bị chồng chéo.

```text
fe/src/features/
├── 👑 system_admin/           # Dành cho Super Admin điều hành toàn hệ thống
│   ├── brands/                # Quản lý các Tập đoàn thuê phần mềm
│   ├── subscriptions/         # Gói cước SaaS
│   ├── payment_methods/       # Tích hợp cổng thanh toán gốc
│   ├── categories/            # Phân loại mô hình kinh doanh
│   ├── api_keys/              # Quản lý cấu hình AI LLM
│   └── ... (và hơn 10 modules khác như revenue, users, dashboard)
│
├── 🏢 brand_owner/            # Dành cho Chủ Tập Đoàn / Chuỗi
│   ├── restaurants/           # Quản lý danh sách chi nhánh
│   ├── global_menu/           # Thực đơn dùng chung toàn chuỗi
│   ├── promotions/            # Rule khuyến mãi JSON
│   ├── inventory_master/      # Kho tổng & Điều chuyển (StockTransfer)
│   ├── brand_revenue/         # Báo cáo doanh thu toàn chuỗi
│   └── ... (và nhiều modules khác)
│
├── 🏪 restaurant_manager/     # Dành cho Quản lý / Cửa hàng trưởng
│   ├── pos_order/             # Màn hình bán hàng (Point of Sale)
│   ├── table_map/             # Sơ đồ bàn 2D (Toạ độ, Tầng)
│   ├── reservations/          # Đặt lịch & Xếp bàn
│   ├── local_inventory/       # Kiểm kho chi nhánh (StockCount)
│   ├── staff_schedule/        # Lịch làm việc nhân viên
│   └── ... (và nhiều modules khác)
│
├── 👨‍🍳 staff/                  # Dành cho Thu ngân / Bếp / Phục vụ
│   ├── kitchen_display/       # Màn hình nhà bếp (KDS)
│   └── order_taking/          # Giao diện nhận món di động
│
├── 📱 customer/               # Dành cho Khách hàng cuối (B2C)
│   ├── qr_menu/               # Menu QR Code tự đặt món
│   ├── loyalty_wallet/        # Ví Voucher & Tích điểm
│   └── chatbot_ai/            # Nhắn tin gọi món với Trợ lý ảo
│
├── 🔐 auth/                   # Luồng Đăng nhập, Quên mật khẩu, Xác thực token
└── 🧩 shared/                 # Các Component dùng chung (Button, Modal, Table...)
```

---

## 🔍 Cấu Trúc Bức Vách (Inside a Feature)

Mỗi thư mục tính năng (Ví dụ: `system_admin/brands/`) đều phải tuân thủ nghiêm ngặt **SRP (Single Responsibility Principle)** ở mức file:

```text
brands/
 ├── component/                # Chỉ chứa UI Rendering (React)
 │    ├── BrandListTable.tsx   # Hiển thị bảng
 │    └── CreateBrandForm.tsx  # Form dùng react-hook-form
 ├── hook/                     # Chứa logic kết nối API (React Query)
 │    ├── useGetBrands.ts      # Fetch data (useQuery)
 │    └── useCreateBrand.ts    # Thực thi action (useMutation)
 ├── service/                  # Nơi gọi Axios thuần tuý
 │    └── brand.service.ts     # axiosClient.get('/brands')
 ├── schema/                   # Validate dữ liệu bằng Zod
 │    └── brand.schema.ts      # Schema & Infer Type cho Form
 └── type/                     # Interface / Type của API Response
      └── brand.type.ts
```

---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC FRONTEND (GÓC NHÌN TECHNICAL ARCHITECT)
*Bản thẩm định chất lượng dành cho Technical Lead / Nhà tuyển dụng.*

**🏆 Điểm đánh giá Kiến trúc Frontend: 8.5 / 10**

### ✅ ĐIỂM SÁNG ĐẲNG CẤP (The Good - Kỹ thuật cao)
1. **Kiến trúc Feature-Sliced Design (FSD):** Rất ít dự án cá nhân hoặc thậm chí dự án công ty nhỏ áp dụng FSD. Việc tách biệt `Service (Axios)` -> `Hook (React Query)` -> `Component (UI)` giúp tái sử dụng logic cực kỳ cao và hoàn toàn cách ly UI khỏi Data Fetching.
2. **Khống chế Re-render bằng Zod + React Hook Form:** Thay vì dùng Controlled Components (State) cho hàng chục field nhập liệu, hệ thống ép kiểu bằng Zod và dùng Uncontrolled Component của `react-hook-form`. Điều này giúp Form tạo món ăn phức tạp không bị lag khi gõ phím.
3. **Phân Rã Quyền Lực Rõ Ràng:** Cấu trúc chia ngay từ thư mục gốc theo Role (`system_admin`, `brand_owner`...) giúp quá trình Lazy Loading / Code Splitting của Next.js hiệu quả. User ở Role nào thì chỉ tải Bundle JS của Role đó, bảo mật 100%.

### 🛑 THIẾU SÓT CẦN KHẮC PHỤC (Tech Debt - Góc nhìn khắt khe)
Dù cấu trúc file rất tốt, nhưng Frontend đang đối mặt với những vấn đề sau nếu đem chạy ở quy mô lớn:

1. **Bỏ lỡ sức mạnh của Next.js App Router (Server Components):** 
   - *Thực trạng:* Hệ thống đang phụ thuộc quá nhiều vào Client-side fetching (`@tanstack/react-query`). Hầu hết các trang đều là Client Components có spinner Loading.
   - *Khắc phục:* Với Next.js 14+, các trang hiển thị dữ liệu tĩnh (Ví dụ: Menu khách xem qua mã QR, Danh sách chuỗi của Admin) cần phải dùng **Server Components (RSC)** kết hợp `fetch` để SEO tốt hơn và giảm tải JS xuống trình duyệt.

2. **Thiếu vắng Global Error Boundary:**
   - *Thực trạng:* Nếu một đoạn code trong một Table (Ví dụ: map sai cấu trúc mảng của một biến `undefined`), cả giao diện trang đó sẽ "trắng xoá" (Crash).
   - *Khắc phục:* Cần bọc `error.tsx` hoặc các thẻ `<ErrorBoundary>` ở từng cấp độ Layout và Feature, để khi 1 Component chết, nó chỉ báo lỗi ở đúng ô đó thay vì sập toàn trang.

3. **Quản lý Cache State của React Query Chưa Tối Ưu Tận Cùng:**
   - *Thực trạng:* Ở một số tính năng, việc Invalidate Queries (Xoá cache để tải lại mới) đang làm hơi "thủ công" sau mỗi Mutation. 
   - *Khắc phục:* Cần triển khai kỹ thuật **Optimistic Updates** mạnh mẽ hơn (Cập nhật UI ngay lập tức trước khi Server trả kết quả) ở các tính năng POS hoặc Drag-and-drop sơ đồ bàn, để mang lại trải nghiệm không độ trễ (Zero-latency) cho thu ngân.

> **Tổng kết:** Bộ mã nguồn Frontend phản ánh tác giả là một người bị "ám ảnh" bởi sự ngăn nắp và kiến trúc sạch (Clean Architecture). Bất cứ lập trình viên mới nào vào team cũng có thể dễ dàng hiểu được luồng đi của dữ liệu. Nếu cải thiện thêm kỹ thuật Server-Side Rendering của Next.js, kiến trúc này hoàn toàn xứng đáng điểm 10 tuyệt đối ở môi trường Enterprise.
