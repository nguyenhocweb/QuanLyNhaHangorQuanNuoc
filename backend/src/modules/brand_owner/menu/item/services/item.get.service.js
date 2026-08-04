import { getMenuItemsRepo } from "../repositories/item.get.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";

export const getItemService = async (userId, { page, limit, search, categoryId, menuId, restaurantId, isAvailable, isAssigned }) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu.");
    }
    const brandId = employment.brandId;

    const skip = (page - 1) * limit;
    const { data, total } = await getMenuItemsRepo(brandId, { skip, take: limit, search, categoryId, menuId, restaurantId, isAvailable, isAssigned });

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
