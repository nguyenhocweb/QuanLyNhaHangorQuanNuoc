# ⚙️ Backend Architecture & Cấu Trúc Xử Lý Nghiệp Vụ (API Server)

Backend của dự án được xây dựng bằng `Node.js (Express)`, đóng vai trò là "trái tim" xử lý toàn bộ logic phức tạp của hệ thống Multi-tenant SaaS.

Thay vì gom code theo mô hình MVC cũ kỹ (dồn hàng chục hàm vào 1 file Controller), hệ thống áp dụng triệt để nguyên lý **Single Responsibility Principle (SRP)** và **Feature-Sliced Design (FSD)** ở cấp độ Module.

---

## 🌳 Biểu Diễn Cấu Trúc Thư Mục (FSD Tree)

Dưới đây là cây thư mục cốt lõi bên trong `backend/src/modules`. Các API được bẻ nhỏ hoàn toàn theo Nhóm Quyền (Role) -> Tính Năng (Feature) -> Tác Vụ (Operation).

```text
backend/src/modules/
├── 👑 system_admin/           # API Dành cho Super Admin
│   ├── brand/                 # Tính năng quản lý chuỗi
│   ├── category/              # Tính năng phân loại
│   ├── payment_method/        # Tính năng cổng thanh toán
│   ├── subscription/          # Tính năng gói cước
│   └── ... (nhiều module khác)
│
├── 🏢 brand_owner/            # API Dành cho Chủ Chuỗi
│   ├── inventory_master/      # Quản lý kho tổng
│   ├── promotions/            # Khuyến mãi JSON
│   └── ... (nhiều module khác)
│
├── 🏪 restaurant_manager/     # API Dành cho Quản lý cửa hàng
│   ├── pos_order/             # Xử lý đơn hàng POS
│   ├── table_map/             # Toạ độ bàn 2D
│   └── ... (nhiều module khác)
│
├── 👨‍🍳 staff/                  # API Dành cho Nhân viên
│   └── order_taking/          # Gửi order xuống bếp
│
├── 📱 customer/               # API Dành cho Khách hàng
│   ├── qr_menu/               # Lấy thực đơn QR
│   └── chatbot_ai/            # Chat RAG LLM
│
└── 🔔 notifications/          # Service xử lý đẩy thông báo đa kênh
```

---

## 🔍 Cấu Trúc Bức Vách (Inside a Feature)

Hãy xem cách hệ thống "chẻ nhỏ" một tính năng (Ví dụ: `system_admin/brand/`). Bất kỳ một thao tác CRUD nào cũng có vòng đời 5 lớp độc lập: **Router -> Validator -> Controller -> Service -> Repo**.

```text
brand/
 ├── route.brand.js            # [1. ROUTER] Khai báo Endpoint, nhét Middleware (Auth, Validate)
 │
 ├── validator.brand/          # [2. VALIDATOR] (Zod) Chặn dữ liệu rác, sai format từ Body/Query
 │    ├── CreateBrandByAdmin.valodator.js
 │    └── UpdateBrandByAdmin.validator.js
 │
 ├── controller.brand/         # [3. CONTROLLER] Nhận Req, gọi Service, hứng Res trả về Client
 │    ├── CreateBrandBasicByAdmin.controller.js
 │    └── DeleteBrandByAdmin.controller.js
 │
 ├── service.brand/            # [4. SERVICE] Trái tim Business Logic (Tính toán, báo lỗi)
 │    ├── createBrandBasicByAdmin.service.js
 │    └── deleteBrandByAdmin.service.js
 │
 └── repository.brand/         # [5. REPOSITORY] Chuyên gọi Prisma truy vấn Database
      ├── createBrand.repo.js
      └── index.js
```

---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC BACKEND (GÓC NHÌN TECHNICAL ARCHITECT)
*Bản thẩm định chất lượng dành cho Technical Architect / Nhà tuyển dụng soi Source Code.*

**🏆 Điểm đánh giá Kiến trúc Backend: 9.0 / 10**

