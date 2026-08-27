export const emp_vs_per = [
  // --- BRAND USERS ---
  // Giám đốc thương hiệu (Toàn quyền Brand)
  { user_name: "brand_director", namePermission: "MENU_MANAGEMENT", type: "BRAND" },
  { user_name: "brand_director", namePermission: "CRM_MANAGEMENT", type: "BRAND" },
  { user_name: "brand_director", namePermission: "ADVANCED_PROMOTIONS", type: "BRAND" },
  { user_name: "brand_director", namePermission: "EMPLOYEE_PERMISSIONS", type: "BRAND" },
  { user_name: "brand_director", namePermission: "PAYMENT_INTEGRATION", type: "BRAND" },
  { user_name: "brand_director", namePermission: "REVENUE_ANALYTICS", type: "BRAND" },
  { user_name: "brand_director", namePermission: "CENTRAL_SUPPLY_CHAIN", type: "BRAND" },

  // Nhân viên kế toán, sản xuất
  { user_name: "brand_accountant", namePermission: "REVENUE_ANALYTICS", type: "BRAND" },
  { user_name: "brand_production", namePermission: "MENU_MANAGEMENT", type: "BRAND" },

  // --- RESTAURANT USERS ---
  // Quản lý nhà hàng (Toàn quyền Restaurant)
  { user_name: "rest_manager", namePermission: "TABLE_MANAGEMENT", type: "RESTAURANT" },
  { user_name: "rest_manager", namePermission: "ORDER_MANAGEMENT", type: "RESTAURANT" },
  { user_name: "rest_manager", namePermission: "RESERVATION_ONLINE", type: "RESTAURANT" },
  { user_name: "rest_manager", namePermission: "LOCAL_INVENTORY", type: "RESTAURANT" },
  { user_name: "rest_manager", namePermission: "KITCHEN_DISPLAY", type: "RESTAURANT" },
  
  // Nhân viên pha chế (Barista) - Chỉ xem đơn hàng và bếp
  { user_name: "rest_barista", namePermission: "ORDER_MANAGEMENT", type: "RESTAURANT" },
  { user_name: "rest_barista", namePermission: "KITCHEN_DISPLAY", type: "RESTAURANT" },
];