import { updateRestaurantTagsRepo } from "../repositories/updateRestaurantTags.repo.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateRestaurantTagsService = async (brandId, restaurantId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Check ownership
    const existing = await getRestaurantByIdRepo({ id: restaurantId });
    if (!existing) throw new NotFoundError("Không tìm thấy nhà hàng này");
    if (existing.brandId !== brandId) throw new ForbiddenError("Bạn không có quyền chỉnh sửa chi nhánh này");
    
    return await updateRestaurantTagsRepo({ id: restaurantId }, data);
};
