import { hashPass } from "../../../core/utils/bcrypt.js";

// Helper tạo ngày sinh (Senior way)
const dob = (year, month, day) => new Date(year, month - 1, day);


  const hashedPassword = async()=>await hashPass("Matkhau2k3.");


    // =======================
    // User_Admin
    // =======================
  export const User_Admin =async()=>[
      {
        user_name: "admin01",
        name: "Nguyễn Văn A",
        email: "admin01@example.com",
        password:await hashedPassword(),
        is_active:"ACTIVE",
        date_of_birth: dob(1990, 1, 15)
      }
    ]
  

    // =======================
    // User_Brand
    // =======================
  export const User_Brand =async()=> [
      {
        user_name: "brand_director",
        name: "Trần Thị B",
        email: "director@brand.com",
        //role_name: "Giám đốc thương hiệu",
        password: await hashedPassword(),
        date_of_birth: dob(1988, 5, 20),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_accountant",
        name: "Lê Văn C",
        email: "accountant@brand.com",
        //role_name: "Nhân viên kế toán",
        password: await hashedPassword(),
        date_of_birth: dob(1992, 3, 12),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_marketing",
        name: "Phạm Thị D",
        email: "marketing@brand.com",
        //role_name: "Nhân viên marketing",
        password: await hashedPassword(),
        date_of_birth: dob(1995, 7, 8),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_sales",
        name: "Nguyễn Văn E",
        email: "sales@brand.com",
        //role_name: "Nhân viên bán hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1994, 10, 5),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_support",
        name: "Trần Văn F",
        email: "support@brand.com",
        //role_name: "Nhân viên chăm sóc khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1996, 12, 18),
        is_active:"ACTIVE" 
      },
      {
        user_name: "brand_warehouse",
        name: "Lê Thị G",
        email: "warehouse@brand.com",
        //role_name: "Nhân viên kho",
       password: await hashedPassword(),
        date_of_birth: dob(1993, 9, 22),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_production",
        name: "Phạm Văn H",
        email: "production@brand.com",
        //role_name: "Nhân viên sản xuất",
       password: await hashedPassword(),
        date_of_birth: dob(1991, 6, 14),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_it",
        name: "Nguyễn Thị I",
        email: "it@brand.com",
        //role_name: "Nhân viên IT",
      password: await hashedPassword(),
        date_of_birth: dob(1997, 4, 3),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_tech",
        name: "Trần Văn J",
        email: "tech@brand.com",
        //role_name: "Nhân viên kỹ thuật",
        password: await hashedPassword(),
        date_of_birth: dob(1990, 8, 27),
        is_active:"ACTIVE"
      },
      {
        user_name: "brand_extra",
        name: "Lê Văn K",
        email: "extra@brand.com",
        //role_name: "Nhân viên chăm sóc khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1998, 2, 9),
        is_active:"ACTIVE"
      }
    ]

    // =======================
    // User_Restaurant
    // =======================
  export const User_Restaurant =async()=> [
      {
        user_name: "rest_manager",
        name: "Nguyễn Văn L",
        email: "manager@restaurant.com",
        //role_name: "Quản lý nhà hàng",
       password: await hashedPassword(),
        date_of_birth: dob(1987, 9, 30),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_cashier",
        name: "Trần Thị M",
        email: "cashier@restaurant.com",
        //role_name: "Thu ngân",
        password: await hashedPassword(),
        date_of_birth: dob(1998, 11, 2),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_waiter1",
        name: "Lê Văn N",
        email: "waiter1@restaurant.com",
        //role_name: "Nhân viên phục vụ",
        password: await hashedPassword(),
        date_of_birth: dob(2000, 1, 19),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_chef",
        name: "Phạm Thị O",
        email: "chef@restaurant.com",
        //role_name: "Đầu bếp",
       password: await hashedPassword(),
        date_of_birth: dob(1989, 6, 25),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_barista",
        name: "Nguyễn Văn P",
        email: "barista@restaurant.com",
        //role_name: "Nhân viên pha chế",
        password: await hashedPassword(),
        date_of_birth: dob(1997, 3, 11),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_cleaning",
        name: "Trần Văn Q",
        email: "cleaning@restaurant.com",
        // role_name: "Nhân viên dọn dẹp",
        password: await hashedPassword(),
        date_of_birth: dob(1995, 7, 6),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_maintenance",
        name: "Lê Thị R",
        email: "maintenance@restaurant.com",
        //role_name: "Nhân viên bảo trì",
       password: await hashedPassword(),
        date_of_birth: dob(1992, 12, 1),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_stock",
        name: "Phạm Văn S",
        email: "stock@restaurant.com",
        //role_name: "Nhân viên quản lý kho",
    password: await hashedPassword(),
        date_of_birth: dob(1994, 4, 17),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_supervisor",
        name: "Nguyễn Thị T",
        email: "supervisor@restaurant.com",
        //role_name: "Nhân viên giám sát",
password: await hashedPassword(),
        date_of_birth: dob(1991, 10, 29),
        is_active:"ACTIVE"
      },
      {
        user_name: "rest_support",
        name: "Trần Văn U",
        email: "support@restaurant.com",
        //role_name: "Nhân viên chăm sóc khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1999, 5, 8),
        is_active:"ACTIVE"
      }
    ]

    // =======================
    // User_Customer
    // =======================
  export const User_Customer =async()=> [
      {
        user_name: "customer1",
        name: "Khách hàng 1",
        email: "customer1@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2000, 6, 1),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer2",
        name: "Khách hàng 2",
        email: "customer2@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2001, 8, 14),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer3",
        name: "Khách hàng 3",
        email: "customer3@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1999, 12, 20),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer4",
        name: "Khách hàng 4",
        email: "customer4@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2002, 2, 5),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer5",
        name: "Khách hàng 5",
        email: "customer5@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2000, 9, 9),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer6",
        name: "Khách hàng 6",
        email: "customer6@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1998, 11, 30),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer7",
        name: "Khách hàng 7",
        email: "customer7@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2001, 1, 17),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer8",
        name: "Khách hàng 8",
        email: "customer8@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(1997, 7, 23),
        is_active:"ACTIVE"
      },
      {
        user_name: "customer9",
        name: "Khách hàng 9",
        email: "customer9@example.com",
        //role_name: "Khách hàng",
        password: await hashedPassword(),
        date_of_birth: dob(2003, 4, 2),
        is_active:"ACTIVE"
      }
    ]


