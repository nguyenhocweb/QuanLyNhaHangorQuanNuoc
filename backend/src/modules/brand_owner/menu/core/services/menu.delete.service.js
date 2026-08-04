import { deleteMenuRepo } from "../repositories/menu.delete.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteMenuService = async (userId, id) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }

    const existingMenu = await prisma.menu.findFirst({ where: { id, brandId: employment.brandId } });
    if (!existingMenu) {
        throw new NotFoundError("Không tìm thấy thực đơn hoặc bạn không có quyền xóa.");
    }

    // Check dependencies
    const relatedCategories = await prisma.menuCategoryMap.count({ where: { menuId: id } });
    if (relatedCategories > 0) {
        throw new ConflictError("Không thể xóa thực đơn này vì đang có danh mục liên kết. Vui lòng chuyển hoặc xóa danh mục trước.");
    }

    return await deleteMenuRepo(id);
};
