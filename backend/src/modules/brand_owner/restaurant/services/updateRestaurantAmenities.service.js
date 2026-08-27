import { updateRestaurantAmenitiesRepo } from "../repositories/updateRestaurantAmenities.repo.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateRestaurantAmenitiesService = async (brandId, restaurantId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Check ownership
    const existing = await getRestaurantByIdRepo({ id: restaurantId });
    if (!existing) throw new NotFoundError("Không tìm thấy nhà hàng này");
    if (existing.brandId !== brandId) throw new ForbiddenError("Bạn không có quyền chỉnh sửa chi nhánh này");
    
    const updateData = { ...data };
    
    // Map frontend camelCase to Prisma schema keys
    if (updateData.amenityIds !== undefined) {
        updateData.restaurantAmenityIds = updateData.amenityIds;
        delete updateData.amenityIds;
    }
    
    return await updateRestaurantAmenitiesRepo({ id: restaurantId }, updateData);
};
