// Định nghĩa tất cả các tính năng (features)
export const SUBSCRIPTION_FEATURES = {
    // --- Tính năng Cốt lõi (Mặc định mở 100% cho mọi thương hiệu/nhà hàng) ---
    MENU_MANAGEMENT: 'MENU_MANAGEMENT',               // Quản lý thực đơn
    TABLE_MANAGEMENT: 'TABLE_MANAGEMENT',             // Quản lý sơ đồ bàn
    ORDER_MANAGEMENT: 'ORDER_MANAGEMENT',             // Quản lý gọi món
    RESERVATION_ONLINE: 'RESERVATION_ONLINE',         // Tiếp nhận & Quản lý đặt bàn online
    CUSTOMER_REVIEWS: 'CUSTOMER_REVIEWS',             // Đánh giá từ khách
    
    // --- Tính năng Nâng cao (Có thể bật/tắt theo gói cước dịch vụ) ---
    CRM_MANAGEMENT: 'CRM_MANAGEMENT',                 // Quản lý Khách hàng & CRM
    ADVANCED_PROMOTIONS: 'ADVANCED_PROMOTIONS',       // Quản lý Voucher/Khuyến mãi nâng cao
    EMPLOYEE_PERMISSIONS: 'EMPLOYEE_PERMISSIONS',     // Phân quyền nhân viên chuyên sâu
    PAYMENT_INTEGRATION: 'PAYMENT_INTEGRATION',       // Tích hợp thanh toán online (Momo, VNPay...)
    ZALO_SMS_NOTIFICATION: 'ZALO_SMS_NOTIFICATION',   // Gửi tin nhắn tự động (Zalo OA / SMS)
    REVENUE_ANALYTICS: 'REVENUE_ANALYTICS',           // Báo cáo doanh thu & Phân tích nâng cao
    CENTRAL_SUPPLY_CHAIN: 'CENTRAL_SUPPLY_CHAIN',     // Chuỗi cung ứng kho tổng (Supply Chain)
    LOCAL_INVENTORY: 'LOCAL_INVENTORY',               // Quản lý Kho chi nhánh & Định lượng (Recipe)
    KITCHEN_DISPLAY: 'KITCHEN_DISPLAY',               // Hệ thống hiển thị Bếp/Bar (KDS)
    AI_CHATBOT_BOOKING: 'AI_CHATBOT_BOOKING',         // Trợ lý ảo AI Đặt bàn & Tư vấn khách
    AI_CHATBOT_BRAND: 'AI_CHATBOT_BRAND',             // Trợ lý ảo AI Phân tích Doanh thu
    AI_INVENTORY_PREDICT: 'AI_INVENTORY_PREDICT',     // AI Dự báo Tồn kho thông minh
};

// Danh sách các tính năng CỐT LÕI MẶC ĐỊNH (Không thể bị khóa hay tắt bỏ)
export const DEFAULT_CORE_FEATURES = {
    [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: true,
    [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: true,
    [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: true,
    [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: true,
    [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: true,
    qr_menu: true,
    basic_pos: true,
    reservation: true
};

// Ánh xạ các Tính năng Nâng cao cho Admin cấu hình trong Gói cước (Ẩn các tính năng cơ bản)
export const CONFIGURABLE_FEATURE_NAMES = {
    [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: 'Chuỗi cung ứng toàn hệ thống (Kho tổng)',
    [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: 'Quản lý kho chi nhánh & Định lượng món (Recipe)',
    [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: 'Hệ thống hiển thị Bếp/Bar (KDS)',
    [SUBSCRIPTION_FEATURES.CRM_MANAGEMENT]: 'Khách hàng thân thiết & CRM nâng cao',
    [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: 'Quản lý Khuyến mãi & Voucher nâng cao',
    [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: 'Phân quyền nhân viên chi tiết theo ca',
    [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: 'Tích hợp cổng thanh toán trực tuyến (MoMo, VNPay)',
    [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: 'Gửi tin nhắn tự động (Zalo OA / SMS Brandname)',
    [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: 'Báo cáo doanh thu & Phân tích chuyên sâu',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING]: 'Trợ lý ảo AI Đặt bàn & Tư vấn thực đơn',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BRAND]: 'Trợ lý ảo AI Phân tích Quản trị & Doanh thu',
    [SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT]: 'AI Dự báo Tồn kho thông minh',
};

// Tên tất cả tính năng để hiển thị tra cứu
export const FEATURE_NAMES = {
    [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: 'Quản lý thực đơn (Mặc định)',
    [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: 'Quản lý sơ đồ bàn (Mặc định)',
    [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: 'Hệ thống gọi món (Mặc định)',
    [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: 'Tính năng đặt bàn online (Mặc định)',
    [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: 'Nhận & Quản lý đánh giá (Mặc định)',
    ...CONFIGURABLE_FEATURE_NAMES
};
