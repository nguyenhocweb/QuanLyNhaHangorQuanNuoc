# Kế hoạch "Đập đi xây lại" (Rebuild from scratch) - Module Payment

Dựa trên yêu cầu khắt khe chuẩn Senior Pro Max Leader, tôi đã **XÓA SẠCH** 2 folder `payment_methods` và `admin_payment_configs` ở Frontend để loại bỏ những tư duy kiến trúc rời rạc cũ. Chúng ta sẽ làm lại một tính năng hợp nhất (Unified Feature) chặt chẽ, an toàn và có UI/UX đẳng cấp nhất.

## 🧐 Đánh Giá Tổng Thể Lỗi Hệ Thống Cũ (Tỉ mỉ từng khâu)

### 1. Kiến trúc Rời rạc & Trải nghiệm (UX) Kém
**Thiếu sót:** 
- Tách làm 2 tính năng riêng biệt: Người dùng phải "Thêm phương thức" ở một nơi, rồi lại chuyển sang trang "Cấu hình API" ở một nơi khác.
- UI/UX lỏng lẻo: Danh sách hiển thị những tham số trống rỗng, form API Key thì hardcode chỉ hỗ trợ PAYOS, các cổng khác bị bỏ mặc.
**Mục tiêu (10/10):** Hợp nhất toàn bộ trải nghiệm vào một Feature thống nhất. Admin chỉ cần click vào "VNPAY", hệ thống sẽ tự động mở ra một Modal (hoặc Slide-over panel) chứa đầy đủ thông tin chung và cấu hình API ở các tab khác nhau.

### 2. Sự "Dễ Dãi" Của Zod Validation & Schema
**Thiếu sót:**
- Dùng `z.any()` cho API Config, dẫn đến việc lưu trữ data rác, thiếu cấu trúc.
- Không có Discriminator (phân loại nhánh) cho từng cổng thanh toán. Ví dụ VNPAY bắt buộc phải có `vnp_TmnCode`, trong khi MOMO bắt buộc phải có `partnerCode`. Schema cũ gộp chung lại và cho "optional" toàn bộ.
**Mục tiêu (10/10):** Xây dựng Zod Schema sử dụng `z.discriminatedUnion` dựa trên `providerCode` để bắt lỗi chính xác từng ký tự cho từng loại cổng thanh toán (Strict Type Checking).

### 3. Hiệu Năng & Fetching (React Query)
**Thiếu sót:** 
- Gộp quá nhiều queries rời rạc, không tận dụng staleTime, dễ sinh lỗi đồng bộ dữ liệu giữa bảng `SystemPaymentMethod` và `AdminPaymentConfig`.
**Mục tiêu (10/10):** Viết lại Custom Hooks chuẩn xác, tận dụng `useQueries` nếu cần, và quản lý cache invalidation một cách khoa học.

---

## 🚀 Proposed Changes (Kế hoạch thực thi)

Chúng ta sẽ chỉ xây dựng lại **MỘT FOLDER DUY NHẤT** là `fe/src/features/system_admin/payment_methods` (đóng vai trò Controller trung tâm cho cả thông tin chung lẫn cấu hình bảo mật).

### 1. Cấu trúc Schema Tiên Tiến (Zod Discriminated Union)
Tạo `fe/src/features/system_admin/payment_methods/schema/payment.schema.ts`.
Sẽ định nghĩa 2 Schema:
- **`methodMetadataSchema`**: Dành cho tên, mô tả, trạng thái hoạt động.
- **`apiConfigSchema`**: Sử dụng `z.discriminatedUnion("providerCode", [...])`.
  - Nhánh `VNPAY`: Bắt buộc `vnp_TmnCode`, `vnp_HashSecret`, `vnp_Url`.
  - Nhánh `MOMO`: Bắt buộc `partnerCode`, `accessKey`, `secretKey`.
  - Nhánh `PAYOS`: Bắt buộc `clientId`, `apiKey`, `checksumKey`.

### 2. Services & Hooks (API Layer)
Tạo thư mục `hook/` và `service/` tập trung:
- `usePaymentMethods.ts`: Lấy danh sách tổng.
- `usePaymentConfig.ts`: Lấy và Cập nhật cấu hình API của một phương thức. Sẽ gọi đến endpoint của backend `admin_payment_config`.
*(Lưu ý: Chúng ta sẽ tái sử dụng các API Backend hiện có, vì Backend chia ra 2 Router `system-admin/payment-methods` và `system-admin/payment-configs` là hợp lý về mặt Micro-service & DB separation. Việc gộp trải nghiệm là trách nhiệm của Frontend).*

### 3. Giao diện (UI Components - Premium Feel)
Xây dựng các component với Animation và Styling cao cấp:
- **`PaymentMethodList.tsx`**: Dạng lưới (Grid), thẻ Card bo góc mềm mại, hiển thị Logo lớn, Badge trạng thái.
- **`PaymentConfigSlideOver.tsx`**: (Slide-over panel trượt từ phải sang thay vì Modal nhỏ). Panel này chia làm 2 Tabs:
  - **Tab 1: Thông tin chung** (Tên, Trạng thái bật/tắt toàn cầu).
  - **Tab 2: Kết nối API** (Form render động dựa theo `apiConfigSchema` đã định nghĩa. Có chức năng ẩn/hiện Secret Keys (masking)).

## User Review Required
> [!IMPORTANT]
> Đây là một cuộc đại tu toàn diện cho Frontend. Giao diện Slide-over và Zod Schema Strict (bắt buộc nhập đúng key của từng cổng) sẽ đòi hỏi code khá phức tạp nhưng đổi lại UX sẽ đạt 10/10. Bạn có đồng ý triển khai cấu trúc Frontend mới này không?

## Verification Plan
### Manual Verification
- Test giao diện Grid danh sách cổng thanh toán.
- Bấm vào một cổng bất kỳ (VD: VNPAY), Slide-over trượt ra.
- Chuyển sang Tab "Kết nối API", form bắt lỗi đỏ rực (Validation Error) nếu cố tình để trống `vnp_TmnCode`.
- Submit thành công, dữ liệu được ghi vào đúng 2 bảng (thông qua 2 API độc lập).
