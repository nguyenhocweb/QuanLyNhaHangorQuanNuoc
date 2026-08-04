# Database Schema Documentation

This document describes all tables, their attributes, their purpose, and the relationships within the database. It is automatically maintained by the AI agent based on the Prisma schema files.

## Overview

The database uses MongoDB and is managed via Prisma ORM. Models are organized into domains representing different core components of the system (Brands, Restaurants, Users, Orders, etc.).

---

## Models

### Brand
**File**: `brand.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` |  |
| `logo` | `String?` | `` |  |
| `email_contact` | `String?` | `` |  |
| `phone_contact` | `String?` | `` |  |
| `description` | `String?` | `` |  |
| `tax_code` | `String?` | `` |  |
| `link` | `String?` | `` |  |
| `imageMain` | `String?` | `` |  |
| `images` | `String[]` | `` |  |
| `isActive` | `isActive` | `@default(PENDING)` |  |
| `reason` | `String?` | `` |  |
| `address` | `LocationAddress?` | `` |  |
| `isFeatured` | `Boolean` | `@default(false)` | 👈 tiêu biểu |
| `isNew` | `Boolean` | `@default(true)` |  |
| `restaurantCount` | `Int` | `@default(0)` | Số lượng nhà hàng hiện có |
| `subscriptions` | `BrandSubscription[]` | `` | Lịch sử các gói cước đã đăng ký |
| `restaurants` | `Restaurant[]` | `` | 1 Brand có nhiều Nhà hàng |
| `employments` | `Employment[]` | `` | Nhân sự cấp Brand |
| `menu` | `Menu[]` | `` |  |
| `items` | `MenuItem[]` | `` |  |
| `paymentConfigs` | `RestaurantPaymentConfig[]` | `` |  |
| `brandPaymentConfigs` | `BrandPaymentConfig[]` | `` |  |
| `brandRevenues` | `BrandRevenue[]` | `` |  |
| `restaurantRevenues` | `RestaurantRevenue[]` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### BrandPaymentConfig
**File**: `brand_payment_config.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `systemPaymentMethodId` | `String` | `@db.ObjectId` |  |
| `configData` | `Json` | `` | API keys, secret keys của Brand |
| `isActive` | `Boolean` | `@default(true)` |  |
| `isTestMode` | `Boolean` | `@default(true)` |  |
| `brand` | `Brand` | `@relation(fields: [brandId], references: [id])` |  |
| `systemPaymentMethod` | `SystemPaymentMethod` | `@relation(fields: [systemPaymentMethodId], references: [id])` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### BrandRevenue
**File**: `brand_revenue.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `amount` | `Float` | `` |  |
| `source` | `String` | `` | VD: "RESTAURANT_ORDER" |
| `referenceId` | `String?` | `@db.ObjectId` |  |
| `description` | `String?` | `` |  |
| `brand` | `Brand` | `@relation(fields: [brandId], references: [id])` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### BrandSubscription
**File**: `brand_subscription.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `planId` | `String` | `@db.ObjectId` |  |
| `startDate` | `DateTime` | `@default(now())` |  |
| `endDate` | `DateTime` | `` |  |
| `status` | `SubscriptionStatus` | `@default(PENDING_PAYMENT)` |  |
| `brand` | `Brand` | `@relation(fields: [brandId], references: [id])` |  |
| `plan` | `SubscriptionPlan` | `@relation(fields: [planId], references: [id])` |  |
| `transactions` | `BrandSubscriptionTransaction[]` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### BrandSubscriptionTransaction
**File**: `brand_subscription_transaction.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandSubscriptionId` | `String` | `@db.ObjectId` |  |
| `brandSubscription` | `BrandSubscription` | `@relation(fields: [brandSubscriptionId], references: [id])` |  |
| `amount` | `Float` | `` |  |
| `userId` | `String` | `@db.ObjectId` | Người thanh toán |
| `user` | `User` | `@relation(fields: [userId], references: [id])` |  |
| `systemPaymentMethodId` | `String` | `@db.ObjectId` |  |
| `systemPaymentMethod` | `SystemPaymentMethod` | `@relation(fields: [systemPaymentMethodId], references: [id])` |  |
| `externalTransactionId` | `String?` | `` | VD: Mã giao dịch VNPay/Momo/VietQR |
| `status` | `TransactionStatus` | `` |  |
| `rawResponse` | `Json?` | `` | Lưu kết quả trả về từ cổng thanh toán |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### Category_Restaurant
**File**: `Category_Restaurant.prisma`

*Quan hệ ngược lại với Restaurant*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` | VD: Lẩu, Nướng, Chay, Hàn Quốc... |
| `isActive` | `Boolean` | `@default(true)` |  |
| `description` | `String?` | `` |  |
| `bgColor` | `String?` | `@default("#EEF2FF")` | Default indigo-50 |
| `textColor` | `String?` | `@default("#000000ff")` | Default indigo-500 |
| `restaurantIds` | `String[]` | `@db.ObjectId` |  |
| `restaurants` | `Restaurant[]` | `@relation(fields: [restaurantIds], references: [id])` |  |

### Employment
**File**: `Employment.prisma`

*AI?*

*LÀM CHỨC VỤ GÌ?*

