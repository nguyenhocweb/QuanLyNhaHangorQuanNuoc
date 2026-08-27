import { updateMenuRepo } from "../repositories/menu.update.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";
import { emitBrandMenuUpdate } from "../../../../../core/utils/socket.js";

export const updateMenuService = async (userId, id, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    const existingMenu = await prisma.menu.findFirst({ where: { id, brandId } });
    if (!existingMenu) {
        throw new NotFoundError("Không tìm thấy thực đơn hoặc bạn không có quyền sửa.");
    }

    if (payload.name && payload.name !== existingMenu.name) {
        const nameExists = await prisma.menu.findFirst({ where: { brandId, name: payload.name } });
        if (nameExists) throw new ConflictError("Tên thực đơn này đã tồn tại.");
    }

    const updated = await updateMenuRepo(id, payload);

    // Đồng thời đồng bộ xuống các danh mục, món ăn và chi nhánh nếu cập nhật is_active
    if (payload.is_active !== undefined) {
        const catMaps = await prisma.menuCategoryMap.findMany({
            where: { menuId: id },
            select: { categoryId: true }
        });
        const categoryIds = catMaps.map(m => m.categoryId).filter(Boolean);
        if (categoryIds.length > 0) {
            await prisma.menuCategory.updateMany({
                where: { id: { in: categoryIds } },
                data: { is_active: Boolean(payload.is_active) }
            });

            const itemMaps = await prisma.menuCategoryMap.findMany({
                where: { categoryId: { in: categoryIds } },
                select: { itemId: true }
            });
            const itemIds = itemMaps.map(m => m.itemId).filter(Boolean);
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
    }

    // Phát sự kiện WebSocket cho tất cả chi nhánh thuộc thương hiệu cập nhật thời gian thực
    emitBrandMenuUpdate(brandId);

    return updated;
};
