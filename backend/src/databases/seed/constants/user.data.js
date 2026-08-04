export default [
  {
    id: "65b2a1c0d4f3e2a1b0c9d8fb",
    name: "Admin",
    description: "Quản trị viên hệ thống",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8fc",
    name: "Khách hàng",
    description: "Người sử dụng dịch vụ của nhà hàng hoặc thương hiệu",
  },
  {    
    id: "65b2a1c0d4f3e2a1b0c9d8fd",
    name: "Quản lý thương hiệu",
    description: "Người quản lý cấp cao của thương hiệu",
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

// Helper tạo ngày sinh (Senior way)
const dob = (year, month, day) => new Date(year, month - 1, day);

const hashedPassword = async () => await hashPass("Matkhau2k3.");

// =======================
// User_Admin
// =======================
export const User_Admin = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d900",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fb", // Role: Admin
    user_name: "admin012",
    name: "Nguyễn Văn A",
    email: "admin01@example.com",
    password: await hashedPassword(),
    is_active: "ACTIVE",
    date_of_birth: dob(1990, 1, 15)
  }
];

// =======================
// User_Brand
// =======================
export const User_Brand = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d901",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Quản lý thương hiệu
    user_name: "brand_director",
    name: "Trần Thị B",
    email: "director@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1988, 5, 20),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d902",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_accountant",
    name: "Lê Văn C",
    email: "accountant@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1992, 3, 12),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d903",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_marketing",
    name: "Phạm Thị D",
    email: "marketing@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1995, 7, 8),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d904",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_sales",
    name: "Nguyễn Văn E",
    email: "sales@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1994, 10, 5),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d905",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_support",
    name: "Trần Văn F",
    email: "support@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1996, 12, 18),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d906",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_warehouse",
    name: "Lê Thị G",
    email: "warehouse@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1993, 9, 22),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d907",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_production",
    name: "Phạm Văn H",
    email: "production@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1991, 6, 14),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d908",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_it",
    name: "Nguyễn Thị I",
    email: "it@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1997, 4, 3),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d909",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_tech",
    name: "Trần Văn J",
    email: "tech@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1990, 8, 27),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d90a",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fd", // Role: Nhân viên
    user_name: "brand_extra",
    name: "Lê Văn K",
    email: "extra@brand.com",
    password: await hashedPassword(),
    date_of_birth: dob(1998, 2, 9),
    is_active: "ACTIVE"
  }
];

// =======================
// User_Restaurant
// =======================
export const User_Restaurant = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d90b",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Quản lý nhà hàng
    user_name: "rest_manager",
    name: "Nguyễn Văn L",
    email: "manager@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1987, 9, 30),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d90c",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_cashier",
    name: "Trần Thị M",
    email: "cashier@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1998, 11, 2),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d90d",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_waiter1",
    name: "Lê Văn N",
    email: "waiter1@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(2000, 1, 19),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d90e",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_chef",
    name: "Phạm Thị O",
    email: "chef@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1989, 6, 25),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d90f",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_barista",
    name: "Nguyễn Văn P",
    email: "barista@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1997, 3, 11),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d910",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_cleaning",
    name: "Trần Văn Q",
    email: "cleaning@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1995, 7, 6),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d911",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_maintenance",
    name: "Lê Thị R",
    email: "maintenance@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1992, 12, 1),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d912",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_stock",
    name: "Phạm Văn S",
    email: "stock@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1994, 4, 17),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d913",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_supervisor",
    name: "Nguyễn Thị T",
    email: "supervisor@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1991, 10, 29),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d914",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fe", // Role: Nhân viên
    user_name: "rest_support",
    name: "Trần Văn U",
    email: "support@restaurant.com",
    password: await hashedPassword(),
    date_of_birth: dob(1999, 5, 8),
    is_active: "ACTIVE"
  }
];

// =======================
// User_Customer
// =======================
export const User_Customer = async () => [
  {
    id: "65b2a1c0d4f3e2a1b0c9d915",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc", // Role: Khách hàng
    user_name: "customer1",
    name: "Khách hàng 1",
    email: "customer1@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2000, 6, 1),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d916",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer2",
    name: "Khách hàng 2",
    email: "customer2@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2001, 8, 14),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d917",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer3",
    name: "Khách hàng 3",
    email: "customer3@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(1999, 12, 20),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d918",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer4",
    name: "Khách hàng 4",
    email: "customer4@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2002, 2, 5),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d919",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer5",
    name: "Khách hàng 5",
    email: "customer5@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2000, 9, 9),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d91a",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer6",
    name: "Khách hàng 6",
    email: "customer6@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(1998, 11, 30),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d91b",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer7",
    name: "Khách hàng 7",
    email: "customer7@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2001, 1, 17),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d91c",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer8",
    name: "Khách hàng 8",
    email: "customer8@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(1997, 7, 23),
    is_active: "ACTIVE"
  },
  {
    id: "65b2a1c0d4f3e2a1b0c9d91d",
    roleId: "65b2a1c0d4f3e2a1b0c9d8fc",
    user_name: "customer9",
    name: "Khách hàng 9",
    email: "customer9@example.com",
    password: await hashedPassword(),
    date_of_birth: dob(2003, 4, 2),
    is_active: "ACTIVE"
  }
];