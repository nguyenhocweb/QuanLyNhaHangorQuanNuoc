# BỘ NHỚ NGỮ CẢNH DỰ ÁN (PROJECT CONTEXT)

> *File này là bộ não của Agent. Nó không chứa code, mà chứa CÁC LÝ DO đằng sau code.*

## 1. Mục Tiêu Dự Án (DoD Tóm Tắt)
[VD: Xây dựng hệ thống nhà hàng MVP. Chịu tải 1000 CCU].

## 2. Các Quyết Định Kiến Trúc Đã Chốt (Từ Bước 2,3,4)
- **Tech Stack:** [VD: Node.js, PostgreSQL, React].
- **Bảo Mật:** [VD: JWT xoay vòng, Mã hóa PII với AWS KMS].
- **Hợp Đồng API:** [Link tới swagger.yaml].

## 3. Nhật Ký Tính Năng (Feature Log) - BẮT BUỘC ĐÍNH KÈM TEST
| Tính Năng | Trạng Thái | Bằng Chứng (Integration Test Output) |
|---|---|---|
| Đăng nhập (Auth) | Hoàn Thành | `[PASS] test/integration/auth.test.js (200ms)` |
| Tính tiền (Billing) | Đang code | (Chưa có test) |

## 4. Nhật Ký Lỗi Khó (Known Issues & Workarounds)
- [VD: Lỗi CORS khi fetch từ Frontend. Đã fix bằng cách cấu hình Nginx reverse proxy thay vì sửa logic BE].


---
*Lưu ý: Nếu file này vượt quá 500 lines, Agent BẮT BUỘC phải tạo một bản tóm tắt các tính năng cũ và nén chúng lại (Archive).*
