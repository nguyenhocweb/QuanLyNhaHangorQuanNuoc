import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { updateBrandById } from "../repositories/brand.update.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const updateBrandService = async (userId, payload) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền Quản lý thương hiệu hoặc không tìm thấy thương hiệu.");
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

    // Map and extract only valid fields for Brand model
    const updateData = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.logo !== undefined) updateData.logo = payload.logo;
    if (payload.emailContact !== undefined) updateData.email_contact = payload.emailContact;
    if (payload.phoneContact !== undefined) updateData.phone_contact = payload.phoneContact;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.taxCode !== undefined) updateData.tax_code = payload.taxCode;
    if (payload.link !== undefined) updateData.link = payload.link;
    if (payload.imageMain !== undefined) updateData.imageMain = payload.imageMain;
    if (payload.images !== undefined) updateData.images = payload.images;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
    if (payload.address !== undefined) updateData.address = payload.address;
    if (payload.is_featured !== undefined) updateData.isFeatured = payload.is_featured;
    if (payload.isFeatured !== undefined) updateData.isFeatured = payload.isFeatured;
    if (payload.isFeatured !== undefined) updateData.isFeatured = payload.isFeatured;

    // Map Tax Configs
    if (
        payload.isVatInclusive !== undefined ||
        payload.defaultVatRate !== undefined ||
        payload.applyServiceCharge !== undefined ||
        payload.serviceChargeRate !== undefined ||
        payload.forceGlobalTaxConfig !== undefined
    ) {
        updateData.taxConfig = {
            isVatInclusive: payload.isVatInclusive,
            defaultVatRate: payload.defaultVatRate,
            applyServiceCharge: payload.applyServiceCharge,
            serviceChargeRate: payload.serviceChargeRate,
            forceGlobalTaxConfig: payload.forceGlobalTaxConfig
        };
    }

    // Map Inventory Configs
    if (payload.inventoryApprovalThreshold !== undefined) {
        updateData.inventoryConfig = {
            inventoryApprovalThreshold: payload.inventoryApprovalThreshold
        };
    }
    const updatedBrand = await updateBrandById(brandId, updateData);
    return updatedBrand;
};
