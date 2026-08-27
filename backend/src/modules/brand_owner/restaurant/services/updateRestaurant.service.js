import { updateRestaurantRepo } from "../repositories/restaurant.update.repo.js";
import { getRestaurantByIdRepo } from "../repositories/restaurant.get.repo.js";
import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateRestaurantService = async (brandId, restaurantId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Check ownership
    const existing = await getRestaurantByIdRepo({ id: restaurantId });
    if (!existing) throw new NotFoundError("Không tìm thấy nhà hàng này");
    if (existing.brandId !== brandId) throw new ForbiddenError("Bạn không có quyền chỉnh sửa chi nhánh này");
    
    // Normalize corrupted address from earlier { set: {} } bug
    if (existing.address && existing.address.set) {
        existing.address = existing.address.set;
    }
    
    const updateData = { ...data };

    // Prevent Brand Owner from tampering with System Admin controls
    delete updateData.statusByAdmin;
    delete updateData.reasonByAdmin;
    
    if (data.address) {
        updateData.address = {
            street: data.address.street || existing.address?.street || "",
            province: data.address.city || data.address.province || existing.address?.province || "",
            provinceCode: data.address.provinceCode || existing.address?.provinceCode || "",
            district: data.address.district || existing.address?.district || "",
            districtCode: data.address.districtCode || existing.address?.districtCode || "",
            ward: data.address.ward || existing.address?.ward || "",
            wardCode: data.address.wardCode || existing.address?.wardCode || ""
        };
    } else if (data.city || data.province) {
        // Fallback for legacy updates
        updateData.address = {
            ...existing.address,
            province: data.city || data.province || existing.address?.province || ""
        };
    }
    delete updateData.city;
    delete updateData.province;

    // Map fields from frontend camelCase to Prisma snake_case & correct names
    if (updateData.emailContact !== undefined) { updateData.email_contact = updateData.emailContact; delete updateData.emailContact; }
    if (updateData.phoneContact !== undefined) { updateData.phone_contact = updateData.phoneContact; delete updateData.phoneContact; }
    
    if (updateData.categoryIds !== undefined) { updateData.categoryRestaurantIds = updateData.categoryIds; delete updateData.categoryIds; }
    if (updateData.amenityIds !== undefined) { updateData.restaurantAmenityIds = updateData.amenityIds; delete updateData.amenityIds; }
    if (updateData.tagIds !== undefined) { updateData.tagIds = updateData.tagIds; /* already matches schema */ }
    // Remove unsupported fields that don't exist in Prisma Schema
    delete updateData.isVatInclusive;
    delete updateData.defaultVatRate;
    delete updateData.applyServiceCharge;
    delete updateData.serviceChargeRate;

    // 1. Map Booking Config
    if (
        updateData.maxPartySize !== undefined || 
        updateData.bookingWindowDays !== undefined || 
        updateData.cancellationHours !== undefined || 
        updateData.depositRequired !== undefined || 
        updateData.depositPerPax !== undefined
    ) {
        updateData.bookingConfig = {
            maxPartySize: updateData.maxPartySize,
            bookingWindowDays: updateData.bookingWindowDays,
            cancellationHours: updateData.cancellationHours,
            depositRequired: updateData.depositRequired,
            depositAmount: updateData.depositPerPax
        };
        // Clean up flat payload keys
        delete updateData.maxPartySize;
        delete updateData.bookingWindowDays;
        delete updateData.cancellationHours;
        delete updateData.depositRequired;
        delete updateData.depositPerPax;
    }

    // 2. Map Tax Config
    if (
        data.isVatInclusive !== undefined ||
        data.defaultVatRate !== undefined ||
        data.applyServiceCharge !== undefined ||
        data.serviceChargeRate !== undefined ||
        data.forceGlobalTaxConfig !== undefined
    ) {
        updateData.taxConfig = {
            isVatInclusive: data.isVatInclusive,
            defaultVatRate: data.defaultVatRate,
            applyServiceCharge: data.applyServiceCharge,
            serviceChargeRate: data.serviceChargeRate,
            forceGlobalTaxConfig: data.forceGlobalTaxConfig
        };
    }

    // 3. Map Inventory Config
    if (data.inventoryApprovalThreshold !== undefined) {
        updateData.inventoryConfig = {
            inventoryApprovalThreshold: data.inventoryApprovalThreshold
        };
        delete updateData.inventoryApprovalThreshold;
    }

    return await updateRestaurantRepo({ id: restaurantId }, updateData);
};
