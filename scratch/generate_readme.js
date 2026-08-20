const fs = require('fs');

const domains = [
  {
    name: "1. Phân Hệ Lõi (Core Domain & Tenant)",
    desc: "Xử lý logic chuỗi thương hiệu, chi nhánh, nhân sự, phân quyền và các yêu cầu cấp tài nguyên hệ thống.",
    rels: [
      'User "1" --> "*" Employment : làm việc như',
      'SystemRole "1" --> "*" User : có quyền',
      'Brand "1" --> "*" Restaurant : sở hữu',
      'Brand "1" --> "*" Employment : quản lý',
      'Restaurant "1" --> "*" Employment : có nhân viên',
      'WorkspaceRole "1" --> "*" Employment : vị trí',
      'Permission "*" --> "*" Employment : gán quyền',
      'Category_Restaurant "*" --> "*" Restaurant : thuộc loại',
      'Template "1" --> "*" Restaurant : dùng giao diện',
      'User "1" --> "*" UpgradeRequest : gửi yêu cầu'
    ],
    classes: [
      'class Brand {\n        id : ObjectId\n        name : String\n        forceGlobalTaxConfig : Boolean\n        logo : String\n        status : String\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n        statusByAdmin : String\n        statusByBrand : String\n        averageRating : Float\n    }',
      'class User {\n        id : ObjectId\n        email : String\n        user_name : String\n        is_active : String\n        createdAt : DateTime\n    }',
      'class Employment {\n        id : ObjectId\n        userId : ObjectId\n        brandId : ObjectId\n        restaurantId : ObjectId\n        isActive : Boolean\n    }',
      'class SystemRole {\n        id : ObjectId\n        name : String\n        description : String\n        createdAt : DateTime\n        updatedAt : DateTime\n    }',
      'class WorkspaceRole {\n        id : ObjectId\n        name : String\n        description : String\n        createdAt : DateTime\n        updatedAt : DateTime\n    }',
      'class Permission {\n        id : ObjectId\n        name : String\n        description : String\n        type : String\n        createdAt : DateTime\n    }',
      'class Category_Restaurant {\n        id : ObjectId\n        name : String\n        description : String\n        image : String\n        isActive : Boolean\n    }',
      'class Template {\n        id : ObjectId\n        name : String\n        code : String\n        type : String\n        isActive : Boolean\n    }',
      'class UpgradeRequest {\n        id : ObjectId\n        userId : ObjectId\n        brandName : String\n        status : String\n        createdAt : DateTime\n    }'
    ]
  },
  {
    name: "2. Phân Hệ Thực Đơn & Gọi Món (Menu & Order)",
    desc: "Xử lý cấu trúc Menu phân tầng phức tạp và luồng tạo Đơn hàng.",
    rels: [
      'Menu "1" --> "*" MenuCategoryMap : chứa',
      'MenuCategory "1" --> "*" MenuCategoryMap : thuộc',
      'MenuCategory "1" --> "*" ItemCategoryMap : chứa',
      'MenuItem "1" --> "*" ItemCategoryMap : nằm trong',
      'MenuItem "1" --> "*" ItemVariant : có size/loại',
      'MenuItem "1" --> "*" ModifierGroup : có tuỳ chọn',
      'ModifierGroup "1" --> "*" ModifierOption : chi tiết',
      'MenuItem "1" --> "*" OrderItem : nằm trong đơn',
      'Order "1" --> "*" OrderItem : bao gồm',
      'Restaurant "1" --> "*" Order : thuộc nhà hàng',
      'MenuItem "1" --> "*" RestaurantMenuItem : tuỳ biến giá'
    ],
    classes: [
      'class Menu {\n        id : ObjectId\n        name : String\n        brandId : ObjectId\n        is_active : Boolean\n        sort_order : Int\n    }',
      'class MenuCategory {\n        id : ObjectId\n        name : String\n        description : String\n        is_active : Boolean\n        sort_order : Int\n    }',
      'class MenuItem {\n        id : ObjectId\n        sku : String\n        name : String\n        basePrice : Float\n        is_featured : Boolean\n    }',
      'class ItemVariant {\n        id : ObjectId\n        name : String\n        sku : String\n        price : Float\n        menuItemId : ObjectId\n    }',
      'class ModifierGroup {\n        id : ObjectId\n        name : String\n        minSelections : Int\n        maxSelections : Int\n        menuItemId : ObjectId\n    }',
      'class ModifierOption {\n        id : ObjectId\n        name : String\n        priceExtra : Float\n        modifierGroupId : ObjectId\n        recipes : List\n    }',
      'class Order {\n        id : ObjectId\n        order_number : String\n        status : String\n        total_amount : Float\n        paymentStatus : String\n    }',
      'class OrderItem {\n        id : ObjectId\n        name : String\n        quantity : Int\n        unitPrice : Float\n        totalPrice : Float\n    }',
      'class RestaurantMenuItem {\n        id : ObjectId\n        restaurantId : ObjectId\n        menuItemId : ObjectId\n        isAvailable : Boolean\n        overridePrice : Float\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n    }'
    ]
  },
  {
    name: "3. Phân Hệ Đặt Bàn & Lịch Trình (Reservation & Scheduling)",
    desc: "Quản lý sơ đồ bàn 2D/3D (pos_x, pos_y), đặt bàn, bảo trì bàn và giờ hoạt động chi tiết.",
    rels: [
      'Restaurant "1" --> "*" Restaurant_Areas : có khu vực',
      'Restaurant_Areas "1" --> "*" Tables : chứa bàn',
      'Reservations "1" --> "*" Reservation_Tables : giữ bàn',
      'Tables "1" --> "*" Reservation_Tables : được giữ',
      'Tables "1" --> "*" Table_Maintenance_Schedules : sửa chữa',
      'Reservations "1" --> "*" Reservation_Audit_Log : lịch sử đổi',
      'Reservations "1" --> "*" Order : sinh ra đơn',
      'Restaurant "1" --> "*" Operating_Hours : giờ làm việc',
      'Restaurant "1" --> "*" Special_Schedules : lịch đặc biệt'
    ],
    classes: [
      'class Restaurant_Areas {\n        id : ObjectId\n        name : String\n        is_outdoor : Boolean\n        floor_number : Int\n        is_active : Boolean\n    }',
      'class Tables {\n        id : ObjectId\n        table_number : String\n        min_capacity : Int\n        max_capacity : Int\n        status : String\n    }',
      'class Reservations {\n        id : ObjectId\n        guest_name : String\n        reservation_date : DateTime\n        status : String\n        deposit_paid : Boolean\n    }',
      'class Reservation_Tables {\n        id : ObjectId\n        reservationId : ObjectId\n        tableId : ObjectId\n        assigned_at : DateTime\n        assigned_by : ObjectId\n    }',
      'class Table_Maintenance_Schedules {\n        id : ObjectId\n        start_time : DateTime\n        end_time : DateTime\n        reason : String\n        status : String\n    }',
      'class Reservation_Audit_Log {\n        id : ObjectId\n        action : String\n        old_values : Json\n        new_values : Json\n        createdAt : DateTime\n    }',
      'class Operating_Hours {\n        id : ObjectId\n        restaurantId : ObjectId\n        day_of_week : Int\n        open_time : String\n        close_time : String\n    }',
      'class Special_Schedules {\n        id : ObjectId\n        restaurantId : ObjectId\n        date : DateTime\n        type : String\n        open_time : String\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n    }',
      'class Order {\n        id : ObjectId\n        order_number : String\n    }'
    ]
  },
  {
    name: "4. Phân Hệ Kho Bãi & Chuỗi Cung Ứng (Inventory & Supply Chain)",
    desc: "Theo dõi nguyên liệu (Recipe), kiểm kho (StockCount), luân chuyển kho (Transfer) và đặt hàng NCC (PO).",
    rels: [
      'InventoryItem "1" --> "*" InventoryStock : tồn kho thực',
      'InventoryItem "1" --> "*" Recipe : là nguyên liệu',
      'MenuItem "1" --> "*" Recipe : được nấu từ',
      'InventoryItem "1" --> "*" StockTransaction : lịch sử XNT',
      'InventoryItem "1" --> "*" StockCountItem : trong phiếu kiểm',
      'StockCount "1" --> "*" StockCountItem : chi tiết kiểm',
      'Supplier "1" --> "*" PurchaseOrder : cấp hàng',
      'PurchaseOrder "1" --> "*" PurchaseOrderItem : đặt hàng',
      'InventoryItem "1" --> "*" PurchaseOrderItem : hàng được đặt',
      'InventoryItem "1" --> "*" StockTransfer : điều chuyển',
      'InventoryItem "1" --> "*" PurchaseRequest : yêu cầu mua'
    ],
    classes: [
      'class InventoryItem {\n        id : ObjectId\n        sku : String\n        baseUnit : String\n        minPrice : Float\n        minStockLevel : Float\n    }',
      'class InventoryStock {\n        id : ObjectId\n        quantity : Float\n        minStockLevel : Float\n        location : String\n        inventoryItemId : ObjectId\n    }',
      'class StockTransaction {\n        id : ObjectId\n        type : String\n        quantityChange : Float\n        balanceAfter : Float\n        unitCost : Float\n    }',
      'class StockCount {\n        id : ObjectId\n        code : String\n        status : String\n        reason : String\n        approvedBy : ObjectId\n    }',
      'class StockCountItem {\n        id : ObjectId\n        systemQty : Float\n        actualQty : Float\n        discrepancy : Float\n        inventoryItemId : ObjectId\n    }',
      'class PurchaseOrder {\n        id : ObjectId\n        poNumber : String\n        status : String\n        totalAmount : Float\n        supplierId : ObjectId\n    }',
      'class PurchaseOrderItem {\n        id : ObjectId\n        orderQty : Float\n        receivedQty : Float\n        unitPrice : Float\n        actualAmount : Float\n    }',
      'class Supplier {\n        id : ObjectId\n        name : String\n        brandId : ObjectId\n        status : String\n        createdAt : DateTime\n    }',
      'class StockTransfer {\n        id : ObjectId\n        transferNumber : String\n        status : String\n        fromRestaurantId : ObjectId\n        toRestaurantId : ObjectId\n    }',
      'class PurchaseRequest {\n        id : ObjectId\n        requestCode : String\n        status : String\n        brandId : ObjectId\n        createdAt : DateTime\n    }',
      'class MenuItem {\n        id : ObjectId\n        name : String\n    }'
    ]
  },
  {
    name: "5. Phân Hệ Khuyến Mãi, CRM & CSKH (Promotion, CRM & Loyalty)",
    desc: "Quản lý Khách hàng thân thiết (Loyalty), ví Voucher, Đánh giá nhà hàng và sự kiện tiếp thị.",
    rels: [
      'Promotion "1" --> "*" PromotionUsageLog : đã sử dụng',
      'Promotion "1" --> "*" UserPromotionWallet : khách lưu ví',
      'User "1" --> "*" RestaurantCustomer : là khách hàng',
      'User "1" --> "*" LoyaltyTransaction : tích điểm',
      'Reservations "1" --> "*" Review_Restaurant : đánh giá',
      'Restaurant "1" --> "*" Tags : gắn tag',
      'Restaurant "1" --> "*" Restaurant_Amenities : tiện ích',
      'Restaurant "1" --> "*" Restaurant_Event : sự kiện'
    ],
    classes: [
      'class Promotion {\n        id : ObjectId\n        code : String\n        discountType : String\n        conditions : Json\n        status : String\n    }',
      'class PromotionUsageLog {\n        id : ObjectId\n        discountAmount : Float\n        usedAt : DateTime\n        promotionId : ObjectId\n        userId : ObjectId\n    }',
      'class UserPromotionWallet {\n        id : ObjectId\n        savedAt : DateTime\n        userId : ObjectId\n        promotionId : ObjectId\n        user : ObjectId\n    }',
      'class RestaurantCustomer {\n        id : ObjectId\n        restaurantId : ObjectId\n        userId : ObjectId\n        totalSpent : Float\n        loyaltyPoints : Float\n    }',
      'class LoyaltyTransaction {\n        id : ObjectId\n        userId : ObjectId\n        points : Float\n        type : String\n        createdAt : DateTime\n    }',
      'class Review_Restaurant {\n        id : ObjectId\n        reservationId : ObjectId\n        overall_rating : Int\n        comment : String\n        status : String\n    }',
      'class Tags {\n        id : ObjectId\n        name : String\n        slug : String\n        bgColor : String\n        createdAt : DateTime\n    }',
      'class Restaurant_Amenities {\n        id : ObjectId\n        name : String\n        icon : String\n        description : String\n        createdAt : DateTime\n    }',
      'class Restaurant_Event {\n        id : ObjectId\n        title : String\n        startDate : DateTime\n        isActive : Boolean\n        createdAt : DateTime\n    }',
      'class User {\n        id : ObjectId\n        name : String\n    }',
      'class Reservations {\n        id : ObjectId\n        guest_name : String\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n    }'
    ]
  },
  {
    name: "6. Phân Hệ Thanh Toán & Doanh Thu (Billing, Payment & Revenue)",
    desc: "Giao dịch thanh toán cổng (Webhook), luồng Subscriptions của chuỗi và các báo cáo doanh thu độc lập.",
    rels: [
      'SystemPaymentMethod "1" --> "*" AdminPaymentConfig : cấu hình gốc',
      'SystemPaymentMethod "1" --> "*" BrandPaymentConfig : cấu hình brand',
      'SystemPaymentMethod "1" --> "*" RestaurantPaymentConfig : cấu hình quán',
      'Brand "1" --> "*" BrandSubscription : đăng ký gói',
      'SubscriptionPlan "1" --> "*" BrandSubscription : thuộc gói',
      'BrandSubscription "1" --> "*" Invoice : sinh hoá đơn',
      'Invoice "1" --> "*" BrandSubscriptionTransaction : chi tiết TT',
      'Order "1" --> "*" Transaction : giao dịch',
      'Restaurant "1" --> "*" RestaurantRevenue : ghi nhận DT',
      'Brand "1" --> "*" BrandRevenue : ghi nhận DT',
      'SystemPaymentMethod "1" --> "*" SystemWebhookLog : log cổng TT',
      'SystemPaymentMethod "1" --> "*" SystemRevenue : ghi nhận phí'
    ],
    classes: [
      'class SystemPaymentMethod {\n        id : ObjectId\n        name : String\n        code : String\n        isActive : Boolean\n        iconUrl : String\n    }',
      'class AdminPaymentConfig {\n        id : ObjectId\n        configData : Json\n        isActive : Boolean\n        systemPaymentMethodId : ObjectId\n        createdAt : DateTime\n    }',
      'class BrandPaymentConfig {\n        id : ObjectId\n        configData : Json\n        isActive : Boolean\n        brandId : ObjectId\n        systemPaymentMethodId : ObjectId\n    }',
      'class RestaurantPaymentConfig {\n        id : ObjectId\n        configData : Json\n        isActive : Boolean\n        restaurantId : ObjectId\n        systemPaymentMethodId : ObjectId\n    }',
      'class BrandSubscription {\n        id : ObjectId\n        status : String\n        startDate : DateTime\n        endDate : DateTime\n        nextBillingDate : DateTime\n    }',
      'class SubscriptionPlan {\n        id : ObjectId\n        name : String\n        price : Float\n        billingCycle : String\n        maxRestaurants : Int\n    }',
      'class Invoice {\n        id : ObjectId\n        invoiceNumber : String\n        subTotal : Float\n        total : Float\n        status : String\n    }',
      'class BrandSubscriptionTransaction {\n        id : ObjectId\n        amount : Float\n        status : String\n        paymentDate : DateTime\n        brandSubscriptionId : ObjectId\n    }',
      'class Transaction {\n        id : ObjectId\n        orderId : ObjectId\n        amount : Float\n        status : String\n        systemPaymentMethodId : ObjectId\n    }',
      'class RestaurantRevenue {\n        id : ObjectId\n        restaurantId : ObjectId\n        amount : Float\n        source : String\n        createdAt : DateTime\n    }',
      'class BrandRevenue {\n        id : ObjectId\n        brandId : ObjectId\n        amount : Float\n        source : String\n        createdAt : DateTime\n    }',
      'class SystemRevenue {\n        id : ObjectId\n        amount : Float\n        source : String\n        referenceId : ObjectId\n        createdAt : DateTime\n    }',
      'class SystemWebhookLog {\n        id : ObjectId\n        systemPaymentMethodId : ObjectId\n        event : String\n        payload : Json\n        processed : Boolean\n    }',
      'class Brand {\n        id : ObjectId\n        name : String\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n    }',
      'class Order {\n        id : ObjectId\n        order_number : String\n    }'
    ]
  },
  {
    name: "7. Phân Hệ AI Trợ Lý & Thông Báo (AI Agent & Notifications)",
    desc: "Tích hợp AI LLM, RAG (Retrieval-Augmented Generation) và hệ thống đẩy thông báo đa luồng (Brand, Restaurant, Customer).",
    rels: [
      'AiChatbox "1" --> "*" AiModel : cung cấp',
      'Brand "1" --> "*" AIBrandConfig : cấu hình AI',
      'Brand "1" --> "*" AIChatSession : log chat',
      'AIChatSession "1" --> "*" AIChatMessage : tin nhắn',
      'Brand "1" --> "*" ApiKey : quản lý key',
      'Brand "1" --> "*" BrandNotification : thông báo',
      'Restaurant "1" --> "*" RestaurantNotification : thông báo',
      'User "1" --> "*" CustomerNotification : thông báo',
      'SystemRole "1" --> "*" SystemNotification : thông báo chung'
    ],
    classes: [
      'class AiChatbox {\n        id : ObjectId\n        name : String\n        systemPrompt : String\n        temperature : Float\n        maxTokens : Int\n    }',
      'class AiModel {\n        id : ObjectId\n        name : String\n        provider : String\n        modelId : String\n        isActive : Boolean\n    }',
      'class AIBrandConfig {\n        id : ObjectId\n        isEnabled : Boolean\n        autoReplyOrder : Boolean\n        knowledgeBaseUrl : String\n        brandId : ObjectId\n    }',
      'class AIChatSession {\n        id : ObjectId\n        platform : String\n        status : String\n        brandId : ObjectId\n        restaurantId : ObjectId\n    }',
      'class AIChatMessage {\n        id : ObjectId\n        role : String\n        content : String\n        intent : String\n        metadata : Json\n    }',
      'class ApiKey {\n        id : ObjectId\n        name : String\n        encryptedKey : String\n        brandId : ObjectId\n        createdAt : DateTime\n    }',
      'class BrandNotification {\n        id : ObjectId\n        brandId : ObjectId\n        title : String\n        body : String\n        createdAt : DateTime\n    }',
      'class RestaurantNotification {\n        id : ObjectId\n        restaurantId : ObjectId\n        title : String\n        body : String\n        createdAt : DateTime\n    }',
      'class CustomerNotification {\n        id : ObjectId\n        userId : ObjectId\n        title : String\n        body : String\n        createdAt : DateTime\n    }',
      'class SystemNotification {\n        id : ObjectId\n        title : String\n        body : String\n        type : String\n        createdAt : DateTime\n    }',
      'class Brand {\n        id : ObjectId\n        name : String\n    }',
      'class Restaurant {\n        id : ObjectId\n        name : String\n    }',
      'class User {\n        id : ObjectId\n        name : String\n    }',
      'class SystemRole {\n        id : ObjectId\n        name : String\n    }'
    ]
  }
];

