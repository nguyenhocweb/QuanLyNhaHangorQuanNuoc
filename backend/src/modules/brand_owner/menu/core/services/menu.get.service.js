import { getMenusRepo } from "../repositories/menu.get.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";

export const getMenuService = async (userId, { page, limit, search, is_active, sort_order }) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    const skip = (page - 1) * limit;
    const { data, total } = await getMenusRepo(brandId, { skip, take: limit, search, is_active, sort_order });

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