*Ở ĐÂU? (Ngữ cảnh)*

*lương*

*Đảm bảo 1 user không bị gán trùng 1 role ở cùng 1 nhà hàng 2 lần*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `userId` | `String` | `@db.ObjectId` |  |
| `user` | `User` | `@relation(fields: [userId], references: [id])` |  |
| `per_vs_emp` | `Permission_vs_Employment[]` | `` |  |
| `brandId` | `String?` | `@db.ObjectId` |  |
| `brand` | `Brand?` | `@relation(fields: [brandId], references: [id])` |  |
| `restaurantId` | `String?` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant?` | `@relation(fields: [restaurantId], references: [id])` |  |
| `salary_type` | `salary_type?` | `` | tính theo giờ or tháng sau này mở rộng ra table khác |
| `createdAt` | `DateTime` | `@default(now())` | cho biết ngày vào làm |
| `updatedAt` | `DateTime` | `@updatedAt` | cho biết cập nhật lúc nào |
| `reservations` | `Reservations[]` | `` | nhân viên phụ trách đặt bàn cho khách |
| `reservation_tables` | `Reservation_Tables[]` | `` | nhân viên phụ trách phân table nếu có |

### Menu
**File**: `menu.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String?` | `@db.ObjectId` |  |
| `brand` | `Brand?` | `@relation(fields: [brandId], references: [id])` |  |
| `restaurantId` | `String?` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant?` | `@relation(fields: [restaurantId], references: [id])` |  |
| `name` | `String` | `` | tên menu đó Main Menu |
| `description` | `String?` | `` |  |
| `is_active` | `Boolean` | `@default(true)` | còn sử dụng không hay tạm hết |
| `sort_order` | `Int` | `@default(0)` | thứ tự nằm trong bảng menu 0 đứng trước ... |
| `menucategory` | `MenuCategory[]` | `` |  |

### MenuCategory
**File**: `MenuCategory.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `menuId` | `String` | `@db.ObjectId` |  |
| `menu` | `Menu` | `@relation(fields: [menuId], references: [id])` |  |
| `name` | `String` | `` |  |
| `description` | `String?` | `` |  |
| `sort_order` | `Int` | `@default(0)` |  |
| `is_active` | `Boolean` | `@default(true)` |  |
| `items` | `MenuItem[]` | `` |  |

### MenuItem
**File**: `menuItems.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `categoryId` | `String` | `@db.ObjectId` |  |
| `category` | `MenuCategory` | `@relation(fields: [categoryId], references: [id])` |  |
| `brandId` | `String?` | `@db.ObjectId` |  |
| `brand` | `Brand?` | `@relation(fields: [brandId], references: [id])` |  |
| `sku` | `String` | `@unique` |  |
| `name` | `String` | `` |  |
| `description` | `String?` | `` |  |
| `image` | `String?` | `` |  |
| `images` | `String[]` | `` |  |
| `basePrice` | `Float` | `` | Giá niêm yết chuẩn toàn hệ thống |
| `item_type` | `ItemType?` | `` |  |
| `allergens` | `String[]` | `` |  |
| `spice_level` | `Int?` | `` | độ cay |
| `prep_time` | `Int?` | `` | thời gian chuẩn bị dự kiến |
| `isActive` | `Boolean` | `@default(true)` | còn bán hay không |
| `is_featured` | `Boolean` | `@default(false)` | món có hot không |
| `sort_order` | `Int` | `@default(0)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `orderItems` | `OrderItem[]` | `` |  |
| `variants` | `ItemVariant[]` | `` |  |
| `modifierGroups` | `ModifierGroup[]` | `` |  |
| `restaurantMaps` | `RestaurantMenuItem[]` | `` |  |
| `recipes` | `Recipe[]` | `` |  |

### ItemVariant
**File**: `ItemVariant.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `menuItemId` | `String` | `@db.ObjectId` |  |
| `name` | `String` | `` | VD: "Size S", "Size M" |
| `sku` | `String` | `@unique` |  |
| `price` | `Float` | `` | Giá thay thế cho basePrice |
| `menuItem` | `MenuItem` | `@relation(fields: [menuItemId], references: [id], onDelete: Cascade)` |  |
| `recipes` | `Recipe[]` | `` |  |

### ModifierGroup
**File**: `ModifierGroup.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `menuItemId` | `String` | `@db.ObjectId` |  |
| `name` | `String` | `` | VD: "Lượng Đường", "Thêm Topping" |
| `minSelections` | `Int` | `@default(0)` |  |
| `maxSelections` | `Int` | `@default(1)` |  |
| `menuItem` | `MenuItem` | `@relation(fields: [menuItemId], references: [id], onDelete: Cascade)` |  |
| `options` | `ModifierOption[]` | `` |  |

### ModifierOption
**File**: `ModifierOption.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `modifierGroupId` | `String` | `@db.ObjectId` |  |
| `name` | `String` | `` |  |
| `priceExtra` | `Float` | `@default(0)` | Phụ thu |
| `group` | `ModifierGroup` | `@relation(fields: [modifierGroupId], references: [id], onDelete: Cascade)` |  |
| `recipes` | `Recipe[]` | `` |  |

