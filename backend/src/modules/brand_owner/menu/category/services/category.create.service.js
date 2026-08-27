import { createMenuCategoryRepo } from "../repositories/category.create.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const createCategoryService = async (userId, payload) => {
    // 1. Lấy brandId từ userId
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    // 2. Kiểm tra Menu có thuộc Brand không
    const menus = await prisma.menu.findMany({ 
        where: { id: { in: payload.menuIds }, brandId } 
    });
    if (menus.length !== payload.menuIds.length) {
        throw new NotFoundError("Một hoặc nhiều thực đơn không tồn tại hoặc không thuộc quyền quản lý của bạn.");
    }

    // 3. Kiểm tra xem tên danh mục đã tồn tại trong brand chưa
    const existing = await prisma.menuCategory.findFirst({
        where: { brandId, name: payload.name }
    });
    if (existing) {
        throw new ConflictError("Tên danh mục này đã tồn tại trong thương hiệu của bạn.");
    }

    // 4. Lưu vào Database
    const { menuIds, ...categoryData } = payload;
    return await createMenuCategoryRepo(brandId, menuIds, categoryData);
};
