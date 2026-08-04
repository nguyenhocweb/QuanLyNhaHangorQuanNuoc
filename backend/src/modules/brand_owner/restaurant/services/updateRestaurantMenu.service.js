import { updateRestaurantMenuRepo } from "../repositories/restaurantMenu.update.repo.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateRestaurantMenuService = async (brandId, restaurantId, menuItemId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Check ownership of the restaurant
    const existing = await getRestaurantByIdRepo({ id: restaurantId });
    if (!existing) throw new NotFoundError("Không tìm thấy nhà hàng này");
    if (existing.brandId !== brandId) throw new ForbiddenError("Bạn không có quyền thao tác trên chi nhánh này");
    
    // Check if menuItemId is provided
    if (!menuItemId) throw new NotFoundError("Không tìm thấy ID món ăn");

    return await updateRestaurantMenuRepo(restaurantId, menuItemId, data);
};
