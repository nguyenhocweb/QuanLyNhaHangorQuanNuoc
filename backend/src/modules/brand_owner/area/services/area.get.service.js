import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getAreasByRestaurantIdRepo, getAreaByIdRepo } from "../repositories/area.get.repo.js";

export const getAreasByRestaurantIdService = async (restaurantId) => {
    if (!restaurantId) throw new BadRequestError("restaurantId là bắt buộc");
    return await getAreasByRestaurantIdRepo(restaurantId);
};

export const getAreaByIdService = async (id) => {
    const area = await getAreaByIdRepo(id);
    if (!area) throw new NotFoundError("Khu vực không tồn tại");
    return area;
};
