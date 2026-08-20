import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantByIdService = async (brandId, restaurantId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    if (!restaurantId) throw new NotFoundError("Vui lòng cung cấp ID nhà hàng");
    
    const restaurant = await getRestaurantByIdRepo({
        id: restaurantId,
        brandId: brandId
    });

    if (!restaurant) throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng không thuộc thương hiệu này");

    return restaurant;
};