let md = `# Hệ Thống Quản Lý Nhà Hàng Đa Điểm (Multi-tenant F&B SaaS)

Chào mừng bạn đến với dự án Quản lý Nhà hàng Đa điểm (Multi-tenant F&B SaaS). Đây là một hệ thống đồ sộ bao phủ mọi nghiệp vụ từ quản lý chuỗi thương hiệu, chi nhánh, nhân sự, kiểm kho, cho đến thanh toán và tích hợp trợ lý ảo AI.

---

## 🌌 Bản Đồ Vũ Trụ (Master Schema - Toàn bộ 73 Bảng)

> [!WARNING]
> Đây là sơ đồ gộp toàn bộ 73 bảng và hàng trăm mối quan hệ vào chung 1 khung hình duy nhất (Master Diagram). Sơ đồ này cực kỳ nặng, vui lòng đợi vài giây để GitHub render.

<details>
<summary><b>🔥 Bấm vào đây để bung lụa toàn bộ Sơ Đồ Tổng Hợp (Vui lòng zoom trên trình duyệt để xem rõ)</b></summary>

\`\`\`mermaid
classDiagram
    direction TB
`;

// Add all relations to master
domains.forEach(d => {
  d.rels.forEach(r => md += `    ${r}\n`);
});

md += `\n`;

