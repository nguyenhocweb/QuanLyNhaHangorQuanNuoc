# Tài Liệu Chi Tiết Chức Năng Website Quản Lý Nhà Hàng

Dựa trên cấu trúc Database hiện tại, hệ thống đã hỗ trợ các tính năng rất toàn diện. Dưới đây là mô tả chi tiết các chức năng HIỆN CÓ và đề xuất những CHỨC NĂNG BỔ SUNG để hệ thống trở nên hoàn hảo, sẵn sàng để nâng cấp quy mô (scale up).

---

## PHẦN 1: CÁC CHỨC NĂNG ĐÃ CÓ TRONG HỆ THỐNG
*(Dựa theo Schema hiện tại)*

### 1. Quản lý Đa Chi Nhánh (Multi-Tenant/Franchise)
- **Mô tả:** Hệ thống hỗ trợ mô hình Chuỗi (Brand) và Chi nhánh (Restaurant). Một Brand có thể có nhiều Restaurant.
- **Hoạt động:** Admin tạo Brand. Người dùng bình thường có thể tạo `UpgradeRequest` để xin làm chủ Brand. Sau khi duyệt, chủ Brand tạo các chi nhánh Restaurant, mỗi chi nhánh có giờ hoạt động, sơ đồ bàn và menu riêng.
- **Role phụ trách:** System Admin, Brand Owner.

### 2. Quản lý Phân Quyền Nhân Sự (RBAC)
- **Mô tả:** Phân quyền vô cùng linh hoạt, không chỉ theo Role (Admin, Customer) mà còn theo Employment (ai làm việc ở nhà hàng nào) và các Permission chi tiết (Ai có quyền CREATE_ORDER ở nhà hàng A).
- **Hoạt động:** Chủ nhà hàng thêm User vào `Employment` của nhà hàng mình, sau đó gán `Permission` (Tạo đơn, Hủy đơn, Xếp bàn) cho nhân viên đó.
- **Role phụ trách:** Brand Owner, Restaurant Manager.

### 3. Đặt Bàn & Sơ Đồ Bàn (Reservation & Table Mapping)
- **Mô tả:** Khách hàng hoặc nhân viên có thể đặt bàn trước. Hệ thống lưu trữ khu vực (Area), sơ đồ toạ độ bàn (pos_x, pos_y), sức chứa (min/max capacity).
- **Hoạt động:** Khách chọn ngày giờ, số người, yêu cầu đặc biệt. Hệ thống chuyển sang `PENDING`. Nhân viên xác nhận chuyển sang `CONFIRMED`. Khi khách tới, Hostess xếp khách vào bàn (bảng `Reservation_Tables`). Quá trình thay đổi trạng thái đặt bàn được lưu lại trong `Reservation_Audit_Log` để chống gian lận.
- **Role phụ trách:** Customer, Hostess, Manager.

### 4. Bán Hàng Trực Tiếp (POS & Order)
- **Mô tả:** Quản lý quy trình gọi món cho khách đang ngồi tại bàn.
- **Hoạt động:** Nhân viên POS chọn `Reservation` (bàn đang có khách) và tạo `Order`. Thêm `OrderItem` vào bill. `OrderItem` có trạng thái bếp (`QUEUED`, `PREPARING`, `READY`).
- **Role phụ trách:** POS Staff (Thu ngân), Waiter (Phục vụ).

### 5. Quản lý Thanh Toán (Transactions)
- **Mô tả:** Quản lý thanh toán đa kênh (Tiền mặt, Thẻ, Momo, ZaloPay).
- **Hoạt động:** Khi khách tính tiền, hệ thống tạo `Transaction` ghi lại số tiền, phương thức, và kết quả từ ví điện tử.
- **Role phụ trách:** Cashier, Customer.

### 6. Đánh Giá, Khuyến Mãi & Thông Báo (CRM)
- **Mô tả:** Chăm sóc khách hàng toàn diện.
- **Hoạt động:** 
  - Khách hàng sau khi ăn xong có thể Review nhà hàng.
  - Chủ nhà hàng tạo `Promotion` (Mã giảm giá).
  - Hệ thống tự gửi `Notifications` (SMS, Email, Zalo) nhắc lịch đặt bàn.
- **Role phụ trách:** Customer, Marketing, Manager.

---

## PHẦN 2: CÁC CHỨC NĂNG THIẾU SÓT CẦN BỔ SUNG TRONG TƯƠNG LAI
*(Thiết kế tối ưu để sau này có thể nâng cấp Database dễ dàng)*

### 1. Quản lý Kho & Nguyên Vật Liệu (Inventory Management)
- **Thiếu sót hiện tại:** Menu đang chỉ quản lý "Món ăn bán ra", chưa quản lý "Nguyên liệu chế biến". Nếu bán 1 ly cafe, kho không tự trừ hạt cafe.
- **Chi tiết bổ sung:**
  - **Làm gì:** Quản lý số lượng tồn kho của nguyên vật liệu, cảnh báo khi sắp hết hàng.
  - **Hoạt động:** Tạo bảng `Ingredients` (Nguyên liệu). Bảng `Recipes` (Công thức) ánh xạ 1 `MenuItem` = bao nhiêu `Ingredients`. Khi `OrderItem` chuyển trạng thái `SERVED`, hệ thống trigger trừ tự động số lượng trong kho.
  - **Role:** Inventory Manager / Chef.