### RestaurantMenuItem
**File**: `RestaurantMenuItem.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `menuItemId` | `String` | `@db.ObjectId` |  |
| `isAvailable` | `Boolean` | `@default(true)` | Hết hàng cục bộ tại CN |
| `overridePrice` | `Float?` | `` | Giá bán ghi đè |
| `menuItem` | `MenuItem` | `@relation(fields: [menuItemId], references: [id], onDelete: Cascade)` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id], onDelete: Cascade)` |  |

### Ingredient
**File**: `Ingredient.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `sku` | `String` | `@unique` |  |
| `name` | `String` | `` |  |
| `unit` | `String` | `` | "ml", "gram" |
| `costPerUnit` | `Float` | `` |  |
| `recipes` | `Recipe[]` | `` |  |

### Recipe
**File**: `Recipe.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `ingredientId` | `String` | `@db.ObjectId` |  |
| `menuItemId` | `String?` | `@db.ObjectId` |  |
| `variantId` | `String?` | `@db.ObjectId` |  |
| `modifierOptionId` | `String?` | `@db.ObjectId` |  |
| `quantityRequired` | `Float` | `` |  |
| `ingredient` | `Ingredient` | `@relation(fields: [ingredientId], references: [id], onDelete: Cascade)` |  |
| `menuItem` | `MenuItem?` | `@relation(fields: [menuItemId], references: [id], onDelete: Cascade)` |  |
| `variant` | `ItemVariant?` | `@relation(fields: [variantId], references: [id], onDelete: Cascade)` |  |
| `modifierOption` | `ModifierOption?` | `@relation(fields: [modifierOptionId], references: [id], onDelete: Cascade)` |  |

### Notifications
**File**: `Notifications.prisma`

*⭐ thêm cho web notification*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `reservationId` | `String?` | `@db.ObjectId` |  |
| `reservation` | `Reservations?` | `@relation(fields: [reservationId], references: [id])` |  |
| `userId` | `String?` | `@db.ObjectId` |  |
| `user` | `User?` | `@relation(fields: [userId], references: [id])` |  |
| `type` | `NotificationType?` | `` | loại thông báo |
| `channel` | `NotificationChannel?` | `` | thuộc loại nào để gửi đến |
| `recipient` | `String` | `` | người nhận |
| `subject` | `String?` | `` | tiêu đề thông báo |
| `body` | `String?` | `` | nội dung thông báo |
| `status` | `NotificationStatus` | `` |  |
| `sent_at` | `DateTime?` | `` | thời điểm gửi thông báo |
| `delivered_at` | `DateTime?` | `` | thời điểm thông báo đc nhận |
| `external_id` | `String?` | `` |  |
| `error_message` | `String?` | `` |  |
| `is_read` | `Boolean` | `@default(false)` |  |
| `read_at` | `DateTime?` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### Operating_Hours
**File**: `operating_hours.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `day_of_week` | `Int` | `` | // xác định ngày trong tuần mở cửa 0 chủ nhật -> 6 thứ 7 |
| `open_time` | `String` | `` | thời gian mở cửa |
| `close_time` | `String` | `` | thời gian đóng cửa |
| `is_closed` | `Boolean` | `@default(false)` | ngày nghỉ (nguyên ngày) hay ngày mở cửa |
| `break_start` | `String?` | `` | thời gian bắt đầu nghĩ |
| `break_end` | `String?` | `` | thời gian kết thúc nghĩ |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### Order
**File**: `order.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `reservationId` | `String` | `@db.ObjectId` |  |
| `reservation` | `Reservations` | `@relation(fields: [reservationId], references: [id])` |  |
| `tableId` | `String?` | `@db.ObjectId` |  |
| `table` | `Tables?` | `@relation(fields: [tableId], references: [id])` |  |
| `takenByEmpId` | `String?` | `@db.ObjectId` |  |
| `takenByEmp` | `User?` | `@relation("EmployeeOrders", fields: [takenByEmpId], references: [id])` |  |
| `order_number` | `String` | `@unique` |  |
| `status` | `OrderStatus` | `` |  |
| `subtotal` | `Float` | `` |  |
| `discount_amount` | `Float` | `` |  |
| `tax_amount` | `Float` | `` |  |
| `total_amount` | `Float` | `` |  |
| `systemPaymentMethodId` | `String?` | `@db.ObjectId` |  |
| `systemPaymentMethod` | `SystemPaymentMethod?` | `@relation(fields: [systemPaymentMethodId], references: [id])` |  |
| `paid_at` | `DateTime?` | `` |  |
| `items` | `OrderItem[]` | `` |  |
| `transactions` | `Transaction[]` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### OrderItem
**File**: `order_Items.prisma`

