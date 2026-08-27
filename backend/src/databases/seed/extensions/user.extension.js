import { User_Brand, User_Customer, User_Restaurant } from "../constants/user.data.js";

// Lấy id systemRole để gán cho khách hàng (Admin đã được tạo ở seed production)
const getSystemRoles = async (prisma) => {
    return await prisma.SystemRole.findMany({
        select: { id: true, name: true }
    });
};

export const users_Extension = async (prisma) => {
    console.log('🚀 Creating Users...');
    const roles = await getSystemRoles(prisma);
    
    // Note: Admin user is NOT seeded here. It is handled by the production seed.js script.
    
    // 1. Tạo dữ liệu cho Khách hàng
    const customerUser = await User_Customer();
    const result_customer = await prisma.User.createMany({
        data: customerUser.map(user => ({
            ...user, 
            systemRoleId: roles.find(r => r.name === "Khách hàng")?.id
        })),
    });
    console.log(`✅ Đã tạo thành công ${result_customer.count} Khách hàng!`);
    
    // 2. Tạo dữ liệu cho Nhân viên thương hiệu (Chưa gán role ở bảng User, vì nhân viên dùng WorkspaceRole ở bảng Employment)
    const brandUser = await User_Brand();
    const result_brand = await prisma.User.createMany({
        data: brandUser
    });
    console.log(`✅ Đã tạo thành công ${result_brand.count} Nhân viên thương hiệu!`);
    
    // 3. Tạo dữ liệu cho Nhân viên nhà hàng (Chưa gán role ở bảng User)
    const restauranUser = await User_Restaurant();
    const result_restaurant = await prisma.User.createMany({
        data: restauranUser
    });
    console.log(`✅ Đã tạo thành công ${result_restaurant.count} Nhân viên nhà hàng!`);
};
