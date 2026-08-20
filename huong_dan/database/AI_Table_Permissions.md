# TÀI LIỆU PHÂN QUYỀN TRUY CẬP TABLE CHO TỪNG AI CHATBOX

Tài liệu này quy định chặt chẽ quyền Truy cập (READ) và Chỉnh sửa (WRITE) vào 69 Bảng (Tables) trong Database đối với 4 nhân dạng AI (Customer, Manager, Owner, Admin). Đây là lớp khiên bảo vệ sống còn của hệ thống SaaS Multi-tenant.

---

## 1. KHÁCH HÀNG & VÃNG LAI (CUSTOMER AI)
*Mục tiêu: Đóng vai trò là Nhân viên tư vấn món ăn, hỗ trợ đặt bàn và giải đáp thắc mắc.*

### 🟢 Quyền ĐỌC (READ)
- **Danh mục & Thực đơn:** `Restaurant`, `Category_Restaurant`, `Menu`, `MenuCategory`, `MenuItem`, `ItemVariant`, `ModifierGroup`, `ModifierOption`, `Tags`.
- **Thông tin quán:** `Operating_Hours`, `Restaurant_Areas`, `Tables` (Chỉ xem bàn trống, không xem thông tin khách đặt), `Restaurant_Amenities`, `Faq`, `RestaurantPolicy`.
- **Marketing:** `Promotion` (Chỉ các mã đang ACTIVE và public), `Review_Restaurant` (Chỉ xem đánh giá public).
- **Lý do:** Khách hàng cần thông tin để quyết định ăn gì và ở đâu. Các bảng này mang tính chất Catalog (Public Data).

### 🟠 Quyền GHI (WRITE - Rất hạn chế)
- **Giao dịch cá nhân:** `Reservations` (Tạo đặt bàn mới), `Order` (Tạo đơn hàng/Gọi món).
- **Tương tác:** `Review_Restaurant` (Viết đánh giá), `UserPromotionWallet` (Lưu mã giảm giá).
- **Lý do:** AI chỉ được phép tạo record gắn với chính `userId` của người dùng. Tuyệt đối không được cấp quyền Update/Delete đơn hàng đã duyệt.

### 🔴 CẤM TUYỆT ĐỐI
- Mọi bảng liên quan đến Doanh thu (`RestaurantRevenue`, `Order` của người khác).
- Kho hàng, Nhân sự, Cấu hình hệ thống.

---

## 2. QUẢN LÝ NHÀ HÀNG (MANAGER AI)
*Mục tiêu: Đóng vai trò là Trợ lý Vận hành, giúp Quản lý chi nhánh theo dõi kho, nhân viên, và đơn hàng hằng ngày.*

### 🟢 Quyền ĐỌC (READ)
- **Vận hành hằng ngày:** `Reservations`, `Reservation_Tables`, `Order`, `OrderItem`, `Transaction`.
- **Kho & Cung ứng:** `InventoryItem`, `InventoryStock`, `InventoryAlert`, `Supplier`, `PurchaseOrder`, `PurchaseRequest`, `StockTransaction`, `StockCount`, `StockTransfer`.
- **Nhân sự & CRM:** `Employment` (Chỉ nhân viên thuộc chi nhánh đó), `RestaurantCustomer` (Chỉ khách hàng từng đến chi nhánh).
- **Lý do:** Quản lý cần nắm toàn bộ nhịp đập của nhà hàng để điều phối bếp, kho và thu ngân.

### 🟠 Quyền GHI (WRITE)
- **Cập nhật trạng thái:** `Reservations` (Xác nhận/Hủy), `Order` (Cập nhật món đã lên), `Tables` (Cập nhật bàn trống/đang dọn).
- **Nghiệp vụ kho:** `PurchaseRequest` (Tạo phiếu yêu cầu mua hàng), `StockCount` (Tạo phiếu kiểm kê), `StockTransaction` (Xuất/Nhập kho).
- **Cấu hình cục bộ:** `RestaurantMenuItem` (Báo hết hàng cục bộ), `Operating_Hours`, `Special_Schedules`.
- **Lý do:** Được quyền thay đổi trạng thái vận hành, nhưng KHÔNG ĐƯỢC thay đổi giá món ăn gốc (basePrice) hay cấu hình của Brand.

