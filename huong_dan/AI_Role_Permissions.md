# BẢNG PHÂN QUYỀN VÀ CHỨC NĂNG CỦA CÁC NHÂN CÁCH AI (AI PERSONAS RBAC)

Tài liệu này liệt kê chi tiết **Giới hạn hành vi (Prompt Limit)** và **Công cụ được phép sử dụng (Allowed Tools)** của 4 con Bot Chatbox trong hệ thống. Đây là các quyền hạn *thực tế đang có* trong mã nguồn hiện tại.

---

## 1. 🧑‍💼 LỄ TÂN ẢO "MIA" (Role: CUSTOMER / Khách vãng lai)

**Mô tả:** Chuyên viên chăm sóc khách hàng, hỗ trợ khách vãng lai tìm hiểu thông tin và đặt món. Bị cấm tuyệt đối truy cập các số liệu nhạy cảm.

### Quyền hạn Công cụ (Tools):
- 🟢 `getRestaurants`: Xem danh sách các nhà hàng / chi nhánh.
- 🟢 `getRestaurant`: Xem chi tiết thông tin của một nhà hàng cụ thể (địa chỉ, giờ mở cửa).
- 🟢 `getMenuItems`: Xem danh sách thực đơn (món ăn, đồ uống).
- 🟢 `getMenuItem`: Xem chi tiết thông tin của một món ăn (giá cả, thành phần).

### Giới hạn (Bị cấm):
- 🚫 **Cấm** đếm số lượng nhà hàng, số lượng món ăn (`countRestaurant`, `countMenuItem`).
- 🚫 **Cấm** xem thông tin cấp Thương hiệu (`getBrand`, `countBrand`).
- 🚫 **Cấm** xem các báo cáo doanh thu, vận hành.

---

## 2. 👔 TRỢ LÝ ĐIỀU HÀNH "MARCUS" (Role: QUẢN LÝ NHÀ HÀNG)

**Mô tả:** Trợ lý ảo chuyên nghiệp giúp quản lý một chi nhánh nắm bắt tình hình hoạt động của nhà hàng đó. 

### Quyền hạn Công cụ (Tools):
- 🟢 `countRestaurant`: Đếm số lượng nhà hàng (để thống kê cơ bản).
- 🟢 `getRestaurants`: Xem danh sách nhà hàng.
- 🟢 `getRestaurant`: Lấy chi tiết nhà hàng.
- 🟢 `countMenuItem`: Đếm số lượng món ăn trong thực đơn của nhà hàng.
- 🟢 `getMenuItems`: Xem danh sách món ăn.
- 🟢 `getMenuItem`: Xem chi tiết món ăn.

### Giới hạn (Bị cấm):
- 🚫 **Cấm** truy cập thông tin vĩ mô của toàn bộ Thương hiệu (Chỉ giới hạn trong chi nhánh).
- 🚫 **Cấm** xem danh sách Thương hiệu (`getBrand`, `getBrands`).

---

## 3. 🕴️ GIÁM ĐỐC PHÂN TÍCH "CEO BOT" (Role: CHỦ THƯƠNG HIỆU)

**Mô tả:** Trợ lý cấp cao (Data Analyst) làm việc trực tiếp với Chủ thương hiệu. Nói chuyện bằng số liệu, KPI và hiệu suất kinh doanh của toàn chuỗi.

### Quyền hạn Công cụ (Tools):
Được kế thừa toàn bộ quyền của Quản lý, và được cấp thêm quyền cấp cao:
- 🟢 `countBrand`: Đếm số lượng thương hiệu (Nếu họ có nhiều thương hiệu).
- 🟢 `getBrands`: Xem danh sách thương hiệu của họ.
- 🟢 `getBrand`: Xem chi tiết cấu hình của thương hiệu.
- 🟢 `countRestaurant`: Đếm số lượng chi nhánh trong toàn chuỗi.
- 🟢 `getRestaurants`: Xem danh sách toàn bộ chi nhánh.
- 🟢 `getRestaurant`: Xem chi tiết từng chi nhánh.
- 🟢 `countMenuItem`: Thống kê tổng số lượng món ăn trên toàn hệ thống.
- 🟢 `getMenuItems`: Lấy dữ liệu toàn bộ món ăn.
- 🟢 `getMenuItem`: Xem chi tiết món ăn.

### Giới hạn (Bị cấm):
- 🚫 **Cấm** truy cập và quản trị chéo dữ liệu của Thương hiệu khác (Được cấu trúc chặt chẽ qua biến `brandId`).
- 🚫 **Cấm** thao tác cấu hình hệ thống máy chủ (SysAdmin).

---

## 4. 👨‍💻 KIẾN TRÚC SƯ HỆ THỐNG "SYSADMIN" (Role: ADMIN)

**Mô tả:** Báo cáo dưới dạng Log kỹ thuật. Phục vụ cho Quản trị viên hệ thống để theo dõi toàn bộ nền tảng phần mềm.

### Quyền hạn Công cụ (Tools - God Mode):
Được mở full 100% công cụ hiện có trong hệ thống:
- 🟢 `countBrand`, `getBrand`, `getBrands`
- 🟢 `countRestaurant`, `getRestaurant`, `getRestaurants`
- 🟢 `countMenuItem`, `getMenuItem`, `getMenuItems`

### Đặc quyền:
- Không bị giới hạn bởi `brandId` (Truyền `brandId = null` để xem toàn cục).
- Có quyền truy cập vào thông tin cấu hình API Key của tất cả các thương hiệu.

---
> **Lưu ý:** Danh sách trên chỉ bao gồm các Tools (Function Calling) **đã được code và tích hợp thành công** trong lõi hệ thống tính đến thời điểm hiện tại. Khi phát triển thêm các Tools mới (như Tính tổng doanh thu `countRevenue` hay Phân tích đơn hàng `analyzeOrders`), chúng sẽ được bổ sung vào các file `tools.js` tương ứng trong thư mục `personas`.
