import { createMenuRepo } from "../repositories/menu.create.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError, ConflictError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const createMenuService = async (userId, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    const existing = await prisma.menu.findFirst({
        where: { brandId, name: payload.name }
    });
    if (existing) {
        throw new ConflictError("Tên thực đơn này đã tồn tại trong thương hiệu của bạn.");
    }

    return await createMenuRepo(brandId, payload);
};
