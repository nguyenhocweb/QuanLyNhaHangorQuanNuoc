# TỪ ĐIỂN CÁC HÀM (TOOLS DICTIONARY) DÀNH CHO AI CHATBOX

Tài liệu này liệt kê chi tiết TẤT CẢ các Hàm (Tools/Functions) mà 4 nhân dạng AI (Customer, Manager, Owner, Admin) được phép gọi.
Hệ thống tuân thủ chặt chẽ nguyên tắc **Physical Role-Based Isolation** (Cách ly vật lý theo Vai trò), nghĩa là AI của quyền nào chỉ nhìn thấy và chạy được các hàm nằm trong đúng thư mục quyền đó.

> [!CAUTION]
> Bất kỳ hàm nào có gắn thẻ **[WRITE - CONFIRMATION REQUIRED]** đều KHÔNG ghi thẳng vào Database. Hàm sẽ trả về cờ `needsUserConfirmation: true` để Frontend hiển thị Popup yêu cầu người dùng (Human) bấm nút xác nhận trước khi thực thi. AI chỉ đóng vai trò "Đề xuất".

---

## 1. 🟢 CUSTOMER AI (Khách hàng vãng lai & Thành viên)
Vị trí file: `src/modules/shared/llm/tools/customer/`

| Tên Hàm (Tool Name) | Loại | Mô Tả Chi Tiết Nhiệm Vụ |
| :--- | :---: | :--- |
| **`getPublicMenu`** | READ | Lấy danh sách các món ăn đang hoạt động (`isAvailable: true`). Tự động lọc dựa trên `restaurantId` khách đang xem. Dùng khi khách hỏi "Quán có món gì ngon?", "Lẩu thái giá bao nhiêu?". Hỗ trợ phân trang tối đa 20 món/lần. |
| **`getRestaurantInfo`** | READ | Truy vấn bảng `Operating_Hours`, `Tables` và `Restaurant_Amenities` để trả lời các câu hỏi: "Quán mấy giờ đóng cửa?", "Quán có chỗ đỗ xe ô tô không?", "Hiện tại quán còn bàn trống không?". |
| **`getPublicPromotions`** | READ | Trích xuất các mã giảm giá (Voucher) đang Active và công khai của thương hiệu. Dùng khi khách hỏi "Hôm nay có mã giảm giá nào không?". |
| **`createReservation`** | WRITE - CONFIRMATION REQUIRED | AI đề xuất tạo lịch đặt bàn dựa trên thời gian và số người khách cung cấp. Tự động gắn cứng `userId` từ Token. Khách phải bấm Xác nhận trên màn hình để lưu vào DB. |
| **`createOrder`** | WRITE - CONFIRMATION REQUIRED | AI đề xuất tạo đơn hàng (Gọi món). Gắn cứng `userId`. Yêu cầu xác nhận thao tác từ khách. |

---

## 2. 🟡 MANAGER AI (Quản lý nhà hàng / Chi nhánh)
Vị trí file: `src/modules/shared/llm/tools/manager/`
*Tất cả các hàm đều bị ép cứng `restaurantId` lấy từ Token của Quản lý.*

| Tên Hàm (Tool Name) | Loại | Mô Tả Chi Tiết Nhiệm Vụ |
| :--- | :---: | :--- |
| **`getBranchOrders`** | READ | Lấy danh sách đơn hàng của đúng chi nhánh đó. Hỗ trợ lọc theo trạng thái (`PENDING`, `COMPLETED`). Dùng khi hỏi: "Hôm nay có bao nhiêu đơn đang chờ?". |
| **`getBranchReservations`** | READ | Lấy lịch đặt bàn của chi nhánh. Hỗ trợ lọc theo ngày cụ thể (VD: "Lịch đặt bàn ngày mai thế nào?"). |
| **`getLowStockAlerts`** | READ | Quét bảng `InventoryStock` và đối chiếu với `minStockLevel`. Báo cáo các nguyên vật liệu đang cạn kiệt (vd: "Thịt bò còn 5kg, dưới mức tối thiểu 10kg"). |
| **`getBranchEmployees`** | READ | Danh sách nhân sự đang công tác tại chi nhánh (Đang Active). Dùng khi hỏi: "Hôm nay ai làm ca sáng?". |
| **`createPurchaseRequest`** | WRITE - CONFIRMATION REQUIRED | AI lập nháp Phiếu yêu cầu nhập thêm nguyên liệu để gửi lên Owner duyệt. Quản lý phải duyệt lại nháp trên UI. |
| **`updateOrderStatus`** | WRITE - CONFIRMATION REQUIRED | Đề xuất đổi trạng thái của đơn hàng (VD: "Đơn #123 đã nấu xong"). Yêu cầu Popup xác nhận trên máy Quản lý. |