### 2. Màn Hình Hiển Thị Bếp (KDS - Kitchen Display System) Real-time
- **Thiếu sót hiện tại:** Đã có trạng thái bếp `KitchenStatus` nhưng chưa có chức năng Real-time WebSocket cho màn hình bếp.
- **Chi tiết bổ sung:**
  - **Làm gì:** Bếp không cần in bill giấy, chỉ cần nhìn lên màn hình Tablet để biết món nào cần làm trước, món nào làm sau.
  - **Hoạt động:** Dùng Socket.io. Khi Waiter bấm "Gửi bếp", màn hình Tablet ở bếp tự động hiện món ăn. Đầu bếp làm xong, chạm vào màn hình chuyển trạng thái thành `READY`, Tablet của Waiter tự động rung báo "Món đã xong, mang ra bàn". Thiết kế database thêm bảng `KitchenStations` (Bếp nóng, Bếp lạnh, Quầy Bar) để chia order về đúng màn hình.
  - **Role:** Chef, Kitchen Staff.

### 3. Giao Hàng & Mang Đi (Delivery & Takeaway)
- **Thiếu sót hiện tại:** Hệ thống đang bị phụ thuộc vào bảng `Reservations` (Đặt bàn) và `Tables` (Bàn). Thiếu nghiệp vụ cho khách chỉ muốn mua mang về hoặc gọi giao hàng tận nhà.
- **Chi tiết bổ sung:**
  - **Làm gì:** Cho phép đặt đồ ăn ship tận nhà hoặc ghé quán lấy.
  - **Hoạt động:** Tách `Order` độc lập khỏi `Reservation`. Thêm bảng `DeliveryDetails` (Địa chỉ, SĐT người nhận, Phí ship, Tài xế). Tích hợp API Ahamove/GrabExpress để tự book xe.
  - **Role:** Customer, Delivery Driver, Cashier.

### 4. Hệ Thống Thẻ Thành Viên & Điểm Thưởng (Loyalty & Reward System)
- **Thiếu sót hiện tại:** Khách ăn nhiều hay ít đều giống nhau, chưa có thẻ tích điểm để giữ chân khách hàng.
- **Chi tiết bổ sung:**
  - **Làm gì:** Tích điểm sau mỗi hóa đơn, phân hạng thành viên.
  - **Hoạt động:** Thêm bảng `LoyaltyPoints` và `MembershipTiers` (Bạc, Vàng, Kim Cương). Ví dụ: Bill 100k = 10 điểm. Khách được dùng điểm để đổi lấy `Promotion` (Voucher 50k). Database thêm trường `TotalSpent` trong bảng `User`.
  - **Role:** Customer, Marketing Team.

### 5. Quản Lý Ca Làm Việc & Chấm Công (Shift & Attendance)
- **Thiếu sót hiện tại:** Bảng `Employment` mới chỉ có `salary_type` nhưng chưa biết ai đang làm ca nào, làm mấy giờ để tính lương cuối tháng.
- **Chi tiết bổ sung:**
  - **Làm gì:** Lên lịch làm việc hàng tuần cho nhân viên và chấm công tự động.
  - **Hoạt động:** Bổ sung bảng `Shifts` (Ca sáng, Ca tối) và `AttendanceLogs` (Lịch sử quét vân tay/QR code giờ vào/giờ ra). Cuối tháng tự động tính tổng số giờ nhân với lương để ra bảng lương (`Payroll`).
  - **Role:** HR Manager, Restaurant Staff.

### 6. Xếp Hàng Chờ Thông Minh (Smart Waitlist)
- **Thiếu sót hiện tại:** Khi nhà hàng full bàn, khách tới phải đứng chờ thủ công, dễ bỏ đi quán khác.
- **Chi tiết bổ sung:**
  - **Làm gì:** Cho khách quét QR trước cửa để lấy số thứ tự xếp hàng.
  - **Hoạt động:** Bảng `WaitlistEntries`. Khách nhập số điện thoại, hệ thống dự đoán thời gian chờ (dựa vào thời gian ăn trung bình của các bàn đang ngồi). Khi sắp tới lượt (còn 5 phút), hệ thống tự gửi SMS "Bàn của bạn sắp sẵn sàng, vui lòng quay lại quầy".
  - **Role:** Hostess, Customer.

### 7. Báo Cáo Chuyên Sâu (Advanced Analytics Dashboard)
- **Thiếu sót hiện tại:** Thiếu việc tổng hợp data để xuất báo cáo.
- **Chi tiết bổ sung:**
  - **Làm gì:** Thống kê chi phí, doanh thu, mặt hàng bán chạy.
  - **Hoạt động:** Chạy Cronjob lúc 12h đêm hàng ngày gom data từ `Order` và `Transaction` vào bảng `DailySalesAggregate`. Giúp load biểu đồ doanh thu theo tháng cực nhanh mà không làm sập Database. Báo cáo nhân viên xuất sắc nhất (dựa trên ai bán được nhiều đơn nhất).
  - **Role:** Brand Owner, Restaurant Manager.