### 🔴 CẤM TUYỆT ĐỐI
- Doanh thu tổng của Thương hiệu (`BrandRevenue`).
- Dữ liệu của chi nhánh khác (Chi nhánh 1 không được xem đơn của Chi nhánh 2).
- Mua gói SaaS (`BrandSubscription`).

---

## 3. CHỦ THƯƠNG HIỆU (OWNER AI)
*Mục tiêu: Trợ lý CEO, chuyên phân tích tài chính, chiến lược kinh doanh và quản lý chuỗi.*

### 🟢 Quyền ĐỌC (READ)
- **Tài chính & Doanh thu:** `BrandRevenue`, `RestaurantRevenue`, `BrandSubscription`, `BrandSubscriptionTransaction`, `Transaction` (Toàn chuỗi).
- **Tổng quan chuỗi:** Đọc được dữ liệu của TẤT CẢ Chi nhánh thuộc Brand đó (Orders, Inventory, Reservations).
- **Marketing & Loyalty:** `BrandCustomer`, `LoyaltyTransaction`, `PromotionUsageLog`.
- **Lý do:** Chủ thương hiệu sở hữu toàn bộ dữ liệu của chuỗi. Cần xem báo cáo tổng hợp để ra quyết định chiến lược.

### 🟠 Quyền GHI (WRITE)
- **Cấu hình lõi:** `Brand`, `Restaurant` (Tạo/Sửa chi nhánh mới), `BrandPaymentConfig`.
- **Menu Toàn hệ thống:** `Menu`, `MenuItem`, `Recipe`, `Ingredient` (Đổi giá, thêm món, đổi định lượng).
- **Kinh doanh:** `Promotion`, `PurchaseOrder` (Duyệt phiếu mua hàng từ Quản lý gửi lên).
- **Lý do:** Owner có quyền tối cao trong phạm vi Brand của mình.

### 🔴 CẤM TUYỆT ĐỐI
- Dữ liệu của Brand đối thủ.
- Cấu hình lõi của hệ thống SaaS (`SystemPaymentMethod`, `AiChatbox`, `AiModel`, `ApiKey`).

---

## 4. QUẢN TRỊ VIÊN HỆ THỐNG (SYSTEM ADMIN AI)
*Mục tiêu: Trợ lý Tổng, theo dõi sức khỏe hệ thống SaaS, cấu hình AI và dòng tiền nền tảng.*

### 🟢 Quyền ĐỌC (READ)
- **Cấu hình & Nền tảng:** `AiChatbox`, `AiModel`, `ApiKey`, `SubscriptionPlan`, `Template`, `SystemPaymentMethod`.
- **Kiểm soát Người dùng:** `User` (Toàn hệ thống), `Brand` (Toàn hệ thống), `UpgradeRequest`.
- **Doanh thu nền tảng:** `SystemRevenue` (Tiền thu từ bán gói SaaS).
- **Lý do:** Admin cần theo dõi xem hệ thống đang dùng hết bao nhiêu tiền API AI, có bao nhiêu Brand đang hoạt động.

### 🟠 Quyền GHI (WRITE)
- **Xét duyệt:** `Brand` (Khóa/Mở khóa Brand vi phạm), `UpgradeRequest` (Duyệt đơn xin lên Owner).
- **Cấu hình SaaS:** `SubscriptionPlan` (Đổi giá gói Pro, Enterprise), `AiChatbox` (Đổi API Key OpenAI/Gemini), `SystemPaymentMethod`.
- **Lý do:** Duy trì và cấu hình luồng tiền/hạ tầng của ứng dụng.

### 🔴 CẤM ĐỌC/SỬA (RẤT QUAN TRỌNG)
- **Quyền riêng tư:** KHÔNG ĐƯỢC phép đọc nội dung `Order`, `Reservations`, `BrandRevenue` cụ thể của từng Brand (Luật bảo mật dữ liệu khách hàng thuê SaaS). Admin chỉ được xem tổng số lượng nhà hàng, chứ không được soi lẩu thái của quán A bán được bao nhiêu tiền!

