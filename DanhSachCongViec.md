# Danh Sách Công Việc (To-do List) Dự Án Quản Lý Nhà Hàng

Dựa trên phân tích chi tiết chức năng, dưới đây là danh sách các công việc ĐÃ LÀM (dựa trên thiết kế Database hiện tại) và các công việc CHƯA HOÀN THÀNH / CẦN LÀM trong tương lai để nâng cấp hệ thống.

---

## ✅ Phần 1: CÁC CHỨC NĂNG ĐÃ LÀM (Hoàn thành về thiết kế Database)
*(Cấu trúc Database đã sẵn sàng, cần đảm bảo Frontend và Backend đã tích hợp đầy đủ API và UI cho các chức năng này).*

- [x] **1. Quản lý Đa Chi Nhánh (Multi-Tenant)**
  - [x] Tạo và quản lý Brand (Thương hiệu).
  - [x] Tạo và quản lý Restaurant (Chi nhánh).
  - [x] Xét duyệt yêu cầu nâng cấp lên chủ Brand (`UpgradeRequest`).
- [x] **2. Quản lý Nhân Sự & Phân Quyền (RBAC)**
  - [x] Đăng ký, đăng nhập và xác thực User.
  - [x] Quản lý Role (System Admin, Brand, Restaurant, Customer).
  - [x] Gán nhân viên vào làm việc tại chi nhánh (`Employment`).
  - [x] Phân quyền chi tiết cho từng nhân viên (`Permission`).
- [x] **3. Quản lý Thực Đơn (Menu Management)**
  - [x] Phân cấp Menu -> MenuCategory -> MenuItem.
  - [x] Quản lý giá cả, món giảm giá, đánh dấu món Hot (`is_featured`).
- [x] **4. Đặt Bàn & Quản Lý Sơ Đồ Bàn**
  - [x] Vẽ sơ đồ bàn theo tọa độ, theo khu vực (Trong nhà/Ngoài trời, Hút thuốc).
  - [x] Tiếp nhận yêu cầu đặt bàn của khách (ngày, giờ, số người, yêu cầu đặc biệt).
  - [x] Nhân viên xếp bàn cho khách (`Reservation_Tables`).
  - [x] Lưu lịch sử thay đổi đặt bàn (`Reservation_Audit_Log`).
- [x] **5. Bán Hàng Tại Quầy (POS & Orders)**
  - [x] Tạo Order cho bàn đang có khách.
  - [x] Thêm món (`OrderItem`) vào Order.
  - [x] Cập nhật trạng thái món ăn trong bếp (`QUEUED`, `PREPARING`, `READY`, `SERVED`).
- [x] **6. Quản Lý Thanh Toán**
  - [x] Hỗ trợ cấu hình nhiều cổng thanh toán (Tiền mặt, Thẻ, Momo, ZaloPay).
  - [x] Lưu lịch sử giao dịch (`Transaction`).
- [x] **7. Chăm Sóc Khách Hàng (CRM)**
  - [x] Tạo và áp dụng Mã khuyến mãi (`Promotion`).
  - [x] Khách hàng đánh giá nhà hàng, món ăn, dịch vụ (`Review_Restaurant`).
  - [x] Cấu hình gửi thông báo (Email, SMS) (`Notifications`).
- [x] **8. Quản Lý Giờ Hoạt Động**
  - [x] Cài đặt giờ mở/đóng cửa cố định hàng tuần (`Operating_Hours`).
  - [x] Cấu hình ngày nghỉ lễ, sự kiện đặc biệt (`Special_Schedules`).

---

## ⏳ Phần 2: CÁC CÔNG VIỆC CẦN LÀM / CHƯA HOÀN THÀNH (Future Features)
*(Đây là các tính năng hệ thống chưa có, cần thiết kế thêm Database, viết API Backend và xây dựng UI Frontend).*

- [ ] **1. Quản lý Kho & Nguyên Vật Liệu (Inventory)**
  - [ ] Thiết kế Database cho: `Ingredients` (Nguyên liệu), `Recipes` (Công thức), `Suppliers` (Nhà cung cấp), `PurchaseOrders` (Đơn nhập hàng).
  - [ ] Viết API tự động trừ số lượng nguyên liệu khi món ăn chuyển trạng thái `SERVED`.
  - [ ] Xây dựng giao diện cảnh báo tồn kho sắp hết cho Quản lý / Bếp trưởng.
- [ ] **2. Màn Hình Hiển Thị Bếp (KDS - Kitchen Display System)**
  - [ ] Tích hợp WebSocket (Socket.io) vào Backend và Frontend.
  - [ ] Thiết kế Database bảng `KitchenStations` (bếp nóng, bếp lạnh) để chia bill về đúng màn hình bếp.
  - [ ] Xây dựng màn hình Tablet cho Bếp để cập nhật trạng thái món ăn Real-time.
- [ ] **3. Tính Năng Giao Hàng & Mang Đi (Delivery/Takeaway)**
  - [ ] Thiết kế Database cho: `DeliveryDetails` (Địa chỉ, SĐT, phí ship), `Drivers` (Tài xế).
  - [ ] Tách luồng Order không cần qua Đặt Bàn (`Reservations`).
  - [ ] Tích hợp API của đối tác giao hàng thứ 3 (Ahamove, GrabExpress, Lalamove).
- [ ] **4. Hệ Thống Thẻ Thành Viên & Điểm Thưởng (Loyalty Program)**
  - [ ] Thiết kế Database cho: `LoyaltyPoints`, `MembershipTiers` (Hạng Đồng, Bạc, Vàng).
  - [ ] Viết API cộng điểm tự động khi `Transaction` thành công.
  - [ ] Viết API cho khách hàng dùng điểm đổi Voucher/Khuyến mãi.
- [ ] **5. Quản Lý Ca Làm Việc & Chấm Công**
  - [ ] Thiết kế Database cho: `Shifts` (Ca làm việc), `AttendanceLogs` (Lịch sử điểm danh).
  - [ ] Tích hợp quét mã QR code để chấm công Giờ vào / Giờ ra.
  - [ ] Tự động hóa xuất bảng lương dự kiến (`Payroll`).
- [ ] **6. Hệ Thống Xếp Hàng Chờ Thông Minh (Smart Waitlist)**
  - [ ] Thiết kế Database bảng `WaitlistEntries`.
  - [ ] Xây dựng luồng quét QR lấy số thứ tự cho khách vãng lai (Walk-in).
  - [ ] Tự động gửi tin nhắn SMS / Zalo khi sắp tới lượt bàn trống.
- [ ] **7. Dashboard Báo Cáo Chuyên Sâu**
  - [ ] Thiết kế Database `DailySalesAggregate` để tối ưu truy vấn dữ liệu lớn.
  - [ ] Xây dựng giao diện biểu đồ (Doanh thu, Món bán chạy, Hiệu suất nhân viên) dùng Recharts.
  - [ ] Viết Cronjob chạy tự động tổng hợp dữ liệu mỗi ngày vào lúc nửa đêm.

---
**Ghi chú:** Đánh dấu `[x]` vào các mục trong Phần 2 khi bắt đầu triển khai hoàn thiện dần các tính năng!
