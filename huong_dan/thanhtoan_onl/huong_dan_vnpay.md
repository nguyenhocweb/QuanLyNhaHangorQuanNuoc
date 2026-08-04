# Hướng dẫn Cấu hình Thanh toán VNPay

VNPay là cổng thanh toán hỗ trợ thẻ ATM nội địa, QR Code của app ngân hàng và thẻ Quốc tế (Visa/Mastercard). Đây là cổng thanh toán quy chuẩn đòi hỏi đăng ký khá khắt khe.

## 1. Đăng ký Đối tác VNPay
1. Truy cập trang chủ VNPAY: [https://sandbox.vnpayment.vn](https://sandbox.vnpayment.vn) (Để tạo tài khoản Test Sandbox) hoặc trang kinh doanh chính thức của VNPAY.
2. Nếu đăng ký thật, bạn cần gửi hồ sơ cứng hoặc liên hệ nhân viên sales của VNPAY để ký hợp đồng dịch vụ.
3. VNPAY sẽ phản hồi và gửi mail cấu hình hệ thống cho bạn.

## 2. Lấy thông tin API Keys
Dù là môi trường Test hay Thật, VNPAY sẽ gửi cho bạn qua Email 2 thông tin cốt lõi sau:
1. **vnp_TmnCode**: Mã Website (Terminal Code - Ví dụ: `CGX789AB`).
2. **vnp_HashSecret**: Chuỗi bí mật dùng để tạo Checksum (rất dài và mã hóa).

Bạn cần nhập 2 thông tin này vào Hệ thống Quản lý Nhà hàng ở trang Cài đặt Thanh toán.

## 3. Cấu hình Môi trường URL
Khi kết nối VNPAY, có 2 đường link khác nhau tùy vào môi trường:
- **Sandbox (Test):** `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- **Thật (Live):** Hệ thống sẽ dùng link chính thức VNPAY cung cấp khi Go-live.
*(Phần mềm Quản lý Nhà hàng sẽ tự động đổi link này dựa trên việc bạn có bật công tắc "Chế độ Test" hay không).*

## 4. Cấu hình IPN URL (Webhook)
Giống như PayOS, VNPAY cần nhận 1 URL cố định để báo cáo kết quả giao dịch về hệ thống.
1. Bạn phải gửi IPN URL cho bên VNPAY thông qua Email hoặc Cấu hình trong trang quản lý Merchant.
2. Đường dẫn chuẩn của hệ thống: `https://ten-mien-cua-ban.com/api/v1/webhook/payment/vnpay`.
3. Lưu ý: VNPAY yêu cầu IPN URL phải chạy HTTPs (SSL) và không bị chặn bởi tường lửa.
