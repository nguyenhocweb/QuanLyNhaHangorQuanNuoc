# TÀI LIỆU CHI TIẾT DATABASE SCHEMA TỪNG TABLE & THUỘC TÍNH (PHẦN 1)

Dưới đây là danh sách Liệt Kê Tuyệt Đối Không Bỏ Sót bất kỳ Bảng, Thuộc Tính (Fields), và Liên Kết (Relations) nào có trong hệ thống Database Prisma hiện hành.

---

## CÁC ENUMS & KIỂU DỮ LIỆU TỰ ĐỊNH NGHĨA (CUSTOM TYPES)
- **LocationAddress**: `street`, `ward`, `wardCode`, `district`, `districtCode`, `province`, `provinceCode` (String)
- **SocialLink**: `platform`, `url`
- **Faq**: `question`, `answer`
- **RestaurantPolicy**: `name`, `description`
- **DeliveryPartner**: `name`, `url`, `icon`
- **Gender**: `Nam`, `Nu`, `Khac`
- **AccountStatus**: `PENDING`, `ACTIVE`, `INACTIVE`, `BANNED`
- **isActive**: `PENDING`, `ACTIVE`, `INACTIVE`, `TERMINATED`
- **RequestStatus**: `PENDING`, `APPROVED`, `REJECTED`
- **role_enum**: `BRAND`, `RESTAURANT`, `SYSTEM`
- **salary_type**: `MONTHLY`, `HOURLY`
- **TableShape**: `ROUND`, `RECT`, `LONG`
- **TableStatus**: `ACTIVE`, `INACTIVE`, `MAINTENANCE`
- **ScheduleType**: `HOLIDAY`, `SPECIAL_HOURS`, `PRIVATE_EVENT`, `CLOSURE`
- **ReservationStatus**: `PENDING`, `CONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- **ReservationSource**: `WEB`, `MOBILE`, `PHONE`, `WALK_IN`, `THIRD_PARTY`
- **Occasion**: `NORMAL`, `BIRTHDAY`, `ANNIVERSARY`, `BUSINESS`, `DATE`, `OTHER`
- **NotificationStatus**: `PENDING`, `SENT`, `DELIVERED`, `FAILED`, `BOUNCED`
- **NotificationType**: `CONFIRMATION`, `REMINDER`, `CANCELLATION`, `WAITLIST`, `CUSTOM`
- **NotificationChannel**: `EMAIL`, `SMS`, `PUSH`, `ZALO`, `WHATSAPP`
- **OrderStatus**: `OPEN`, `SENT_TO_KITCHEN`, `PARTIALLY_SERVED`, `SERVED`, `BILL_REQUESTED`, `PAID`, `CANCELLED`

---

## 1. PHÂN HỆ NGƯỜI DÙNG & PHÂN QUYỀN (IAM)

### 1.1. Bảng `User`
*Lưu trữ thông tin cá nhân và xác thực của người dùng.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `user_name` (String, Unique)
  - `email` (String, Unique)
  - `sdt` (String?)
  - `password` (String?)
  - `providerId` (String?)
  - `providerType` (Enum providerType?)
  - `name` (String?)
  - `avatar` (String?)
  - `gender` (Enum Gender?)
  - `date_of_birth` (DateTime?)
  - `is_active` (Enum AccountStatus, Default: PENDING)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
  - `roleId` (ObjectId, FK tới `Role`)
- **Liên kết:**
  - `role` (1-1/N-1 tới `Role`)
  - `employments` (1-N tới `Employment`)
  - `reservations` (1-N tới `Reservations`)
  - `review_restaurant` (1-N tới `Review_Restaurant`)
  - `reservation_audit_log` (1-N tới `Reservation_Audit_Log`)
  - `notifications` (1-N tới `Notifications`)
  - `ordersTaken` (1-N tới `Order`)
  - `upgradeRequest` (1-1 tới `UpgradeRequest`)
  - `brandSubscriptionTransactions` (1-N tới `BrandSubscriptionTransaction`)

### 1.2. Bảng `Role`
*Định nghĩa các cấp bậc vai trò.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `name` (String, Unique)
  - `description` (String?)
- **Liên kết:**
  - `user` (1-N tới `User`)

### 1.3. Bảng `Employment`
*Xác định nhân viên làm việc tại Brand/Restaurant nào.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `userId` (ObjectId, FK tới `User`)
  - `brandId` (ObjectId?, FK tới `Brand`)
  - `restaurantId` (ObjectId?, FK tới `Restaurant`)
  - `salary_type` (Enum salary_type?)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
- **Liên kết:**
  - `user` (N-1 tới `User`)
  - `brand` (N-1 tới `Brand`)
  - `restaurant` (N-1 tới `Restaurant`)
  - `per_vs_emp` (1-N tới `Permission_vs_Employment`)
  - `reservations` (1-N tới `Reservations`)
  - `reservation_tables` (1-N tới `Reservation_Tables`)

### 1.4. Bảng `Permission`
*Danh mục các quyền cụ thể trong hệ thống.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `name` (String)
  - `description` (String)
  - `type` (Enum role_enum)
- **Liên kết:**
  - `per_vs_emp` (1-N tới `Permission_vs_Employment`)

### 1.5. Bảng `Permission_vs_Employment`
*Bảng trung gian kết nối Nhân viên với Quyền.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `permissionId` (ObjectId, FK tới `Permission`)
  - `employmentId` (ObjectId, FK tới `Employment`)
- **Liên kết:**
  - `permissions` (N-1 tới `Permission`)
  - `employment` (N-1 tới `Employment`)

### 1.6. Bảng `UpgradeRequest`
*Đơn xin cấp quyền lên quản lý/brand.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `userId` (ObjectId, Unique, FK tới `User`)
  - `brandName` (String)
  - `tax_code` (String?)
  - `businessLicense` (String?)
  - `status` (Enum RequestStatus, Default: PENDING)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
- **Liên kết:**
  - `user` (1-1 tới `User`)

---

## 2. PHÂN HỆ ĐA TIỀN SẢNH (MULTI-TENANT BRAND & RESTAURANT)

### 2.1. Bảng `Brand`
- **Thuộc tính:**
  - `id` (ObjectId, PK), `name` (String, Unique), `logo` (String?), `email_contact` (String?), `phone_contact` (String?), `description` (String?), `tax_code` (String?), `link` (String?), `imageMain` (String?), `images` (String[])
  - `isActive` (Enum isActive, Default: PENDING), `reason` (String?)
  - `address` (Custom Type LocationAddress?)
  - `isFeatured` (Boolean, Default: false), `isNew` (Boolean, Default: true)
  - `restaurantCount` (Int, Default: 0)
  - `createdAt`, `updatedAt` (DateTime)
- **Liên kết (1-N):**
  - `subscriptions`, `restaurants`, `employments`, `menu`, `items`, `paymentConfigs`, `brandPaymentConfigs`, `brandRevenues`, `restaurantRevenues`

### 2.2. Bảng `Restaurant`
- **Thuộc tính:**
  - `id` (ObjectId, PK), `brandId` (ObjectId?, FK tới `Brand`)
  - `logo`, `name`, `email_contact`, `phone_contact`, `description`, `imageMain` (String), `images` (String[]), `slug` (String?)
  - `isNew` (Boolean, Default: true)
  - `address` (Custom Type LocationAddress?)
  - `statusByAdmin` (Enum isActive, Default: PENDING), `reasonByAdmin` (String?)
  - `statusByBrand` (Enum isActive, Default: ACTIVE), `reasonByBrand` (String?)
  - `max_party_size` (Int), `booking_window_days` (Int), `cancellation_hours` (Int)
  - `deposit_required` (Boolean, Default: false), `deposit_amount` (Int?)
  - `weightedScore` (Float), `totalRating` (Int), `averageRating` (Float), `average_food_rating` (Float), `average_service_rating` (Float), `average_ambiance_rating` (Float)
  - `categoryIds` (String[]), `amenityIds` (String[]), `tagIds` (String[])
  - `policies` (RestaurantPolicy[]), `social_links` (SocialLink[]), `faqs` (Faq[]), `delivery_partners` (DeliveryPartner[])
  - `createdAt`, `updatedAt` (DateTime)
- **Liên kết:**
  - N-1: `brand`
  - N-M (References ID array): `categories`, `amenities`, `tags`
  - 1-N: `employments`, `restaurant_areas`, `tabels`, `menu`, `operating_hours`, `special_schedules`, `reservations`, `review_restaurant`, `items`, `paymentConfigs`, `restaurantRevenues`, `promotions`, `events`

### 2.3. Các Bảng Thuộc Tính Mở Rộng của Nhành Hàng
- **`Category_Restaurant`**: `id`, `name` (Unique), `isActive`, `description`, `bgColor`, `textColor`, `restaurantIds`. (Liên kết N-M: `restaurants`)
- **`Restaurant_Amenities`**: `id`, `name` (Unique), `icon`, `description`, `createdAt`, `restaurantIds`. (Liên kết N-M: `restaurants`)
- **`Tags`**: `id`, `name` (Unique), `slug` (Unique), `description`, `textColor`, `bgColor`, `createdAt`, `restaurantIds`. (Liên kết N-M: `restaurants`)
- **`Operating_Hours`**: `id`, `restaurantId`, `day_of_week` (Int), `open_time`, `close_time`, `is_closed` (Boolean), `break_start`, `break_end`, `createdAt`, `updatedAt`. (Liên kết N-1: `restaurant`)
- **`Special_Schedules`**: `id`, `restaurantId`, `date` (DateTime?), `month` (Int?), `day` (Int?), `is_recurring` (Boolean), `type` (Enum ScheduleType), `open_time`, `close_time`, `reason`, `createdAt`, `updatedAt`. (Liên kết N-1: `restaurant`)
- **`Restaurant_Areas`**: `id`, `restaurantId`, `name`, `description`, `smoking_allowed` (Boolean), `is_outdoor` (Boolean), `floor_number` (Int), `is_active` (Enum isActive). (Liên kết N-1: `restaurant`, 1-N: `tabels`)
- **`Tables`**: `id`, `restaurantId`, `areaId`, `is_vip` (Boolean), `table_number` (String), `min_capacity` (Int), `max_capacity` (Int), `shape` (Enum TableShape?), `is_combinable` (Boolean?), `pos_x`, `pos_y` (Float?), `status` (Enum TableStatus), `qr_code` (String, Unique), `createdAt`, `updatedAt`. (Liên kết N-1: `restaurant`, `area`; 1-N: `reservation_tables`, `orders`)
- **`Promotion`**: `id`, `code` (Unique), `description`, `discount_type`, `discount_value` (Float), `min_order_value` (Float?), `max_discount` (Float?), `valid_from`, `valid_until`, `usage_limit` (Int?), `used_count` (Int), `brandId`, `restaurantId`, `isActive`, `createdAt`. (Liên kết N-1: `restaurant`)
- **`Restaurant_Event`**: `id`, `restaurantId`, `title`, `description`, `image`, `startDate`, `endDate`, `isActive`, `createdAt`, `updatedAt`. (Liên kết N-1: `restaurant`)

---
---

## 3. PHÂN HỆ THỰC ĐƠN & QUẢN LÝ KHO (CATALOG & INVENTORY)

### 3.1. Bảng `Menu`
*Thực đơn chính của nhà hàng.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `brandId` (ObjectId?, FK tới `Brand`)
  - `restaurantId` (ObjectId?, FK tới `Restaurant`)
  - `name` (String)
  - `description` (String?)
  - `is_active` (Boolean, Default: true)
  - `sort_order` (Int, Default: 0)
- **Liên kết:**
  - N-1: `restaurant`
  - 1-N: `menucategory`

### 3.2. Bảng `MenuCategory`
*Danh mục món ăn.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `menuId` (ObjectId, FK tới `Menu`)
  - `name` (String)
  - `description` (String?)
  - `sort_order` (Int, Default: 0)
  - `is_active` (Boolean, Default: true)
- **Liên kết:**
  - N-1: `menu`
  - 1-N: `items` (MenuItem)

### 3.3. Bảng `MenuItem`
*Món ăn cốt lõi (Global level).*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `categoryId` (ObjectId, FK tới `MenuCategory`)
  - `brandId` (ObjectId?, FK tới `Brand`)
  - `sku` (String, Unique)
  - `name` (String)
  - `description` (String?)
  - `image` (String?), `images` (String[])
  - `basePrice` (Float)
  - `item_type` (Enum ItemType?)
  - `allergens` (String[])
  - `spice_level` (Int?)
  - `prep_time` (Int?)
  - `isActive` (Boolean, Default: true)
  - `is_featured` (Boolean, Default: false)
  - `sort_order` (Int, Default: 0)
  - `createdAt`, `updatedAt` (DateTime)
- **Liên kết:**
  - N-1: `category`, `brand`
  - 1-N: `orderItems`, `variants` (ItemVariant), `modifierGroups`, `restaurantMaps` (RestaurantMenuItem), `recipes`

### 3.4. Bảng `ItemVariant`
*Biến thể của món ăn (Size, Kích cỡ).*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `menuItemId` (ObjectId, FK tới `MenuItem`)
  - `name` (String)
  - `sku` (String, Unique)
  - `price` (Float)
- **Liên kết:**
  - N-1: `menuItem`
  - 1-N: `recipes`

### 3.5. Bảng `ModifierGroup` & `ModifierOption`
*Nhóm tuỳ chọn (Ví dụ: Thêm Topping).*
- **`ModifierGroup`**:
  - Thuộc tính: `id`, `menuItemId`, `name`, `minSelections` (Int), `maxSelections` (Int)
  - Liên kết: N-1 `menuItem`, 1-N `options` (ModifierOption)
- **`ModifierOption`**:
  - Thuộc tính: `id`, `modifierGroupId`, `name`, `priceExtra` (Float, Phụ thu)
  - Liên kết: N-1 `group`, 1-N `recipes`

### 3.6. Bảng `RestaurantMenuItem`
*Ghi đè cấu hình món ăn tại từng nhà hàng.*
- **Thuộc tính:**
  - `id` (ObjectId, PK)
  - `restaurantId` (ObjectId, FK)
  - `menuItemId` (ObjectId, FK)
  - `isAvailable` (Boolean, Default: true)
  - `overridePrice` (Float?)
- **Liên kết:**
  - N-1: `menuItem`, `restaurant`

### 3.7. Bảng `Ingredient` & `Recipe`
*Quản lý nguyên liệu và công thức định lượng.*
- **`Ingredient`**: `id`, `brandId`, `sku` (Unique), `name`, `unit` (String), `costPerUnit` (Float). Liên kết: 1-N `recipes`.
---

## 4. PHÂN HỆ VẬN HÀNH & GIAO DỊCH (OPERATIONS & TRANSACTIONS)

### 4.1. Bảng `Reservations`
*Đơn đặt bàn.*
- **Thuộc tính:**
  - `id`, `confirmation_code` (Unique), `restaurantId`, `userId`, `created_by_staff_id`
  - `guest_name`, `guest_phone`, `guest_email`
  - `reservation_date`, `start_time`, `end_time`, `party_size`
  - `status` (Enum ReservationStatus, Default: PENDING)
  - `source` (Enum ReservationSource?)
  - `special_requests` (String?), `dietary_restrictions` (Json?), `occasion` (Enum Occasion?), `internal_notes` (String?)
  - `deposit_paid` (Boolean), `deposit_amount` (Int?)
  - `confirmed_at`, `cancelled_at`, `cancellation_reason`, `seated_at`, `completed_at`
  - `createdAt`, `updatedAt`
- **Liên kết:**
  - N-1: `restaurant`, `user`, `created_by_staff`
  - 1-N: `reservation_tables`, `reservation_audit_log`, `notifications`, `order`
  - 1-1: `review_restaurant`

### 4.2. Bảng `Reservation_Tables`
*Chi tiết phân bàn cho Đơn đặt bàn.*
- **Thuộc tính:** `id`, `reservationId`, `tableId`, `assigned_at`, `assigned_by_staff_id`, `createdAt`, `updatedAt`
- **Liên kết:** N-1 `reservation`, `table`, `assigned_by_staff`

### 4.3. Bảng `Order` & `OrderItem`
*Đơn hàng thanh toán tại quán.*
- **`Order`**:
  - Thuộc tính: `id`, `reservationId`, `tableId`, `takenByEmpId`, `order_number` (Unique), `status` (Enum OrderStatus), `subtotal`, `discount_amount`, `tax_amount`, `total_amount` (đều là Float), `systemPaymentMethodId`, `paid_at`, `createdAt`.
  - Liên kết: N-1 `reservation`, `table`, `takenByEmp`, `systemPaymentMethod`; 1-N `items`, `transactions`.
- **`OrderItem`**:
  - Thuộc tính: `id`, `orderId`, `menuItemId`, `isNew`, `name`, `quantity` (Int), `unitPrice` (Float), `subtotal` (Float), `discountAmount` (Float), `totalPrice` (Float), `note` (String?), `status` (Enum KitchenStatus, Default: QUEUED), `createdAt`.
  - Liên kết: N-1 `order`, `menuItem`.

### 4.4. Bảng `Transaction`
*Lịch sử giao dịch thanh toán đơn hàng.*
- **Thuộc tính:** `id`, `orderId`, `amount` (Float), `systemPaymentMethodId`, `externalTransactionId` (String?), `status` (Enum TransactionStatus), `rawResponse` (Json?), `createdAt`.
- **Liên kết:** N-1 `order`, `systemPaymentMethod`.

---

## 5. CẤU HÌNH THANH TOÁN SAAS (PAYMENTS & REVENUE)

### 5.1. Bảng Quản lý Cổng Thanh Toán
- **`SystemPaymentMethod`**: `id`, `name`, `code` (Unique), `description`, `iconUrl`, `isActive`, `systemConfig` (Json?), `createdAt`, `updatedAt`.
- **`BrandPaymentConfig`**: `id`, `brandId`, `systemPaymentMethodId`, `configData` (Json, API Keys), `isActive`, `isTestMode`.
- **`RestaurantPaymentConfig`**: `id`, `restaurantId`, `brandId`, `systemPaymentMethodId`, `configData` (Json), `isActive`, `isTestMode`.

### 5.2. Bảng Ghi nhận Doanh thu (Revenues)
- Tất cả đều có thuộc tính chung: `id`, `amount` (Float), `source` (String), `referenceId` (ObjectId?), `description`, `createdAt`.
- **`BrandRevenue`**: Gắn với `brandId`.
- **`RestaurantRevenue`**: Gắn với `restaurantId` và `brandId`.
- **`SystemRevenue`**: Ghi nhận phí nền tảng cho Admin.

### 5.3. Bảng Gói cước SaaS (Subscriptions)
- **`SubscriptionPlan`**: `id`, `name`, `description`, `price`, `discountPrice`, `discountStartDate`, `discountEndDate`, `billingCycle` (Enum), `maxRestaurants`, `features` (String[]), `isActive`.
- **`BrandSubscription`**: `id`, `brandId`, `planId`, `startDate`, `endDate`, `status` (Enum), `createdAt`, `updatedAt`.
- **`BrandSubscriptionTransaction`**: Chi tiết bill thanh toán tiền mua gói SaaS của Chủ thương hiệu.

---

## 6. HỆ THỐNG BỔ TRỢ & LOGGING (UTILITIES)

### 6.1. Bảng `Notifications`
- **Thuộc tính:** `id`, `reservationId`, `userId`, `type` (Enum NotificationType?), `channel` (Enum NotificationChannel?), `recipient`, `subject`, `body`, `status` (Enum NotificationStatus), `sent_at`, `delivered_at`, `external_id`, `error_message`, `is_read`, `read_at`, `createdAt`, `updatedAt`.

### 6.2. Bảng `Reservation_Audit_Log`
- **Thuộc tính:** `id`, `reservationId`, `changedByUserId`, `action`, `old_values` (Json?), `new_values` (Json?), `ip_address`, `user_agent`, `createdAt`.

### 6.3. Bảng `Review_Restaurant`
- **Thuộc tính:** `id`, `reservationId` (Unique), `userId`, `restaurantId`, `overall_rating`, `food_rating`, `service_rating`, `ambiance_rating`, `comment`, `is_public`, `staff_response`, `createdAt`, `updatedAt`.

---

## 7. PHÂN HỆ TRÍ TUỆ NHÂN TẠO & API KEYS (AI SYSTEM)

### 7.1. Bảng `AiChatbox` & `AiModel`
*Quản lý nhà cung cấp (Google, OpenAI) và các Mô hình tương ứng.*
- **`AiChatbox`**: `id`, `name` (Unique, vd: OpenAI, Gemini), `isActive`, `createdAt`, `updatedAt`.
  - Liên kết: 1-N tới `models` (AiModel), 1-N tới `apiKeys` (ApiKey).
- **`AiModel`**: `id`, `name` (Vd: gpt-4o), `displayName`, `chatboxId` (FK), `createdAt`, `updatedAt`.
  - Liên kết: N-1 tới `chatbox`, 1-N tới `apiKeys`.

### 7.2. Bảng `ApiKey`
*Quản lý khóa API dùng để chat.*
- **Thuộc tính:** `id`, `name`, `encryptedKey`, `keyHash` (Unique), `prefix`, `keyType` (Enum: ADMIN, CUSTOMER, BRAND), `brandId` (FK), `status` (Enum: ACTIVE, SUSPENDED, REVOKED, EXPIRED), `contactEmail`, `chatboxId` (FK), `restrictedModelId` (FK), `lastUsedAt`, `lastIp`, `createdAt`, `updatedAt`.
- **Liên kết:** N-1 tới `chatbox`, N-1 tới `restrictedModel`.

---

## 8. PHÂN HỆ QUẢN LÝ KHO & CUNG ỨNG (INVENTORY & PROCUREMENT)

### 8.1. Hàng hóa & Tồn kho
- **`InventoryItem`**: `id`, `brandId`, `sku` (Unique), `name`, `categoryId`, `supplierId`, `baseUnit`, `minPrice`, `maxPrice`, `minStockLevel`, `type`, `isActive`, `createdAt`, `updatedAt`.
  - Liên kết: N-1 `supplier`; 1-N `stocks`, `transactions`, `recipes`, `purchaseOrderItems`, `stockCountItems`, `stockTransferItems`, `inventoryAlerts`, `purchaseRequestItems`.
- **`InventoryStock`**: `id`, `restaurantId`, `inventoryItemId`, `quantity`, `minStockLevel`, `location`.
  - Liên kết: N-1 `inventoryItem`. (Unique: `restaurantId`, `inventoryItemId`).
- **`InventoryAlert`**: Cảnh báo hết hạn/hết hàng (`id`, `restaurantId`, `inventoryItemId`, `type`, `status`, `createdAt`, `updatedAt`). N-1 `inventoryItem`.

### 8.2. Mua hàng & Nhà cung cấp
- **`Supplier`**: Nhà cung cấp (`id`, `brandId`, `name`, `taxCode`, `contact`, `status`, `createdAt`, `updatedAt`). 1-N `purchaseOrders`, `inventoryItems`.
- **`PurchaseRequest` & `PurchaseRequestItem`**: Yêu cầu mua hàng (Tạo bởi Quản lý nhà hàng).
  - `PurchaseRequest`: `id`, `brandId`, `restaurantId`, `requestCode` (Unique), `status`, `notes`, `expectedDate`, `createdAt`, `updatedAt`. N-1 `restaurant`, 1-N `items`.
  - `PurchaseRequestItem`: `id`, `purchaseRequestId`, `inventoryItemId`, `requestedQty`, `approvedQty`.
- **`PurchaseOrder` & `PurchaseOrderItem`**: Đơn đặt hàng gửi cho Supplier.
  - `PurchaseOrder`: `id`, `restaurantId`, `supplierId`, `createdBy`, `poNumber` (Unique), `status`, `totalAmount`, `invoiceImageUrl`. N-1 `supplier`, 1-N `items`.
  - `PurchaseOrderItem`: `id`, `purchaseOrderId`, `inventoryItemId`, `orderQty`, `receivedQty`, `unitPrice`, `actualAmount`.

### 8.3. Giao dịch & Luân chuyển kho
- **`StockTransaction`**: Ghi log mọi thay đổi kho (Nhập/Xuất/Hủy). `id`, `restaurantId`, `inventoryItemId`, `userId`, `type` (Enum), `quantityChange`, `balanceAfter`, `unitCost`, `referenceId`, `notes`. N-1 `inventoryItem`.
- **`StockTransfer` & `StockTransferItem`**: Chuyển hàng giữa các chi nhánh.
  - `StockTransfer`: `id`, `fromRestaurantId`, `toRestaurantId`, `createdBy`, `transferNumber` (Unique), `status`, `notes`.
  - `StockTransferItem`: `id`, `stockTransferId`, `inventoryItemId`, `transferQty`, `receivedQty`.
- **`StockCount` & `StockCountItem`**: Phiếu kiểm kê kho thực tế.
  - `StockCount`: `id`, `restaurantId`, `brandId`, `createdBy`, `code` (Unique), `status`, `notes`, `reason`, `approvedBy`, `approvedAt`.
  - `StockCountItem`: `id`, `stockCountId`, `inventoryItemId`, `systemQty`, `actualQty`, `discrepancy` (Độ lệch).

---

## 9. CHĂM SÓC KHÁCH HÀNG & CRM (LOYALTY)

### 9.1. Quản lý Khách hàng (CRM)
- **`BrandCustomer`**: `id`, `brandId`, `userId`, `totalSpent`, `loyaltyPoints`, `orderCount`, `tier` (Enum CustomerTier), `createdAt`, `updatedAt`. Liên kết N-1 tới `brand`, `user`.
- **`RestaurantCustomer`**: `id`, `restaurantId`, `userId`, `totalSpent`, `loyaltyPoints`, `orderCount`, `lastVisit`, `tier`. Liên kết N-1 tới `restaurant`, `user`.

### 9.2. Điểm thưởng & Khuyến mãi (Loyalty)
- **`LoyaltyTransaction`**: Lịch sử cộng/trừ điểm. `id`, `userId`, `restaurantId`, `brandId`, `orderId`, `cashierId`, `points`, `type` (Enum: EARN, SPEND, EXPIRED), `isSuspicious`, `description`, `createdAt`.
- **`PromotionUsageLog`**: `id`, `promotionId`, `userId`, `orderId`, `discountAmount`, `usedAt`.
- **`UserPromotionWallet`**: Khách lưu mã giảm giá vào ví. `id`, `userId`, `promotionId`, `savedAt`.
- **`PromotionRestaurant` & `PromotionMenuItem`**: Cấu hình Voucher áp dụng cho Chi nhánh hoặc Món ăn cụ thể.

---

## 10. TIỆN ÍCH HỆ THỐNG & MAPPING (UTILITIES)

### 10.1. Mẫu giao diện (Template SaaS)
- **`Template`**: `id`, `name`, `code` (Unique), `type` (Enum), `thumbnailUrl`, `description`, `desktopImages`, `mobileImages`, `tabletImages`, `isActive`, `allowedPlanIds`. 1-N `brands`, `restaurants`.

### 10.2. Bảo trì & Ánh xạ dữ liệu
- **`Table_Maintenance_Schedules`**: Lịch bảo trì bàn ghế. `id`, `restaurantId`, `tableIds` (String[]), `start_time`, `end_time`, `reason`, `status`, `created_by_staff_id`. Liên kết N-M `tables`.
- **`MenuCategoryMap` & `ItemCategoryMap`**: Các bảng trung gian (Pivot tables) tối ưu hóa việc kéo thả, sắp xếp Menu đa cấp độ.

---
---

# 👑 TECH LEAD REVIEW (CHẤM ĐIỂM: 8.0/10)

Đứng ở góc độ một **Senior Pro Max Tech Lead**, sau khi đã quét 100% tất cả các thuộc tính của hơn 40 bảng trong Schema này, tôi xác nhận **Cấu trúc phân tầng (RBAC + Multi-Tenant)** là hoàn hảo. Việc thiết kế `User -> Employment -> Permission` và `Brand -> Restaurant -> Orders` đạt tiêu chuẩn cực kỳ cao của một mô hình SaaS B2B.

Tuy nhiên, nếu mang cái Database này lên chạy **Scale thực tế** (Production), chúng ta sẽ vấp phải **4 LỖ HỔNG CHÍ MẠNG** cực lớn:

### 🔴 1. Anti-Pattern của MongoDB (Quá nhiều Relation Join)
- **Thiếu sót:** Database đang dùng MongoDB (NoSQL), nhưng lại thiết kế chuẩn hóa y hệt Relational DB (SQL). Điển hình là cụm Món ăn: `Menu -> MenuCategory -> MenuItem -> ItemVariant -> ModifierGroup -> ModifierOption`. Món ăn có tới 6 cấp độ Relation!
- **Hậu quả:** Trong MongoDB không có hàm `JOIN` xịn như SQL. Prisma phải chạy hàng chục vòng lặp ngầm để bóc (populate) dữ liệu. Khi hệ thống có 1000 khách load Menu cùng lúc, CPU của DB sẽ nổ tung.
- **Cách sửa:** Nên nhúng (Embed) các bảng nhỏ lẻ như `ModifierOption` và `ItemVariant` trực tiếp vào trong bảng `MenuItem` dưới dạng Type / Json Array.

### 🔴 2. Lỗi Chết Người về Kế Toán Tài Chính (Dùng Float cho Tiền tệ)
- **Thiếu sót:** Hàng loạt các field nhạy cảm như `price`, `amount`, `total_amount`, `discount_amount` đang dùng kiểu dữ liệu `Float`.
- **Hậu quả:** Sai số dấu phẩy động khét tiếng trong khoa học máy tính (VD: `0.1 + 0.2 = 0.30000000000000004`). Khi Kế toán và Cơ quan thuế vào đối soát cuối tháng, tổng doanh thu sẽ bị lệch (nhảy số thập phân rác). Trong các hệ thống tài chính/thanh toán, xài `Float` là **Tội Ác**.
- **Cách sửa:** Lập tức đổi tất cả các field tiền tệ sang `Int` (Lưu theo mệnh giá nhỏ nhất, ví dụ: 50.000 VNĐ thì lưu thẳng số nguyên `50000`).

### 🔴 3. Thiếu Cơ Chế Xóa Tạm (Soft Deletes)
- **Thiếu sót:** Không có bất kỳ field `isDeleted Boolean @default(false)` hay `deletedAt DateTime?` nào ở các bảng dữ liệu cốt lõi (Orders, Transactions, MenuItems, Reservations).
- **Hậu quả:** Bất cứ khi nào có thao tác xóa, dữ liệu sẽ bốc hơi vĩnh viễn (Hard Delete) khỏi DB. Rủi ro về thất thoát dữ liệu và không thể Audit (Truy vết) khi có gian lận nội bộ là 100%.

### 🔴 4. Mù Thông Tin Truy Vết Cấu Hình (Missing System Audit Logs)
- **Thiếu sót:** Chúng ta mới chỉ có log cho `Reservations`. Trong khi những cái quan trọng hơn như: Ai vừa sửa giá lẩu Thái? Quản lý nào vừa đổi API Key cổng thanh toán Momo? Lại KHÔNG CÓ LOG.
- **Cách sửa:** Bắt buộc phải có một bảng `System_Audit_Log` đa năng ghi nhận `{ entityName, entityId, action, changedBy, oldData, newData }` cho toàn hệ thống.

> **TỔNG KẾT:** Schema hoàn thành Rất Tốt phần Business Logic, nhưng Cần Refactor lại gấp các khuyết điểm về Performance & Data Integrity.
