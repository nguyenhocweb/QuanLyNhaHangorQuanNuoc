import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { deleteRestaurantMenuRepo } from "../repositories/restaurantMenu.delete.repo.js";

export const deleteRestaurantMenuService = async (userId, brandId, restaurantId, menuItemId) => {
    // 1. Kiểm tra nhà hàng có thuộc brand này không
    const restaurant = await getRestaurantByIdRepo({ id: restaurantId });
    if (!restaurant || restaurant.brandId !== brandId) {
        throw new NotFoundError("Nhà hàng không tồn tại hoặc không thuộc quyền quản lý");
    }

    // 2. Xóa mapping (un-assign)
    try {
        await deleteRestaurantMenuRepo(restaurantId, menuItemId);
    } catch (error) {
        // Lỗi thường do Record to delete does not exist (P2025)
        if (error.code === 'P2025') {
            throw new NotFoundError("Món ăn này chưa được phân bổ cho chi nhánh");
        }
        throw error;
    }

    return true;
};
