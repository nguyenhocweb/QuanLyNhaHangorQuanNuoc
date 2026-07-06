// Định nghĩa tất cả các tính năng (features) có thể khóa/mở khóa dựa trên gói cước
export const SUBSCRIPTION_FEATURES = {
    // --- Quản lý Cơ bản ---
    MENU_MANAGEMENT: 'MENU_MANAGEMENT',               // Quản lý thực đơn
    TABLE_MANAGEMENT: 'TABLE_MANAGEMENT',             // Quản lý sơ đồ bàn
    ORDER_MANAGEMENT: 'ORDER_MANAGEMENT',             // Quản lý gọi món
    
    // --- Đặt bàn & Khách hàng ---
    RESERVATION_ONLINE: 'RESERVATION_ONLINE',         // Cho phép khách đặt bàn online
    CUSTOMER_REVIEWS: 'CUSTOMER_REVIEWS',             // Cho phép nhận đánh giá từ khách
    
    // --- Quản lý Nâng cao ---
    ADVANCED_PROMOTIONS: 'ADVANCED_PROMOTIONS',       // Quản lý Voucher/Khuyến mãi
    EMPLOYEE_PERMISSIONS: 'EMPLOYEE_PERMISSIONS',     // Phân quyền nhân viên chuyên sâu
    PAYMENT_INTEGRATION: 'PAYMENT_INTEGRATION',       // Tích hợp thanh toán (Momo, VNPay...)
    
    // --- Chăm sóc khách hàng & Marketing ---
    ZALO_SMS_NOTIFICATION: 'ZALO_SMS_NOTIFICATION',   // Tự động gửi SMS/Zalo OA cho khách
    REVENUE_ANALYTICS: 'REVENUE_ANALYTICS',           // Báo cáo doanh thu nâng cao
};

// Ánh xạ Features thành Tên hiển thị (Dùng cho Frontend hoặc API response)
export const FEATURE_NAMES = {
    [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: 'Quản lý thực đơn',
    [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: 'Quản lý sơ đồ bàn',
    [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: 'Hệ thống gọi món',
    [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: 'Tính năng đặt bàn online',
    [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: 'Nhận & Quản lý đánh giá khách hàng',
    [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: 'Quản lý khuyến mãi nâng cao',
    [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: 'Phân quyền nhân viên chi tiết',
    [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: 'Tích hợp thanh toán trực tuyến',
    [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: 'Gửi thông báo tự động (Zalo/SMS)',
    [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: 'Báo cáo doanh thu nâng cao',
};