*optional relation (không bắt buộc vì đã snapshot)*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `orderId` | `String` | `@db.ObjectId` |  |
| `order` | `Order` | `@relation(fields: [orderId], references: [id])` |  |
| `menuItemId` | `String` | `@db.ObjectId` |  |
| `menuItem` | `MenuItem?` | `@relation(fields: [menuItemId], references: [id])` |  |
| `isNew` | `Boolean` | `@default(true)` |  |
| `name` | `String` | `` |  |
| `quantity` | `Int` | `` |  |
| `unitPrice` | `Float` | `` |  |
| `subtotal` | `Float` | `` |  |
| `discountAmount` | `Float` | `@default(0)` |  |
| `totalPrice` | `Float` | `` |  |
| `note` | `String?` | `` |  |
| `status` | `KitchenStatus` | `@default(QUEUED)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### Permission
**File**: `permissions.prisma`

*1 chức năng có thể có nhiều người dùng*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `` | Lưu mảng các quyền: ["CREATE_ORDER", "VIEW_REPORT"] |
| `description` | `String` | `` |  |
| `type` | `role_enum` | `` |  |
| `per_vs_emp` | `Permission_vs_Employment[]` | `` |  |

### Permission_vs_Employment
**File**: `permissions_vs_employment.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `permissionId` | `String` | `@db.ObjectId` |  |
| `permissions` | `Permission` | `@relation(fields: [permissionId], references: [id])` |  |
| `employmentId` | `String` | `@db.ObjectId` |  |
| `employment` | `Employment` | `@relation(fields: [employmentId], references: [id])` |  |

### Promotion
**File**: `Promotion.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `code` | `String` | `@unique` |  |
| `description` | `String?` | `` |  |
| `discount_type` | `String` | `` | PERCENTAGE hoặc FIXED_AMOUNT |
| `discount_value` | `Float` | `` |  |
| `min_order_value` | `Float?` | `` |  |
| `max_discount` | `Float?` | `` |  |
| `valid_from` | `DateTime` | `` |  |
| `valid_until` | `DateTime` | `` |  |
| `usage_limit` | `Int?` | `` | Tổng số lần mã có thể dùng |
| `used_count` | `Int` | `@default(0)` |  |
| `brandId` | `String?` | `@db.ObjectId` |  |
| `restaurantId` | `String?` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant?` | `@relation(fields: [restaurantId], references: [id], onDelete: Cascade)` |  |
| `isActive` | `Boolean` | `@default(true)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### Reservations
**File**: `reservations.prisma`

*thông tin khách*

*Booking details*

*Special requests*

*Payment*

*Timeline*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `confirmation_code` | `String` | `@unique` | mã xác nhận để khách có thể thay đổi or hủy đặt |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `userId` | `String?` | `@db.ObjectId` | khách hàng |
| `user` | `User?` | `@relation(fields: [userId], references: [id])` |  |
| `created_by_staff_id` | `String?` | `@db.ObjectId` | lấy từ table employment |
| `created_by_staff` | `Employment?` | `@relation(fields: [created_by_staff_id], references: [id])` |  |
| `guest_name` | `String` | `` |  |
| `guest_phone` | `String` | `` |  |
| `guest_email` | `String?` | `` |  |
| `reservation_date` | `DateTime` | `` | ngày đến |
| `start_time` | `String` | `` | giờ khách đến |
| `end_time` | `String` | `` | giờ khách đi |
| `party_size` | `Int` | `` | số lượng ngừoi |
| `status` | `ReservationStatus` | `@default(PENDING)` |  |
| `source` | `ReservationSource?` | `` |  |
| `special_requests` | `String?` | `` | yêu cầu đặt biệt của khách đặt bàn |
| `dietary_restrictions` | `Json?` | `` | các hạn chế và dị ứng nếu có |
| `occasion` | `Occasion?` | `` |  |
| `internal_notes` | `String?` | `` | ghi chú nội bộ nhân viên chỉ có nhân viên thấy đc |
| `deposit_paid` | `Boolean` | `@default(false)` | khách đặt cọc chưa |
| `deposit_amount` | `Int?` | `` | đặt bao nhiêu |
| `confirmed_at` | `DateTime?` | `` | thời gian nhân viên xác nhận đơn |
| `cancelled_at` | `DateTime?` | `` | thời gian nhân viên hủy đơn |
| `cancellation_reason` | `String?` | `` | lý do hủy |
| `seated_at` | `DateTime?` | `` | thời gian khách đến |
| `completed_at` | `DateTime?` | `` | thời gian khách đã dùng xong |
| `reservation_tables` | `Reservation_Tables[]` | `` |  |
| `review_restaurant` | `Review_Restaurant?` | `` |  |
| `reservation_audit_log` | `Reservation_Audit_Log[]` | `` |  |
| `notifications` | `Notifications[]` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `order` | `Order[]` | `` |  |

### Reservation_Audit_Log
**File**: `reservation_audit_log.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `reservationId` | `String` | `@db.ObjectId` |  |
| `reservation` | `Reservations` | `@relation(fields: [reservationId], references: [id])` |  |
| `changedByUserId` | `String?` | `@db.ObjectId` |  |
| `changedByUser` | `User?` | `@relation(fields: [changedByUserId], references: [id])` |  |
| `action` | `String` | `` |  |
| `old_values` | `Json?` | `` |  |
| `new_values` | `Json?` | `` |  |
| `ip_address` | `String?` | `` | địa chỉ ip máy nếu cần |
| `user_agent` | `String?` | `` | loại thiết bị |
| `createdAt` | `DateTime` | `@default(now())` |  |

