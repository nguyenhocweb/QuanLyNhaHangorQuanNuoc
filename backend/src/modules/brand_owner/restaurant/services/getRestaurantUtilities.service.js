import { getRestaurantUtilitiesRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantUtilitiesService = async (brandId, restaurantId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    if (!restaurantId) throw new NotFoundError("Vui lòng cung cấp ID nhà hàng");
    
    const utilities = await getRestaurantUtilitiesRepo({
        id: restaurantId,
        brandId: brandId
    });

    if (!utilities) throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng không thuộc thương hiệu này");

    // Format for frontend compatibility
    if (utilities.categoryRestaurants) {
        utilities.categories = utilities.categoryRestaurants;
        delete utilities.categoryRestaurants;
    }
    if (utilities.restaurantAmenities) {
        utilities.amenities = utilities.restaurantAmenities;
        delete utilities.restaurantAmenities;
    }

    return utilities;
};
