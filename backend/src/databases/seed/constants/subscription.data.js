export const subscriptionPlansData = [
  {
    id: "60e9eb7a8d200d3b5098de40",
    name: "Gói Miễn Phí (Free)",
    description: "Trải nghiệm hệ thống miễn phí với các tính năng cơ bản.",
    price: 0,
    billingCycle: "LIFETIME",
    maxRestaurants: 1,
    features: ["Quản lý 1 nhà hàng", "Hỗ trợ cộng đồng"],
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de41",
    name: "Gói Cơ Bản (Basic)",
    description: "Phù hợp cho thương hiệu nhỏ với 1-2 nhà hàng.",
    price: 500000,
    billingCycle: "MONTHLY",
    maxRestaurants: 2,
    features: ["Quản lý nhà hàng cơ bản", "Hỗ trợ chuẩn"],
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de42",
    name: "Gói Chuyên Nghiệp (Pro)",
    description: "Phù hợp cho chuỗi nhà hàng vừa và lớn.",
    price: 1500000,
    billingCycle: "MONTHLY",
    maxRestaurants: 10,
    features: ["Tất cả tính năng cơ bản", "Phân tích nâng cao", "Hỗ trợ 24/7"],
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de43",
    name: "Gói Không Giới Hạn (Enterprise)",
    description: "Dành cho các tập đoàn lớn, không giới hạn nhà hàng.",
    price: 5000000,
    billingCycle: "YEARLY",
    maxRestaurants: -1,
    features: ["Toàn bộ tính năng hệ thống", "Tùy chỉnh linh hoạt", "Hỗ trợ chuyên biệt"],
    isActive: true
  }
];
