# Kế hoạch Triển khai: Hệ thống Đánh giá Toàn diện (All Roles)

Kế hoạch này phác thảo cấu trúc kỹ thuật (Backend APIs & Frontend Components) để xây dựng hệ thống Đánh giá nhà hàng chuẩn "Pro Max" cho cả 3 vai trò: **Khách hàng**, **Chủ nhà hàng (Brand Owner)**, và **Quản trị viên (System Admin)**.

## User Review Required

> [!IMPORTANT]
> - Do hệ thống Review liên quan đến nhiều Roles, chúng ta sẽ cần chia nhỏ công việc thành 3 Giai đoạn (Phases) tương ứng với 3 đối tượng.
> - Bạn có muốn ưu tiên làm Giai đoạn nào trước không? (Ví dụ: Làm Brand Owner trước để xem review, hay làm Khách hàng trước để viết review?)

---

## Giai đoạn 1: Khách hàng (Customer)
*Mục tiêu: Cho phép người ăn xong viết review, đính kèm ảnh, thả tim (helpful) và báo cáo.*

### 1. Backend (`src/modules/customer/review/`)
Tuân thủ chuẩn SRP (Single Responsibility Principle):
- `POST /` (`review.create`): Khách tạo Review mới. *Lưu ý: Chỉ cho phép tạo nếu `reservationId` thuộc về user này và có trạng thái `COMPLETED`.*
- `GET /restaurant/:restaurantId` (`review.get-by-restaurant`): Lấy danh sách Review `APPROVED` để hiển thị trên trang chủ nhà hàng.
- `PUT /:id` (`review.update`): Sửa đánh giá (nếu chưa quá hạn).
- `DELETE /:id` (`review.delete`): Khách tự xóa đánh giá.
- `POST /:id/helpful` (`review.helpful`): Tăng `helpful_count`. Thêm logic chặn 1 user spam click liên tục (có thể cần 1 bảng trung gian lưu lịch sử thả tim, hoặc tạm thời chỉ tăng số đếm).
- `POST /:id/report` (`review.report`): Khách report comment người khác. Update `status = PENDING`.

### 2. Frontend (`fe/src/features/customer/reviews/`)
- **Components:**
  - `ReviewList.tsx`: Hiển thị list review của nhà hàng (có sort theo Mới nhất / Hữu ích nhất).
  - `ReviewCard.tsx`: Hiển thị 1 review cụ thể (có ảnh, avatar, số sao, nút Hữu ích, nút Report).
  - `CreateReviewModal.tsx`: Form đánh giá đa chiều (Đồ ăn, Phục vụ, Không gian) + Component Upload Ảnh lên Cloudinary (chữ ký từ Backend).
- **Hooks:** `useGetRestaurantReviews`, `useCreateReview`, `useReactReview` (Thả tim).

---

## Giai đoạn 2: Chủ Nhà hàng (Brand Owner)
*Mục tiêu: Đọc thống kê review, xem chi tiết và trả lời khách hàng.*

### 1. Backend (`src/modules/brand_owner/review/`)
- `GET /` (`review.get`): Lấy toàn bộ đánh giá của các nhà hàng trực thuộc Brand. Hỗ trợ query params: `?restaurantId=...&rating=5&status=APPROVED`.
- `PUT /:id/reply` (`review.reply.update`): Cập nhật trường `staff_response`.
- `POST /:id/report` (`review.report`): Chủ nhà hàng report comment xấu. Chuyển `status = PENDING`.

### 2. Frontend (`fe/src/features/brand_owner/reviews/`)
- **Components:**
  - `ReviewsDashboard.tsx`: Tổng quan số lượng review theo sao (1-5 sao).
  - `ReviewsTable.tsx`: Bảng danh sách các review.
  - `ReviewDetailModal.tsx`: Xem chi tiết review và Form nhập `staff_response`.
- **Hooks:** `useGetBrandReviews`, `useReplyReview`, `useReportReview`.

---

## Giai đoạn 3: Quản trị viên (System Admin)
*Mục tiêu: Đóng vai trò tòa án tối cao, duyệt các bài bị report và quản lý toàn bộ nội dung.*

### 1. Backend (`src/modules/system_admin/review/`)
- `GET /` (`review.get`): Lấy toàn bộ review trên toàn sàn. Mặc định sort những review có `status = PENDING` lên đầu để dễ kiểm duyệt.
- `PUT /:id/moderate` (`review.moderate.update`): Đổi trạng thái từ `PENDING` sang `APPROVED` (Cho qua) hoặc `REJECTED_SPAM` (Ẩn vĩnh viễn).
- `DELETE /:id` (`review.delete`): Hard delete (xóa hẳn khỏi DB nếu là rác).

### 2. Frontend (`fe/src/features/system_admin/reviews/`)
- **Components:**
  - `ModerationQueue.tsx`: Danh sách các comment đang bị Report (`PENDING`).
  - `ModerationAction.tsx`: Hai nút bấm to bự "Duyệt (Approve)" và "Xóa (Reject)".

---

## Verification Plan
1. **Kiểm tra nghiệp vụ Khách hàng:** Khách chỉ review được bàn đã đặt xong (COMPLETED). Thử đăng một review kèm ảnh Cloudinary.
2. **Kiểm tra tương tác:** Dùng tài khoản khách khác vào bấm "Report", kiểm tra xem Review có lập tức bị đổi thành `PENDING` và biến mất khỏi UI của nhà hàng hay không.
3. **Kiểm tra nghiệp vụ System Admin:** Admin vào tab "Chờ duyệt", bấm "Approve" (Khôi phục lại bài) hoặc "Reject" (Cho ẩn vĩnh viễn).
4. **Kiểm tra nghiệp vụ Brand Owner:** Chủ nhà hàng vào xem Review của mình và nhập "Cảm ơn bạn đã ghé thăm". Đảm bảo dòng chữ đó hiện ra phía dưới Review bên App Khách hàng.
