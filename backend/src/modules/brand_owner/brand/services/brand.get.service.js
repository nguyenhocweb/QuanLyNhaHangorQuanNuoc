import { findEmploymentByUserId, getBrandById } from "../repositories/brand.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getBrandService = async (userId) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }

    const brand = await getBrandById(employment.brandId);
    if (!brand) {
        throw new NotFoundError("Không tìm thấy thông tin thương hiệu.");
    }

    return brand;
};
