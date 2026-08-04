import { updateItemRepo } from "../repositories/item.update.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";
import { emitBrandMenuUpdate } from "../../../../../core/utils/socket.js";

export const updateItemService = async (userId, id, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu.");
    }

    const item = await prisma.menuItem.findUnique({
        where: { id }
    });

    if (!item || item.brandId !== employment.brandId) {
        throw new NotFoundError("Món ăn không tồn tại hoặc không thuộc thương hiệu của bạn.");
    }

    if (payload.name && payload.name !== item.name) {
        const existing = await prisma.menuItem.findFirst({
            where: { brandId: employment.brandId, name: payload.name }
        });
        if (existing) {
            throw new ConflictError("Tên món ăn này đã tồn tại trong hệ thống của bạn.");
        }
    }

    if (payload.categoryIds && payload.categoryIds.length > 0) {
        const categories = await prisma.menuCategory.findMany({
            where: { id: { in: payload.categoryIds }, brandId: employment.brandId }
        });
        if (categories.length !== payload.categoryIds.length) {
            throw new NotFoundError("Danh mục không hợp lệ.");
        }
    }

    const { categoryIds, ...itemData } = payload;
    const updated = await updateItemRepo(id, categoryIds, itemData);

    // Đồng thời đồng bộ xuống tất cả chi nhánh nếu có cập nhật trạng thái isActive / is_active
    const activeVal = payload.isActive !== undefined ? payload.isActive : payload.is_active;
    if (activeVal !== undefined) {
        await prisma.restaurantMenuItem.updateMany({
            where: { menuItemId: id },
            data: { isAvailable: Boolean(activeVal) }
        });
    }

    // Phát sự kiện WebSocket cho tất cả chi nhánh thuộc thương hiệu cập nhật thời gian thực
    emitBrandMenuUpdate(employment.brandId);

    return updated;
};
