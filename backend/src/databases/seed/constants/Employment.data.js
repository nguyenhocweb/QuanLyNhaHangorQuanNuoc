import { generateSeedId } from "./user.data.js";

// Tạo Employment cho Chủ Thương Hiệu (Mỗi brand 1 người quản lý cấp cao nhất)
export const generateBrandEmployments = (brandOwners, workspaceRoleId, brandData) => {
    return brandOwners.map((owner, index) => ({
        id: generateSeedId("e0e0e0e0e0e0e0e0e0", index + 1), // prefix cho employment brand
        userId: owner.id,
        workspaceRoleId: workspaceRoleId, // "Chủ thương hiệu" ID
        brandId: brandData[index].id,
        restaurantId: null,
        salary_type: "MONTHLY"
    }));
};

// Tạo Employment cho Quản lý nhà hàng (Mỗi nhà hàng 1 người quản lý)
export const generateRestaurantEmployments = (restaurantManagers, workspaceRoleId, restaurantData) => {
    return restaurantManagers.map((manager, index) => ({
        id: generateSeedId("f0f0f0f0f0f0f0f0f0", index + 1), // prefix cho employment restaurant manager
        userId: manager.id,
        workspaceRoleId: workspaceRoleId, // "Quản lý nhà hàng" ID
        brandId: restaurantData[index].brandId, // Cần liên kết đúng brand của nhà hàng đó
        restaurantId: restaurantData[index].id,
        salary_type: "MONTHLY"
    }));
};

// Tạo Employment cho Nhân viên cơ bản (Chia đều ngẫu nhiên vào các nhà hàng)
export const generateStaffEmployments = (staffs, workspaceRoleId, restaurantData) => {
    return staffs.map((staff, index) => {
        // Phân bổ đều nhân viên vào các nhà hàng
        const restIndex = index % restaurantData.length;
        return {
            id: generateSeedId("f1f1f1f1f1f1f1f1f1", index + 1), // prefix cho employment staff
            userId: staff.id,
            workspaceRoleId: workspaceRoleId, // "Nhân viên" ID
            brandId: restaurantData[restIndex].brandId,
            restaurantId: restaurantData[restIndex].id,
            salary_type: "HOURLY"
        };
    });
};
