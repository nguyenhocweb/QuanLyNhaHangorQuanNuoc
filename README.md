# Hệ Thống Quản Lý Nhà Hàng Đa Điểm (Multi-tenant F&B SaaS)

Chào mừng bạn đến với dự án Quản lý Nhà hàng Đa điểm (Multi-tenant F&B SaaS). Đây là một hệ thống đồ sộ bao phủ mọi nghiệp vụ từ quản lý chuỗi thương hiệu, chi nhánh, nhân sự, kiểm kho, cho đến thanh toán và tích hợp trợ lý ảo AI.

---

## 🗺️ Bản Đồ Kiến Trúc Cơ Sở Dữ Liệu (Database Schema 3D-View)

> Do quy mô của hệ thống cực kỳ đồ sộ (hơn 70 bảng cơ sở dữ liệu và 2200 dòng schema), sơ đồ đã được chia nhỏ thành 5 phân hệ (Domains) để GitHub có thể hiển thị mượt mà. 
> **Lưu ý:** Giao diện đã được chuyển sang chế độ Dark Mode (Màu Đen) và sử dụng định dạng danh sách thuộc tính chuẩn để dễ đọc hơn. Mọi bảng đều hiển thị tối thiểu 5 thuộc tính quan trọng nhất!

### 1. Phân Hệ Lõi (Core Domain: Brand, Restaurant, HR)
Đây là trái tim của hệ thống Multi-tenant, xử lý logic chuỗi thương hiệu, chi nhánh và nhân sự.

```mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    User "1" --> "*" Employment : làm việc như
    SystemRole "1" --> "*" User : có quyền
    Brand "1" --> "*" Restaurant : sở hữu
    Brand "1" --> "*" Employment : quản lý
    Restaurant "1" --> "*" Employment : có nhân viên
    WorkspaceRole "1" --> "*" Employment : vị trí
    Permission "*" --> "*" Employment : gán quyền
    Category_Restaurant "*" --> "*" Restaurant : thuộc loại

    class Brand {
        id : ObjectId
        name : String
        forceGlobalTaxConfig : Boolean
        logo : String
        status : String
    }
    class Restaurant {
        id : ObjectId
        name : String
        statusByAdmin : String
        statusByBrand : String
        averageRating : Float
    }
    class User {
        id : ObjectId
        email : String
        user_name : String
        is_active : String
        createdAt : DateTime
    }
    class Employment {
        id : ObjectId
        userId : ObjectId
        brandId : ObjectId
        restaurantId : ObjectId
        isActive : Boolean
    }
    class SystemRole {
        id : ObjectId
        name : String
        description : String
        createdAt : DateTime
        updatedAt : DateTime
    }
    class WorkspaceRole {
        id : ObjectId
        name : String
        description : String
        createdAt : DateTime
        updatedAt : DateTime
    }
    class Permission {
        id : ObjectId
        name : String
        description : String
        type : String
        createdAt : DateTime
    }
    class Category_Restaurant {
        id : ObjectId
        name : String
        description : String
        image : String
        isActive : Boolean
    }
```

### 2. Phân Hệ Thực Đơn & Gọi Món (Menu & Order Domain)
Hệ thống xử lý cấu trúc Menu phân tầng phức tạp (Menu > Category > Item > Variant/Modifier).

```mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    Menu "1" --> "*" MenuCategoryMap : chứa
    MenuCategory "1" --> "*" MenuCategoryMap : thuộc
    MenuCategory "1" --> "*" ItemCategoryMap : chứa
    MenuItem "1" --> "*" ItemCategoryMap : nằm trong
    MenuItem "1" --> "*" ItemVariant : có size/loại
    MenuItem "1" --> "*" ModifierGroup : có tuỳ chọn
    ModifierGroup "1" --> "*" ModifierOption : chi tiết
    MenuItem "1" --> "*" OrderItem : nằm trong đơn
    Order "1" --> "*" OrderItem : bao gồm
    Restaurant "1" --> "*" Order : thuộc nhà hàng

    class Menu {
        id : ObjectId
        name : String
        brandId : ObjectId
        is_active : Boolean
        sort_order : Int
    }
    class MenuCategory {
        id : ObjectId
        name : String
        description : String
        is_active : Boolean
        sort_order : Int
    }
    class MenuItem {
        id : ObjectId
        sku : String
        name : String
        basePrice : Float
        is_featured : Boolean
    }
    class ItemVariant {
        id : ObjectId
        name : String
        sku : String
        price : Float
        menuItemId : ObjectId
    }
    class ModifierGroup {
        id : ObjectId
        name : String
        minSelections : Int
        maxSelections : Int
        menuItemId : ObjectId
    }
    class ModifierOption {
        id : ObjectId
        name : String
        priceExtra : Float
        modifierGroupId : ObjectId
        recipes : List
    }
    class Order {
        id : ObjectId
        order_number : String
        status : String
        total_amount : Float
        paymentStatus : String
    }
    class OrderItem {
        id : ObjectId
        name : String
        quantity : Int
        unitPrice : Float
        totalPrice : Float
    }
```

