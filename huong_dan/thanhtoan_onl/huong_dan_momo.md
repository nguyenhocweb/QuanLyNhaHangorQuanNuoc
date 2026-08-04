# Hướng dẫn Cấu hình Thanh toán MoMo

MoMo là ví điện tử phổ biến nhất Việt Nam. Tuy nhiên, để nhận thanh toán qua API tự động, bạn **bắt buộc** phải đăng ký tài khoản MoMo Doanh nghiệp (MoMo Business).

## 1. Đăng ký MoMo Business
1. Truy cập cổng đối tác của MoMo: [https://business.momo.vn](https://business.momo.vn)
2. Bấm **Đăng ký làm đối tác** và điền đầy đủ thông tin doanh nghiệp (Giấy phép kinh doanh, thông tin người đại diện...).
3. Chờ MoMo xét duyệt hồ sơ (Thường mất từ 1-3 ngày làm việc).

## 2. Lấy thông tin API Keys
Sau khi được duyệt và đăng nhập vào Dashboard MoMo Business:
1. Truy cập menu **Quản lý tích hợp** (Integration) -> **Cấu hình API**.
2. Tại đây bạn sẽ được cấp các thông số sau để điền vào phần mềm:
   - **Partner Code** (Mã đối tác - Thường bắt đầu bằng chữ MOMO...)
   - **Access Key** (Khóa truy cập)
   - **Secret Key** (Khóa bí mật - Dùng để tạo chữ ký bảo mật signature)

## 3. Cấu hình IPN URL (Webhook)
Khác với PayOS cấu hình trực tiếp trên Web, đối với MoMo, chúng ta sẽ truyền động Webhook URL (IPN URL) vào mỗi lần tạo giao dịch.
Tuy nhiên, hệ thống Quản lý Nhà hàng đã lo việc này tự động! Link IPN mặc định sẽ là: `https://ten-mien-cua-ban.com/api/v1/webhook/payment/momo`.

## 4. Chế độ Test (Môi trường Sandbox)
MoMo cung cấp một môi trường thử nghiệm độc lập. Nếu bạn muốn test trước khi Go-live thật:
1. MoMo sẽ cấp cho bạn bộ Test Keys (Partner Code, Access Key, Secret Key của môi trường Test).
2. Khi nhập vào phần mềm Quản lý Nhà hàng, hãy **bật công tắc "Chế độ Test (Sandbox)"**. Hệ thống sẽ tự động chuyển hướng giao dịch sang cổng Test của MoMo.
3. Khi bạn quét mã test bằng app MoMo dev, tiền sẽ không bị trừ thật.
