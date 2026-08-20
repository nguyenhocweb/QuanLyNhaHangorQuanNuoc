import { generateBrandEmployments, generateRestaurantEmployments, generateStaffEmployments } from "../constants/Employment.data.js";
import { User_Brand, User_Restaurant, User_Staff, WorkspaceRoleData } from "../constants/user.data.js";
import brandData from "../constants/brand.data.js";
import restaurantData from "../constants/restaurant.data.js";

export const employment_Extension = async (prisma) => {
    console.log('creating employments...');

    // Lấy lại danh sách users đã định nghĩa (ID được sinh xác định)
    const brandOwners = await User_Brand();
    const restaurantManagers = await User_Restaurant();
    const staffs = await User_Staff();

    // 1. Tạo Employment cho Brand Owner
    const brandEmployments = generateBrandEmployments(
        brandOwners, 
        WorkspaceRoleData[1].id, // "Chủ thương hiệu"
        brandData
    );
    const resultBrand = await prisma.Employment.createMany({
        data: brandEmployments
    });
    console.log(`✅ Đã tạo thành công ${resultBrand.count} Employment cho Chủ thương hiệu!`);

    // 2. Tạo Employment cho Restaurant Manager
    const restaurantEmployments = generateRestaurantEmployments(
        restaurantManagers, 
        WorkspaceRoleData[2].id, // "Quản lý nhà hàng"
        restaurantData
    );
    const resultRestaurant = await prisma.Employment.createMany({
        data: restaurantEmployments
    });
    console.log(`✅ Đã tạo thành công ${resultRestaurant.count} Employment cho Quản lý nhà hàng!`);

    // 3. Tạo Employment cho Staff
    const staffEmployments = generateStaffEmployments(
        staffs, 
        WorkspaceRoleData[3].id, // "Nhân viên"
        restaurantData
    );
    const resultStaff = await prisma.Employment.createMany({
        data: staffEmployments
    });
    console.log(`✅ Đã tạo thành công ${resultStaff.count} Employment cho Nhân viên!`);
};