### 3. Phân Hệ Đặt Bàn & Khu Vực (Reservation & Table Domain)
Quản lý sơ đồ bàn 2D/3D (tọa độ X, Y), đặt bàn trước và lịch bảo trì bàn.

```mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    Restaurant "1" --> "*" Restaurant_Areas : có khu vực
    Restaurant_Areas "1" --> "*" Tables : chứa bàn
    Reservations "1" --> "*" Reservation_Tables : giữ bàn
    Tables "1" --> "*" Reservation_Tables : được giữ
    Tables "1" --> "*" Table_Maintenance_Schedules : sửa chữa
    Reservations "1" --> "*" Reservation_Audit_Log : lịch sử đổi
    Reservations "1" --> "*" Order : sinh ra đơn

    class Restaurant_Areas {
        id : ObjectId
        name : String
        is_outdoor : Boolean
        floor_number : Int
        is_active : Boolean
    }
    class Tables {
        id : ObjectId
        table_number : String
        min_capacity : Int
        max_capacity : Int
        status : String
    }
    class Reservations {
        id : ObjectId
        guest_name : String
        reservation_date : DateTime
        status : String
        deposit_paid : Boolean
    }
    class Reservation_Tables {
        id : ObjectId
        reservationId : ObjectId
        tableId : ObjectId
        assigned_at : DateTime
        assigned_by : ObjectId
    }
    class Table_Maintenance_Schedules {
        id : ObjectId
        start_time : DateTime
        end_time : DateTime
        reason : String
        status : String
    }
    class Reservation_Audit_Log {
        id : ObjectId
        action : String
        old_values : Json
        new_values : Json
        createdAt : DateTime
    }
```

### 4. Phân Hệ Kho Bãi & Khuyến Mãi (Inventory & Promotion Domain)
Theo dõi công thức nấu ăn (Recipe), kiểm kho (StockCount) và quản lý chiến dịch khuyến mãi phức tạp.

```mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    InventoryItem "1" --> "*" InventoryStock : tồn kho thực
    InventoryItem "1" --> "*" Recipe : là nguyên liệu
    MenuItem "1" --> "*" Recipe : được nấu từ
    InventoryItem "1" --> "*" StockTransaction : lịch sử XNT
    InventoryItem "1" --> "*" StockCountItem : trong phiếu kiểm
    StockCount "1" --> "*" StockCountItem : chi tiết kiểm
    PurchaseOrder "1" --> "*" PurchaseOrderItem : đặt hàng
    InventoryItem "1" --> "*" PurchaseOrderItem : hàng được đặt
    Promotion "1" --> "*" PromotionUsageLog : đã sử dụng
    Promotion "1" --> "*" UserPromotionWallet : khách lưu ví

    class InventoryItem {
        id : ObjectId
        sku : String
        baseUnit : String
        minPrice : Float
        minStockLevel : Float
    }
    class InventoryStock {
        id : ObjectId
        quantity : Float
        minStockLevel : Float
        location : String
        inventoryItemId : ObjectId
    }
    class StockTransaction {
        id : ObjectId
        type : String
        quantityChange : Float
        balanceAfter : Float
        unitCost : Float
    }
    class StockCount {
        id : ObjectId
        code : String
        status : String
        reason : String
        approvedBy : ObjectId
    }
    class StockCountItem {
        id : ObjectId
        systemQty : Float
        actualQty : Float
        discrepancy : Float
        inventoryItemId : ObjectId
    }
    class PurchaseOrder {
        id : ObjectId
        poNumber : String
        status : String
        totalAmount : Float
        supplierId : ObjectId
    }
    class PurchaseOrderItem {
        id : ObjectId
        orderQty : Float
        receivedQty : Float
        unitPrice : Float
        actualAmount : Float
    }
    class Promotion {
        id : ObjectId
        code : String
        discountType : String
        conditions : Json
        status : String
    }
    class PromotionUsageLog {
        id : ObjectId
        discountAmount : Float
        usedAt : DateTime
        promotionId : ObjectId
        userId : ObjectId
    }
    class UserPromotionWallet {
        id : ObjectId
        savedAt : DateTime
        userId : ObjectId
        promotionId : ObjectId
        user : ObjectId
    }
```

