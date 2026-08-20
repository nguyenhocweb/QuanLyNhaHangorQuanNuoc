import { User_Admin, User_Brand, User_Customer, User_Restaurant, User_Staff } from "../constants/user.data.js";

export const users_Extension = async (prisma) => {
    console.log('creating users...');

    // 1. Admin
    const adminUser = await User_Admin();
    const result_admin = await prisma.User.createMany({
        data: adminUser
    });
    console.log(`✅ Đã tạo thành công ${result_admin.count} Admin!`);

    // 2. Customer
    const customerUser = await User_Customer();
    const result_customer = await prisma.User.createMany({
        data: customerUser
    });
    console.log(`✅ Đã tạo thành công ${result_customer.count} Khách hàng!`);

    // 3. Brand Owner
    const brandUser = await User_Brand();
    const result_brand = await prisma.User.createMany({
        data: brandUser
    });
    console.log(`✅ Đã tạo thành công ${result_brand.count} Chủ thương hiệu!`);

    // 4. Restaurant Manager
    const restaurantUser = await User_Restaurant();
    const result_restaurant = await prisma.User.createMany({
        data: restaurantUser
    });
    console.log(`✅ Đã tạo thành công ${result_restaurant.count} Quản lý nhà hàng!`);

    // 5. Staff
    const staffUser = await User_Staff();
    const result_staff = await prisma.User.createMany({
        data: staffUser
    });
    console.log(`✅ Đã tạo thành công ${result_staff.count} Nhân viên!`);
};