---

## 3. 🟠 OWNER AI (Chủ thương hiệu / CEO)
Vị trí file: `src/modules/shared/llm/tools/owner/`
*Tất cả các hàm đều bị ép cứng `brandId` lấy từ Token của Chủ thương hiệu.*

| Tên Hàm (Tool Name) | Loại | Mô Tả Chi Tiết Nhiệm Vụ |
| :--- | :---: | :--- |
| **`getBrandRevenueSummary`** | READ | Tổng hợp tổng doanh thu của toàn bộ chuỗi nhà hàng thuộc Brand trong 1 năm hoặc 1 tháng. |
| **`getRestaurantComparison`** | READ | Lấy doanh thu của từng nhà hàng (Restaurant) trong chuỗi, gom nhóm (Group) và xếp hạng để xem chi nhánh nào bán chạy nhất tháng. |
| **`getLoyaltyMetrics`** | READ | Tìm top các khách hàng thân thiết (BrandCustomer) có số điểm Loyalty cao nhất để chăm sóc. |
| **`approvePurchaseOrder`** | WRITE - CONFIRMATION REQUIRED | AI đề xuất DUYỆT (`APPROVE`) hoặc TỪ CHỐI (`REJECT`) phiếu xin nhập hàng do Manager chi nhánh gửi lên. |
| **`manageGlobalMenu`** | WRITE - CONFIRMATION REQUIRED | AI đề xuất cập nhật giá bán mới (`basePrice`) của 1 món ăn áp dụng cho toàn bộ các chi nhánh trong chuỗi. |
| **`managePromotion`** | WRITE - CONFIRMATION REQUIRED | AI lập nháp tạo một chiến dịch Khuyến mãi mới (Tên, Loại % hay tiền mặt, Số tiền). Chủ chuỗi phải bấm Xác nhận trên màn hình. |

---

## 4. 🔴 SYSTEM ADMIN AI (Quản trị viên nền tảng SaaS)
Vị trí file: `src/modules/shared/llm/tools/admin/`

| Tên Hàm (Tool Name) | Loại | Mô Tả Chi Tiết Nhiệm Vụ |
| :--- | :---: | :--- |
| **`getPlatformMetrics`** | READ | Chạy lệnh Count song song để đếm tổng số User, tổng số Brand và tổng số Restaurant đang hoạt động trên toàn hệ thống SaaS. |
| **`getSystemRevenueSummary`** | READ | Tính tổng tiền doanh thu của nền tảng thu được từ việc bán các gói cước Subscription cho Brands. |
| **`approveUpgradeRequest`** | WRITE - CONFIRMATION REQUIRED | Xem xét và đề xuất duyệt đơn xin nâng cấp lên Owner từ một User thường. |
| **`suspendBrand`** | WRITE - CONFIRMATION REQUIRED | Đề xuất Khóa (Banned/Suspended) một thương hiệu nếu phát hiện vi phạm chính sách của nền tảng. Yêu cầu Admin xác nhận thao tác. |
| **`manageAiConfigs`** | WRITE - CONFIRMATION REQUIRED | Cấu hình thay đổi API Key của OpenAI/Gemini hoặc tắt/bật tính năng AI trên toàn hệ thống. |

---

> **Nguyên Tắc Bọc Lót (Fail-Safes):**
> 1. Mọi Tool `READ` đều bị giới hạn `take: 20` trong Prisma để chống Nổ Context Limit.
> 2. Mọi Tool đều được bọc `try/catch`, nếu Prisma quăng lỗi (vd sai kiểu dữ liệu), nó sẽ báo `{"error": "Lý do"}` để LLM đọc và xin lỗi User thay vì làm sập App.
