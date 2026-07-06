# Hướng Dẫn Chạy Dự Án (Quản Lý Nhà Hàng)

Dự án này bao gồm 2 script (file `.bat`) để hỗ trợ chạy nhanh trên hệ điều hành Windows chỉ với 1 cú click chuột (hoặc gõ tên file trên terminal).

## 1. Chạy lần đầu (Tạo bảng & Thêm dữ liệu mẫu)
👉 **Sử dụng file:** `run-setup.bat`

**Tác dụng của file này:**
1. Chạy các lệnh của Prisma (`npm run prisma:generate` và `npm run prisma:push`) để tạo/cập nhật schema database.
2. Chạy migration của MongoDB (`npm run db:mig`).
3. Chạy file seed để thêm dữ liệu mẫu vào Database (`npm run db:seed`).
4. Tự động mở 2 cửa sổ CMD mới: 
   - Một cửa sổ chạy Backend (cổng mặc định tùy theo file `.env`).
   - Một cửa sổ chạy Frontend (`npm run dev`).

**Khi nào nên dùng:**
Chỉ nên dùng cho lần đầu tiên cài đặt dự án, khi database của bạn hoàn toàn trống và chưa có bảng/collection nào. Không nên chạy lại file này nếu đã có dữ liệu thực tế vì nó có thể chạy lại seed/migration.

---

## 2. Chạy bình thường (Đã có sẵn dữ liệu)
👉 **Sử dụng file:** `run-start.bat`

**Tác dụng của file này:**
- Bỏ qua các bước setup Database.
- Trực tiếp mở 2 cửa sổ CMD mới để khởi động luôn Backend và Frontend.

**Khi nào nên dùng:**
Dùng hàng ngày, mỗi khi bạn muốn bật dự án lên để code hoặc sử dụng.

---

## 💡 Lưu ý chung
- Trước khi chạy bất kỳ file nào, hãy chắc chắn rằng bạn đã chạy `npm install` ở cả thư mục `backend` và `fe` nếu đây là lần đầu clone project về máy.
- Đảm bảo bạn đã cấu hình đúng thông tin kết nối Database trong file `.env` của `backend`.
- Để dừng dự án, bạn chỉ cần tắt 2 cửa sổ CMD của Backend và Frontend đi là xong.