### 5. Phân Hệ Thanh Toán, AI & Thuê Bao (Billing & AI Domain)
Hệ thống thanh toán đa luồng (Subscription của Brand, Payment của Khách) và trợ lý AI Chatbot.

```mermaid
%%{init: {'theme': 'dark'}}%%
classDiagram
    SystemPaymentMethod "1" --> "*" AdminPaymentConfig : cấu hình gốc
    SystemPaymentMethod "1" --> "*" BrandPaymentConfig : cấu hình brand
    Brand "1" --> "*" BrandSubscription : đăng ký gói
    SubscriptionPlan "1" --> "*" BrandSubscription : thuộc gói
    BrandSubscription "1" --> "*" Invoice : sinh hoá đơn
    Invoice "1" --> "*" BrandSubscriptionTransaction : chi tiết TT
    AiChatbox "1" --> "*" AiModel : cung cấp
    Brand "1" --> "*" AIBrandConfig : cấu hình AI
    Brand "1" --> "*" AIChatSession : log chat
    AIChatSession "1" --> "*" AIChatMessage : tin nhắn

    class SystemPaymentMethod {
        id : ObjectId
        name : String
        code : String
        isActive : Boolean
        iconUrl : String
    }
    class AdminPaymentConfig {
        id : ObjectId
        configData : Json
        isActive : Boolean
        systemPaymentMethodId : ObjectId
        createdAt : DateTime
    }
    class BrandPaymentConfig {
        id : ObjectId
        configData : Json
        isActive : Boolean
        brandId : ObjectId
        systemPaymentMethodId : ObjectId
    }
    class BrandSubscription {
        id : ObjectId
        status : String
        startDate : DateTime
        endDate : DateTime
        nextBillingDate : DateTime
    }
    class SubscriptionPlan {
        id : ObjectId
        name : String
        price : Float
        billingCycle : String
        maxRestaurants : Int
    }
    class Invoice {
        id : ObjectId
        invoiceNumber : String
        subTotal : Float
        total : Float
        status : String
    }
    class BrandSubscriptionTransaction {
        id : ObjectId
        amount : Float
        status : String
        paymentDate : DateTime
        brandSubscriptionId : ObjectId
    }
    class AiChatbox {
        id : ObjectId
        name : String
        systemPrompt : String
        temperature : Float
        maxTokens : Int
    }
    class AiModel {
        id : ObjectId
        name : String
        provider : String
        modelId : String
        isActive : Boolean
    }
    class AIBrandConfig {
        id : ObjectId
        isEnabled : Boolean
        autoReplyOrder : Boolean
        knowledgeBaseUrl : String
        brandId : ObjectId
    }
    class AIChatSession {
        id : ObjectId
        platform : String
        status : String
        brandId : ObjectId
        restaurantId : ObjectId
    }
    class AIChatMessage {
        id : ObjectId
        role : String
        content : String
        intent : String
        metadata : Json
    }
```

---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ (SENIOR PRO MAX LEADER MODE)

Với tư cách là một Tech Lead/Architect khó tính (áp dụng chuẩn V5.2), tôi đã audit toàn bộ cấu trúc 70 bảng Database của dự án này. Đây là một hệ thống có tham vọng lớn, bao trùm hầu hết mọi ngóc ngách của một nền tảng F&B SaaS đa khách hàng (Multi-tenant).

**🏆 Điểm đánh giá tổng quan: 7.8 / 10**

### ✅ ĐIỂM SÁNG TRONG THIẾT KẾ (The Good)
1. **Kiến trúc Multi-tenant Tốt:** Việc tách biệt `Brand` và `Restaurant` rất rạch ròi. Việc đẩy cấu hình Thuế/Phí (`isVatInclusive`, `defaultVatRate`) lên cả 2 cấp cho phép sự linh hoạt tuyệt vời cho các chuỗi nhượng quyền.
2. **Hệ thống AI Chatbot Tiên tiến:** Việc lưu trữ Intent, Metadata trong `AIChatMessage` và hỗ trợ RAG (`knowledgeBaseUrl` trong `AIBrandConfig`) cho thấy tư duy bắt kịp thời đại, sẵn sàng cho các luồng Agentic AI.
3. **Quản lý Bàn Nâng Cao (Advanced Table Management):** Lưu trữ cả tọa độ (`pos_x`, `pos_y`, `width`, `height`, `rotation`) và `shape` của bàn trực tiếp trong DB. Rất ít dự án F&B mã nguồn mở làm được tính năng sơ đồ bàn 2D trực quan thế này.
4. **Hệ sinh thái Khuyến mãi (Promotion Engine):** Bảng `Promotion` bao gồm các trường linh hoạt (Tiers, Days of Week, Time, Budget) kết hợp với JSON `conditions` cho phép tạo ra các rule giảm giá vô cùng phức tạp (giống các app giao đồ ăn lớn).
5. **Audit Trail Đầy Đủ:** Bảng `Reservation_Audit_Log`, `StockTransaction`, `LoyaltyTransaction` lưu trữ `old_values`, `new_values` và `balanceAfter` là chuẩn mực của hệ thống tài chính/kho bãi để truy vết gian lận.

