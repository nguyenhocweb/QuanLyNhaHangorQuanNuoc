import { updateRestaurantRepo } from "../repositories/restaurant.update.repo.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateRestaurantService = async (brandId, restaurantId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Check ownership
    const existing = await getRestaurantByIdRepo({ id: restaurantId });
    if (!existing) throw new NotFoundError("Không tìm thấy nhà hàng này");
    if (existing.brandId !== brandId) throw new ForbiddenError("Bạn không có quyền chỉnh sửa chi nhánh này");
    
    const updateData = { ...data };
    
    if (data.address) {
        updateData.address = {
            set: {
                street: data.address.street || existing.address?.street || "",
                province: data.address.city || data.address.province || existing.address?.province || "",
                provinceCode: data.address.provinceCode || existing.address?.provinceCode || "",
                district: data.address.district || existing.address?.district || "",
                districtCode: data.address.districtCode || existing.address?.districtCode || "",
                ward: data.address.ward || existing.address?.ward || "",
                wardCode: data.address.wardCode || existing.address?.wardCode || ""
            }
        };
    } else if (data.city || data.province) {
        // Fallback for legacy updates
        updateData.address = {
            set: {
                ...existing.address,
                province: data.city || data.province || existing.address?.province || ""
            }
        };
    }
    delete updateData.city;
    delete updateData.province;

    return await updateRestaurantRepo({ id: restaurantId }, updateData);
};
