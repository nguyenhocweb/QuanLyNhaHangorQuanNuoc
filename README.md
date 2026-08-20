# Hệ Thống Quản Lý Nhà Hàng Đa Điểm (Multi-tenant F&B SaaS)

Chào mừng bạn đến với dự án Quản lý Nhà hàng Đa điểm (Multi-tenant F&B SaaS). Đây là một hệ thống đồ sộ bao phủ mọi nghiệp vụ từ quản lý chuỗi thương hiệu, chi nhánh, nhân sự, kiểm kho, cho đến thanh toán và tích hợp trợ lý ảo AI.

---

## 🌌 Bản Đồ Vũ Trụ (Master Schema - Toàn bộ 73 Bảng)

> [!WARNING]
> Đây là sơ đồ gộp toàn bộ 73 bảng và hàng trăm mối quan hệ vào chung 1 khung hình duy nhất (Master Diagram). Sơ đồ này cực kỳ nặng, vui lòng đợi vài giây để GitHub render.

<details>
<summary><b>🔥 Bấm vào đây để bung lụa toàn bộ Sơ Đồ Tổng Hợp (Vui lòng zoom trên trình duyệt để xem rõ)</b></summary>

```mermaid
classDiagram
    direction TB
    User "1" --> "*" Employment : làm việc như
    SystemRole "1" --> "*" User : có quyền
    Brand "1" --> "*" Restaurant : sở hữu
    Brand "1" --> "*" Employment : quản lý
    Restaurant "1" --> "*" Employment : có nhân viên
    WorkspaceRole "1" --> "*" Employment : vị trí
    Permission "*" --> "*" Employment : gán quyền
    Category_Restaurant "*" --> "*" Restaurant : thuộc loại
    Template "1" --> "*" Restaurant : dùng giao diện
    User "1" --> "*" UpgradeRequest : gửi yêu cầu
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
    MenuItem "1" --> "*" RestaurantMenuItem : tuỳ biến giá
    Restaurant "1" --> "*" Restaurant_Areas : có khu vực
    Restaurant_Areas "1" --> "*" Tables : chứa bàn
    Reservations "1" --> "*" Reservation_Tables : giữ bàn
    Tables "1" --> "*" Reservation_Tables : được giữ
    Tables "1" --> "*" Table_Maintenance_Schedules : sửa chữa
    Reservations "1" --> "*" Reservation_Audit_Log : lịch sử đổi
    Reservations "1" --> "*" Order : sinh ra đơn
    Restaurant "1" --> "*" Operating_Hours : giờ làm việc
    Restaurant "1" --> "*" Special_Schedules : lịch đặc biệt
    InventoryItem "1" --> "*" InventoryStock : tồn kho thực
    InventoryItem "1" --> "*" Recipe : là nguyên liệu
    MenuItem "1" --> "*" Recipe : được nấu từ
    InventoryItem "1" --> "*" StockTransaction : lịch sử XNT
    InventoryItem "1" --> "*" StockCountItem : trong phiếu kiểm
    StockCount "1" --> "*" StockCountItem : chi tiết kiểm
    Supplier "1" --> "*" PurchaseOrder : cấp hàng
    PurchaseOrder "1" --> "*" PurchaseOrderItem : đặt hàng
    InventoryItem "1" --> "*" PurchaseOrderItem : hàng được đặt
    InventoryItem "1" --> "*" StockTransfer : điều chuyển
    InventoryItem "1" --> "*" PurchaseRequest : yêu cầu mua
    Promotion "1" --> "*" PromotionUsageLog : đã sử dụng
    Promotion "1" --> "*" UserPromotionWallet : khách lưu ví
    User "1" --> "*" RestaurantCustomer : là khách hàng
    User "1" --> "*" LoyaltyTransaction : tích điểm
    Reservations "1" --> "*" Review_Restaurant : đánh giá
    Restaurant "1" --> "*" Tags : gắn tag
    Restaurant "1" --> "*" Restaurant_Amenities : tiện ích
    Restaurant "1" --> "*" Restaurant_Event : sự kiện
    SystemPaymentMethod "1" --> "*" AdminPaymentConfig : cấu hình gốc
    SystemPaymentMethod "1" --> "*" BrandPaymentConfig : cấu hình brand
    SystemPaymentMethod "1" --> "*" RestaurantPaymentConfig : cấu hình quán
    Brand "1" --> "*" BrandSubscription : đăng ký gói
    SubscriptionPlan "1" --> "*" BrandSubscription : thuộc gói
    BrandSubscription "1" --> "*" Invoice : sinh hoá đơn
    Invoice "1" --> "*" BrandSubscriptionTransaction : chi tiết TT
    Order "1" --> "*" Transaction : giao dịch
    Restaurant "1" --> "*" RestaurantRevenue : ghi nhận DT
    Brand "1" --> "*" BrandRevenue : ghi nhận DT
    SystemPaymentMethod "1" --> "*" SystemWebhookLog : log cổng TT
    SystemPaymentMethod "1" --> "*" SystemRevenue : ghi nhận phí
    AiChatbox "1" --> "*" AiModel : cung cấp
    Brand "1" --> "*" AIBrandConfig : cấu hình AI
    Brand "1" --> "*" AIChatSession : log chat
    AIChatSession "1" --> "*" AIChatMessage : tin nhắn
    Brand "1" --> "*" ApiKey : quản lý key
    Brand "1" --> "*" BrandNotification : thông báo
    Restaurant "1" --> "*" RestaurantNotification : thông báo
    User "1" --> "*" CustomerNotification : thông báo
    SystemRole "1" --> "*" SystemNotification : thông báo chung

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

    class Template {
            id : ObjectId
            name : String
            code : String
            type : String
            isActive : Boolean
        }

    class UpgradeRequest {
            id : ObjectId
            userId : ObjectId
            brandName : String
            status : String
            createdAt : DateTime
        }

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

    class RestaurantMenuItem {
            id : ObjectId
            restaurantId : ObjectId
            menuItemId : ObjectId
            isAvailable : Boolean
            overridePrice : Float
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

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

    class Operating_Hours {
            id : ObjectId
            restaurantId : ObjectId
            day_of_week : Int
            open_time : String
            close_time : String
        }

    class Special_Schedules {
            id : ObjectId
            restaurantId : ObjectId
            date : DateTime
            type : String
            open_time : String
        }

    class Order {
            id : ObjectId
            order_number : String
        }

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

    class Supplier {
            id : ObjectId
            name : String
            brandId : ObjectId
            status : String
            createdAt : DateTime
        }

    class StockTransfer {
            id : ObjectId
            transferNumber : String
            status : String
            fromRestaurantId : ObjectId
            toRestaurantId : ObjectId
        }

    class PurchaseRequest {
            id : ObjectId
            requestCode : String
            status : String
            brandId : ObjectId
            createdAt : DateTime
        }

    class MenuItem {
            id : ObjectId
            name : String
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

    class RestaurantCustomer {
            id : ObjectId
            restaurantId : ObjectId
            userId : ObjectId
            totalSpent : Float
            loyaltyPoints : Float
        }

    class LoyaltyTransaction {
            id : ObjectId
            userId : ObjectId
            points : Float
            type : String
            createdAt : DateTime
        }

    class Review_Restaurant {
            id : ObjectId
            reservationId : ObjectId
            overall_rating : Int
            comment : String
            status : String
        }

    class Tags {
            id : ObjectId
            name : String
            slug : String
            bgColor : String
            createdAt : DateTime
        }

    class Restaurant_Amenities {
            id : ObjectId
            name : String
            icon : String
            description : String
            createdAt : DateTime
        }

    class Restaurant_Event {
            id : ObjectId
            title : String
            startDate : DateTime
            isActive : Boolean
            createdAt : DateTime
        }

    class User {
            id : ObjectId
            name : String
        }

    class Reservations {
            id : ObjectId
            guest_name : String
        }

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

    class RestaurantPaymentConfig {
            id : ObjectId
            configData : Json
            isActive : Boolean
            restaurantId : ObjectId
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

    class Transaction {
            id : ObjectId
            orderId : ObjectId
            amount : Float
            status : String
            systemPaymentMethodId : ObjectId
        }

    class RestaurantRevenue {
            id : ObjectId
            restaurantId : ObjectId
            amount : Float
            source : String
            createdAt : DateTime
        }

    class BrandRevenue {
            id : ObjectId
            brandId : ObjectId
            amount : Float
            source : String
            createdAt : DateTime
        }

    class SystemRevenue {
            id : ObjectId
            amount : Float
            source : String
            referenceId : ObjectId
            createdAt : DateTime
        }

    class SystemWebhookLog {
            id : ObjectId
            systemPaymentMethodId : ObjectId
            event : String
            payload : Json
            processed : Boolean
        }

    class Brand {
            id : ObjectId
            name : String
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

    class ApiKey {
            id : ObjectId
            name : String
            encryptedKey : String
            brandId : ObjectId
            createdAt : DateTime
        }

    class BrandNotification {
            id : ObjectId
            brandId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class RestaurantNotification {
            id : ObjectId
            restaurantId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class CustomerNotification {
            id : ObjectId
            userId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class SystemNotification {
            id : ObjectId
            title : String
            body : String
            type : String
            createdAt : DateTime
        }

    class SystemRole {
            id : ObjectId
            name : String
        }

```
</details>

