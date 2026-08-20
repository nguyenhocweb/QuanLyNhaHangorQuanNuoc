import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { updateBrandById } from "../repositories/brand.update.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const updateBrandService = async (userId, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    // Check tên thương hiệu có trùng với brand khác không
    if (payload.name) {
        const existingBrand = await prisma.brand.findUnique({
            where: { name: payload.name }
        });
        if (existingBrand && existingBrand.id !== brandId) {
            throw new ConflictError("Tên thương hiệu đã tồn tại trong hệ thống.");
        }
    }

    // Mapping is_featured to isFeatured if needed, but our validator allows is_featured
    // Prisma model expects isFeatured
    if (payload.is_featured !== undefined) {
        payload.isFeatured = payload.is_featured;
        delete payload.is_featured;
    }

    const updatedBrand = await updateBrandById(brandId, payload);
    return updatedBrand;
};
