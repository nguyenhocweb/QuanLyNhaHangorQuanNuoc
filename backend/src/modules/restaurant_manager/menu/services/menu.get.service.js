import { getRestaurantMenuRepo } from "../repositories/menu.get.repo.js";
import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";

export const getRestaurantMenuService = async (restaurantId, params) => {
    if (!restaurantId) {
        throw new BadRequestError("Thiếu thông tin restaurantId");
    }

    const { page = 1, limit = 50, search, categoryId, menuId, isAvailable } = params;
    const skip = (Number(page) - 1) * Number(limit);

    const { data, total, categories, menus } = await getRestaurantMenuRepo(restaurantId, {
        skip,
        take: Number(limit),
        search,
        categoryId,
        menuId,
        isAvailable
    });

    return {
        items: data,
        categories: categories || [],
        menus: menus || [],
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        }
    };
};