### 🛑 CÁC LỖ HỔNG & TECH DEBT CHẾT NGƯỜI (The Bad & The Ugly)
Để dự án này có thể scale lên hàng ngàn nhà hàng và không bị "sập" ở môi trường Production thực tế, hệ thống đang vướng phải những thiết kế sai lầm cực kỳ nghiêm trọng cần khắc phục:

1. **Rủi ro Dữ liệu Phình To (DB Bloating) Không Kiểm Soát:**
   - Các bảng log như `AIChatMessage`, `SystemWebhookLog`, `BrandNotification` đang **thiếu TTL (Time-To-Live) Indexes**. Nếu một nhà hàng có 1000 khách chat AI mỗi ngày, sau 1 năm database MongoDB sẽ phình lên hàng chục GB rác. 
   - *Cách fix:* Phải cấu hình TTL index ở MongoDB để tự động xóa log cũ sau 30-90 ngày.

2. **Quá Tải Bảng "Employment" (God Table Anti-pattern):**
   - Bảng `Employment` hiện đang gánh quá nhiều trách nhiệm: Vừa map User với Brand, vừa map User với Restaurant, lại vừa map với Role và Permission. Việc dùng chung 1 bảng cho cả cấp độ Tập đoàn (Brand) và Chi nhánh (Restaurant) sẽ khiến câu query kiểm tra quyền (Authorization) trở nên cực kỳ chậm và phức tạp.
   - *Cách fix:* Nên tách biệt `Brand_Employment` và `Restaurant_Employment`.

3. **Cạm Bẫy Giao Dịch Kho (Inventory Concurrency Trap):**
   - Bảng `StockTransaction` và `InventoryStock` có nguy cơ bị **Race Condition** cực cao. Trong môi trường Node.js (Bất đồng bộ), nếu 2 nhân viên cùng xuất kho 1 mặt hàng cùng lúc, số lượng `quantity` và `balanceAfter` sẽ bị ghi đè sai bét nếu không sử dụng **Transaction (ACID)**.
   - *Lưu ý tử huyệt:* Vì dùng MongoDB, Prisma chỉ hỗ trợ Transaction thực thụ nếu MongoDB được cài đặt dưới dạng **Replica Set**. Nếu bạn chạy MongoDB Standalone trên localhost hoặc server rẻ tiền, toàn bộ logic trừ kho/thanh toán sẽ vỡ vụn khi có tải cao.

4. **Thiếu Compound Indexes Ở Mức Độ Trầm Trọng:**
   - Ở các bảng lớn như `Order`, `OrderItem`, `StockTransaction`, khai báo Index hiện tại là quá ngây thơ. 
   - Ví dụ: `@@index([restaurantId, status, createdAt])` trên `Order` là tốt, nhưng lại thiếu Index cho các tác vụ phân tích doanh thu (Group by Day, By MenuItem). Khi Admin kéo báo cáo doanh thu tháng, database sẽ phải Full-scan toàn bộ bảng OrderItem, gây chết Server.

5. **Thiếu Isolation (Cô lập) Dữ liệu Nhạy Cảm:**
   - Bảng `ApiKey` lưu trữ `encryptedKey` chung với các thông tin truy vấn. Mặc dù đã mã hóa, nhưng việc thiết kế chung thế này rất rủi ro. 
   - Mã hóa Token Webhook (`webhookTokenHash`) ở `RestaurantPaymentConfig` nhưng không có cơ chế Key Rotation rõ ràng.

### 🎯 TỔNG KẾT
Đây là một dự án có nghiệp vụ (Business Logic) **rất xuất sắc và chi tiết**. Bạn đã nghĩ đến những thứ mà một hệ thống F&B thực tế cần (Audit log, Pos_X/Y của bàn, Rule khuyến mãi). Tuy nhiên, về mặt hạ tầng Database (Database Infrastructure), nó vẫn mang hơi hướng "code để chạy được" thay vì "code để scale". Cần đặc biệt chú ý đến Replica Set của MongoDB và đánh Index lại toàn bộ các trường phục vụ Báo cáo (Reporting) trước khi Go-live.