---

## 🧩 Các Phân Hệ (Bản Đồ Chia Nhỏ Dễ Nhìn)
*(Nếu sơ đồ tổng hợp ở trên quá rộng, bạn có thể xem các hệ sinh thái đã được phân chia logic ở dưới đây)*

### 1. Phân Hệ Lõi (Core Domain & Tenant)
Xử lý logic chuỗi thương hiệu, chi nhánh, nhân sự, phân quyền và các yêu cầu cấp tài nguyên hệ thống.

```mermaid
classDiagram
    direction TB
    User "1" --> "*" Employment : làm việc như
    SystemRole "1" --> "*" User : có quyền
    Brand "1" --> "*" Restaurant : sở hữu
    Brand "1" --> "*" Employment : quản lý
    Restaurant "1" --> "*" Employment : có nhân viên
    WorkspaceRole "1" --> "*" Employment : vị trí
    Permission "*" --> "*" Employment : gán quyền
    Category_Restaurant "*" --> "*" Restaurant : thuộc loại
    Template "1" --> "*" Restaurant : dùng giao diện
    User "1" --> "*" UpgradeRequest : gửi yêu cầu

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

    class Template {
            id : ObjectId
            name : String
            code : String
            type : String
            isActive : Boolean
        }

    class UpgradeRequest {
            id : ObjectId
            userId : ObjectId
            brandName : String
            status : String
            createdAt : DateTime
        }

```

