import { generateSeedId } from "./user.data.js";

// Helper tạo ngày (để dữ liệu rải rác các tháng cho biểu đồ đẹp hơn)
const pastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// =======================
// Upgrade_Request
// =======================
export const Upgrade_Request = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d91e",
    userId: generateSeedId("b0b0b0b0b0b0b0b0b0", 1), // Khớp với: Chủ thương hiệu 1
    brandName: "Golden Gate Group",
    tax_code: "0101234567",
    businessLicense: "https://res.cloudinary.com/demo/image/upload/license_golden_gate.jpg",
    status: "APPROVED",
    createdAt: pastDate(45), // Nộp từ tháng trước rưỡi
    updatedAt: pastDate(40), // Đã duyệt
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d91f",
    userId: generateSeedId("c0c0c0c0c0c0c0c0c0", 1), // Khớp với: Khách hàng 1
    brandName: "Phở Lý Quốc Sư",
    tax_code: "0107654321",
    businessLicense: "https://res.cloudinary.com/demo/image/upload/license_pho_ly.jpg",
    status: "PENDING",
    createdAt: pastDate(2), // Vừa nộp 2 ngày trước
    updatedAt: pastDate(2),
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d920",
    userId: generateSeedId("c0c0c0c0c0c0c0c0c0", 2), // Khớp với: Khách hàng 2
    brandName: "Cà phê Vợt 1990",
    tax_code: null,
    businessLicense: "https://res.cloudinary.com/demo/image/upload/license_cafe_vot.jpg",
    status: "PENDING",
    createdAt: pastDate(5), // Vừa nộp 5 ngày trước
    updatedAt: pastDate(5),
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d921",
    userId: generateSeedId("c0c0c0c0c0c0c0c0c0", 3), // Khớp với: Khách hàng 3
    brandName: "Bún Đậu Mắm Tôm Cô Ba",
    tax_code: "0109988776",
    businessLicense: "https://res.cloudinary.com/demo/image/upload/license_bun_dau.jpg",
    status: "REJECTED",
    createdAt: pastDate(15), 
    updatedAt: pastDate(14), // Bị từ chối vào ngày hôm sau
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d922",
    userId: generateSeedId("c0c0c0c0c0c0c0c0c0", 4), // Khớp với: Khách hàng 4
    brandName: "Nhà Hàng Chay Sen Trắng",
    tax_code: "0105556667",
    businessLicense: "https://res.cloudinary.com/demo/image/upload/license_chay.jpg",
    status: "PENDING",
    createdAt: new Date(), // Nộp đúng hôm nay
    updatedAt: new Date(),
  }
];