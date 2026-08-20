export const SUBSCRIPTION_FEATURES = {
    MENU_MANAGEMENT: 'MENU_MANAGEMENT',
    TABLE_MANAGEMENT: 'TABLE_MANAGEMENT',
    ORDER_MANAGEMENT: 'ORDER_MANAGEMENT',
    RESERVATION_ONLINE: 'RESERVATION_ONLINE',
    CUSTOMER_REVIEWS: 'CUSTOMER_REVIEWS',
    ADVANCED_PROMOTIONS: 'ADVANCED_PROMOTIONS',
    EMPLOYEE_PERMISSIONS: 'EMPLOYEE_PERMISSIONS',
    PAYMENT_INTEGRATION: 'PAYMENT_INTEGRATION',
    ZALO_SMS_NOTIFICATION: 'ZALO_SMS_NOTIFICATION',
    REVENUE_ANALYTICS: 'REVENUE_ANALYTICS',
    CENTRAL_SUPPLY_CHAIN: 'CENTRAL_SUPPLY_CHAIN',
    LOCAL_INVENTORY: 'LOCAL_INVENTORY',
    KITCHEN_DISPLAY: 'KITCHEN_DISPLAY',
    AI_CHATBOT_BOOKING: 'AI_CHATBOT_BOOKING',
    AI_INVENTORY_PREDICT: 'AI_INVENTORY_PREDICT',
};

export const FEATURE_NAMES: Record<string, string> = {
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
    [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: 'Chuỗi cung ứng toàn hệ thống',
    [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: 'Quản lý kho & Định lượng (Recipe)',
    [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: 'Hệ thống hiển thị Bếp (KDS)',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING]: 'Chatbot AI Đặt bàn & Tư vấn khách',
    [SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT]: 'AI Dự báo Tồn kho thông minh',
};

export const FEATURE_DESCRIPTIONS: Record<string, string> = {
    [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: 'Tạo và quản lý danh sách món ăn, danh mục, giá bán dễ dàng.',
    [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: 'Thiết lập sơ đồ bàn trực quan, quản lý trạng thái bàn theo thời gian thực.',
    [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: 'Hệ thống gọi món tại bàn cho nhân viên phục vụ, theo dõi tiến độ bếp.',
    [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: 'Tích hợp form đặt bàn lên website/fanpage, tự động xếp bàn.',
    [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: 'Gửi yêu cầu đánh giá tự động, phân tích phản hồi để cải thiện dịch vụ.',
    [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: 'Tạo mã giảm giá đa dạng (phần trăm, số tiền, mua 1 tặng 1, theo khung giờ).',
    [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: 'Cấp quyền truy cập chi tiết cho từng vị trí nhân sự, bảo mật dữ liệu.',
    [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: 'Chấp nhận thanh toán qua ví điện tử (Momo, ZaloPay), thẻ ngân hàng.',
    [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: 'Tự động gửi tin nhắn xác nhận đơn, chúc mừng sinh nhật, khuyến mãi.',
    [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: 'Biểu đồ phân tích doanh thu, món bán chạy, xu hướng khách hàng chuyên sâu.',
    [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: 'Quản lý điều phối nguyên vật liệu từ kho tổng đến các chi nhánh.',
    [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: 'Theo dõi tồn kho chi nhánh, tự động trừ kho theo định lượng món (Recipe).',
    [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: 'Màn hình KDS tại bếp/bar giúp tối ưu tốc độ chuẩn bị món, tránh sai sót.',
    [SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING]: 'Trợ lý ảo AI tự động trả lời khách hàng 24/7 và hỗ trợ chốt lịch đặt bàn.',
    [SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT]: 'AI phân tích dữ liệu lịch sử để đưa ra đề xuất nhập hàng chính xác nhất.',
};

export const BASIC_OPERATIONAL_FEATURES = [
    SUBSCRIPTION_FEATURES.MENU_MANAGEMENT,
    SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT,
    SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT,
];
