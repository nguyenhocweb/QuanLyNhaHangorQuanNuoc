import { getRestaurantsRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantsService = async (brandId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    return await getRestaurantsRepo({
        brandId: brandId
    });
};