### Reservation_Tables
**File**: `reservation_tables.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `reservationId` | `String` | `@db.ObjectId` |  |
| `reservation` | `Reservations` | `@relation(fields: [reservationId], references: [id])` |  |
| `tableId` | `String` | `@db.ObjectId` |  |
| `table` | `Tables` | `@relation(fields: [tableId], references: [id])` |  |
| `assigned_at` | `DateTime` | `@default(now())` | ngày đc phân bàn |
| `assigned_by_staff_id` | `String?` | `@db.ObjectId` |  |
| `assigned_by_staff` | `Employment?` | `@relation(fields: [assigned_by_staff_id], references: [id])` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### Restaurant
**File**: `restaurant.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `brandId` | `String?` | `@db.ObjectId` |  |
| `brand` | `Brand?` | `@relation(fields: [brandId], references: [id], onDelete: Cascade)` |  |
| `logo` | `String?` | `` |  |
| `isNew` | `Boolean` | `@default(true)` |  |
| `name` | `String?` | `` |  |
| `address` | `LocationAddress?` | `` |  |
| `email_contact` | `String?` | `` |  |
| `phone_contact` | `String?` | `` |  |
| `description` | `String?` | `` |  |
| `statusByAdmin` | `isActive` | `@default(PENDING)` |  |
| `reasonByAdmin` | `String?` | `` |  |
| `statusByBrand` | `isActive` | `@default(ACTIVE)` |  |
| `reasonByBrand` | `String?` | `` |  |
| `imageMain` | `String` | `` |  |
| `images` | `String[]` | `` |  |
| `slug` | `String?` | `` |  |
| `employments` | `Employment[]` | `` | nhẫn viên cấp nhà hàng |
| `restaurant_areas` | `Restaurant_Areas[]` | `` |  |
| `tabels` | `Tables[]` | `` |  |
| `max_party_size` | `Int` | `` | số lượng khách tối đa cho nhà hàng |
| `booking_window_days` | `Int` | `` | đặt trước mấy ngày |
| `cancellation_hours` | `Int` | `` | hủy trước mấy giờ |
| `deposit_required` | `Boolean` | `@default(false)` | có cần đặt cọc ko |
| `deposit_amount` | `Int?` | `` | đặt cọc trước bao nhiêu |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `menu` | `Menu[]` | `` |  |
| `operating_hours` | `Operating_Hours[]` | `` |  |
| `special_schedules` | `Special_Schedules[]` | `` | giờ mở cửa or đóng đặc biệt |
| `reservations` | `Reservations[]` | `` |  |
| `review_restaurant` | `Review_Restaurant[]` | `` |  |
| `items` | `MenuItem[]` | `` |  |
| `weightedScore` | `Float` | `` |  |
| `totalRating` | `Int` | `` | tổng luyowtj đánh giá |
| `averageRating` | `Float` | `@default(0.0)` | trung bình đánh giá |
| `average_food_rating` | `Float` | `@default(0.0)` | trung bình đánh giá đồ ăn |
| `average_service_rating` | `Float` | `@default(0.0)` | trung bình đnahs giá phục vụ |
| `average_ambiance_rating` | `Float` | `@default(0.0)` | trung bình đánh giá không gian quán |
| `paymentConfigs` | `RestaurantPaymentConfig[]` | `` |  |
| `restaurantRevenues` | `RestaurantRevenue[]` | `` |  |
| `categoryIds` | `String[]` | `@db.ObjectId` |  |
| `categories` | `Category_Restaurant[]` | `@relation(fields: [categoryIds], references: [id])` |  |
| `promotions` | `Promotion[]` | `` |  |
| `events` | `Restaurant_Event[]` | `` |  |
| `amenityIds` | `String[]` | `@db.ObjectId` |  |
| `amenities` | `Restaurant_Amenities[]` | `@relation(fields: [amenityIds], references: [id])` |  |
| `tagIds` | `String[]` | `@db.ObjectId` |  |
| `tags` | `Tags[]` | `@relation(fields: [tagIds], references: [id])` |  |
| `policies` | `RestaurantPolicy[]` | `` |  |
| `social_links` | `SocialLink[]` | `` |  |
| `faqs` | `Faq[]` | `` |  |
| `delivery_partners` | `DeliveryPartner[]` | `` |  |

### RestaurantPaymentConfig
**File**: `RestaurantPaymentConfig.prisma`

*JSON config (MongoDB rất hợp cho field này)*

*Relations (optional nếu bạn đã có model)*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `systemPaymentMethodId` | `String` | `@db.ObjectId` |  |
| `configData` | `Json` | `` |  |
| `isActive` | `Boolean` | `@default(true)` |  |
| `isTestMode` | `Boolean` | `@default(true)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `brand` | `Brand` | `@relation(fields: [brandId], references: [id])` |  |
| `systemPaymentMethod` | `SystemPaymentMethod` | `@relation(fields: [systemPaymentMethodId], references: [id])` |  |

### Restaurant_Amenities
**File**: `restaurant_amenities.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` |  |
| `icon` | `String?` | `` |  |
| `description` | `String?` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `restaurantIds` | `String[]` | `@db.ObjectId` |  |
| `restaurants` | `Restaurant[]` | `@relation(fields: [restaurantIds], references: [id])` |  |

### Restaurant_Areas
**File**: `restaurant_areas.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `name` | `String?` | `` |  |
| `description` | `String?` | `` |  |
| `smoking_allowed` | `Boolean` | `@default(true)` | cho phép huốc thuốc không |
| `is_outdoor` | `Boolean` | `` | ngoài trời hay trong Nhà |
| `floor_number` | `Int` | `` | tầng mấy |
| `is_active` | `isActive` | `@default(ACTIVE)` |  |
| `tabels` | `Tables[]` | `` |  |