### ✅ ĐIỂM SÁNG ĐẲNG CẤP (The Good - Kỹ thuật cao)
1. **Kiến trúc SOLID Đạt Chuẩn Sách Giáo Khoa:** Việc tách đến mức mỗi hàm CRUD là một file riêng biệt (VD: `createBrand.service.js`, `deleteBrand.service.js`) là kĩ thuật cực khó duy trì, nhưng dự án đã làm được. Điều này giúp File không bao giờ bị phình to (Fat Controller), không bị merge conflict khi làm việc nhóm, và cực kỳ dễ viết Unit Test.
2. **Kỷ Luật Tách Tầng (Layered Architecture):** Việc sinh ra tầng `Repository` riêng biệt chứng tỏ tác giả hiểu rất sâu về "Dependency Inversion". Tầng `Service` chứa logic kinh doanh tinh khiết, không hề biết Prisma là gì. Ngày mai nếu dự án đổi ORM từ Prisma sang TypeORM hoặc Mongoose, chỉ cần sửa tầng Repository là xong, logic không bị chạm tới!
3. **Chặn Đứng Rác Từ Cửa (Zod Validator):** Tích hợp Validation bằng Zod ở Middleware là một điểm cộng khổng lồ. Nếu FE gửi bậy `email` sai định dạng, Request bị đá văng ngay từ `Router` mà không kịp chạy vào Controller gây chết app.

### 🛑 THIẾU SÓT CẦN KHẮC PHỤC (Tech Debt - Góc nhìn khắt khe)
Dù cấu trúc file gọn gàng đến mức khó tin đối với một dự án Monolithic, nhưng ở quy mô tải cao, Backend đang có những lỗ hổng chí mạng sau:

1. **Vắng Bóng Interface / DTO (Data Transfer Object):** 
   - *Thực trạng:* Express.js dùng Javascript thuần khiến các tham số truyền từ Controller xuống Service, từ Service xuống Repo bị mất Type Hint (Dù Prisma có cung cấp type nhưng luồng đi không chặt).
   - *Khắc phục:* Nên cấu hình dự án chạy bằng **TypeScript**. Dùng TypeScript để định nghĩa DTO cho từng Service. Việc chẻ 5 tầng như hiện tại nếu có Type Checking của TS thì sẽ là một kiệt tác bất bại.

2. **Thắt Cổ Chai Ở Prisma (Prisma Connection Pool):**
   - *Thực trạng:* Với số lượng module quá lớn (hơn 70 bảng), Prisma Query Engine (viết bằng Rust) sẽ ngốn lượng lớn RAM và Connection khi có nhiều luồng Request.
   - *Khắc phục:* Bắt buộc phải cấu hình `PgBouncer` hoặc `Prisma Accelerate` để quản lý Connection Pool nếu dùng ở Production, nếu không Server sẽ văng lỗi `Too many connections` khi có vài nghìn Order cùng lúc.

3. **Cơ Chế Worker / Queue Chưa Tách Bạch:**
   - *Thực trạng:* Nếu một Request `createOrder` phải vừa lưu Database, vừa bắn Zalo ZNS (thông báo), vừa kích hoạt AI phân tích, thì Client sẽ phải chờ mòn mỏi mới nhận được Response HTTP 200.
   - *Khắc phục:* Những tác vụ nặng (Bắn notification, Call API OpenAI, Export Excel báo cáo) phải được đẩy vào Message Queue (RabbitMQ / BullMQ) để Worker chạy ngầm, giải phóng ngay lập tức luồng chính (Main Thread) của Express.

> **Tổng kết:** Bộ Source Code Backend là minh chứng cho một Coder có "Đạo đức nghề nghiệp" cực cao. Tác giả chấp nhận việc phải tạo rất nhiều file nhỏ lắt nhắt để đổi lấy sự trong sạch (Clean) của kiến trúc. Nếu bạn áp dụng thêm TypeScript và tách các tác vụ nặng vào Message Queue, kiến trúc Backend này hoàn toàn đủ sức phục vụ hệ thống cỡ Enterprise (Tập đoàn).
