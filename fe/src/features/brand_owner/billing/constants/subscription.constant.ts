export const SUBSCRIPTION_FEATURES = {
    // --- Tính năng cốt lõi mặc định ---
    MENU_MANAGEMENT: 'MENU_MANAGEMENT',
    TABLE_MANAGEMENT: 'TABLE_MANAGEMENT',
    ORDER_MANAGEMENT: 'ORDER_MANAGEMENT',
    RESERVATION_ONLINE: 'RESERVATION_ONLINE',
    CUSTOMER_REVIEWS: 'CUSTOMER_REVIEWS',

    // --- Tính năng nâng cao tùy chọn ---
    ADVANCED_PROMOTIONS: 'ADVANCED_PROMOTIONS',
    EMPLOYEE_PERMISSIONS: 'EMPLOYEE_PERMISSIONS',
    CRM_MANAGEMENT: 'CRM_MANAGEMENT',
    PAYMENT_INTEGRATION: 'PAYMENT_INTEGRATION',
    ZALO_SMS_NOTIFICATION: 'ZALO_SMS_NOTIFICATION',
    REVENUE_ANALYTICS: 'REVENUE_ANALYTICS',
    CENTRAL_SUPPLY_CHAIN: 'CENTRAL_SUPPLY_CHAIN',
    LOCAL_INVENTORY: 'LOCAL_INVENTORY',
    KITCHEN_DISPLAY: 'KITCHEN_DISPLAY',
    AI_CHATBOT_BOOKING: 'AI_CHATBOT_BOOKING',
    AI_CHATBOT_BRAND: 'AI_CHATBOT_BRAND',
    AI_INVENTORY_PREDICT: 'AI_INVENTORY_PREDICT',
};

// Danh sách các tính năng CỐT LÕI MẶC ĐỊNH (Mở 100% cho mọi thương hiệu/nhà hàng)
export const DEFAULT_CORE_FEATURES = [
    SUBSCRIPTION_FEATURES.MENU_MANAGEMENT,
    SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT,
    SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT,
    SUBSCRIPTION_FEATURES.RESERVATION_ONLINE,
    SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS,
];

export const FEATURE_NAMES: Record<string, string> = {
    [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: 'Chuỗi cung ứng toàn hệ thống (Kho tổng)',
    [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: 'Quản lý kho chi nhánh & Định lượng (Recipe)',
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

export const FEATURE_DESCRIPTIONS: Record<string, string> = {
    [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: 'Quản lý điều phối nguyên vật liệu từ kho tổng đến các chi nhánh.',
    [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: 'Theo dõi tồn kho chi nhánh, tự động trừ kho theo định lượng món (Recipe).',
    [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: 'Màn hình KDS tại bếp/bar giúp tối ưu tốc độ chuẩn bị món, tránh sai sót.',
    [SUBSCRIPTION_FEATURES.CRM_MANAGEMENT]: 'Quản lý thông tin khách hàng, thẻ thành viên, phân tập khách hàng nâng cao.',
    [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: 'Tạo mã giảm giá đa dạng (phần trăm, số tiền, mua 1 tặng 1, theo khung giờ).',
    [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: 'Cấp quyền truy cập chi tiết cho từng vị trí nhân sự, bảo mật dữ liệu.',
    [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: 'Chấp nhận thanh toán qua ví điện tử (Momo, ZaloPay), thẻ ngân hàng.',
    [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: 'Tự động gửi tin nhắn xác nhận đơn, chúc mừng sinh nhật, khuyến mãi.',
    [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: 'Biểu đồ phân tích doanh thu, món bán chạy, xu hướng khách hàng chuyên sâu.',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING]: 'Trợ lý ảo AI tự động trả lời khách hàng 24/7 và hỗ trợ chốt lịch đặt bàn.',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BRAND]: 'Trợ lý ảo phân tích báo cáo doanh thu và đưa ra gợi ý chiến lược kinh doanh.',
    [SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT]: 'AI phân tích dữ liệu lịch sử để đưa ra đề xuất nhập hàng chính xác nhất.',
};

// Danh sách các tính năng NÂNG CAO cho Thương hiệu (Admin có thể bật/tắt)
export const BRAND_FEATURES = [
    SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN,
    SUBSCRIPTION_FEATURES.CRM_MANAGEMENT,
    SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS,
    SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS,
    SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION,
    SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION,
    SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS,
    SUBSCRIPTION_FEATURES.AI_CHATBOT_BRAND,
    SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT,
];

// Danh sách các tính năng NÂNG CAO cho Chi nhánh (Admin có thể bật/tắt)
export const BRANCH_FEATURES = [
    SUBSCRIPTION_FEATURES.LOCAL_INVENTORY,
    SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY,
    SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING,
];