### Restaurant_Event
**File**: `restaurant_events.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id], onDelete: Cascade)` |  |
| `title` | `String` | `` |  |
| `description` | `String?` | `` |  |
| `image` | `String?` | `` |  |
| `startDate` | `DateTime` | `` |  |
| `endDate` | `DateTime?` | `` |  |
| `isActive` | `Boolean` | `@default(true)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### RestaurantRevenue
**File**: `restaurant_revenue.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `brandId` | `String` | `@db.ObjectId` |  |
| `amount` | `Float` | `` |  |
| `source` | `String` | `` | VD: "ORDER_PAYMENT" |
| `referenceId` | `String?` | `@db.ObjectId` | orderId |
| `description` | `String?` | `` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `brand` | `Brand` | `@relation(fields: [brandId], references: [id])` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### Review_Restaurant
**File**: `review_restaurant.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `reservationId` | `String` | `@unique @db.ObjectId` |  |
| `reservation` | `Reservations` | `@relation(fields: [reservationId], references: [id])` |  |
| `userId` | `String` | `@db.ObjectId` |  |
| `user` | `User` | `@relation(fields: [userId], references: [id])` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `overall_rating` | `Int` | `` | đánh giá từ 1 đến 5 |
| `food_rating` | `Int?` | `` | đánh giá đồ ăn |
| `service_rating` | `Int?` | `` | đánh giá dịch vụ |
| `ambiance_rating` | `Int?` | `` | đánh giá không gian quán |
| `comment` | `String?` | `` | bình luận |
| `is_public` | `Boolean` | `@default(true)` | có công khia bình luận hay không |
| `staff_response` | `String?` | `` | phản hồi từ nhà hàng |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### Role
**File**: `role.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` |  |
| `description` | `String?` | `` |  |
| `user` | `User[]` | `` |  |

### Special_Schedules
**File**: `special_schedules.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `date` | `DateTime?` | `` | dùng cho ngày cụ thể |
| `month` | `Int?` | `` | dùng cho holiday |
| `day` | `Int?` | `` |  |
| `is_recurring` | `Boolean` | `@default(false)` | có lặp mỗi năm không |
| `type` | `ScheduleType` | `` |  |
| `open_time` | `String?` | `` | giờ mở đặc biệt null nếu cả nagyf đều đóng |
| `close_time` | `String?` | `` | giờ đóng đặc biệt null nếu cả nagyf đều đóng |
| `reason` | `String?` | `` | lý do cho nagyf này |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### SubscriptionPlan
**File**: `subscription_plan.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` |  |
| `description` | `String?` | `` |  |
| `price` | `Float` | `` |  |
| `discountPrice` | `Float?` | `` | Giá sau khi giảm (nếu có chương trình khuyến mãi) |
| `discountStartDate` | `DateTime?` | `` | Ngày bắt đầu khuyến mãi |
| `discountEndDate` | `DateTime?` | `` | Ngày kết thúc khuyến mãi |
| `billingCycle` | `BillingCycle` | `@default(MONTHLY)` |  |
| `maxRestaurants` | `Int` | `` | Số nhà hàng tối đa (-1 = không giới hạn) |
| `features` | `String[]` | `` | Danh sách các tính năng được mở khóa |
| `isActive` | `Boolean` | `@default(true)` |  |
| `subscriptions` | `BrandSubscription[]` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### SystemPaymentMethod
**File**: `system_payment_method.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `` | Tên hiển thị (VD: MoMo, VNPay, Tiền mặt) |
| `code` | `String` | `@unique` | Mã code (VD: MOMO, VNPAY, CASH) |
| `description` | `String?` | `` |  |
| `iconUrl` | `String?` | `` |  |
| `isActive` | `Boolean` | `@default(true)` |  |
| `systemConfig` | `Json?` | `` | Các setting chung của hệ thống |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `brandConfigs` | `BrandPaymentConfig[]` | `` |  |
| `restaurantConfigs` | `RestaurantPaymentConfig[]` | `` |  |
| `transactions` | `Transaction[]` | `` |  |
| `brandSubscriptionTransactions` | `BrandSubscriptionTransaction[]` | `` |  |
| `orders` | `Order[]` | `` |  |

### SystemRevenue
**File**: `system_revenue.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `amount` | `Float` | `` |  |
| `source` | `String` | `` | VD: "BRAND_SUBSCRIPTION", "SERVICE_FEE" |
| `referenceId` | `String?` | `@db.ObjectId` |  |
| `description` | `String?` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |

