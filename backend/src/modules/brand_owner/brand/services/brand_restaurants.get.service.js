import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { getBrandRestaurantsByBrandId } from "../repositories/brand_restaurants.get.repo.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const getBrandRestaurantsService = async (userId) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new ForbiddenError("Người dùng không thuộc thương hiệu nào");
    }

    const restaurants = await getBrandRestaurantsByBrandId(employment.brandId);
    
    // Format for frontend compatibility
    return restaurants.map(r => {
        if (r.categoryRestaurants) {
            r.categories = r.categoryRestaurants;
            delete r.categoryRestaurants;
        }
        if (r.restaurantAmenities) {
            r.amenities = r.restaurantAmenities;
            delete r.restaurantAmenities;
        }
        return r;
    });
};
