export const emp_vs_per = [
  // --- BRAND USERS ---
  {
    user_name: "brand_director",
    namePermission: "VIEW_REPORT",
    type: "BRAND"
  },
  {
    user_name: "brand_director",
    namePermission: "MANAGE_RESTAURANT",
    type: "BRAND"
  },
  {
    user_name: "brand_director",
    namePermission: "MANAGE_EMPLOYEE",
    type: "BRAND"
  },
  {
    user_name: "brand_accountant",
    namePermission: "VIEW_REPORT",
    type: "BRAND"
  },
  {
    user_name: "brand_production",
    namePermission: "MANAGE_RESTAURANT",
    type: "BRAND"
  },
  {
    user_name: "brand_production",
    namePermission: "MANAGE_EMPLOYEE",
    type: "BRAND"
  },

  // --- RESTAURANT USERS (Đã sửa lại user_name) ---
  {
    user_name: "rest_manager", // Khớp với User_Restaurant
    namePermission: "CANCEL_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_manager",
    namePermission: "UPDATE_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_manager",
    namePermission: "CREATE_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_manager",
    namePermission: "VIEW_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_manager",
    namePermission: "MANAGE_MENU",
    type: "RESTAURANT"
  },
  
  {
    user_name: "rest_barista", // Khớp với User_Restaurant (Thay cho restaurant_bartender)
    namePermission: "CANCEL_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_barista",
    namePermission: "UPDATE_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_barista",
    namePermission: "CREATE_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_barista",
    namePermission: "VIEW_ORDER",
    type: "RESTAURANT"
  },
  {
    user_name: "rest_barista",
    namePermission: "MANAGE_MENU",
    type: "RESTAURANT"
  },
];