### Tables
**File**: `tables.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `restaurantId` | `String` | `@db.ObjectId` |  |
| `restaurant` | `Restaurant` | `@relation(fields: [restaurantId], references: [id])` |  |
| `areaId` | `String` | `@db.ObjectId` |  |
| `area` | `Restaurant_Areas` | `@relation(fields: [areaId], references: [id])` |  |
| `is_vip` | `Boolean` | `@default(false)` |  |
| `table_number` | `String` | `` |  |
| `min_capacity` | `Int` | `` | số lượng khách ít nhất |
| `max_capacity` | `Int` | `` | số lượng khách nhiều nhất |
| `shape` | `TableShape?` | `` |  |
| `is_combinable` | `Boolean?` | `@default(false)` | cho phép ghép table vs người khác hay không |
| `pos_x` | `Float?` | `` | sơ đồ |
| `pos_y` | `Float?` | `` | table nhà hàng |
| `status` | `TableStatus` | `@default(ACTIVE)` |  |
| `qr_code` | `String?` | `@unique` | mở link để đặt món tiếp |
| `reservation_tables` | `Reservation_Tables[]` | `` | bàn đc phân khi có đơn đặt |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `orders` | `Order[]` | `` |  |

### Tags
**File**: `tags.prisma`

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `name` | `String` | `@unique` |  |
| `slug` | `String` | `@unique` |  |
| `description` | `String?` | `` |  |
| `textColor` | `String?` | `@default("#000000")` |  |
| `bgColor` | `String?` | `@default("#f3f4f6")` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `restaurantIds` | `String[]` | `@db.ObjectId` |  |
| `restaurants` | `Restaurant[]` | `@relation(fields: [restaurantIds], references: [id])` |  |

### Transaction
**File**: `Transaction.prisma`

*Relation*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `orderId` | `String` | `@db.ObjectId` |  |
| `amount` | `Float` | `` |  |
| `systemPaymentMethodId` | `String` | `@db.ObjectId` |  |
| `externalTransactionId` | `String?` | `` |  |
| `status` | `TransactionStatus` | `` |  |
| `rawResponse` | `Json?` | `` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `order` | `Order` | `@relation(fields: [orderId], references: [id])` |  |
| `systemPaymentMethod` | `SystemPaymentMethod` | `@relation(fields: [systemPaymentMethodId], references: [id])` |  |

### UpgradeRequest
**File**: `UpgradeRequest.prisma`

*Các thông tin user phải nộp để xin lên quản lý*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `userId` | `String` | `@unique` | Mỗi user chỉ có 1 request chờ duyệt tại 1 thời điểm |
| `user` | `User` | `@relation(fields: [userId], references: [id])` |  |
| `brandName` | `String` | `` | Tên thương hiệu muốn tạo |
| `tax_code` | `String?` | `` | Mã số thuế (nếu cần) |
| `businessLicense` | `String?` | `` | Ảnh chụp giấy phép KD (URL từ Cloudinary) |
| `status` | `RequestStatus` | `@default(PENDING)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |

### User
**File**: `Users.prisma`

*thông tin cơ bản*

*tạo liên kết*

*--- Các Relations (Liên kết tới các vai trò của User) ---*

| Field | Type | Attributes/Relationships | Description |
|-------|------|--------------------------|-------------|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` |  |
| `user_name` | `String` | `@unique` |  |
| `email` | `String` | `@unique` |  |
| `sdt` | `String?` | `` |  |
| `password` | `String?` | `` |  |
| `providerId` | `String?` | `` |  |
| `providerType` | `providerType?` | `` |  |
| `name` | `String?` | `` |  |
| `avatar` | `String?` | `` |  |
| `gender` | `Gender?` | `` |  |
| `date_of_birth` | `DateTime?` | `` |  |
| `is_active` | `AccountStatus` | `@default(PENDING)` |  |
| `createdAt` | `DateTime` | `@default(now())` |  |
| `updatedAt` | `DateTime` | `@updatedAt` |  |
| `employments` | `Employment[]` | `` | Liên kết: User này làm nhân viên ở đâu? có or ko |
| `roleId` | `String` | `@db.ObjectId` | Liên kết : User này là khách hàng hay admin |
| `role` | `Role` | `@relation(fields: [roleId], references: [id])` |  |
| `reservations` | `Reservations[]` | `` | khách hàng đặt bàn |
| `review_restaurant` | `Review_Restaurant[]` | `` | người đánh fias nhà hàng |
| `reservation_audit_log` | `Reservation_Audit_Log[]` | `` | thay đổi đặt |
| `notifications` | `Notifications[]` | `` |  |
| `ordersTaken` | `Order[]` | `@relation("EmployeeOrders")` |  |
| `upgradeRequest` | `UpgradeRequest?` | `` |  |
| `brandSubscriptionTransactions` | `BrandSubscriptionTransaction[]` | `` |  |

## Enums

### Gender
- `Nam`
- `Nu`
- `Khac`

### AccountStatus
- `PENDING // chờ xác minh`
- `ACTIVE // Hoạt động bình thường`
- `INACTIVE // Tạm khóa (Nghỉ việc/Chưa kích hoạt)`
- `BANNED // Cấm vĩnh viễn (Vi phạm)`

### isActive
- `PENDING`
- `ACTIVE // đang hoạt động`
- `INACTIVE // tạm thời nghĩ`
- `TERMINATED // nghĩ vĩnh viễn`

