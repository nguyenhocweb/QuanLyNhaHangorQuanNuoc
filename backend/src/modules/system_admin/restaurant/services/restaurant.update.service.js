import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updateRestaurant } from "../repositories/restaurant.update.repo.js";

export const updateRestaurantService = async (id, data) => {
    try {
        const payload = { ...data };
        if (payload.statusByAdmin !== undefined) {
            const validStatuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'TERMINATED'];
            if (!validStatuses.includes(payload.statusByAdmin)) {
                payload.statusByAdmin = 'INACTIVE';
            }
        }
        if (payload.statusByBrand !== undefined) {
            const validStatuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'TERMINATED'];
            if (!validStatuses.includes(payload.statusByBrand)) {
                payload.statusByBrand = 'INACTIVE';
            }
        }

        // Prevent relational and unsupported flat fields from crashing Prisma update
        delete payload.brandId;
        delete payload.brand;
        delete payload.categories;
        delete payload.restaurantAmenities;
        delete payload.city;
        delete payload.province;
        delete payload.isVatInclusive;
        delete payload.defaultVatRate;
        delete payload.applyServiceCharge;
        delete payload.serviceChargeRate;

        if (payload.emailContact !== undefined) { payload.email_contact = payload.emailContact; delete payload.emailContact; }
        if (payload.phoneContact !== undefined) { payload.phone_contact = payload.phoneContact; delete payload.phoneContact; }
        if (payload.categoryIds !== undefined) { payload.categoryRestaurantIds = payload.categoryIds; delete payload.categoryIds; }
        if (payload.amenityIds !== undefined) { payload.restaurantAmenityIds = payload.amenityIds; delete payload.amenityIds; }

        // 1. Map Booking Config
        if (
            payload.maxPartySize !== undefined || 
            payload.bookingWindowDays !== undefined || 
            payload.cancellationHours !== undefined || 
            payload.depositRequired !== undefined || 
            payload.depositPerPax !== undefined
        ) {
            payload.bookingConfig = {
                maxPartySize: payload.maxPartySize,
                bookingWindowDays: payload.bookingWindowDays,
                cancellationHours: payload.cancellationHours,
                depositRequired: payload.depositRequired,
                depositAmount: payload.depositPerPax
            };
            delete payload.maxPartySize;
            delete payload.bookingWindowDays;
            delete payload.cancellationHours;
            delete payload.depositRequired;
            delete payload.depositPerPax;
        }

        // 2. Map Tax Config
        if (
            data.isVatInclusive !== undefined ||
            data.defaultVatRate !== undefined ||
            data.applyServiceCharge !== undefined ||
            data.serviceChargeRate !== undefined ||
            data.forceGlobalTaxConfig !== undefined
        ) {
            payload.taxConfig = {
                isVatInclusive: data.isVatInclusive,
                defaultVatRate: data.defaultVatRate,
                applyServiceCharge: data.applyServiceCharge,
                serviceChargeRate: data.serviceChargeRate,
                forceGlobalTaxConfig: data.forceGlobalTaxConfig
            };
        }

        return await updateRestaurant(id, payload);
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Không tìm thấy nhà hàng");
        }
        throw error;
    }
};
