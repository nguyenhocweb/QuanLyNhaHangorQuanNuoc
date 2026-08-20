const fs = require('fs');

let md = fs.readFileSync('README.md', 'utf8');

const newContent = `---

## 🎯 BỨC TRANH NGHIỆP VỤ & PHÂN QUYỀN HỆ THỐNG (BUSINESS LOGIC)
*Hệ thống phân chia quyền lực rõ ràng theo 5 vai trò chính: Admin (Hệ thống), Quản lý thương hiệu, Quản lý nhà hàng, Nhân viên và Khách hàng. Dưới đây là cách hệ thống vận hành thực tế.*

### 1. Quản lý Chuỗi (SaaS Multi-tenant) & Subscriptions
- **Mục đích:** Vận hành hệ thống như một dịch vụ phần mềm (SaaS), cho phép nhiều Tập đoàn (Brand) cùng thuê nền tảng.
- **Vai trò tác động:** 
  - \`Admin\`: Tạo các gói cước (SubscriptionPlan), quản lý cổng thanh toán gốc, thu phí thuê bao.
  - \`Quản lý thương hiệu\`: Mua gói cước, gia hạn, khai báo thông tin tập đoàn (Logo, Tax, Payment Config riêng).
- **Tác động hệ thống:** Cách ly hoàn toàn dữ liệu của các Tập đoàn khác nhau. Dòng tiền được tách bạch rõ ràng giữa Doanh thu của Admin (tiền bán phần mềm) và Doanh thu của Brand (tiền bán đồ ăn).

### 2. Quản lý Nhân sự & Phân quyền (RBAC)
- **Mục đích:** Phân bổ nhân sự làm việc đa chi nhánh và kiểm soát quyền hạn chặt chẽ.
- **Vai trò tác động:**
  - \`Quản lý thương hiệu\`: Điều phối nhân sự (Employment) làm việc tại chi nhánh nào, tạo các Role (Quản lý, Bếp, Thu ngân).
  - \`Quản lý nhà hàng\`: Xếp lịch làm việc, phân quyền (Permission) cho từng nhân viên tại chi nhánh của mình.
- **Tác động hệ thống:** Ngăn chặn nhân viên chi nhánh A nhìn thấy doanh thu hoặc kho của chi nhánh B. Đảm bảo an toàn dữ liệu qua cơ chế kiểm tra token và phân quyền động.

### 3. Thực Đơn, Gọi Món (POS) & Bếp
- **Mục đích:** Xử lý quy trình gọi món phức tạp (Combo, Topping, Size) và đồng bộ với Bếp.
- **Vai trò tác động:**
  - \`Quản lý nhà hàng\`: Thiết lập món ăn, giá tiền, ẩn/hiện món (RestaurantMenuItem) và tuỳ biến giá riêng cho chi nhánh.
  - \`Nhân viên (Phục vụ/Thu ngân)\`: Tạo Order, thêm Topping (ModifierOption), huỷ/đổi món.
  - \`Khách hàng\`: Quét mã QR tại bàn để xem Menu và tự đặt món (Self-ordering).
- **Tác động hệ thống:** Khi Order được tạo, hệ thống ghi nhận OrderItem, tính toán tổng tiền, và sẽ kích hoạt trigger trừ kho (nếu món có Recipe).

### 4. Đặt Bàn & Quản Lý Sơ Đồ Không Gian (Table Management)
- **Mục đích:** Số hoá mặt bằng nhà hàng, quản lý trạng thái bàn theo thời gian thực.
- **Vai trò tác động:**
  - \`Quản lý nhà hàng\`: Vẽ sơ đồ nhà hàng (gắn toạ độ pos_x, pos_y, tầng, khu vực indoor/outdoor), đặt lịch bảo trì bàn hư.
  - \`Nhân viên\`: Nhận lịch đặt bàn (Reservations), xếp khách vào bàn trống.
  - \`Khách hàng\`: Đặt bàn trước qua Web/App AI.
- **Tác động hệ thống:** Khoá trạng thái bàn (Lock) để tránh tình trạng trùng khách (Double-booking), ghi log lịch sử đổi bàn (Reservation_Audit_Log) để truy vết.

### 5. Chuỗi Cung Ứng & Kiểm Kho (Inventory & Supply Chain)
- **Mục đích:** Quản lý thất thoát nguyên liệu, đảm bảo nguồn cung không bị đứt gãy.
- **Vai trò tác động:**
  - \`Quản lý nhà hàng / Thủ kho\`: Khai báo định mức (Recipe), tạo phiếu kiểm kho thực tế (StockCount), yêu cầu mua hàng (PurchaseRequest).
  - \`Quản lý thương hiệu\`: Duyệt yêu cầu mua hàng, tạo Đơn đặt hàng (PO) gửi Nhà cung cấp (Supplier), luân chuyển hàng giữa các chi nhánh (StockTransfer).
- **Tác động hệ thống:** Mọi biến động kho đều ghi vào bảng \`StockTransaction\` (Audit Trail). Nếu lượng tồn kho giảm dưới \`minStockLevel\`, hệ thống tự động bắn cảnh báo (InventoryAlert).

### 6. Khuyến Mãi (CRM) & Chăm Sóc Khách Hàng
- **Mục đích:** Giữ chân khách hàng và kích cầu doanh số.
- **Vai trò tác động:**
  - \`Quản lý thương hiệu\`: Tạo mã giảm giá (Promotion) với các điều kiện JSON phức tạp (VD: Giảm 20% cho thành viên Vàng mua vào thứ 3).
  - \`Khách hàng\`: Tích luỹ điểm (Loyalty), đánh giá món ăn (Review_Restaurant), lưu voucher vào ví (UserPromotionWallet).
- **Tác động hệ thống:** Gắn tag phân loại khách hàng, xây dựng hồ sơ thói quen chi tiêu (totalSpent) để hệ thống AI lấy dữ liệu tư vấn.

### 7. Trợ Lý Ảo AI (RAG Chatbot)
- **Mục đích:** Tự động hoá khâu CSKH và Sale.
- **Vai trò tác động:**
  - \`Quản lý thương hiệu\`: Nạp tài liệu (KnowledgeBaseUrl), cấu hình độ sáng tạo (Temperature), chọn Model LLM (AiModel).
  - \`Khách hàng\`: Nhắn tin hỏi Menu, khiếu nại, đặt bàn qua Chatbot.
- **Tác động hệ thống:** AI sẽ đọc dữ liệu từ DB (Menu, Giờ mở cửa) kết hợp RAG để tư vấn, tự động nhận diện ý định (Intent) để tạo Order hoặc đặt bàn mà không cần người thật can thiệp.

---

## 🕵️‍♂️ ĐÁNH GIÁ THỰC CHIẾN (GÓC NHÌN SENIOR PRO MAX LEADER)
*Đây là bài toán thẩm định khắt khe nhất khi mang hệ thống này đi gọi vốn hoặc Deploy lên môi trường thực tế với quy mô hàng triệu người dùng.*

**🏆 Điểm đánh giá khả năng thực chiến: 8.5 / 10**

### ✅ ĐIỂM SÁNG TRONG THỰC TẾ (What Works Well)
1. **Quy trình Nghiệp vụ Cực Kì Chặt Chẽ:** Tác giả đã thiết kế luồng (Flow) như một hệ thống ERP thực thụ. Việc có hẳn bảng \`StockTransaction\` (ghi log xuất/nhập/tồn), \`StockCount\` (phiếu kiểm kho) và \`PurchaseOrder\` cho thấy sự am hiểu sâu sắc về vận hành nhà hàng chứ không phải làm phần mềm "cho vui".
2. **Kiến trúc B2B2C Hoàn Hảo:** Hệ thống không chỉ phục vụ Admin quản lý (B2B) mà còn phục vụ cả Khách hàng cuối (B2C) thông qua Chatbot AI và Tích điểm Loyalty. Dòng tiền (Revenue) được xé nhỏ đến từng nhà hàng và từng cổng thanh toán giúp việc đối soát (Reconciliation) cuối tháng cực kì minh bạch.
3. **Quản trị Rủi ro (Audit Trail):** Việc lưu lại \`old_values\` và \`new_values\` trong các bảng Audit giúp chống lại việc gian lận của nhân viên (Ví dụ: Nhân viên lén đổi trạng thái hoá đơn từ "Đã thanh toán" sang "Huỷ" để đút túi tiền mặt).

### 🛑 THIẾU SÓT CHÍNH MẠNG (Fatal Flaws - Nếu không sửa sẽ sập Server)
Dưới góc nhìn của một Leader khắt khe, nếu đưa hệ thống này vào chạy thực tế cho chuỗi 500 nhà hàng, nó sẽ bộc lộ các tử huyệt sau:

1. **Race Condition Khủng Hoảng Ở Kho (Concurrency Issue):**
   - **Thực tế:** Vào giờ cao điểm (12h trưa), 50 nhân viên cùng bấm thanh toán 50 Order. Hệ thống lao vào trừ kho bảng \`InventoryStock\` và ghi log \`StockTransaction\`. Do cơ chế bất đồng bộ của Node.js, nếu không có Locking (Pessimistic Lock) hoặc Transaction chuẩn ACID, số lượng tồn kho sẽ bị ghi đè sai lệch (VD: Kho còn 10, trừ 50 lần vẫn còn... 5).
   - **Khắc phục:** BẮT BUỘC phải cài đặt MongoDB Replica Set để chạy \`prisma.$transaction\`. Thêm nữa, phải thiết kế cơ chế \`Version Control\` (Optimistic Locking) cho các record trong kho.

2. **Bài Toán Nút Thắt Cổ Chai (Bottleneck) Do AI & Webhook:**
   - **Thực tế:** Mô hình đang là Monolithic (Tất cả gộp chung 1 cục API). Khi có 10.000 khách hàng chat AI cùng lúc, tiến trình chờ phản hồi từ OpenAI (hoặc LLM) sẽ ngốn sạch Connection Pool của Server. Lúc đó, cái máy POS của nhân viên thu ngân bấm thanh toán sẽ bị "xoay mòng mòng" vì API không phản hồi.
   - **Khắc phục:** Phải chẻ hệ thống ra thành Microservices. Dịch vụ AI Chat và Webhook nhận tiền phải đẩy qua nền tảng khác (VD: Python FastAPI) hoặc dùng **Message Queue (RabbitMQ/Kafka)** để xử lý bất đồng bộ, không được để chúng cản trở luồng bán hàng (Core POS) của thu ngân.

3. **Cơ Chế Báo Cáo Chết Người (Reporting Death):**
   - **Thực tế:** Admin tập đoàn bấm nút "Xem doanh thu tháng qua của 100 chi nhánh". Nếu hệ thống query trực tiếp vào bảng \`OrderItem\` với hàng chục triệu dòng dữ liệu để SUM() và GROUP BY, Database MongoDB sẽ "đứng tim" (Timeout).
   - **Khắc phục:** Thiếu hẳn một hệ thống Data Warehouse (ETL). Cần có CronJob chạy lúc 2h sáng để tổng hợp dữ liệu từ \`Order\` sang một bảng \`Report_Aggregated\` (Dữ liệu đã được cộng dồn theo ngày), hoặc sử dụng ElasticSearch cho việc thống kê.

> **Tổng Kết Của Leader:** Dự án đạt mức xuất sắc về mặt phân tích nghiệp vụ (Business Analyst) và quy hoạch Database Schema. Nhưng để lên tầm "Kỳ Lân công nghệ" (Enterprise-scale), kiến trúc Backend cần phải được đập đi xây lại theo hướng Event-Driven và Microservices. Tuy nhiên, ở tầm vóc 1 kĩ sư phần mềm/Fullstack Developer, đây là một kiệt tác hiếm có!
`;

const splitIndex = md.indexOf("## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ (GÓC NHÌN SENIOR PRO MAX LEADER)");
if (splitIndex !== -1) {
    const finalMd = md.substring(0, splitIndex) + newContent;
    fs.writeFileSync('README.md', finalMd);
}
