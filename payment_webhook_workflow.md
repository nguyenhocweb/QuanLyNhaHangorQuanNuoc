# Tài Liệu Giải Thích Chi Tiết Quy Trình Webhook & Payment Service

Tài liệu này giải thích chi tiết luồng dữ liệu (workflow) và chức năng của từng file/hàm trong hai thư mục:
- `backend/src/modules/public/webhook`
- `backend/src/core/services/payment`

Hệ thống được thiết kế theo mẫu **Factory Pattern**, giúp dễ dàng mở rộng nhiều cổng thanh toán khác nhau (PayOS, Momo, VNPay) mà không làm rườm rà file Controller.

---

## 1. Quy Trình Tổng Quan (Webhook Workflow)

Quy trình nhận và xử lý kết quả thanh toán từ cổng PayOS/Momo diễn ra như sau:

1. **Đối tác gọi Webhook**: Khi khách hàng chuyển khoản thành công, PayOS sẽ tự động gọi một HTTP POST request vào đường dẫn Public của hệ thống: `POST /api/v1/webhook/payment/:gatewayCode` (VD: `.../payment/PAYOS`).
2. **Controller tiếp nhận**: `paymentWebhookController` nhận request, trích xuất `gatewayCode` và `webhookData`.
3. **Ủy quyền cho Handler**: Controller đẩy dữ liệu sang `handlePaymentWebhook` nằm ở Core Service để xử lý phần logic dùng chung.
4. **Khởi tạo Gateway**: Handler gọi `PaymentFactory.getGateway('PAYOS', config)` để sinh ra đối tượng Gateway chuyên xử lý cho PayOS.
5. **Xác thực chữ ký**: Handler gọi hàm `gateway.verifyWebhook()` để kiểm tra xem Webhook này có thật sự đến từ PayOS không, hay là do hacker giả mạo.
6. **Xử lý nghiệp vụ**: Nếu chữ ký đúng, Controller sẽ lấy mã giao dịch (`transactionId`) và cập nhật Database (chuyển trạng thái đơn hàng thành `SUCCESS` hoặc `ACTIVE`).
7. **Trả kết quả**: Controller trả về `HTTP 200 OK` cho PayOS để PayOS biết hệ thống đã ghi nhận thành công và ngừng gửi lại Webhook.

---

## 2. Chi Tiết Các File & Hàm Code

### A. Thư mục: `modules/public/webhook`
Nơi chứa các API công khai (Public) để các đối tác thứ 3 (như Ngân hàng, PayOS) có thể gọi vào mà không cần đăng nhập (No Authentication).

#### File: `webhook.controller.js`
- **Hàm:** `paymentWebhookController(req, res)`
- **Nhiệm vụ:** Là cổng giao tiếp HTTP. Nhận Payload từ bên ngoài, gọi Service xử lý và trả về HTTP Response.
- **Đối số nội bộ (Variables):**
  - `gatewayCode` *(string)*: Lấy từ URL `req.params`. Cho biết Webhook này của cổng nào (VD: `'PAYOS'`, `'MOMO'`).
  - `webhookData` *(object)*: Lấy từ `req.body`. Chứa toàn bộ dữ liệu đối tác gửi sang (mã đơn, số tiền, chữ ký bảo mật).
- **Quy trình hoạt động trong code:**
  1. Gọi `handlePaymentWebhook` để xác thực.
  2. Nếu thành công, Query Database tìm bảng `BrandSubscriptionTransaction` dựa trên `externalTransactionId`.
  3. Cập nhật trạng thái giao dịch (`SUCCESS`) và kích hoạt gói cước (`ACTIVE`).
  4. Trả về `res.status(200)` kèm message `success: true`.

---

### B. Thư mục: `core/services/payment`
Nơi chứa các logic cốt lõi (Core) về thanh toán, dùng chung cho toàn bộ dự án (System Admin, Brand Owner, v.v.).

