# Cấu Trúc File & Thư Mục Frontend (Next.js App Router)
Dựa trên phân tích Backend (Roles & Permissions), dưới đây là đề xuất cấu trúc thư mục `fe/src/app` chia theo từng **VAI TRÒ (Role)** và sau đó chia theo **CHỨC NĂNG (Features)**.

Cấu trúc này sử dụng tính năng **Route Groups** `(folder_name)` của Next.js để gộp các tính năng cùng 1 đối tượng sử dụng vào chung một Layout, giúp code không bị rối và dễ dàng áp dụng Middleware check quyền truy cập.

---

## 1. `(public)` - Dành cho Khách Vãng Lai (Guest)
Nhóm tính năng ai cũng xem được, không cần đăng nhập. Mục đích là để marketing và thu hút khách hàng.
```text
src/app/(public)/
├── page.tsx                      # Trang chủ (Landing page giới thiệu nền tảng)
├── restaurants/                  # Danh sách tất cả nhà hàng
│   ├── page.tsx                  # Hiển thị list nhà hàng, filter, tìm kiếm
│   └── [restaurantId]/           # Chi tiết 1 nhà hàng
│       ├── page.tsx              # Xem thông tin chung
│       ├── menu/                 # Khách xem trước thực đơn
│       └── reviews/              # Khách đọc đánh giá
├── about/                        # Về chúng tôi
└── contact/                      # Liên hệ hỗ trợ
```

## 2. `(auth)` - Dành cho Xác thực người dùng
Nhóm các trang liên quan đến định danh, dùng chung cho mọi vai trò.
```text
src/app/(auth)/
├── login/                        # Đăng nhập
├── register/                     # Đăng ký tài khoản
├── forgot-password/              # Quên mật khẩu
└── upgrade-request/              # Form điền thông tin xin nâng cấp lên làm Chủ Brand
```

## 3. `(customer)` - Dành cho Khách Hàng Đã Đăng Nhập
Sau khi User đăng nhập, họ có thể sử dụng các chức năng tự phục vụ.
```text
src/app/(customer)/
├── profile/                      # Thông tin cá nhân, cập nhật avatar, hạng thẻ thành viên
├── reservations/                 # Chức năng Đặt bàn
│   ├── page.tsx                  # Lịch sử đặt bàn của tôi
│   ├── new/                      # Tạo đơn đặt bàn mới
│   └── [reservationId]/          # Chi tiết đơn đặt bàn (Trạng thái, số bàn được xếp)
├── orders/                       # Lịch sử gọi món và hóa đơn của khách
├── reviews/                      # Quản lý các đánh giá mà khách đã viết
└── notifications/                # Thông báo (Nhắc lịch đến ăn, khuyến mãi mới)
```

## 4. `(staff)` - Dành cho Nhân Viên Vận Hành (Nhà hàng)
Dành cho Phục vụ, Thu ngân, Đầu bếp, Hostess (Lễ tân) làm việc hàng ngày. Layout thường là dạng App (Full màn hình, tối ưu cho máy POS, Tablet di động).
```text
src/app/(staff)/
├── pos/                          # Màn hình bán hàng (Dành cho Thu ngân / Phục vụ)
│   ├── page.tsx                  # Chọn bàn, chọn Reservation để order
│   └── [orderId]/                # Giao diện gọi món (Bấm menu, thêm số lượng)
├── kitchen/                      # Màn hình KDS (Dành cho Đầu bếp)
│   └── page.tsx                  # Xem danh sách món chờ làm, bấm hoàn thành
├── tables/                       # Quản lý sơ đồ bàn (Dành cho Phục vụ / Hostess)
│   └── page.tsx                  # Xem trực quan bàn nào trống, bàn nào đang ăn
└── check-in/                     # Check-in khách (Dành cho Hostess)
    └── page.tsx                  # Khách đến đọc SĐT -> Check-in -> Dẫn vào bàn
```

## 5. `(restaurant-admin)` - Dành cho Quản Lý 1 Chi Nhánh
Giám đốc chi nhánh sử dụng phần này để setup cấu hình cho nhà hàng của mình.
```text
src/app/(restaurant-admin)/
├── dashboard/                    # Thống kê doanh thu, khách hàng của chi nhánh
├── menu/                         # Cấu hình thực đơn (Món ăn, Giá cả, Hết hàng)
├── tables-setup/                 # Vẽ sơ đồ bàn, xếp khu vực (Trong nhà, Ngoài trời)
├── staff/                        # Quản lý nhân viên trong chi nhánh (Thêm thu ngân, bếp)
├── promotions/                   # Tạo mã giảm giá riêng cho chi nhánh
├── reviews/                      # Xem và phản hồi đánh giá của khách tại chi nhánh
└── settings/                     # Cấu hình giờ mở cửa, ca làm việc, phương thức thanh toán
```

## 6. `(brand-admin)` - Dành cho Chủ Thương Hiệu (Quản lý chuỗi)
Người đứng đầu thương hiệu có thể tạo ra nhiều nhà hàng con.
```text
src/app/(brand-admin)/
├── dashboard/                    # Thống kê tổng hợp toàn bộ chuỗi nhà hàng
├── restaurants/                  # Quản lý danh sách các chi nhánh (Thêm, sửa, đóng cửa)
├── global-menu/                  # Cấu hình thực đơn dùng chung cho toàn hệ thống
├── staff/                        # Quản lý nhân sự cấp cao (Gán quyền quản lý chi nhánh)
├── customers/                    # Quản lý data khách hàng toàn chuỗi (Thẻ thành viên)
└── settings/                     # Cấu hình thương hiệu (Logo, Thuế)
```

## 7. `(system-admin)` - Dành cho Super Admin Hệ Thống
Chủ nền tảng phần mềm, quản lý tất cả khách hàng B2B (các Brand).
```text
src/app/(system-admin)/
├── dashboard/                    # Thống kê tổng số Brand, số User trên toàn hệ thống
├── upgrade-requests/             # Quản lý và Duyệt đơn xin mở quán của User
├── brands/                       # Quản lý tất cả thương hiệu trên platform
├── users/                        # Quản lý toàn bộ danh sách User
└── categories/                   # Cấu hình danh mục dùng chung (MenuCategory kiểu hệ thống)
```

---
### 💡 Lưu ý khi Code:
1. **Middleware bảo mật**: Ở Next.js, bạn chỉ cần cấu hình trong file `middleware.ts`:
   - Request trỏ vào `/brand-admin/*` -> Check token xem Role có phải BRAND không.
   - Request trỏ vào `/staff/*` -> Check xem User có tồn tại trong bảng `Employment` không.
2. **Layout riêng biệt**: Mỗi Group `(folder)` sẽ có 1 file `layout.tsx` riêng. 
   - `(public)` sẽ có Header, Footer chung.
   - `(staff)` sẽ ẩn hết Header, Footer để dùng menu Sidebar đặc thù cho máy POS.
   - Các `(admin)` sẽ dùng chung 1 UI dạng Dashboard (Side menu, Topbar).