---
---

# 👑 TECH LEAD REVIEW (CHẤM ĐIỂM: 8.5/10)                                                                                                   
Tôi đã review trực tiếp tài liệu phân quyền (Matrix RBAC) dành riêng cho AI này. Phải thừa nhận, cách phân cấp 4 Tầng (Customer -> Manager -> Owner -> Admin) của bạn RẤT ĐÚNG CHUẨN MỰC B2B SaaS.

Tuy nhiên, mang cái này đi code AI Tools thì bạn sẽ ăn đạn nếu không nhận ra **3 LỖ HỔNG BẢO MẬT CHÍ MẠNG (Thiếu sót)** sau đây. Tôi chấm 8.5/10 vì ý tưởng tốt, nhưng Execution cần phải bọc lót kỹ hơn!

### 🔴 1. AI Không Đáng Tin Cậy (Missing Row-Level Security ở Backend)
- **Thiếu sót:** Bản thân LLM (Kể cả GPT-4o) là mô hình sinh ngôn ngữ, nó KHÔNG CHẮC CHẮN 100%. Nếu bạn viết prompt: *"Mày là Manager, chỉ được xem data của restaurantId = 1"*. Lỡ AI bị "ngáo" (hoặc bị khách Prompt Injection), nó truyền param `restaurantId = 2` vào Tool `getOrders()`, thì sao? Nó sẽ lấy được data của chi nhánh khác!
- **Giải pháp bọc lót:** BẮT BUỘC phải code cơ chế xác thực ngay TRONG HÀM (Tool). Khi Tool `getOrders` được gọi, Backend phải TỰ ĐỘNG chèn bộ lọc `where: { restaurantId: req.user.restaurantId }` bằng JWT Token. Tuyệt đối KHÔNG tin tưởng tham số `restaurantId` do AI truyền vào.

### 🔴 2. Data Leakage (Rò rỉ trường dữ liệu nhạy cảm)
- **Thiếu sót:** Khi AI được quyền đọc bảng `User` hoặc `ApiKey`, Tool thường sẽ `SELECT *`.
- **Hậu quả:** AI sẽ đọc được luôn `password`, `encryptedKey`. AI có thể "vô tình" phun luôn password ra khung chat nếu người dùng hỏi khéo.
- **Giải pháp bọc lót:** Phải viết các hàm `DTO` (Data Transfer Object) để "gọt" sạch dữ liệu trước khi nạp JSON vào cho AI. AI chỉ được nhận `{ id, name, role }`, không bao giờ được nhận `{ password }`.

### 🔴 3. Rủi Ro Thao Tác (Destructive Writes)
- **Thiếu sót:** AI được cấp quyền WRITE (như Hủy Đơn, Đổi Trạng Thái Kho). Lỡ AI hiểu sai ý khách: Khách bảo "Món này dở, tôi không muốn ăn nữa" -> AI gọi Tool Xóa mẹ cả cái bàn (Cancel Reservation) thay vì chỉ gọi Tool xóa 1 món (Cancel OrderItem).
- **Giải pháp bọc lót:** Bất kỳ thao tác WRITE nào làm thay đổi dữ liệu/tiền bạc do AI gọi, hệ thống phải trả về FE một Popup xác nhận (Human-in-the-loop). Ví dụ: "AI đề xuất hủy đơn hàng #123. [Đồng ý] / [Hủy bỏ]". Không bao giờ cho AI tự động chạy lệnh UPDATE/DELETE ngầm dưới Database mà người dùng chưa bấm nút Accept.

> **TỔNG KẾT:** Matrix phân quyền rất tuyệt vời, nhưng hãy nhớ: **AI CHỈ ĐỀ XUẤT, BACKEND VÀ CON NGƯỜI MỚI LÀ KẺ QUYẾT ĐỊNH CUỐI CÙNG.**
