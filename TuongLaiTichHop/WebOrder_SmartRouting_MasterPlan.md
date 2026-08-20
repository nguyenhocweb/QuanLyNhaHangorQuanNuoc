# MASTER ARCHITECTURE PLAN: WHITE-LABEL WEB ORDER & SMART ROUTING

Tài liệu này là **"Kinh Thánh Kỹ Thuật" (Master Architecture Blueprint)** tổng hợp toàn bộ Kiến trúc Frontend, Backend, Database và Luồng xử lý dữ liệu cho Hệ sinh thái F&B Enterprise (Phase 2).

Dưới góc độ của một **Senior Tech Lead Pro Max**, tôi đã quy hoạch mã nguồn chi tiết đến từng Module và đính kèm bài đánh giá rủi ro (Risk Evaluation) cực kỳ khắt khe ở cuối tài liệu.

---

## PHẦN 1: TỔNG QUAN KIẾN TRÚC FRONTEND (NEXT.JS)

Frontend phải giải quyết được 3 bài toán: Đa tên miền (Multi-tenant), Tùy biến giao diện (Template Engine) và Định danh khách (Auth Context).

### 1.1. Cấu Trúc Thư Mục (Feature-Sliced Design)
Dự án Web Order được tách riêng biệt (Ví dụ: `web_order_fe`) và tuân thủ tuyệt đối cấu trúc `role -> feature -> technical concern`.

```text
web_order_fe/
├── middleware.ts                 // Core: Bắt Subdomain (VD: mixue.order.com)
├── src/
│   ├── app/
│   │   └── [domain]/             // Dynamic Route theo Brand
│   │       ├── page.tsx          // Homepage / Menu
│   │       └── checkout/page.tsx // Thanh toán
│   ├── core/
│   │   ├── templates/            // Template Engine (Giao diện chuẩn)
│   │   │   ├── TemplateModern.tsx
│   │   │   └── TemplateClassic.tsx
│   │   └── api/
│   │       └── axios-instance.ts // Tự inject BrandId vào Header
│   └── features/
│       └── public/
│           ├── ordering/         // Nghiệp vụ: Menu, Giỏ hàng
│           │   ├── component/
│           │   ├── hook/
│           │   ├── service/
│           │   └── store/        // Zustand: useCartStore
│           └── auth/             // Nghiệp vụ: OTP Login
│               └── component/
```

### 1.2. Logic Template Engine (Code Description)
Giao diện không gắn cứng theo Nhà Hàng (tránh phình code), mà gắn ở cấp độ **Thương Hiệu**.
- API `GET /api/v1/public/theme` trả về `templateName` và `primaryColor`.
- Trong file `page.tsx`, sử dụng `next/dynamic` để load:
```tsx
const DynamicTemplate = dynamic(() => import(`@/core/templates/${theme.templateName}`));
return <DynamicTemplate color={theme.primaryColor} data={menuData} />;
```

### 1.3. Định danh Khách hàng (Dual-Context Auth)
- Khách hàng vô danh lướt Menu. Khi bấm Thanh toán, Popup `OtpLoginModal` hiện lên.
- Xác thực thành công, Backend trả về JWT chứa `{ customerId, brandId }`.
- **Rủi ro rò rỉ:** Frontend BẮT BUỘC lưu Token vào Cookie gắn kèm Domain (`Domain=mixue.order.com`), hoặc prefix tên key trong LocalStorage (`mixue_auth_token`) để tránh lấy Token của Mixue đi mua TocoToco.

---

## PHẦN 2: TỔNG QUAN KIẾN TRÚC BACKEND (EXPRESS.JS)

Backend tiếp nhận đơn hàng, thực thi AI Điều Hướng (Smart Routing) và đẩy xuống máy POS của quán gần nhất.

### 2.1. Cấu Trúc Thư Mục Backend
```text
backend/src/modules/public/web_order/
├── controllers/
│   └── web_order.checkout.controller.js  // Chứa luồng xử lý chính
├── services/
│   ├── routing_algorithm.service.js      // Core AI điều hướng
│   ├── inventory_check.service.js        // Lọc kho sinh tử
│   └── map_distance.service.js           // Gọi API Maps tính km
└── validators/
    └── web_order.checkout.validator.js
```

### 2.2. Lõi Thuật Toán Smart Order Routing (Code Description)
Đây là trái tim của hệ thống. File `routing_algorithm.service.js` sẽ chạy 4 bước:

1. **Geofencing (Lọc bán kính thô):** Lọc toàn bộ chi nhánh đang `OPEN` và nằm trong vòng 10km (tính đường chim bay) so với GPS của khách. (Sử dụng Geo-spatial Index trên MongoDB).
2. **Strict Inventory Check (Màng lọc Sinh Tử):** Khách mua Trà Đào (Topping Trân Châu Trắng). Duyệt qua các quán ở Bước 1. Quán nào `inventory_stocks` thiếu Trà Đào HOẶC thiếu Trân Châu Trắng -> XÓA NGAY KHỎI DANH SÁCH.
   - *UX Fallback:* Nếu danh sách rỗng, quăng lỗi `409 Conflict`. Frontend bật Popup: *"Quán gần nhất hết Trân Châu, bạn có muốn xóa món này để tiếp tục không?"*
