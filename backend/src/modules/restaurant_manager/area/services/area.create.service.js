import { BadRequestError } from "../../../../core/constants/error/index.js";
import { createAreaRepo } from "../repositories/area.create.repo.js";
import { getRestaurantByIdRepo } from "../../../brand_owner/restaurant/repositories/restaurant.get.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const createAreaService = async (body) => {
    const { restaurantId } = body;
    const restaurant = await getRestaurantByIdRepo({ id: restaurantId });
    if (!restaurant) throw new BadRequestError("Nhà hàng không tồn tại");

    const result = await createAreaRepo(body);
    emitTableUpdate(restaurantId);
    return result;
};