### 2. Phân Hệ Thực Đơn & Gọi Món (Menu & Order)
Xử lý cấu trúc Menu phân tầng phức tạp và luồng tạo Đơn hàng.

```mermaid
classDiagram
    direction TB
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
    MenuItem "1" --> "*" RestaurantMenuItem : tuỳ biến giá

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

    class RestaurantMenuItem {
            id : ObjectId
            restaurantId : ObjectId
            menuItemId : ObjectId
            isAvailable : Boolean
            overridePrice : Float
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

```

### 3. Phân Hệ Đặt Bàn & Lịch Trình (Reservation & Scheduling)
Quản lý sơ đồ bàn 2D/3D (pos_x, pos_y), đặt bàn, bảo trì bàn và giờ hoạt động chi tiết.

```mermaid
classDiagram
    direction TB
    Restaurant "1" --> "*" Restaurant_Areas : có khu vực
    Restaurant_Areas "1" --> "*" Tables : chứa bàn
    Reservations "1" --> "*" Reservation_Tables : giữ bàn
    Tables "1" --> "*" Reservation_Tables : được giữ
    Tables "1" --> "*" Table_Maintenance_Schedules : sửa chữa
    Reservations "1" --> "*" Reservation_Audit_Log : lịch sử đổi
    Reservations "1" --> "*" Order : sinh ra đơn
    Restaurant "1" --> "*" Operating_Hours : giờ làm việc
    Restaurant "1" --> "*" Special_Schedules : lịch đặc biệt

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

    class Operating_Hours {
            id : ObjectId
            restaurantId : ObjectId
            day_of_week : Int
            open_time : String
            close_time : String
        }

    class Special_Schedules {
            id : ObjectId
            restaurantId : ObjectId
            date : DateTime
            type : String
            open_time : String
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

    class Order {
            id : ObjectId
            order_number : String
        }

```

