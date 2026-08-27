import { Brand_employment, Restaurant_employment } from "../constants/Employment.data.js"

export const employment_Extension = async (prisma) => {
    // 1. Lấy tất cả user (trừ admin)
    const users = await prisma.User.findMany({
        select: { id: true, user_name: true }
    });

    // 2. Lấy danh sách Thương hiệu và Nhà hàng
    const brands = await prisma.Brand.findMany({
        select: { id: true, name: true }
    });
    const restaurants = await prisma.Restaurant.findMany({
        select: { id: true, name: true }
    });

    // 3. Lấy WorkspaceRole
    const roles = await prisma.WorkspaceRole.findMany({
        select: { id: true, name: true }
    });

    const getRoleId = (roleName) => roles.find(r => r.name === roleName)?.id;

    console.log("🚀 Creating Employment...");

    // 4. Create data employment brand 
    const brandEmployments = Brand_employment.map(e => {
        const userId = users.find(u => u.user_name === e.user_name)?.id;
        const brandId = brands.find(b => b.name === e.Brandname)?.id;
        // Nếu là director thì làm Quản lý thương hiệu, còn lại là Nhân viên
        const roleId = e.user_name === "brand_director" 
            ? getRoleId("Quản lý thương hiệu") 
            : getRoleId("Nhân viên");

        return { userId, brandId, workspaceRoleId: roleId };
    }).filter(e => e.userId && e.brandId && e.workspaceRoleId);

    const resultBrand = await prisma.Employment.createMany({
        data: brandEmployments
    });
    console.log(`✅ Đã tạo thành công ${resultBrand.count} Employment Brand!`);

    // 5. Create data employment restaurant
    const restaurantEmployments = Restaurant_employment.map(e => {
        const userId = users.find(u => u.user_name === e.user_name)?.id;
        const restaurantId = restaurants.find(r => r.name === e.Restaurantname)?.id;
        // Nếu là manager thì làm Quản lý nhà hàng, còn lại là Nhân viên
        const roleId = e.user_name === "rest_manager" 
            ? getRoleId("Quản lý nhà hàng") 
            : getRoleId("Nhân viên");

        return { userId, restaurantId, workspaceRoleId: roleId };
    }).filter(e => e.userId && e.restaurantId && e.workspaceRoleId);

    const resultRestaurant = await prisma.Employment.createMany({
        data: restaurantEmployments
    });

    console.log(`✅ Đã tạo thành công ${resultRestaurant.count} Employment Restaurant!`);
};
