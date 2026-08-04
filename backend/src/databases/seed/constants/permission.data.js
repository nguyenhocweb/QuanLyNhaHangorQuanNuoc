export const permission_data = [
  // ==========================
  // QUYỀN CẤP NHÀ HÀNG (RESTAURANT)
  // ==========================
  // 1. Quản lý Đơn hàng (Order)
  { id: "65b2a1c0d4f3e2a1b0c9d001", name: "VIEW_ORDER", description: "Xem danh sách và chi tiết đơn hàng", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d002", name: "CREATE_ORDER", description: "Tạo đơn hàng mới (Gọi món)", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d003", name: "UPDATE_ORDER", description: "Cập nhật, thêm/bớt món trong đơn hàng", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d004", name: "CANCEL_ORDER", description: "Hủy đơn hàng", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d005", name: "APPLY_DISCOUNT", description: "Áp dụng mã giảm giá / chiết khấu vào đơn hàng", type: "RESTAURANT" },

  // 2. Thu ngân & Thanh toán (Cashier)
  { id: "65b2a1c0d4f3e2a1b0c9d011", name: "PROCESS_PAYMENT", description: "Thanh toán đơn hàng, in hóa đơn", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d012", name: "REFUND_PAYMENT", description: "Hoàn tiền, hủy thanh toán", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d013", name: "VIEW_TRANSACTIONS", description: "Xem lịch sử giao dịch trong ca làm việc", type: "RESTAURANT" },

  // 3. Đặt bàn (Reservations)
  { id: "65b2a1c0d4f3e2a1b0c9d021", name: "VIEW_RESERVATION", description: "Xem danh sách khách đặt bàn", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d022", name: "CREATE_RESERVATION", description: "Tạo đặt bàn mới", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d023", name: "UPDATE_RESERVATION", description: "Chỉnh sửa thông tin đặt bàn", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d024", name: "CANCEL_RESERVATION", description: "Hủy đặt bàn", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d025", name: "ASSIGN_RESERVATION_TABLE", description: "Xếp bàn cho khách đặt trước", type: "RESTAURANT" },

  // 4. Quản lý Bàn (Tables)
  { id: "65b2a1c0d4f3e2a1b0c9d031", name: "VIEW_TABLES", description: "Xem sơ đồ bàn", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d032", name: "MANAGE_TABLES", description: "Quản lý sơ đồ bàn, thêm/sửa/xóa bàn", type: "RESTAURANT" },

  // 5. Bếp & Pha chế (Kitchen & Bar)
  { id: "65b2a1c0d4f3e2a1b0c9d041", name: "VIEW_KITCHEN_TICKETS", description: "Xem danh sách món chờ chế biến (Màn hình Bếp/Bar)", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d042", name: "UPDATE_KITCHEN_STATUS", description: "Cập nhật trạng thái món (Đang nấu, Đã xong, Hủy)", type: "RESTAURANT" },

  // 6. Quản lý nhân sự chi nhánh (Branch Staff)
  { id: "65b2a1c0d4f3e2a1b0c9d051", name: "VIEW_STAFF", description: "Xem danh sách nhân viên chi nhánh", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d052", name: "MANAGE_STAFF", description: "Thêm, sửa, xóa, phân quyền nhân viên tại chi nhánh", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d053", name: "MANAGE_ROSTERS", description: "Phân ca, xếp lịch làm việc cho nhân viên", type: "RESTAURANT" },

  // 7. Thực đơn chi nhánh (Restaurant Menu)
  { id: "65b2a1c0d4f3e2a1b0c9d061", name: "VIEW_MENU", description: "Xem thực đơn của nhà hàng", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d062", name: "UPDATE_MENU_AVAILABILITY", description: "Bật/tắt trạng thái hết hàng của món ăn tại chi nhánh", type: "RESTAURANT" },

  // 8. Báo cáo chi nhánh (Branch Reports)
  { id: "65b2a1c0d4f3e2a1b0c9d071", name: "VIEW_REVENUE_REPORT", description: "Xem báo cáo doanh thu của chi nhánh", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d072", name: "VIEW_STAFF_REPORT", description: "Xem báo cáo hiệu suất, doanh số của nhân viên", type: "RESTAURANT" },

  // 9. Kho & Nguyên liệu (Inventory)
  { id: "65b2a1c0d4f3e2a1b0c9d081", name: "VIEW_INVENTORY", description: "Xem tồn kho nguyên vật liệu tại chi nhánh", type: "RESTAURANT" },
  { id: "65b2a1c0d4f3e2a1b0c9d082", name: "UPDATE_INVENTORY", description: "Kiểm kê, nhập/xuất kho nguyên vật liệu tại chi nhánh", type: "RESTAURANT" },

  // ==========================
  // QUYỀN CẤP THƯƠNG HIỆU (BRAND)
  // ==========================
  { id: "65b2a1c0d4f3e2a1b0c9d101", name: "VIEW_BRAND_DASHBOARD", description: "Xem tổng quan số liệu hoạt động toàn chuỗi", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d102", name: "MANAGE_BRAND_INFO", description: "Cập nhật thông tin thương hiệu (Tên, Logo, Hotline)", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d103", name: "MANAGE_BRANCHES", description: "Thêm mới, cấu hình và quản lý các chi nhánh (Nhà hàng)", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d104", name: "MANAGE_GLOBAL_MENU", description: "Quản lý thực đơn tổng (Tạo, sửa, xóa món ăn, giá chuẩn)", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d105", name: "MANAGE_MENU_CATEGORIES", description: "Quản lý danh mục món ăn", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d106", name: "MANAGE_EMPLOYEES", description: "Quản lý nhân sự toàn chuỗi (Thêm tài khoản, phân quyền cấp cao)", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d107", name: "VIEW_ALL_RESERVATIONS", description: "Giám sát đặt bàn của tất cả chi nhánh", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d108", name: "VIEW_ALL_ORDERS", description: "Giám sát đơn hàng của tất cả chi nhánh", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d109", name: "MANAGE_PROMOTIONS", description: "Quản lý các chương trình khuyến mãi, Voucher", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d110", name: "VIEW_CRM_DATA", description: "Xem dữ liệu và phân tích tệp khách hàng thân thiết (CRM)", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d111", name: "VIEW_GLOBAL_REVENUE", description: "Xem báo cáo doanh thu, lợi nhuận gộp toàn chuỗi", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d112", name: "MANAGE_PAYMENT_CONFIGS", description: "Cấu hình ngân hàng, cổng thanh toán cho thương hiệu", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d113", name: "MANAGE_BRAND_SUBSCRIPTION", description: "Gia hạn, mua gói cước phần mềm từ hệ thống gốc", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d114", name: "MANAGE_REVIEWS", description: "Xem và phản hồi đánh giá của khách hàng trên toàn chuỗi", type: "BRAND" },
  { id: "65b2a1c0d4f3e2a1b0c9d115", name: "MANAGE_INGREDIENTS", description: "Quản lý danh mục nguyên vật liệu và công thức (Recipes)", type: "BRAND" },

  // ==========================
  // QUYỀN CẤP HỆ THỐNG (SYSTEM ADMIN)
  // (Đã được gỡ bỏ vì Admin sử dụng Role cứng, không qua bảng Employment)
  // ==========================
];