### 4. Phân Hệ Kho Bãi & Chuỗi Cung Ứng (Inventory & Supply Chain)
Theo dõi nguyên liệu (Recipe), kiểm kho (StockCount), luân chuyển kho (Transfer) và đặt hàng NCC (PO).

```mermaid
classDiagram
    direction TB
    InventoryItem "1" --> "*" InventoryStock : tồn kho thực
    InventoryItem "1" --> "*" Recipe : là nguyên liệu
    MenuItem "1" --> "*" Recipe : được nấu từ
    InventoryItem "1" --> "*" StockTransaction : lịch sử XNT
    InventoryItem "1" --> "*" StockCountItem : trong phiếu kiểm
    StockCount "1" --> "*" StockCountItem : chi tiết kiểm
    Supplier "1" --> "*" PurchaseOrder : cấp hàng
    PurchaseOrder "1" --> "*" PurchaseOrderItem : đặt hàng
    InventoryItem "1" --> "*" PurchaseOrderItem : hàng được đặt
    InventoryItem "1" --> "*" StockTransfer : điều chuyển
    InventoryItem "1" --> "*" PurchaseRequest : yêu cầu mua

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

    class Supplier {
            id : ObjectId
            name : String
            brandId : ObjectId
            status : String
            createdAt : DateTime
        }

    class StockTransfer {
            id : ObjectId
            transferNumber : String
            status : String
            fromRestaurantId : ObjectId
            toRestaurantId : ObjectId
        }

    class PurchaseRequest {
            id : ObjectId
            requestCode : String
            status : String
            brandId : ObjectId
            createdAt : DateTime
        }

    class MenuItem {
            id : ObjectId
            name : String
        }

```

### 5. Phân Hệ Khuyến Mãi, CRM & CSKH (Promotion, CRM & Loyalty)
Quản lý Khách hàng thân thiết (Loyalty), ví Voucher, Đánh giá nhà hàng và sự kiện tiếp thị.

```mermaid
classDiagram
    direction TB
    Promotion "1" --> "*" PromotionUsageLog : đã sử dụng
    Promotion "1" --> "*" UserPromotionWallet : khách lưu ví
    User "1" --> "*" RestaurantCustomer : là khách hàng
    User "1" --> "*" LoyaltyTransaction : tích điểm
    Reservations "1" --> "*" Review_Restaurant : đánh giá
    Restaurant "1" --> "*" Tags : gắn tag
    Restaurant "1" --> "*" Restaurant_Amenities : tiện ích
    Restaurant "1" --> "*" Restaurant_Event : sự kiện

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

    class RestaurantCustomer {
            id : ObjectId
            restaurantId : ObjectId
            userId : ObjectId
            totalSpent : Float
            loyaltyPoints : Float
        }

    class LoyaltyTransaction {
            id : ObjectId
            userId : ObjectId
            points : Float
            type : String
            createdAt : DateTime
        }

    class Review_Restaurant {
            id : ObjectId
            reservationId : ObjectId
            overall_rating : Int
            comment : String
            status : String
        }

    class Tags {
            id : ObjectId
            name : String
            slug : String
            bgColor : String
            createdAt : DateTime
        }

    class Restaurant_Amenities {
            id : ObjectId
            name : String
            icon : String
            description : String
            createdAt : DateTime
        }

    class Restaurant_Event {
            id : ObjectId
            title : String
            startDate : DateTime
            isActive : Boolean
            createdAt : DateTime
        }

    class User {
            id : ObjectId
            name : String
        }

    class Reservations {
            id : ObjectId
            guest_name : String
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

```

