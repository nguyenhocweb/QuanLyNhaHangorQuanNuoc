import { updateRestaurantMenuRepo } from "../repositories/menu.update.repo.js";
import { ForbiddenError, BadRequestError } from "../../../../core/constants/error/index.js";
import { emitMenuUpdate } from "../../../../core/utils/socket.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const updateRestaurantMenuService = async (restaurantId, menuItemId, payload, user) => {
    if (!restaurantId || !menuItemId) {
        throw new BadRequestError("Thiếu ID nhà hàng hoặc ID món ăn");
    }

    // RBAC Check for Staff role: Staff is NOT allowed to change overridePrice
    if (user?.role === "Nhân viên" && payload.overridePrice !== undefined) {
        throw new ForbiddenError("Nhân viên không có quyền thay đổi giá bán. Vui lòng liên hệ Quản lý nhà hàng!");
    }

    // Check Supreme Override from Brand Level: When trying to activate (isAvailable = true), check if Brand disabled it (isActive = false)
    if (payload.isAvailable === true || payload.isAvailable === 'true') {
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId },
            select: { isActive: true, name: true }
        });
        if (!menuItem || menuItem.isActive === false) {
            throw new ForbiddenError(`Món "${menuItem?.name || ''}" đang bị tạm ngưng kinh doanh từ Trụ sở Thương hiệu. Chi nhánh không có quyền kích hoạt lại!`);
        }
    }

    const result = await updateRestaurantMenuRepo(restaurantId, menuItemId, payload);

    if (result && restaurantId) {
        emitMenuUpdate(restaurantId);
    }

    return result;
};