### RequestStatus
- `PENDING // Đang chờ duyệt`
- `APPROVED // Đã duyệt`
- `REJECTED // Từ chối`

### role_enum
- `BRAND`
- `RESTAURANT`
- `SYSTEM`

### salary_type
- `MONTHLY`
- `HOURLY`

### TableShape
- `ROUND // table dạng tròn`
- `RECT // table dạng chữ nhật`
- `LONG // table dạng dài`

### TableStatus
- `ACTIVE // hoạt động`
- `INACTIVE // không dùng`
- `MAINTENANCE // dang sữa`

### ScheduleType
- `HOLIDAY // NGÀY LỄ`
- `SPECIAL_HOURS // thay đổi h mở của tạm thời`
- `PRIVATE_EVENT // sự kiện riêng`
- `CLOSURE // đóng tạm bảo trì....`

### ReservationStatus
- `PENDING // chờ xác nhận`
- `CONFIRMED // đã xác nhận`
- `SEATED // khách đã tới`
- `COMPLETED //  khách đã ăn xong`
- `CANCELLED // khách đã hủy`
- `NO_SHOW // khách không tới`

### ReservationSource
- `WEB`
- `MOBILE`
- `PHONE`
- `WALK_IN // khách vãng lai đặt  ik bộ tới đặt`
- `THIRD_PARTY // bên thứ 3 đặt dùm`

### Occasion
- `NORMAL // Dùng bữa bình thường`
- `BIRTHDAY // Sinh nhật`
- `ANNIVERSARY // Kỷ niệm (ngày cưới, yêu nhau...)`
- `BUSINESS // Tiếp khách/Công việc`
- `DATE // Hẹn hò cặp đôi`
- `OTHER // Khác`

### NotificationStatus
- `PENDING // ĐANG CHỜ GỬI`
- `SENT // ĐÃ GỬI`
- `DELIVERED // ĐÃ ĐẾN THIẾT BỊ`
- `FAILED // GỬI LỖI`
- `BOUNCED // EMAIL BỊ TRẢ LẠI`

### NotificationType
- `CONFIRMATION // XÁC NHẬN ĐẶT BÀN`
- `REMINDER // NHẮC LỊCH`
- `CANCELLATION // THÔNG BÁO HỦY`
- `WAITLIST // THÔNG BÁO CÓ BÀN TRỐNG`
- `CUSTOM // THÔNG BÁO KHÁC`

### NotificationChannel
- `EMAIL // SENDGRID`
- `SMS // TWILIO`
- `PUSH // FIREBASE`
- `ZALO // ZALO OA`
- `WHATSAPP // WHATSAPP API`

### OrderStatus
- `OPEN //ĐANG MỞ (ĐANG GỌI MÓN)`
- `SENT_TO_KITCHEN //ĐÃ GỬI XUỐNG BẾP`
- `PARTIALLY_SERVED //ĐÃ PHỤC VỤ MỘT PHẦN`
- `SERVED //ĐÃ PHỤC VỤ XONG (ĐỦ MÓN)`
- `BILL_REQUESTED //KHÁCH YÊU CẦU THANH TOÁN`
- `PAID //ĐÃ THANH TOÁN`
- `CANCELLED //ĐÃ HỦY ĐƠN`

### KitchenStatus
- `QUEUED //ĐANG TRONG HÀNG ĐỢI`
- `PREPARING //ĐANG CHẾ BIẾN`
- `READY // MÓN ĂN ĐÃ SẴN SÀNG (CHỜ LÊN MÓN)`
- `SERVING // ĐANG MANG RA BÀN`
- `SERVED //ĐÃ PHỤC VỤ XONG`
- `CANCELLED //ĐÃ HỦY CHẾ BIẾN`

### providerType
- `GOOGLE`
- `FACEBOOK`
- `GITHUB`

### PaymentStatus
- `PENDING //đang chờ thanh toán`
- `PAID //Đã thanh toán đủ 100%`
- `PARTIALLY_PAID //Thanh toán một phần đặt cọ trả trước`
- `REFUNDED //Đã hoàn tiền`
- `FAILED //Thanh toán thất bại hoàn toàn`

### TransactionStatus
- `PENDING`
- `SUCCESS`
- `FAILED`
- `VOIDED`

### ItemType
- `FOOD // Món ăn chế biến`
- `DRINK // Đồ uống (Cà phê, nước ngọt)`
- `ALCOHOL // Đồ uống có cồn (Bia, rượu) - Cần check tuổi hoặc giấy phép`
- `DESSERT // Món tráng miệng`
- `SIDE_DISH // Món ăn kèm (Kim chi, khoai tây chiên)`
- `TOPPING // Topping thêm vào (Trân châu, trứng ốp la)`
- `COMBO // Gói combo nhiều món`
- `SERVICE // Phí dịch vụ (Phí phòng VIP, phí mang đồ uống ngoài vào)`
- `OTHER // Các loại khác`

### BillingCycle
- `MONTHLY`
- `YEARLY`
- `LIFETIME`

### SubscriptionStatus
- `PENDING_PAYMENT // Đang chờ thanh toán`
- `ACTIVE // Đang sử dụng`
- `EXPIRED // Đã hết hạn`
- `CANCELLED // Đã hủy`