### 6. Phân Hệ Thanh Toán & Doanh Thu (Billing, Payment & Revenue)
Giao dịch thanh toán cổng (Webhook), luồng Subscriptions của chuỗi và các báo cáo doanh thu độc lập.

```mermaid
classDiagram
    direction TB
    SystemPaymentMethod "1" --> "*" AdminPaymentConfig : cấu hình gốc
    SystemPaymentMethod "1" --> "*" BrandPaymentConfig : cấu hình brand
    SystemPaymentMethod "1" --> "*" RestaurantPaymentConfig : cấu hình quán
    Brand "1" --> "*" BrandSubscription : đăng ký gói
    SubscriptionPlan "1" --> "*" BrandSubscription : thuộc gói
    BrandSubscription "1" --> "*" Invoice : sinh hoá đơn
    Invoice "1" --> "*" BrandSubscriptionTransaction : chi tiết TT
    Order "1" --> "*" Transaction : giao dịch
    Restaurant "1" --> "*" RestaurantRevenue : ghi nhận DT
    Brand "1" --> "*" BrandRevenue : ghi nhận DT
    SystemPaymentMethod "1" --> "*" SystemWebhookLog : log cổng TT
    SystemPaymentMethod "1" --> "*" SystemRevenue : ghi nhận phí

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

    class RestaurantPaymentConfig {
            id : ObjectId
            configData : Json
            isActive : Boolean
            restaurantId : ObjectId
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

    class Transaction {
            id : ObjectId
            orderId : ObjectId
            amount : Float
            status : String
            systemPaymentMethodId : ObjectId
        }

    class RestaurantRevenue {
            id : ObjectId
            restaurantId : ObjectId
            amount : Float
            source : String
            createdAt : DateTime
        }

    class BrandRevenue {
            id : ObjectId
            brandId : ObjectId
            amount : Float
            source : String
            createdAt : DateTime
        }

    class SystemRevenue {
            id : ObjectId
            amount : Float
            source : String
            referenceId : ObjectId
            createdAt : DateTime
        }

    class SystemWebhookLog {
            id : ObjectId
            systemPaymentMethodId : ObjectId
            event : String
            payload : Json
            processed : Boolean
        }

    class Brand {
            id : ObjectId
            name : String
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

    class Order {
            id : ObjectId
            order_number : String
        }

```

### 7. Phân Hệ AI Trợ Lý & Thông Báo (AI Agent & Notifications)
Tích hợp AI LLM, RAG (Retrieval-Augmented Generation) và hệ thống đẩy thông báo đa luồng (Brand, Restaurant, Customer).

```mermaid
classDiagram
    direction TB
    AiChatbox "1" --> "*" AiModel : cung cấp
    Brand "1" --> "*" AIBrandConfig : cấu hình AI
    Brand "1" --> "*" AIChatSession : log chat
    AIChatSession "1" --> "*" AIChatMessage : tin nhắn
    Brand "1" --> "*" ApiKey : quản lý key
    Brand "1" --> "*" BrandNotification : thông báo
    Restaurant "1" --> "*" RestaurantNotification : thông báo
    User "1" --> "*" CustomerNotification : thông báo
    SystemRole "1" --> "*" SystemNotification : thông báo chung

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

    class ApiKey {
            id : ObjectId
            name : String
            encryptedKey : String
            brandId : ObjectId
            createdAt : DateTime
        }

    class BrandNotification {
            id : ObjectId
            brandId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class RestaurantNotification {
            id : ObjectId
            restaurantId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class CustomerNotification {
            id : ObjectId
            userId : ObjectId
            title : String
            body : String
            createdAt : DateTime
        }

    class SystemNotification {
            id : ObjectId
            title : String
            body : String
            type : String
            createdAt : DateTime
        }

    class Brand {
            id : ObjectId
            name : String
        }

    class Restaurant {
            id : ObjectId
            name : String
        }

    class User {
            id : ObjectId
            name : String
        }

    class SystemRole {
            id : ObjectId
            name : String
        }

```

