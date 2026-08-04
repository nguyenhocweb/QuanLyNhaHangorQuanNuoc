# Hướng dẫn Cấu hình Thanh toán VietQR qua PayOS

PayOS là cổng thanh toán hỗ trợ tạo mã QR chuyển khoản tự động (VietQR) hoàn toàn miễn phí, tốc độ nhận Webhook siêu nhanh (1-3s). Đây là giải pháp hoàn hảo nhất hiện nay cho Hệ thống Quản lý Nhà hàng.

## 1. Đăng ký tài khoản PayOS
1. Truy cập trang chủ: [https://payos.vn](https://payos.vn)
2. Bấm **Đăng ký** và tạo tài khoản (Dành cho cá nhân hoặc doanh nghiệp đều được).
3. Sau khi đăng nhập, hệ thống sẽ yêu cầu bạn **Thêm Tài khoản Ngân hàng** (để nhận tiền). Vui lòng kết nối tài khoản ngân hàng của bạn theo hướng dẫn trên màn hình.

## 2. Lấy thông tin API Keys
Để tích hợp PayOS vào hệ thống Quản lý Nhà hàng, bạn cần 3 thông tin quan trọng.
1. Trong màn hình Dashboard của PayOS, bấm vào menu **Cài đặt** ở thanh bên trái.
2. Chọn tab **Tích hợp**.
3. Tại đây bạn sẽ thấy 3 thông tin cần thiết:
   - **Client ID** (Mã ứng dụng)
   - **API Key** (Khóa API)
   - **Checksum Key** (Khóa bảo mật Checksum - Dùng để xác minh dữ liệu chống giả mạo)

*Lưu ý: Tuyệt đối không chia sẻ các mã này cho người ngoài.*

## 3. Cấu hình Webhook URL
Webhook là đường dẫn để PayOS gọi về hệ thống của chúng ta báo "Khách đã chuyển khoản thành công!".
1. Vẫn ở trang **Cài đặt > Tích hợp** trên PayOS.
2. Cuộn xuống phần **Webhook URL**.
3. Bấm "Thiết lập Webhook" và nhập đường dẫn của hệ thống (Ví dụ: `https://ten-mien-cua-ban.com/api/v1/webhook/payment/payos`).
4. Bấm Lưu.

## 4. Nhập vào hệ thống Quản lý Nhà hàng
- **Đối với Brand/Restaurant:** Truy cập trang **Cài đặt Thanh toán**, chọn phương thức "PayOS (VietQR)", sau đó copy dán 3 thông tin `Client ID`, `API Key`, và `Checksum Key` vào form tương ứng rồi bấm Lưu.
- Hệ thống sẽ tự động dùng cấu hình này để sinh mã QR khi khách thanh toán hóa đơn.
