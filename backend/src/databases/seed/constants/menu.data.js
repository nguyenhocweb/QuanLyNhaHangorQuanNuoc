export const menusData = [

  // ===== BRAND MENU =====
  {
    brandName: "Hương Việt",
    name: "Menu Chính",
    type: "REGULAR",
    description: "Thực đơn truyền thống của Hương Việt",

    available_days: [1,2,3,4,5,6,7],
    available_from: "09:00",
    available_until: "22:00",

    sort_order: 1
  },

  {
    brandName: "Tokyo Sushi",
    name: "Menu Sushi",
    type: "REGULAR",
    description: "Menu sushi chuẩn Nhật",

    available_days: [1,2,3,4,5,6,7],
    available_from: "10:00",
    available_until: "22:00",

    sort_order: 1
  },

  // ===== RESTAURANT CUSTOM MENU =====
  {
    restaurantName: "Hương Việt Quận 1",
    parentMenuName: "Menu Chính",

    name: "Menu Chi Nhánh Q1",
    type: "REGULAR",

    description: "Menu riêng của chi nhánh Quận 1",

    available_days: [1,2,3,4,5,6,7],
    available_from: "09:00",
    available_until: "23:00",

    sort_order: 1
  }

]