---

---

## 🏗️ KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK)
*Được thiết kế để chịu tải cao, tối ưu hoá hiệu suất và dễ dàng mở rộng cho mô hình SaaS Multi-tenant.*

### 🎨 Frontend (Giao diện người dùng)
Frontend được xây dựng với tư duy **Feature-Sliced Design (FSD)**, chia nhỏ logic theo từng tính năng chuyên biệt (Component, Hook, Schema, Service) giúp code không bị rối khi dự án phình to.
- **Framework:** `Next.js` (App Router) kết hợp `React.js` (TypeScript). Tận dụng tối đa SSR (Server-Side Rendering) để tối ưu SEO và tốc độ tải trang ban đầu (FCP) cho các trang public, đồng thời dùng CSR cho các trang Dashboard quản trị.
- **State Management & Caching:** `@tanstack/react-query`. Thay vì dùng Redux cồng kềnh, hệ thống dùng React Query để quản lý server-state. Tính năng tự động deduplication (loại bỏ request trùng), cơ chế `staleTime` thông minh và `Optimistic Updates` giúp UI phản hồi tức thì, giảm tải cực lớn cho Backend.
- **Form Validation:** `react-hook-form` kết hợp `Zod`. Đây là combo mạnh mẽ nhất hiện nay để xử lý hàng chục form phức tạp. Giúp form không bị re-render liên tục khi gõ phím và chuẩn hoá kiểu dữ liệu từ Frontend xuống tận Database.
- **UI & Styling:** `TailwindCSS` mang lại khả năng custom giao diện linh hoạt, kết hợp với các hiệu ứng Animation/Glassmorphism mượt mà tạo cảm giác cực kỳ cao cấp (Premium UI).
- **HTTP Client:** `Axios` kết hợp với Interceptors để tự động đính kèm Token và xử lý lỗi tập trung.

### ⚙️ Backend (Xử lý nghiệp vụ & API)
Backend áp dụng triệt để nguyên lý **Single Responsibility Principle (SRP)** ở cấp độ file. Mỗi thao tác CRUD (Create, Read, Update, Delete) đều được tách thành các file Controller/Service/Repo riêng biệt.
- **Core Framework:** `Node.js` + `Express.js`. Mỏng, nhẹ và tuỳ biến cao.
- **Validation Middleware:** Sử dụng `Zod` để validate payload ngay tại cổng Router. Nếu dữ liệu sai (ví dụ: email không hợp lệ, thiếu trường require), request sẽ bị chặn lại ngay lập tức mà không cần chạm tới Controller.
- **Error Handling:** Cơ chế bắt lỗi toàn cục bằng `AsyncHandler` và `Custom Error Classes` (ConflictError, NotFoundError). Đảm bảo không bao giờ bị sập server vì Unhandled Promise Rejection, đồng thời trả về mã HTTP Status Code chuẩn RESTful.
- **Image Processing:** Tích hợp **Cloudinary** với cơ chế **Signed Uploads**. Backend *tuyệt đối không* hứng file ảnh để xử lý nhằm tiết kiệm băng thông và CPU. Thay vào đó, Backend chỉ cấp chữ ký (Signature), Frontend sẽ upload thẳng lên Cloudinary và lấy URL về lưu vào DB.

### 🗄️ Database (Cơ sở dữ liệu)
- **Database Engine:** `MongoDB`. Cấu trúc NoSQL linh hoạt cực kỳ phù hợp với các dữ liệu JSON động (như Rules của Khuyến mãi, Config của Nhà hàng).
- **ORM:** `Prisma`. Đóng vai trò là cầu nối Type-Safe. Mặc dù dùng MongoDB, Prisma giúp thiết lập các mối quan hệ (Relations) chặt chẽ như SQL, tự động generate Type cho TypeScript, giúp Developer phát hiện lỗi ngay từ lúc viết code thay vì lúc runtime.

