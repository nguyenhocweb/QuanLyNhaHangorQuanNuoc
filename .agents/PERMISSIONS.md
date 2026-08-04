# HỆ THỐNG PHÂN QUYỀN (PERMISSIONS)

Tài liệu này liệt kê tất cả các mã quyền (`Permission Codes`) được sử dụng trong hệ thống quản lý phân quyền (Authorization) qua middleware `authorizePermission` ở Backend. Khi tạo các tính năng mới, hãy sử dụng các mã quyền chuẩn này.

---

## 1. QUYỀN CẤP NHÀ HÀNG (Restaurant Level)
Dành cho các vai trò như: Quản lý nhà hàng, Nhân viên phục vụ, Thu ngân, Lễ tân...

### 🪑 Quản lý Bàn & Sơ đồ (Tables & Areas)
- `VIEW_TABLES`: Xem sơ đồ bàn, danh sách bàn và khu vực.
- `MANAGE_TABLES`: Thêm, sửa, xoá bàn, khu vực và tạo mã QR.

### 📅 Đặt bàn (Reservations)
- `VIEW_RESERVATION`: Xem danh sách đơn đặt bàn.
- `CREATE_RESERVATION`: Tạo đơn đặt bàn mới.
- `UPDATE_RESERVATION`: Cập nhật thông tin, thay đổi trạng thái đơn đặt bàn (Hoàn thành, Đã huỷ...).
- `ASSIGN_RESERVATION_TABLE`: Xếp bàn, gỡ bàn cho đơn đặt.

### 🧾 Gọi món & Đơn hàng (Orders & POS) *[Dự kiến]*
- `VIEW_ORDERS`: Xem danh sách đơn hàng/hóa đơn.
- `CREATE_ORDERS`: Tạo đơn hàng mới (POS).
- `UPDATE_ORDERS`: Chỉnh sửa đơn, thêm món, cập nhật trạng thái món ăn.
- `PROCESS_PAYMENTS`: Thanh toán hoá đơn.

### 👥 Nhân sự nhà hàng (Restaurant Staff) *[Dự kiến]*
- `VIEW_STAFF`: Xem danh sách nhân viên trong nhà hàng.
- `MANAGE_STAFF`: Thêm, sửa, xoá nhân viên, phân quyền cho nhân viên cấp dưới (Dành riêng cho Quản lý nhà hàng).

---

## 2. QUYỀN CẤP THƯƠNG HIỆU (Brand Level)
Dành cho các vai trò như: Chủ thương hiệu (Brand Owner), Quản lý thương hiệu, Nhân sự tổng bộ...

### 🏢 Quản lý Chi nhánh (Restaurants/Branches)
- `VIEW_RESTAURANTS`: Xem danh sách các chi nhánh thuộc thương hiệu.
- `MANAGE_RESTAURANTS`: Thêm mới, chỉnh sửa thông tin, tạm ngưng hoạt động chi nhánh.

### 🍔 Quản lý Thực đơn (Menu Management)
- `VIEW_MENU`: Xem danh sách danh mục và món ăn.
- `MANAGE_MENU`: Thêm, sửa, xoá món ăn, danh mục, topping, tuỳ chọn món.

### 🎁 Quản lý Khuyến mãi (Promotions)
- `VIEW_PROMOTIONS`: Xem danh sách chương trình khuyến mãi.
- `MANAGE_PROMOTIONS`: Tạo, sửa, huỷ chương trình khuyến mãi.

### 📊 Báo cáo & Thống kê (Reports & Analytics)
- `VIEW_REPORTS`: Xem các báo cáo doanh thu, thống kê lượt khách, hiệu suất chi nhánh.

### 👥 Nhân sự thương hiệu (Brand Staff) *[Dự kiến]*
- `VIEW_BRAND_STAFF`: Xem danh sách nhân sự cấp thương hiệu.
- `MANAGE_BRAND_STAFF`: Thêm, sửa, xoá và phân quyền nhân sự cấp thương hiệu.

---

## 💡 Hướng dẫn sử dụng cho Agent / Developer

Khi khai báo một API Router mới cần yêu cầu phân quyền, hãy sử dụng Middleware `authorizePermission` với các mã ở trên.

Ví dụ:
```javascript
import { authorizePermission } from "../../../core/middlewares/authorizePermission.middleware.js";

// Khách hàng không thể vào vì bị chặn bởi authorizeRole ở trên cùng của router.
// Chỉ những Nhân viên / Quản lý có chứa quyền 'MANAGE_MENU' trong database mới được gọi API này.
route.post("/menu-items", authorizePermission('MANAGE_MENU'), createMenuItem);
```
