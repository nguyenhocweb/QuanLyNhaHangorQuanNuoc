export const SYSTEM_ROLES = [
  { name: "Admin", description: "Quản trị viên hệ thống (Super Admin)" },
  { name: "Khách hàng", description: "Người dùng sử dụng dịch vụ (End-user)" }
];

export const WORKSPACE_ROLES = [
  { name: "Quản lý thương hiệu", description: "Chủ sở hữu thương hiệu" },
  { name: "Quản lý nhà hàng", description: "Quản lý chi nhánh nhà hàng" },
  { name: "Nhân viên", description: "Nhân viên vận hành" }
];

export const PERMISSIONS = [
  // Brand Level
  { name: "MENU_MANAGEMENT", description: "Quản lý thực đơn", type: "BRAND" },
  { name: "CRM_MANAGEMENT", description: "Quản lý Khách hàng & CRM", type: "BRAND" },
  { name: "ADVANCED_PROMOTIONS", description: "Quản lý khuyến mãi nâng cao", type: "BRAND" },
  { name: "EMPLOYEE_PERMISSIONS", description: "Phân quyền nhân viên chi tiết", type: "BRAND" },
  { name: "PAYMENT_INTEGRATION", description: "Tích hợp thanh toán trực tuyến", type: "BRAND" },
  { name: "REVENUE_ANALYTICS", description: "Báo cáo doanh thu nâng cao", type: "BRAND" },
  { name: "CENTRAL_SUPPLY_CHAIN", description: "Chuỗi cung ứng toàn hệ thống", type: "BRAND" },
  // Restaurant Level
  { name: "TABLE_MANAGEMENT", description: "Quản lý sơ đồ bàn", type: "RESTAURANT" },
  { name: "ORDER_MANAGEMENT", description: "Hệ thống gọi món", type: "RESTAURANT" },
  { name: "RESERVATION_ONLINE", description: "Tính năng đặt bàn online", type: "RESTAURANT" },
  { name: "LOCAL_INVENTORY", description: "Quản lý kho & Định lượng", type: "RESTAURANT" },
  { name: "KITCHEN_DISPLAY", description: "Hệ thống hiển thị Bếp (KDS)", type: "RESTAURANT" },
];

export const SUBSCRIPTION_PLANS = [
  {
    name: "Miễn phí",
    description: "Gói dành cho nhà hàng nhỏ mới bắt đầu",
    price: 0,
    billingCycle: "MONTHLY",
    maxRestaurants: 1,
    featuresData: {
      features: [
        "MENU_MANAGEMENT",
        "TABLE_MANAGEMENT",
        "ORDER_MANAGEMENT"
      ]
    },
    isPublic: true,
    isActive: true
  },
  {
    name: "Cơ bản",
    description: "Gói tiêu chuẩn cho nhà hàng đang phát triển",
    price: 499000,
    billingCycle: "MONTHLY",
    maxRestaurants: 3,
    featuresData: {
      features: [
        "MENU_MANAGEMENT",
        "TABLE_MANAGEMENT",
        "ORDER_MANAGEMENT",
        "RESERVATION_ONLINE",
        "CUSTOMER_REVIEWS",
        "LOCAL_INVENTORY"
      ]
    },
    isPublic: true,
    isActive: true
  },
  {
    name: "Chuyên nghiệp",
    description: "Gói cao cấp không giới hạn tính năng và chi nhánh",
    price: 1499000,
    billingCycle: "MONTHLY",
    maxRestaurants: -1,
    featuresData: {
      features: [
        "MENU_MANAGEMENT",
        "TABLE_MANAGEMENT",
        "ORDER_MANAGEMENT",
        "RESERVATION_ONLINE",
        "CUSTOMER_REVIEWS",
        "ADVANCED_PROMOTIONS",
        "EMPLOYEE_PERMISSIONS",
        "CRM_MANAGEMENT",
        "PAYMENT_INTEGRATION",
        "ZALO_SMS_NOTIFICATION",
        "REVENUE_ANALYTICS",
        "CENTRAL_SUPPLY_CHAIN",
        "LOCAL_INVENTORY",
        "KITCHEN_DISPLAY",
        "AI_CHATBOT_BOOKING",
        "AI_CHATBOT_BRAND",
        "AI_INVENTORY_PREDICT"
      ]
    },
    isPublic: true,
    isActive: true
  }
];

export const CATEGORIES = [
  { name: "Nhà hàng", bgColor: "#EEF2FF", textColor: "#4F46E5" },
  { name: "Quán Cafe", bgColor: "#FFFBEB", textColor: "#D97706" },
  { name: "Lẩu & Nướng", bgColor: "#FEF2F2", textColor: "#DC2626" },
  { name: "Quán Chay", bgColor: "#F0FDF4", textColor: "#16A34A" },
  { name: "Hải sản", bgColor: "#F0F9FF", textColor: "#0284C7" },
  { name: "Trà sữa", bgColor: "#FDF4FF", textColor: "#C026D3" }
];

export const TAGS = [
  { name: "Sang trọng", slug: "sang-trong" },
  { name: "Bình dân", slug: "binh-dan" },
  { name: "Gia đình", slug: "gia-dinh" },
  { name: "Hẹn hò", slug: "hen-ho" },
  { name: "Trẻ trung", slug: "tre-trung" },
  { name: "View đẹp", slug: "view-dep" }
];

export const AMENITIES = [
  { name: "Wifi miễn phí", icon: "FaWifi" },
  { name: "Bãi đậu ô tô", icon: "FaCar" },
  { name: "Thanh toán thẻ", icon: "FaCreditCard" },
  { name: "Máy lạnh", icon: "FaSnowflake" },
  { name: "Phòng VIP", icon: "FaCrown" },
  { name: "Khu vui chơi trẻ em", icon: "FaChild" }
];

export const BRAND_TEMPLATES = [
  { code: "premium3d", name: "Cao cấp 3D" },
  { code: "standard", name: "Tiêu chuẩn" },
  { code: "luxury", name: "Sang trọng" },
  { code: "vibrant", name: "Sôi động" },
  { code: "zen", name: "Thiền / Chay (Zen)" }
];

export const RESTAURANT_TEMPLATES = [
  { code: "REST_DEFAULT", name: "Tiêu chuẩn (Mặc định)" },
  { code: "REST_LUXURY", name: "Sang trọng" },
  { code: "REST_IMMERSIVE", name: "Không gian chiều sâu (3D/2D)" },
  { code: "REST_ZEN", name: "Thiền / Chay (Zen)" },
  { code: "REST_CAFE", name: "Quán Cafe" },
  { code: "REST_ICECREAM", name: "Cửa hàng kem" },
  { code: "REST_HOTPOT", name: "Lẩu & Nướng" },
  { code: "REST_SUSHI", name: "Nhà hàng Sushi (Premium)" }
];