3. **Kitchen Load Factor (Đo tải Bếp):** Gom nhóm (`prisma.order.groupBy`) đếm số đơn đang `PREPARING` của từng quán còn sống sót. Tính ra `prepTime` dự kiến.
4. **Scoring Formula (Chốt hạ):**
   ```javascript
   const score = (DistanceKm * 10) + (PrepTimeMinutes * 2);
   ```
   Chọn nhà hàng có `score` NHỎ NHẤT.

---

## PHẦN 3: DATABASE SCHEMA (MỞ RỘNG)

```prisma
// 1. Cấu hình Theme Giao diện (Dành cho Template Engine FE)
model BrandThemeConfig {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  brandId         String   @unique @db.ObjectId
  templateName    String   @default("TemplateModern")
  primaryColor    String   @default("#FF5722")
  @@map("brand_theme_configs")
}

// 2. Cấu hình Giao hàng
model DeliveryConfig {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  brandId         String   @unique @db.ObjectId
  maxRadiusKm     Float    @default(10.0)
  baseFee         Float    @default(15000)
  extraFeePerKm   Float    @default(5000)
  @@map("delivery_configs")
}

// 3. Nhật ký AI Điều hướng (Để Audit và Machine Learning)
model SmartRoutingLog {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  brandId         String   @db.ObjectId
  customerGps     Json     
  cartItems       Json     
  selectedRestId  String   @db.ObjectId
  routingScore    Float    
  reason          String?  // VD: "Quán A (2km) hết T.Châu, chốt Quán B (3km)"
  createdAt       DateTime @default(now())
  @@map("smart_routing_logs")
}
```

---

## PHẦN 4: ĐÁNH GIÁ TỔNG THỂ (SENIOR TECH LEAD REVIEW)

### 🏆 ĐIỂM SỐ CHUNG CUỘC: 9.5 / 10
Bản Master Plan này vẽ ra một hệ sinh thái F&B SaaS hoàn hảo. Nó cân bằng giữa tham vọng Business (White-label Web Order xịn như The Coffee House) và sự khắt khe của Kỹ thuật (Feature-Sliced Design, Routing Algorithms).

### 🚨 BẮT LỖI KIẾN TRÚC & CÁCH GIẢI QUYẾT TRƯỚC KHI CODE THỰC TẾ
Mặc dù tôi cho 9.5 điểm, nhưng nếu đội Dev cứ cắm đầu code y chang logic trên mà không có kinh nghiệm xử lý Hệ thống phân tán, server sẽ sập trong ngày đầu tiên. Bạn BẮT BUỘC phải dặn Dev xử lý 3 rào cản này:

1. **Race Condition Tồn kho (Cực kỳ nguy hiểm):**
   - *Lỗi:* Thuật toán check kho thấy Quán A còn 1 Ly Trà Đào. Gửi đơn xuống. Vừa lúc đó, thu ngân Quán A bấm bán 1 Ly Trà Đào cho khách tại quầy. Lập tức ÂM KHO.
   - *Xử lý:* Ngay khi thuật toán chọn xong Quán A, phải dùng **Redis Mutex Lock** để phong tỏa (Reserve) tồn kho đó trong 5 phút để khách hàng điền thẻ tín dụng thanh toán trên Web.
2. **N+1 Query Cứa Cổ Database:**
   - *Lỗi:* Bước đo Tải Bếp (Kitchen Load), nếu dùng vòng lặp For gọi hàm `count()` số lượng đơn hàng của 50 nhà hàng, MongoDB sẽ nghẽn cổ chai.
   - *Xử lý:* Dùng `groupBy` hoặc `aggregate` để đếm tất cả trong 1 câu Query duy nhất.
   - *Xử lý:* API Server bắt buộc phải cấu hình `cors({ origin: function(origin, callback) {...} })` quét qua danh sách tên miền hợp lệ của hệ thống, thay vì chặn bừa. Thêm `credentials: true` để gửi Cookie định danh.

---

## PHẦN 5: KIẾN TRÚC QUẢN LÝ ĐƠN ONLINE TẠI CẤP NHÀ HÀNG (RESTAURANT ADMIN FE & BE)

Sau khi thuật toán Smart Routing ném đơn xuống quán A, nhân viên quán A phải có một giao diện để hứng đơn và quản lý tài xế giao hàng (Ahamove, Lalamove).

### 5.1. Thiết kế Frontend Quản lý Đơn (Restaurant FE)
Tại thư mục Frontend của hệ thống Quản trị (`fe/src/features/restaurant_manager/delivery/`):
- **Giao diện Kanban Board (`DeliveryKanbanBoard.tsx`):** Hiển thị luồng trạng thái thời gian thực (Kéo-Thả): 
  `Đơn Mới` ➔ `Đang Nấu (KDS)` ➔ `Chờ Tài Xế` ➔ `Đang Giao` ➔ `Hoàn Thành`.
