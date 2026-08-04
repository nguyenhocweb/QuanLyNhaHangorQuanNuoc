import { deleteCategoryRepo } from "../repositories/category.delete.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, BadRequestError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteCategoryService = async (userId, id) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu.");
    }

    const category = await prisma.menuCategory.findUnique({
        where: { id },
        include: { itemMaps: true }
    });

    if (!category || category.brandId !== employment.brandId) {
        throw new NotFoundError("Danh mục không tồn tại hoặc không thuộc thương hiệu của bạn.");
    }

    if (category.itemMaps.length > 0) {
        throw new BadRequestError("Không thể xóa danh mục đang chứa món ăn.");
    }

    return await deleteCategoryRepo(id);
};
