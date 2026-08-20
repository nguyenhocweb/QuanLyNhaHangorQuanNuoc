import { updateCategoryRepo } from "../repositories/category.update.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";
import { emitBrandMenuUpdate } from "../../../../../core/utils/socket.js";

export const updateCategoryService = async (userId, id, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu.");
    }
    const brandId = employment.brandId;

    const category = await prisma.menuCategory.findUnique({
        where: { id }
    });

    if (!category || category.brandId !== brandId) {
        throw new NotFoundError("Danh mục không tồn tại hoặc không thuộc thương hiệu của bạn.");
    }

    if (payload.menuIds && payload.menuIds.length > 0) {
        const menus = await prisma.menu.findMany({ 
            where: { id: { in: payload.menuIds }, brandId } 
        });
        if (menus.length !== payload.menuIds.length) {
            throw new NotFoundError("Một hoặc nhiều thực đơn không tồn tại hoặc không thuộc quyền quản lý của bạn.");
        }
    }

    if (payload.name && payload.name !== category.name) {
        const existing = await prisma.menuCategory.findFirst({
            where: { brandId, name: payload.name }
        });
        if (existing) {
            throw new ConflictError("Tên danh mục này đã tồn tại.");
        }
    }

    const { menuIds, ...categoryData } = payload;
    const updated = await updateCategoryRepo(id, menuIds, categoryData);

    // Đồng thời đồng bộ xuống các món ăn trong danh mục và toàn bộ chi nhánh nếu cập nhật is_active
    if (payload.is_active !== undefined) {
        const itemMaps = await prisma.menuCategoryMap.findMany({
            where: { categoryId: id },
            select: { itemId: true }
        });
        const itemIds = itemMaps.map(m => m.itemId);
        if (itemIds.length > 0) {
            await prisma.menuItem.updateMany({
                where: { id: { in: itemIds } },
                data: { isActive: Boolean(payload.is_active) }
            });

            await prisma.restaurantMenuItem.updateMany({
                where: { menuItemId: { in: itemIds } },
                data: { isAvailable: Boolean(payload.is_active) }
            });
        }
    }

    // Phát sự kiện WebSocket cho tất cả chi nhánh thuộc thương hiệu cập nhật thời gian thực
    emitBrandMenuUpdate(brandId);

    return updated;
};
