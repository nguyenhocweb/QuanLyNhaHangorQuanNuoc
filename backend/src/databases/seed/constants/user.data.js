export const SystemRoleData = [
  {
    id: "65b2a1c0d4f3e2a1b0c9d8fb",
    name: "Admin",
    description: "Quản trị viên hệ thống",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8fc",
    name: "Khách hàng",
    description: "Người sử dụng dịch vụ của nhà hàng hoặc thương hiệu",
  }
];

export const WorkspaceRoleData = [
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8fd",
    name: "Quản lý thương hiệu",
    description: "Người quản lý cấp cao của thương hiệu",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8f1",
    name: "Chủ thương hiệu",
    description: "Chủ thương hiệu",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8fe",
    name: "Quản lý nhà hàng",
    description: "Người quản lý một chi nhánh nhà hàng cụ thể",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8ff",
    name: "Nhân viên",
    description: "Nhân viên các bộ phận (Bếp, phục vụ, kế toán, marketing...)",
  },
];

import { hashPass } from "../../../core/utils/bcrypt.js";
import brandData from "./brand.data.js";
import restaurantData from "./restaurant.data.js";

// Helper tạo ngày sinh
const dob = (year, month, day) => new Date(year, month - 1, day);

// TỐI ƯU HIỆU NĂNG: Chỉ hash password 1 lần duy nhất thay vì 350+ lần
let cachedHashedPassword = null;
const getHashedPassword = async () => {
    if (!cachedHashedPassword) {
        cachedHashedPassword = await hashPass("Matkhau2k3.");
    }
    return cachedHashedPassword;
};

// HELPER: Sinh ObjectID xác định thay vì hardcode
export const generateSeedId = (prefix, index) => {
    return (prefix + "00000000000000000000000").slice(0, 18) + index.toString().padStart(6, '0');
};

// =======================
// 1. ADMIN
// =======================
export const User_Admin = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d900",
    systemRoleId: "65b2a1c0d4f3e2a1b0c9d8fb", // Role: Admin
    user_name: "admin012",
    name: "Nguyễn Văn A",
    email: "admin01@example.com",
    password: await getHashedPassword(),
    is_active: "ACTIVE",
    date_of_birth: dob(1990, 1, 15)
  }
];

// =======================
// 2. KHÁCH HÀNG (100 users)
// =======================
export const User_Customer = async () => {
    const pass = await getHashedPassword();
    const customers = [];
    for (let i = 1; i <= 100; i++) {
        customers.push({
            id: generateSeedId("c0c0c0c0c0c0c0c0c0", i),
            systemRoleId: "65b2a1c0d4f3e2a1b0c9d8fc", // Khách hàng
            user_name: `customer_${i}`,
            name: `Khách hàng ${i}`,
            email: `customer${i}@example.com`,
            password: pass,
            date_of_birth: dob(2000, 1, 1),
            is_active: "ACTIVE"
        });
    }
    return customers;
};

// =======================
// 3. CHỦ THƯƠNG HIỆU (Tự động theo số lượng Brand = 30)
// =======================
export const User_Brand = async () => {
    const pass = await getHashedPassword();
    return brandData.map((brand, index) => ({
        id: generateSeedId("b0b0b0b0b0b0b0b0b0", index + 1),
        systemRoleId: "65b2a1c0d4f3e2a1b0c9d8fc", // Login ở system vẫn là khách hàng
        user_name: `owner_${index + 1}`,
        name: `Chủ thương hiệu ${index + 1}`,
        email: `owner_${index + 1}@brand.com`,
        password: pass,
        date_of_birth: dob(1985, 1, 1),
        is_active: "ACTIVE"
    }));
};

// =======================
// 4. QUẢN LÝ NHÀ HÀNG (Tự động theo số lượng Restaurant = 120)
// =======================
export const User_Restaurant = async () => {
    const pass = await getHashedPassword();
    return restaurantData.map((res, index) => ({
        id: generateSeedId("d0d0d0d0d0d0d0d0d0", index + 1),
        systemRoleId: "65b2a1c0d4f3e2a1b0c9d8fc", 
        user_name: `manager_${index + 1}`,
        name: `Quản lý nhà hàng ${index + 1}`,
        email: `manager_${index + 1}@restaurant.com`,
        password: pass,
        date_of_birth: dob(1990, 1, 1),
        is_active: "ACTIVE"
    }));
};

// =======================
// 5. NHÂN VIÊN CƠ BẢN (100 users)
// =======================
export const User_Staff = async () => {
    const pass = await getHashedPassword();
    const staffs = [];
    for (let i = 1; i <= 100; i++) {
        staffs.push({
            id: generateSeedId("a0a0a0a0a0a0a0a0a0", i),
            systemRoleId: "65b2a1c0d4f3e2a1b0c9d8fc", 
            user_name: `staff_${i}`,
            name: `Nhân viên ${i}`,
            email: `staff${i}@restaurant.com`,
            password: pass,
            date_of_birth: dob(1995, 1, 1),
            is_active: "ACTIVE"
        });
    }
    return staffs;
};
