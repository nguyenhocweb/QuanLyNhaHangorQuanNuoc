import { getPublicRestaurantCoreInfoRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicRestaurantService = async (id) => {
    const restaurant = await getPublicRestaurantCoreInfoRepo(id);

    if (!restaurant) {
        throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng đã tạm ngưng hoạt động.");
    }

    // Format keys for frontend compatibility
    const formattedRestaurant = {
        ...restaurant,
        social_links: restaurant.socialLinks,
        delivery_partners: restaurant.deliveryPartners
    };
    delete formattedRestaurant.socialLinks;
    delete formattedRestaurant.deliveryPartners;

    return {
        message: "Lấy thông tin nhà hàng thành công",
        metadata: formattedRestaurant,
    };
};
