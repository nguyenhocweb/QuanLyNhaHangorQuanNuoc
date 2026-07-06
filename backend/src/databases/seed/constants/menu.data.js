export const menusData = [
  // ==========================================
  // I. MENU CẤP THƯƠNG HIỆU (BRAND MENUS) 
  // (Áp dụng cho toàn bộ chi nhánh trừ khi có menu riêng đè lên)
  // ==========================================

  // 1. Hương Việt (brandId: 65b2a1c0d4f3e2a1b0c9d8e7)
  {
    id: "65b2a1c0d4f3e2a1b0c9e801",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e7",
    restaurantId: null,
    name: "Thực Đơn Chính",
    description: "Thực đơn các món ăn truyền thống 3 miền của Hương Việt",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e802",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e7",
    restaurantId: null,
    name: "Cơm Trưa Văn Phòng",
    description: "Combo cơm trưa nhanh, tiện lợi và đầy đủ dinh dưỡng",

    is_active: true,
    sort_order: 2
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e803",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e7",
    restaurantId: null,
    name: "Menu Mâm Cỗ Ngày Tết",
    description: "Các món ăn truyền thống dịp Tết Nguyên Đán",

    is_active: true,
    sort_order: 3
  },

  // 2. Tokyo Sushi Chain (brandId: 65b2a1c0d4f3e2a1b0c9d8e8)
  {
    id: "65b2a1c0d4f3e2a1b0c9e804",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e8",
    restaurantId: null,
    name: "Grand Sushi Menu",
    description: "Menu sashimi và sushi tổng hợp chuẩn vị Nhật",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e805",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e8",
    restaurantId: null,
    name: "Omakase Experience",
    description: "Trải nghiệm ẩm thực do đầu bếp quyết định (chỉ buổi tối)",
    is_active: true,
    sort_order: 2
  },

  // 7. Pizza Roma (brandId: 65b2a1c0d4f3e2a1b0c9d8ee)
  {
    id: "65b2a1c0d4f3e2a1b0c9e813",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ee",
    restaurantId: null,
    name: "Kids Menu (Thực Đơn Bé Yêu)",
    description: "Phần ăn nhỏ gọn, ít gia vị cay nóng, tặng kèm đồ chơi cho bé",

    is_active: true,
    sort_order: 2
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e814",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ee",
    restaurantId: null,
    name: "Delivery & Takeaway Menu",
    description: "Thực đơn đóng gói mang về (lược bỏ các món dễ hỏng khi vận chuyển)",

    is_active: true,
    sort_order: 3
  },

  // 8. Bún Bò Huế 1986 (brandId: 65b2a1c0d4f3e2a1b0c9d8f0)
  {
    id: "65b2a1c0d4f3e2a1b0c9e815",
    brandId: "65b2a1c0d4f3e2a1b0c9d8f0",
    restaurantId: null,
    name: "Menu Điểm Tâm Sáng",

    description: "Bún bò tô tiêu chuẩn phục vụ nhanh buổi sáng",

    is_active: true,
    sort_order: 1
  },

  // 9. Da Nang Sea Breeze (brandId: 65b2a1c0d4f3e2a1b0c9d8f8)
  {
    id: "65b2a1c0d4f3e2a1b0c9e816",
    brandId: "65b2a1c0d4f3e2a1b0c9d8f8",
    restaurantId: null,
    name: "Hải Sản Tươi Sống (Market Price)",
    description: "Hải sản bắt tại hồ, giá thay đổi theo thời giá mỗi ngày",

    is_active: true,
    sort_order: 2
  },

  // 10. Hanoi Phở Quán (brandId: 65b2a1c0d4f3e2a1b0c9d8f7)
  {
    id: "65b2a1c0d4f3e2a1b0c9e817",
    brandId: "65b2a1c0d4f3e2a1b0c9d8f7",
    restaurantId: null,
    name: "Phở Gánh Truyền Thống",
    description: "Menu các món phở nước và phở xào đậm chất Hà Nội",

    is_active: true,
    sort_order: 1
  },

  // 3. BBQ Master Vietnam (brandId: 65b2a1c0d4f3e2a1b0c9d8e9)
  {
    id: "65b2a1c0d4f3e2a1b0c9e806",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e9",
    restaurantId: null,
    name: "Buffet Nướng Tiêu Chuẩn",
    description: "Vé buffet bao gồm bò, heo, hải sản và quầy line",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e807",
    brandId: "65b2a1c0d4f3e2a1b0c9d8e9",
    restaurantId: null,
    name: "A La Carte (Gọi Món)",
    description: "Thực đơn gọi món cho khách không ăn buffet",

    is_active: true,
    sort_order: 2
  },

  // 4. Coffee & Chill (brandId: 65b2a1c0d4f3e2a1b0c9d8ea)
  {
    id: "65b2a1c0d4f3e2a1b0c9e808",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ea",
    restaurantId: null,
    name: "Menu Đồ Uống Cà Phê",
    description: "Cà phê pha máy, pha phin và các loại trà",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e809",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ea",
    restaurantId: null,
    name: "Menu Bánh Ngọt (Pastry)",
    description: "Các loại bánh kem, croissant ăn kèm",

    is_active: true,
    sort_order: 2
  },

  // 5. Fine Dine Elite (brandId: 65b2a1c0d4f3e2a1b0c9d8f6)
  {
    id: "65b2a1c0d4f3e2a1b0c9e80a",
    brandId: "65b2a1c0d4f3e2a1b0c9d8f6",
    restaurantId: null,
    name: "Signature Tasting Menu (7 Courses)",
    description: "Hành trình ẩm thực 7 món do bếp trưởng thiết kế",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e80b",
    brandId: "65b2a1c0d4f3e2a1b0c9d8f6",
    restaurantId: null,
    name: "Premium Wine List",
    description: "Bộ sưu tập rượu vang nhập khẩu cao cấp",

    is_active: true,
    sort_order: 2
  },

  // 6. Saigon Vegan Kitchen (brandId: 65b2a1c0d4f3e2a1b0c9d8ed)
  {
    id: "65b2a1c0d4f3e2a1b0c9e80c",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ed",
    restaurantId: null,
    name: "Thực Đơn Chay Bốn Mùa",
    description: "Menu thuần chay tốt cho sức khỏe",

    is_active: true,
    sort_order: 1
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e80d",
    brandId: "65b2a1c0d4f3e2a1b0c9d8ed",
    restaurantId: null,
    name: "Special Full Moon Buffet",
    description: "Buffet chay đặc biệt mùng 1 và Rằm (âm lịch)",

    is_active: true,
    sort_order: 2
  },

  // ==========================================
  // II. MENU CẤP CHI NHÁNH NHÀ HÀNG (RESTAURANT MENUS)
  // (Menu thiết kế riêng chỉ có tại 1 chi nhánh cụ thể)
  // ==========================================

  // 1. Hương Việt Quận 1 (restaurantId: 65b2a1c0d4f3e2a1b0c9d999)
  {
    id: "65b2a1c0d4f3e2a1b0c9e80e",
    brandId: null, // Thuộc về cấp Restaurant
    restaurantId: "65b2a1c0d4f3e2a1b0c9d999",
    name: "VIP Lounge Menu Quận 1",
    description: "Menu đặc biệt bằng nguyên liệu cao cấp, chỉ phục vụ tại CN Quận 1",

    is_active: true,
    sort_order: 1
  },

  // 2. Tokyo Sushi Lê Lợi (restaurantId: 65b2a1c0d4f3e2a1b0c9d99c)
  {
    id: "65b2a1c0d4f3e2a1b0c9e80f",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d99c",
    name: "Lê Lợi Chef's Choice",
    description: "Menu sáng tạo độc quyền của bếp trưởng chi nhánh Lê Lợi",
    is_active: true,
    sort_order: 1
  },

  // 3. Coffee & Chill Quận 5 (restaurantId: 65b2a1c0d4f3e2a1b0c9d9a2)
  {
    id: "65b2a1c0d4f3e2a1b0c9e810",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9a2",
    name: "Student Combo Q5",
    description: "Combo nước và bánh giá tiết kiệm cho sinh viên các trường Quận 5",
    is_active: true,
    sort_order: 1
  },

  // 4. BBQ Master Phạm Văn Đồng (restaurantId: 65b2a1c0d4f3e2a1b0c9d99f)
  {
    id: "65b2a1c0d4f3e2a1b0c9e811",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d99f",
    name: "Menu Nhậu Đêm (Late Night BBQ)",
    description: "Thực đơn nướng và bia vỉa hè dành riêng cho khách nhậu đêm",

    is_active: true,
    sort_order: 1
  },

  // 5. Fine Dine Elite Đồng Khởi (restaurantId: 65b2a1c0d4f3e2a1b0c9d9ab)
  {
    id: "65b2a1c0d4f3e2a1b0c9e812",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9ab",
    name: "Spring Collection Menu",
    description: "Bộ sưu tập món ăn theo chủ đề mùa Xuân 2026",

    is_active: true,
    sort_order: 3
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9e818",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9a0",
    name: "Weekend Brunch Thảo Điền",
    description: "Menu Brunch phong cách Âu (Steak & Eggs, Mimosa) chỉ dành cho cuối tuần",


    is_active: true,
    sort_order: 2
  },

  // 6. Tokyo Sushi Landmark 81 (restaurantId: 65b2a1c0d4f3e2a1b0c9d99d)
  {
    id: "65b2a1c0d4f3e2a1b0c9e819",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d99d",
    name: "Business Lunch Set",
    description: "Set cơm trưa Bento cao cấp tiếp khách dành cho giới văn phòng tòa nhà",


    is_active: true,
    sort_order: 3
  },

  // 7. Coffee & Chill Quận 5 (restaurantId: 65b2a1c0d4f3e2a1b0c9d9a2)
  {
    id: "65b2a1c0d4f3e2a1b0c9e81a",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9a2",
    name: "Night Owl Cravings (Menu Cú Đêm)",
    description: "Đồ uống nhẹ và mì gói, snack phục vụ các bạn sinh viên chạy deadline xuyên đêm",


    is_active: true,
    sort_order: 3
  },

  // 8. Dalat Pine Roasters (restaurantId: 65b2a1c0d4f3e2a1b0c9d9ac)
  {
    id: "65b2a1c0d4f3e2a1b0c9e81b",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9ac",
    name: "Winter Warmers (Thức Uống Mùa Đông)",
    description: "Cacao nóng, trà quế mật ong và các thức uống giữ ấm",


    is_active: true,
    sort_order: 2
  },

  // 9. Saigon Vegan Kitchen Nguyễn Trãi (restaurantId: 65b2a1c0d4f3e2a1b0c9d9a3)
  {
    id: "65b2a1c0d4f3e2a1b0c9e81c",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d9a3",
    name: "Thực Đơn Mùa Vu Lan Báo Hiếu",
    description: "Set mâm cúng chay và các món đặc biệt dành cho tháng 7 âm lịch",

    is_active: true,
    sort_order: 3
  },

  // 10. BBQ Master Gò Vấp (restaurantId: 65b2a1c0d4f3e2a1b0c9d99e)
  {
    id: "65b2a1c0d4f3e2a1b0c9e81d",
    brandId: null,
    restaurantId: "65b2a1c0d4f3e2a1b0c9d99e",
    name: "Happy Hour Drinks (Giờ Vàng Bia Cuộn)",
    description: "Khuyến mãi mua 1 tặng 1 cho các loại bia tháp và cocktail",

    is_active: true, // Nếu hết chạy chương trình có thể chuyển thành false
    sort_order: 4
  }
];