- **Tích hợp Socket.io:** Khi Backend nhận Webhook từ Ahamove báo "Tài xế đã đến quán", thẻ đơn hàng trên màn hình FE tự động nhấp nháy màu Xanh Lá để nhắc nhân viên mang đồ ăn ra quầy giao.

### 5.2. Mở rộng Database Schema (Prisma)
Cập nhật model `Order` hiện tại để hỗ trợ thông tin Giao hàng đa kênh:
```prisma
model Order {
  // ... (các field cũ)
  orderType       String    @default("DINE_IN") // DINE_IN, TAKE_AWAY, DELIVERY
  deliveryPartner String?   // "AHAMOVE", "GRAB_EXPRESS", "IN_HOUSE"
  deliveryStatus  String?   // "SEARCHING_DRIVER", "DRIVER_ARRIVED", "DELIVERING"
  
  driverName      String?
  driverPhone     String?
  driverVehicle   String?   // Biển số xe
  trackingUrl     String?   // Link bản đồ live tracking cho khách
  
  deliveryFee     Float?
  actualShipFee   Float?    // Tiền ship thực tế hệ thống trả cho Ahamove
}
```

### 5.3. Kiến trúc Backend Webhook & Luồng xử lý
- **File:** `backend/src/modules/public/delivery/delivery.webhook.controller.js`
- **Quy trình xử lý:**
  1. Đơn hàng rớt xuống quán A. Thu ngân bấm "Báo bếp nấu".
  2. Bếp báo xong, Server tự động bắn API `POST /v1/orders/create` sang hệ thống Ahamove.
  3. Ahamove bắt đầu tìm tài xế. Cứ 10 giây, Ahamove sẽ "bắn ngược" Webhook về Backend của ta để cập nhật tọa độ Tài xế.
  4. Backend nhận Webhook, cập nhật `deliveryStatus` trong DB, rồi dùng Socket.io đẩy Real-time lên cho FE (Màn hình của thu ngân) và App của Khách hàng.

---

## PHẦN 6: ĐÁNH GIÁ TỔNG THỂ KIẾN TRÚC QUẢN LÝ ĐƠN ONLINE (SCORING: 9.0 / 10)

Dưới góc nhìn của Senior Tech Lead Pro Max, việc móc nối luồng Online Delivery này vào mô hình vận hành tại điểm (In-store Operations) đạt **9.0 / 10**. 

Tuy nhiên, khi mang bộ mã nguồn này ra cài cho nhà hàng chạy thực tế, sếp phải lường trước **3 tình huống Vỡ Trận (Operational Failures)** cực kỳ khủng khiếp sau:

> [!CAUTION]
> **Tử huyệt 1: Lỗi "Tài xế bùng đơn" hoặc "Không tìm thấy Tài xế"**
> - *Tình huống:* Bếp đã làm xong ly Trà Đào (Đá bắt đầu tan). Quán bắn API tìm Ahamove nhưng trời mưa to, 30 phút không có ai nhận đơn.
> - *Hậu quả:* Khách hàng chửi, đồ ăn hỏng, quán lỗ.
> - *Khắc phục (Fallback Logic):* FE Quản lý đơn phải có nút bấm **[Tăng giá Tip cho Tài xế]** (Bắn API update giá sang Ahamove), HOẶC nút **[Chuyển cho Nhân viên tự đi giao]** để cắt đứt liên kết với Ahamove và chuyển trạng thái về giao hàng nội bộ (In-house Delivery).

> [!CAUTION]
> **Tử huyệt 2: Sập Webhook từ Đối tác**
> - *Tình huống:* Server Ahamove bảo trì hoặc rớt mạng, họ không bắn Webhook báo "Tài xế đã lấy hàng" về cho Server ta.
> - *Hậu quả:* Trên màn hình Kanban của thu ngân, đơn hàng mãi mãi kẹt ở trạng thái "Chờ Tài Xế", dù tài xế đã mang đồ đi giao 1 tiếng trước.
> - *Khắc phục:* FE phải luôn có một nút bấm nhỏ **[Đồng bộ Trạng thái Lại]**. Nút này khi bấm sẽ gọi API GET chủ động (Polling) sang Ahamove để lấy trạng thái mới nhất ghi đè vào DB, đề phòng Webhook bị tịt.

> [!CAUTION]
> **Tử huyệt 3: Sai lệch dòng tiền Thu Hộ (COD - Cash On Delivery)**
> - *Tình huống:* Khách thanh toán tiền mặt (COD). Tài xế Ahamove thu 100k của khách. Đến cuối tháng, nhà hàng đòi Ahamove đối soát trả lại tiền.
> - *Hậu quả:* Rất dễ cãi nhau nếu DB không ghi nhận rạch ròi ai là người đang cầm tiền.
> - *Khắc phục:* Database bắt buộc phải chia rõ `paymentMethod` (CASH_BY_DRIVER vs ONLINE_PAYMENT). Sổ quỹ (Cashbook) của nhà hàng phải tự động sinh ra một công nợ (Debt) với đối tác Ahamove ngay khi đơn hoàn thành.
