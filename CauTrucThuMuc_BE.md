# Cấu Trúc File & Thư Mục Backend (Node.js/Express)
Giống như Frontend, để dự án Backend dễ bảo trì, dễ phân quyền và mở rộng sau này, chúng ta nên chuyển từ cấu trúc "chia theo bảng (Table-driven)" sang cấu trúc "chia theo Vai trò rồi đến Chức năng (Role-based & Feature-driven)".

Dưới đây là đề xuất cấu trúc lại thư mục `backend/src/modules/` cho hệ thống Quản Lý Nhà Hàng:

---

## 1. `public/` - Dành cho Khách Vãng Lai (Guest)
Các API ở đây **KHÔNG** yêu cầu middleware `authenticateToken`.
```text
src/modules/public/
├── auth/                   # Đăng nhập, Đăng ký, Quên mật khẩu, Refresh Token
├── restaurant/             # Lấy danh sách nhà hàng, chi tiết nhà hàng để khách xem
├── menu/                   # Lấy menu công khai của một nhà hàng
├── ai/                     # Chatbot AI tư vấn cho khách vãng lai
└── webhook/                # Nhận callback từ Momo, ZaloPay khi thanh toán xong
```

## 2. `customer/` - Dành cho Khách Hàng
Các API yêu cầu User phải đăng nhập (Token hợp lệ).
```text
src/modules/customer/
├── profile/                # Cập nhật thông tin cá nhân, xem điểm tích lũy
├── reservation/            # Khách hàng tạo đơn đặt bàn, xem lịch sử đặt bàn
├── order/                  # Khách xem lịch sử order và thanh toán
└── review/                 # Khách gửi đánh giá sau khi ăn
```

## 3. `staff/` - Dành cho Nhân Viên Chi Nhánh
Yêu cầu middleware kiểm tra User có nằm trong bảng `Employment` của nhà hàng đó không.
```text
src/modules/staff/
├── pos/                    # API cho máy tính tiền: Tạo Order, thêm món, thanh toán
├── kitchen/                # API cho Bếp: Cập nhật trạng thái món (Đang nấu, Đã xong)
├── table/                  # API sơ đồ bàn: Xem bàn trống, chuyển bàn, ghép bàn
└── check_in/               # API cho Lễ tân: Check-in khách đến đặt bàn, xếp bàn
```

## 4. `restaurant_admin/` - Dành cho Quản Lý Chi Nhánh
Yêu cầu middleware kiểm tra Role quản lý của 1 chi nhánh cụ thể.
```text
src/modules/restaurant_admin/
├── dashboard/              # Thống kê doanh thu, món bán chạy của chi nhánh
├── menu_local/             # Bật/tắt món ăn, cập nhật giá riêng tại chi nhánh
├── table_setup/            # Vẽ sơ đồ bàn, tạo khu vực (Tầng 1, Tầng 2)
├── employment/             # Thêm nhân viên vào chi nhánh, phân quyền
└── promotion/              # Quản lý mã giảm giá của chi nhánh
```

## 5. `brand_admin/` - Dành cho Chủ Thương Hiệu (Chuỗi)
Yêu cầu middleware kiểm tra Role chủ Brand.
```text
src/modules/brand_admin/
├── dashboard/              # Thống kê tổng hợp toàn bộ các nhà hàng trong chuỗi
├── restaurant/             # Tạo mới nhà hàng, sửa thông tin, xóa chi nhánh
├── menu_global/            # Định nghĩa Menu dùng chung cho toàn hệ thống
├── staff/                  # Quản lý nhân sự cấp cao
└── upgrade/                # Quản lý hồ sơ doanh nghiệp của mình
```

## 6. `system_admin/` - Dành cho Super Admin (Hệ thống)
Chỉ có admin tổng mới được truy cập.
```text
src/modules/system_admin/
├── brand/                  # Quản lý tất cả Brand trên nền tảng (Khóa/Mở khóa)
├── upgrade_request/        # Phê duyệt yêu cầu nâng cấp lên Chủ Brand của User
├── users/                  # Quản lý tất cả tài khoản User
└── category/               # Quản lý các danh mục chuẩn (VD: Lẩu, Nướng, Chay)
```

## 7. `shared/` - Các Module Dùng Chung (Internal Services)
Đây là các logic không phụ thuộc vào Role nào cả, dùng để các module trên gọi vào tái sử dụng.
```text
src/modules/shared/
├── cloudinary/             # Logic upload ảnh lên Cloudinary
├── mailer/                 # Logic gửi email (Xác nhận đặt bàn, OTP)
├── payment/                # Logic kết nối Momo, ZaloPay, Stripe
├── llm/                    # Core AI LLM models
└── vector/                 # Vector DB connection (Pinecone)
```

---

### 💡 Cách áp dụng vào Code thực tế (Ví dụ Module `reservation` của Customer)
Thay vì nhét mọi thứ vào 1 file, mỗi chức năng sẽ có 4 file chuẩn MVC:
```text
src/modules/customer/reservation/
├── reservation.controller.js    # Nhận Request, trả Response
├── reservation.service.js       # Xử lý logic nghiệp vụ (Insert DB, tính toán)
├── reservation.router.js        # Khai báo Route (vd: POST /)
└── reservation.schema.js        # File Zod để validate input data
```

### ⚙️ Trong file `router.js` tổng sẽ rất gọn gàng:
```javascript
// src/modules/router.js
import { Router } from "express";
import publicRoutes from "./public/public.routes.js";
import customerRoutes from "./customer/customer.routes.js";
import staffRoutes from "./staff/staff.routes.js";
// ...

const route = Router();

route.use("/public", publicRoutes);
route.use("/customer", authenticateToken, customerRoutes);
route.use("/staff", authenticateToken, checkEmployment, staffRoutes);
route.use("/res-admin", authenticateToken, checkRestaurantAdmin, restaurantAdminRoutes);

export default route;
```

**Lợi ích của cấu trúc này:**
- Chống lậu quyền (IDOR) rất tốt vì ngay từ đầu Router đã chặn Role.
- Khi cần tìm code "Khách hàng tạo đơn" thì vào `customer/order`, cần tìm code "Nhân viên tạo đơn" thì vào `staff/pos`, không bị nhầm lẫn và phình to code.
