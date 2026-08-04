# Phân Quyền Chức Năng Hệ Thống (Menu Architecture)

Dựa trên kiến trúc Master-Local (Brand - Restaurant) mới thiết kế, đây là bản thống kê chi tiết ma trận phân quyền (CRUD: Create, Read, Update, Delete) đối với từng vai trò trong hệ thống.

---

## 1. Brand Owner (Chủ Thương Hiệu)
*Quyền hạn cao nhất trong một thương hiệu. Chịu trách nhiệm cấu hình Master Data.*

| Khối Dữ Liệu | Thêm (Create) | Xem (Read) | Sửa (Update) | Xóa (Delete) | Ghi Chú Cụ Thể |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Danh mục (MenuCategory)** | ✅ | ✅ | ✅ | ✅ | Tạo nhóm món ăn chung cho toàn hệ thống (Lẩu, Nướng, Nước uống). |
| **Món ăn (MenuItem)** | ✅ | ✅ | ✅ | ✅ | Tạo thông tin gốc: Tên, Hình ảnh, `basePrice` (giá niêm yết), SKU, mô tả. |
| **Biến thể (ItemVariant)** | ✅ | ✅ | ✅ | ✅ | Tạo Size S/M/L, thay đổi giá theo Size. |
| **Nhóm tùy chọn (ModifierGroup)** | ✅ | ✅ | ✅ | ✅ | Tạo nhóm Topping, Lượng đường, Lượng đá. Giới hạn min/max. |
| **Tùy chọn (ModifierOption)** | ✅ | ✅ | ✅ | ✅ | Tạo Trân châu (+5k), Thạch dừa (+10k). |
| **Phân bổ món (RestaurantMenuItem)**| ✅ | ✅ | ✅ | ✅ | Quyết định món ăn nào ĐƯỢC BÁN tại chi nhánh nào (Tạo/Xóa bản ghi). Đồng thời có quyền thiết lập `isAvailable` (Còn/Hết hàng) hoặc `overridePrice` (Ghi đè giá). |
| **Nguyên liệu (Ingredient)** | ✅ | ✅ | ✅ | ✅ | Tạo danh mục nguyên liệu (Đường, Thịt Bò) và giá vốn (costPerUnit). |
| **Công thức (Recipe)** | ✅ | ✅ | ✅ | ✅ | Lắp ráp nguyên liệu vào Món ăn, Biến thể hoặc Tùy chọn. |

> **Tóm lại**: Brand Owner là người DUY NHẤT được phép tạo ra các Món ăn (MenuItem) và Công thức (Recipe). Các chi nhánh không được phép tự tạo món lạ ngoài hệ thống.

---

## 2. Restaurant Manager (Quản Lý Chi Nhánh)
*Chịu trách nhiệm kinh doanh tại 1 chi nhánh cụ thể. Chỉ tương tác với dữ liệu được Brand phân bổ.*

| Khối Dữ Liệu | Thêm (Create) | Xem (Read) | Sửa (Update) | Xóa (Delete) | Ghi Chú Cụ Thể |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **MenuCategory** | ❌ | ✅ | ❌ | ❌ | Chỉ được xem danh mục. |
| **MenuItem / Variants / Modifiers** | ❌ | ✅ | ❌ | ❌ | Chỉ được xem món, giá gốc, hình ảnh. Không được sửa tên món. |
| **Phân bổ món (RestaurantMenuItem)**| ❌ | ✅ | ✅ | ❌ | **QUAN TRỌNG**: Quản lý được phép bật/tắt `isAvailable` (Báo hết hàng tạm thời tại chi nhánh) và sửa `overridePrice` (nếu Brand cho phép thay đổi giá theo khu vực). |
| **Nguyên liệu & Công thức** | ❌ | ✅ | ❌ | ❌ | Chỉ xem để biết định mức xuất kho. |

---

## 3. Staff / Cashier (Nhân viên / Thu ngân Chi nhánh)
*Thực thi nghiệp vụ bán hàng hàng ngày.*

| Khối Dữ Liệu | Thêm (Create) | Xem (Read) | Sửa (Update) | Xóa (Delete) | Ghi Chú Cụ Thể |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **MenuItem / Variants / Modifiers** | ❌ | ✅ | ❌ | ❌ | Lên đơn cho khách dựa trên các tùy chọn có sẵn. |
| **Phân bổ món (RestaurantMenuItem)**| ❌ | ✅ | ✅* | ❌ | *(Tùy cấu hình quyền)* Có thể được cấp quyền đổi `isAvailable` = false nếu bếp báo hết nguyên liệu. KHÔNG được thêm/rút món khỏi menu chi nhánh, không được đổi giá. |
| **Order & OrderItem** | ✅ | ✅ | ✅ | ❌ | Tạo đơn hàng, chọn variant, chọn topping và ghi chú món. |

---

## 4. System Admin (Quản Trị Viên Hệ Thống)
*Quản lý nền tảng SaaS (Super Admin)*

| Khối Dữ Liệu | Thêm (Create) | Xem (Read) | Sửa (Update) | Xóa (Delete) | Ghi Chú Cụ Thể |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Tất cả dữ liệu Menu** | ❌ | ✅ | ❌ | ✅* | Thường không can thiệp vào Menu của Brand. Nhưng có quyền "Xóa/Khóa" (Ban) món ăn nếu vi phạm chính sách nền tảng. |
| **Gói cước / Thanh toán** | ✅ | ✅ | ✅ | ✅ | Quản lý hạ tầng SaaS, SystemPaymentMethod, SubscriptionPlan. |

---

## 5. Customer (Khách hàng)
*End-user truy cập vào App/Web.*

| Khối Dữ Liệu | Thêm (Create) | Xem (Read) | Sửa (Update) | Xóa (Delete) | Ghi Chú Cụ Thể |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Public Menu** | ❌ | ✅ | ❌ | ❌ | Chỉ thấy các món có `isActive = true` (ở cấp Brand) VÀ `isAvailable = true` (ở cấp Restaurant). |
| **Giá hiển thị (Price)** | - | ✅ | - | - | Thấy giá `overridePrice` (nếu có) hoặc `basePrice` + `Variant Price` + `Modifier Price`. |
| **Order** | ✅ | ✅ | ❌ | ❌ | Đặt món và thanh toán. |

---

## Tóm tắt luồng hoạt động chuẩn:
1. **Brand Owner** tạo **Trà Sữa Oolong** (BasePrice: 30k) -> Thêm **Size L** (Variant: +10k) -> Thêm **Trân Châu Trắng** (Modifier: +10k).
2. **Brand Owner** phân bổ món này cho **Chi nhánh Q1** và **Chi nhánh Thủ Đức** (`RestaurantMenuItem`).
3. Quản lý **Chi nhánh Q1** giữ nguyên.
4. Quản lý **Chi nhánh Thủ Đức** thay đổi `overridePrice` thành 25k (vì mặt bằng rẻ hơn).
5. Buổi chiều, **Chi nhánh Q1** hết trân châu trắng -> Quản lý Q1 vào tắt `isAvailable` của món Trà Sữa Oolong hoặc tắt riêng Trân Châu Trắng (nếu mở rộng cấp độ kho).
6. **Khách hàng** ở Thủ Đức mua Size L, thêm Trân Châu sẽ thấy tổng giá: 25k + 10k + 10k = **45k**. Đặt hàng thành công!
