import { getMenuItemsRepo } from "../repositories/item.get.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";

export const getItemService = async (userId, { page, limit, search, categoryId, menuId, restaurantId, isAvailable, isAssigned }) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu.");
    }
    const brandId = employment.brandId;

    const skip = (page - 1) * limit;
    const { data, total } = await getMenuItemsRepo(brandId, { skip, take: limit, search, categoryId, menuId, restaurantId, isAvailable, isAssigned });

    // Format for frontend compatibility
    const formattedData = data.map(item => {
        if (item.itemCategoryMaps) {
            item.itemCategoryMaps.forEach(cMap => {
                if (cMap.category && cMap.category.menuCategoryMaps) {
                    cMap.category.menuMaps = cMap.category.menuCategoryMaps;
                    delete cMap.category.menuCategoryMaps;
                }
            });
            item.categoryMaps = item.itemCategoryMaps;
            delete item.itemCategoryMaps;
        }
        if (item.itemVariants) {
            item.variants = item.itemVariants;
            delete item.itemVariants;
        }
        if (item.restaurantMenuItems) {
            item.restaurantMaps = item.restaurantMenuItems;
            delete item.restaurantMenuItems;
        }
        return item;
    });

    return {
        data: formattedData,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