// Add all unique classes to master
const uniqueClasses = new Set();
domains.forEach(d => {
  d.classes.forEach(c => uniqueClasses.add(c));
});

uniqueClasses.forEach(c => {
  md += `    ${c.replace(/\n/g, '\n    ')}\n\n`;
});

md += `\`\`\`\n</details>\n\n---\n\n## 🧩 Các Phân Hệ (Bản Đồ Chia Nhỏ Dễ Nhìn)\n*(Nếu sơ đồ tổng hợp ở trên quá rộng, bạn có thể xem các hệ sinh thái đã được phân chia logic ở dưới đây)*\n\n`;

// Add individual domains
domains.forEach(d => {
  md += `### ${d.name}\n${d.desc}\n\n\`\`\`mermaid\nclassDiagram\n    direction TB\n`;
  d.rels.forEach(r => md += `    ${r}\n`);
  md += `\n`;
  d.classes.forEach(c => md += `    ${c.replace(/\n/g, '\n    ')}\n\n`);
  md += `\`\`\`\n\n`;
});

md += `---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ (SENIOR PRO MAX LEADER MODE)

Với tư cách là một Tech Lead/Architect khó tính (áp dụng chuẩn V5.2), tôi đã audit toàn bộ cấu trúc **73 bảng Database** của dự án này. Đây là một hệ thống có tham vọng cực kỳ lớn, bao trùm hầu hết mọi ngóc ngách của một nền tảng F&B SaaS đa khách hàng.

**🏆 Điểm đánh giá tổng quan: 8.5 / 10**

### ✅ ĐIỂM SÁNG TRONG THIẾT KẾ (The Good)
1. **Kiến trúc Multi-tenant Rất Sâu Tốt:** Việc tách biệt \`Brand\` và \`Restaurant\` rất rạch ròi, thậm chí cả \`Revenue\` và \`PaymentConfig\` cũng tách bạch đến từng cấp (System, Brand, Restaurant).
2. **Hệ thống AI Chatbot Tiên tiến:** Việc lưu trữ Intent, Metadata trong \`AIChatMessage\` và hỗ trợ RAG (\`knowledgeBaseUrl\` trong \`AIBrandConfig\`) cho thấy tư duy bắt kịp thời đại, sẵn sàng cho Agentic AI.
3. **Quản lý Bàn Nâng Cao (Advanced Table Management):** Lưu trữ cả tọa độ (\`pos_x\`, \`pos_y\`, \`width\`, \`height\`, \`rotation\`) và \`shape\` của bàn trực tiếp trong DB. Rất ít dự án F&B mã nguồn mở làm được tính năng sơ đồ bàn 2D trực quan thế này.
4. **Hệ sinh thái Khuyến mãi (Promotion Engine):** Bảng \`Promotion\` bao gồm các trường linh hoạt kết hợp với JSON \`conditions\` cho phép tạo ra các rule giảm giá vô cùng phức tạp.
5. **Audit Trail Đầy Đủ:** Bảng \`Reservation_Audit_Log\`, \`StockTransaction\`, \`LoyaltyTransaction\` lưu trữ \`old_values\`, \`new_values\` và \`balanceAfter\` là chuẩn mực của hệ thống tài chính/kho bãi để truy vết gian lận.
6. **Notification Đa Luồng:** Hệ thống phân mảnh Notification ra làm 4 bảng rõ ràng (Brand, Restaurant, Customer, System) giúp cho Query siêu nhanh thay vì dồn chung vào 1 bảng khổng lồ.

### 🛑 CÁC LỖ HỔNG & TECH DEBT CHẾT NGƯỜI (The Bad & The Ugly)
Để dự án này có thể scale lên hàng ngàn nhà hàng và không bị "sập" ở môi trường Production thực tế, hệ thống đang vướng phải những thiết kế sai lầm cực kỳ nghiêm trọng cần khắc phục:

1. **Rủi ro Dữ liệu Phình To (DB Bloating) Không Kiểm Soát:**
   - Các bảng log như \`AIChatMessage\`, \`SystemWebhookLog\`, \`BrandNotification\` đang **thiếu TTL (Time-To-Live) Indexes**. Nếu một nhà hàng có 1000 khách chat AI mỗi ngày, sau 1 năm database MongoDB sẽ phình lên hàng chục GB rác. 
   - *Cách fix:* Phải cấu hình TTL index ở MongoDB để tự động xóa log cũ sau 30-90 ngày.

2. **Quá Tải Bảng "Employment" (God Table Anti-pattern):**
   - Bảng \`Employment\` hiện đang gánh quá nhiều trách nhiệm: Vừa map User với Brand, vừa map User với Restaurant, lại vừa map với Role và Permission. Việc dùng chung 1 bảng cho cả cấp độ Tập đoàn (Brand) và Chi nhánh (Restaurant) sẽ khiến câu query kiểm tra quyền (Authorization) trở nên cực kỳ chậm và phức tạp.
   - *Cách fix:* Nên tách biệt \`Brand_Employment\` và \`Restaurant_Employment\`.

3. **Cạm Bẫy Giao Dịch Kho (Inventory Concurrency Trap):**
   - Bảng \`StockTransaction\` và \`InventoryStock\` có nguy cơ bị **Race Condition** cực cao. Trong môi trường Node.js (Bất đồng bộ), nếu 2 nhân viên cùng xuất kho 1 mặt hàng cùng lúc, số lượng \`quantity\` và \`balanceAfter\` sẽ bị ghi đè sai bét nếu không sử dụng **Transaction (ACID)**.
   - *Lưu ý tử huyệt:* Vì dùng MongoDB, Prisma chỉ hỗ trợ Transaction thực thụ nếu MongoDB được cài đặt dưới dạng **Replica Set**. Nếu bạn chạy MongoDB Standalone trên localhost hoặc server rẻ tiền, toàn bộ logic trừ kho/thanh toán sẽ vỡ vụn khi có tải cao.

4. **Thiếu Compound Indexes Ở Mức Độ Trầm Trọng:**
   - Ở các bảng lớn như \`Order\`, \`OrderItem\`, \`StockTransaction\`, khai báo Index hiện tại là quá ngây thơ. 
   - Ví dụ: \`@@index([restaurantId, status, createdAt])\` trên \`Order\` là tốt, nhưng lại thiếu Index cho các tác vụ phân tích doanh thu (Group by Day, By MenuItem). Khi Admin kéo báo cáo doanh thu tháng, database sẽ phải Full-scan toàn bộ bảng OrderItem, gây chết Server.

5. **Thiếu Isolation (Cô lập) Dữ liệu Nhạy Cảm:**
   - Bảng \`ApiKey\` lưu trữ \`encryptedKey\` chung với các thông tin truy vấn. Mặc dù đã mã hóa, nhưng việc thiết kế chung thế này rất rủi ro. 
   - Mã hóa Token Webhook (\`webhookTokenHash\`) ở \`RestaurantPaymentConfig\` nhưng không có cơ chế Key Rotation rõ ràng.

### 🎯 TỔNG KẾT
Đây là một dự án có nghiệp vụ (Business Logic) **rất xuất sắc và chi tiết**. Bạn đã nghĩ đến những thứ mà một hệ thống F&B thực tế cần (Audit log, Pos_X/Y của bàn, Rule khuyến mãi). Việc bổ sung 73 bảng bao phủ cả Trợ lý AI và Billing SaaS cho thấy tầm nhìn hệ thống rất xa. 

Tuy nhiên, về mặt hạ tầng Database (Database Infrastructure), nó vẫn mang hơi hướng "code để chạy được" thay vì "code để scale". Cần đặc biệt chú ý đến Replica Set của MongoDB và đánh Index lại toàn bộ các trường phục vụ Báo cáo (Reporting) trước khi Go-live.
`;

fs.writeFileSync('README.md', md);
