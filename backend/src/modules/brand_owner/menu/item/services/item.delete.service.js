import { deleteItemRepo } from "../repositories/item.delete.repo.js";
import { findEmploymentByUserId } from "../../../brand/repositories/brand.get.repo.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteItemService = async (userId, id) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu.");
    }

    const item = await prisma.menuItem.findUnique({
        where: { id }
    });

    if (!item || item.brandId !== employment.brandId) {
        throw new NotFoundError("Món ăn không tồn tại hoặc không thuộc thương hiệu của bạn.");
    }

    return await deleteItemRepo(id);
};