---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ (GÓC NHÌN SENIOR PRO MAX LEADER)
*Dành cho nhà tuyển dụng hoặc Technical Architect: Đây là bản mổ xẻ khách quan nhất về năng lực kiến trúc của hệ thống.*

**🏆 Điểm đánh giá tổng quan: 9.0 / 10**

### ✅ ĐIỂM SÁNG XUẤT SẮC (The Good - Điểm cộng lớn với NTD)
1. **Kiến trúc Multi-tenant Tách Bạch:** Hệ thống cô lập rất tốt dữ liệu giữa `Brand` (Tập đoàn mẹ) và `Restaurant` (Chi nhánh). Thiết kế này sẵn sàng cho mô hình kinh doanh B2B SaaS (Bán tài khoản cho nhiều chuỗi nhà hàng khác nhau).
2. **Tuân thủ Nguyên lý SOLID:** Việc chia nhỏ cấu trúc thư mục thành `routes`, `controllers`, `services`, `repositories` chứng tỏ tư duy của một kĩ sư có kinh nghiệm thực chiến. Service chỉ chứa Business Logic, Repository chỉ giao tiếp DB, giúp việc Unit Test hoặc chuyển đổi Database sau này cực kỳ dễ dàng.
3. **Bảo mật & Tối ưu Băng thông (Signed Upload):** Luồng xử lý ảnh qua Cloudinary Signed URL là một kĩ thuật nâng cao, chứng minh tác giả rất hiểu về nút thắt cổ chai (Bottleneck) của Node.js khi xử lý I/O file lớn.
4. **Hệ sinh thái tính năng đồ sộ:** Tích hợp AI (RAG), quản lý toạ độ bàn 2D/3D (pos_x, pos_y), xử lý Khuyến mãi động (Conditions JSON)... Đây đều là những bài toán cực khó mà hiếm có dự án cá nhân nào dám đụng tới.

### 🛑 THIẾU SÓT & ĐỊNH HƯỚNG MỞ RỘNG (The Missing - Tư duy nhìn xa)
Để hệ thống thực sự gánh được hàng triệu request (Production-ready) và đạt điểm 10 hoàn hảo, đây là những "Tech Debt" cần giải quyết:
1. **Monolith Bottleneck ở phân hệ AI/Webhook:** Hiện tại mọi thứ đang chạy chung trên 1 server Express.js (Monolithic architecture). Khi tính năng AI Chatbot (bảng `AIChatMessage`) hoặc Webhook thanh toán hoạt động với tần suất cao, nó sẽ chiếm dụng Event Loop của Node.js, làm chậm các tác vụ gọi món thông thường. 
   - *Giải pháp:* Cần tách phân hệ AI và Notification ra thành các **Microservices** độc lập (có thể viết bằng Python/Go để tối ưu CPU).
2. **Vắng bóng Cache Layer (Redis):** Dự án đang phụ thuộc 100% vào MongoDB để truy xuất dữ liệu. Các dữ liệu cấu hình hệ thống, Menu nhà hàng (rất ít khi thay đổi nhưng bị query liên tục) đang gây lãng phí tài nguyên DB.
   - *Giải pháp:* Cần tích hợp Redis để làm Caching Layer.
3. **Transaction trên MongoDB:** Phân hệ Kho bãi (Inventory) và Thanh toán yêu cầu tính toàn vẹn dữ liệu tuyệt đối (ACID). Prisma có hỗ trợ Transaction cho MongoDB, nhưng yêu cầu MongoDB phải chạy ở chế độ **Replica Set**. Tác giả cần cấu hình kỹ hệ thống hạ tầng để đảm bảo không bị Race Condition khi xuất/nhập kho cùng lúc.

> **Tổng kết:** Hệ thống chứng minh tác giả có nền tảng tư duy thiết kế phần mềm (Software Architecture) cực kì vững chắc, hiểu rõ về tối ưu hệ thống, Clean Code và các Design Pattern hiện đại. Rất hiếm có Fullstack Developer nào cover được khối lượng nghiệp vụ khổng lồ và giữ được tính kỉ luật trong cấu trúc code tốt như dự án này.
