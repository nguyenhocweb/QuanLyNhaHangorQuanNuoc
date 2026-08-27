import { createItemRepo } from "../repositories/item.create.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const createItemService = async (userId, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    // Kiểm tra danh mục có thuộc về thương hiệu này không
    const categories = await prisma.menuCategory.findMany({
        where: { id: { in: payload.categoryIds }, brandId }
    });
    
    if (categories.length !== payload.categoryIds.length) {
        throw new NotFoundError("Một hoặc nhiều danh mục không hợp lệ hoặc không thuộc thương hiệu của bạn.");
    }

    // Kiểm tra tên món ăn có bị trùng trong thương hiệu không
    const existingItem = await prisma.menuItem.findFirst({
        where: { brandId, name: payload.name }
    });
    
    if (existingItem) {
        throw new ConflictError("Tên món ăn này đã tồn tại trong hệ thống của bạn.");
    }

    const { categoryIds, ...itemData } = payload;
    const newItem = await createItemRepo(brandId, categoryIds, itemData);
    return newItem;
};