#### 1. File: `webhook.handler.js`
- **Hàm:** `handlePaymentWebhook(gatewayCode, webhookData)`
- **Nhiệm vụ:** Đóng vai trò là cầu nối (Orchestrator). Nó không tự mã hóa chữ ký mà sẽ đẩy cho Gateway tương ứng làm việc đó.
- **Đối số đầu vào:**
  - `gatewayCode` *(string)*: Mã cổng thanh toán (VD: `'PAYOS'`).
  - `webhookData` *(object)*: Dữ liệu Payload từ Webhook.
- **Quy trình hoạt động trong code:**
  1. Nạp `config` (API Key, Checksum Key) từ file `.env`.
  2. Gọi `PaymentFactory` để sinh ra đối tượng Gateway.
  3. Bắt buộc Gateway phải chạy hàm `verifyWebhook()`. Nếu lỗi (sai chữ ký), ném ra lỗi `BadRequestError` chặn ngay lập tức.
  4. Trích xuất mã `orderCode` từ `webhookData.data`.
  5. Trả về `transactionId` cho Controller tiếp tục xử lý Database.

#### 2. File: `payment.factory.js`
- **Hàm:** `PaymentFactory.getGateway(gatewayCode, config)`
- **Nhiệm vụ:** Áp dụng Design Pattern Factory. Dựa vào một "Từ khóa" (gatewayCode), hàm sẽ tự động `new` ra một Class xử lý tương ứng. Điều này giúp sau này muốn thêm VNPay, ZaloPay thì chỉ cần thêm vào câu lệnh `switch...case` mà không phải sửa code cũ.
- **Đối số đầu vào:**
  - `gatewayCode` *(string)*: Mã cổng thanh toán.
  - `config` *(object)*: Chứa các tham số bảo mật (`clientId`, `apiKey`, `checksumKey`).
- **Trả về:** Một object là `Instance` của Class `PayOSGateway` hoặc `VietQRGateway`.

#### 3. File: `gateways/payos.gateway.js`
- **Class:** `PayOSGateway`
- **Nhiệm vụ:** Chứa các logic cụ thể, công thức mã hóa chữ ký ĐỘC QUYỀN của PayOS. Mỗi đối tác có 1 cách băm (Hash) mật khẩu khác nhau, nên phải tách riêng ra file này.

**3.1. Hàm `createPaymentUrl(orderData)`**
- **Nhiệm vụ:** Tạo URL trang thanh toán của PayOS.
- **Đối số:**
  - `orderData` *(object)*: Chứa `{ orderCode, amount, description, returnUrl, cancelUrl }`.
- **Cách hoạt động:**
  - Nối các chuỗi theo thứ tự Anphabet (Yêu cầu bắt buộc của PayOS).
  - Dùng hàm `crypto.createHmac('sha256')` để băm (Hash) chuỗi đó cùng với `checksumKey` sinh ra `signature` (Chữ ký).
  - Đóng gói dữ liệu kèm chữ ký và gọi `fetch()` bắn sang Server API của PayOS (`api-merchant.payos.vn`).
  - Trả về `checkoutUrl` (Đường link cho khách bấm vào) và `qrCode` (Link ảnh QR).

**3.2. Hàm `verifyWebhook(webhookData)`**
- **Nhiệm vụ:** Xác thực xem Webhook bắn vào Backend của mình có đúng là của PayOS không hay là hacker giả mạo.
- **Đối số:**
  - `webhookData` *(object)*: Dữ liệu PayOS gửi đến.
- **Cách hoạt động:**
  - Lấy các field (`amount`, `orderCode`, `description`...) do Webhook gửi tới.
  - Tự tay Backend băm (Hash) các chuỗi này 1 lần nữa bằng `checksumKey` sinh ra biến `signature` nội bộ.
  - So sánh biến `signature` nội bộ với cái `webhookData.signature` do PayOS đính kèm theo.
  - Nếu 2 chữ ký khớp nhau -> 100% là dữ liệu thật từ PayOS -> Trả về `true`. Nếu sai, ném ra Error.
