# Kế Hoạch Triển Khai: Thanh Toán VietQR (Mô hình Webhook Cá Nhân - Không lưu API Key)

Dựa trên việc đọc và phân tích các file Prisma Schema hiện tại trong hệ thống, dưới đây là bản kế hoạch chi tiết để áp dụng mô hình thanh toán chuyển khoản trực tiếp cho nhà hàng thông qua SePay/Casso (bằng đường link Webhook có Token) mà không cần lưu khóa bảo mật.

## 1. Phân Tích Schema: Dư Thừa & Thiếu Sót

### Cái Dư Thừa (Redundant)
1. **Sự tồn tại song song của `BrandPaymentConfig` và `RestaurantPaymentConfig`**
   - **Lý do dư thừa:** Nếu nghiệp vụ của bạn là **Mỗi nhà hàng (chi nhánh) có một tài khoản ngân hàng riêng** để nhận tiền từ khách, thì bạn chỉ cần `RestaurantPaymentConfig`. Việc tồn tại thêm `BrandPaymentConfig` sẽ làm logic code phức tạp lên rất nhiều vì hệ thống phải if/else xem "Đơn hàng này dùng tài khoản của Brand hay của Restaurant?".
   - **Khuyến nghị:** Nếu toàn bộ tiền của các chi nhánh đều gom về 1 tài khoản chung của công ty mẹ (Brand), hãy XÓA `RestaurantPaymentConfig`. Nếu tiền về từng quán, hãy XÓA `BrandPaymentConfig`. (Mình giả định bạn chọn Tiền về từng quán).

### Cái Còn Thiếu (Missing)
1. **Model `Order` thiếu `paymentConfigId` (hoặc cách mapping nguồn tiền)**
   - Hiện tại `Order` chỉ có `systemPaymentMethodId` (biết là trả bằng VIETQR), nhưng không trỏ tới cấu hình nào. Dù BE có thể query qua `Restaurant` để lấy `RestaurantPaymentConfig`, nhưng lưu cứng ID cấu hình vào Order sẽ an toàn hơn (lịch sử không bị đổi nếu quán đổi STK).

2. **Cấu trúc JSON `configData` chưa được định hình rõ ràng**
   - Vì chúng ta không lưu API Key, field `configData` (thuộc `RestaurantPaymentConfig`) cần được quy định chuẩn format để phục vụ cho Webhook.

---

## 2. Kế Hoạch Thay Đổi Database (Prisma)

Không cần xóa bảng (nếu bạn muốn giữ linh hoạt), nhưng chúng ta sẽ quy chuẩn lại data sẽ lưu vào JSON.

### Chuẩn hóa `configData` trong `RestaurantPaymentConfig`
Field `configData` kiểu `Json` bắt buộc phải lưu theo Interface sau:
```typescript
{
  "bankId": "970436",           // BIN của ngân hàng Vietcombank
  "accountNo": "0123456789",    // Số tài khoản của chủ quán
  "accountName": "NGUYEN VAN A",// Tên chủ quán
  "webhookToken": "secret_abc123" // Chuỗi Token ngẫu nhiên BE tự sinh ra cho quán này
}
```
*Lưu ý: Không có bất kỳ API Key nào của SePay ở đây.*

---

## 3. Quy Trình Cài Đặt Cho Nhà Hàng

1. **FE (Trang Quản Trị Nhà Hàng):** Cung cấp Form cho chủ quán nhập Ngân hàng, Số tài khoản, Tên tài khoản.
2. **BE (Lưu Cấu Hình):** Nhận data từ FE. Tự động dùng thư viện `crypto.randomBytes(16)` sinh ra một cái `webhookToken` duy nhất. Lưu toàn bộ vào DB dưới dạng JSON.
3. **FE (Hiển thị Link):** FE hiển thị cho chủ quán một URL: 
   `https://api.quanlynhahang.com/v1/payment/sepay-webhook?token=secret_abc123`
4. **Hành động của Chủ Quán:** Chủ quán tải App SePay về máy, copy cái link trên kia dán vào App SePay của họ. Xong!

---

## 4. Kế Hoạch Triển Khai Backend & API

### A. API Tạo QR Code (GET/POST `/api/v1/payment/qr-generate/:orderId`)
1. Lấy thông tin `Order` và `RestaurantPaymentConfig` từ DB.
2. Dùng thư viện tĩnh (hoặc gọi free qua `img.vietqr.io`) để lấy ảnh QR. 
   - `addInfo` (Nội dung) = `PAY O${order.order_number}`
   - `amount` = `order.total_amount`
3. Trả URL ảnh về cho FE hiển thị.

### B. API Webhook Nhận Tiền (POST `/api/v1/payment/sepay-webhook`)
API này là Public, SePay sẽ gọi vào khi quán có tiền vào.
1. Lấy `token` từ `req.query.token`.
2. Truy vấn DB: `findFirst` trong `RestaurantPaymentConfig` xem có cấu hình nào chứa `"webhookToken": "cái_token_kia"` không.
   - Nếu không có -> Ném lỗi 403 (Chống hack giả mạo).
3. Nếu có, trích xuất chuỗi nội dung chuyển khoản từ Body của SePay gửi sang. (VD: `... PAY O10293 ...`).
4. Lấy mã đơn hàng `O10293`, tìm trong DB bảng `Order`.
5. Kiểm tra số tiền `amount` nhận được >= `total_amount` của đơn hàng chưa.
6. Nếu đủ: Đổi `status` đơn hàng thành `PAID`. Kích hoạt Real-time (Socket/SSE) xuống thiết bị của quán báo có tiền.

---

## User Review Required

> [!CAUTION]
> Theo schema hiện tại, dự án của bạn có bảng `Transaction` (dành cho thanh toán của khách) và `BrandSubscriptionTransaction` (dành cho chủ Brand mua gói phần mềm).
> - Bạn có muốn giữ lại `BrandPaymentConfig` để tương lai dùng cho việc chi nhánh Brand dùng chung 1 STK không, hay muốn mình vứt bỏ nó khỏi logic và chỉ focus vào `RestaurantPaymentConfig`?

## Open Questions

> [!WARNING]
> Webhook từ SePay sẽ gọi liên tục vào Server bất cứ khi nào điện thoại chủ quán có tin nhắn biến động số dư (kể cả người nhà chuyển khoản cho chủ quán không liên quan tới đơn hàng). 
> - BE sẽ phải dùng Regex để bóc tách xem nội dung có chữ `PAY O...` hay không rồi mới xử lý. Bạn đã rõ ràng về đặc thù này của mô hình SePay chưa?
