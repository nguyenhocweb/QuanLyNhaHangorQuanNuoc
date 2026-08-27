import { createRestaurantRepo } from "../repositories/restaurant.create.repo.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { checkRestaurantLimitService } from "./checkRestaurantLimit.service.js";

export const createRestaurantService = async (brandId, data) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand của bạn");
    
    // Kiểm tra giới hạn số lượng nhà hàng theo gói cước
    await checkRestaurantLimitService(brandId);
    
    // Gắn brandId vào data trước khi tạo
    const createData = {
        ...data,
        brandId,
        weightedScore: 0.0,
        ratingStats: {
            totalRating: 0,
            averageRating: 0.0,
            food: 0.0,
            service: 0.0,
            ambiance: 0.0
        },
        bookingConfig: {
            maxPartySize: data.maxPartySize || data.max_party_size || 50,
            bookingWindowDays: data.bookingWindowDays || data.booking_window_days || 7,
            cancellationHours: data.cancellationHours || data.cancellation_hours || 24,
            depositRequired: data.depositRequired !== undefined ? data.depositRequired : (data.deposit_required !== undefined ? data.deposit_required : false),
            depositAmount: data.depositPerPax || data.depositAmount || data.deposit_amount || null
        }
    };

    // Remove the flat snake_case fields that might have come from ...data
    delete createData.max_party_size;
    delete createData.booking_window_days;
    delete createData.cancellation_hours;
    delete createData.deposit_required;
    delete createData.deposit_amount;
    delete createData.depositPerPax;
    delete createData.depositAmount;

    // Map fields from frontend camelCase to Prisma snake_case & correct names
    if (createData.categoryIds !== undefined) { createData.categoryRestaurantIds = createData.categoryIds; delete createData.categoryIds; }
    if (createData.amenityIds !== undefined) { createData.restaurantAmenityIds = createData.amenityIds; delete createData.amenityIds; }
    if (createData.emailContact !== undefined) { createData.email_contact = createData.emailContact; delete createData.emailContact; }
    if (createData.phoneContact !== undefined) { createData.phone_contact = createData.phoneContact; delete createData.phoneContact; }
    
    // Remove unsupported fields
    delete createData.maxPartySize;
    delete createData.bookingWindowDays;
    delete createData.cancellationHours;
    delete createData.depositRequired;
    delete createData.depositPerPax;
    delete createData.isVatInclusive;
    delete createData.defaultVatRate;
    delete createData.applyServiceCharge;
    delete createData.serviceChargeRate;
    
    if (typeof data.address === 'object' && data.address !== null) {
        createData.address = {
            street: data.address.street || "",
            province: data.address.city || data.address.province || data.city || data.province || "",
            provinceCode: data.address.provinceCode || "",
            district: data.address.district || "",
            districtCode: data.address.districtCode || "",
            ward: data.address.ward || "",
            wardCode: data.address.wardCode || ""
        };
        delete createData.city;
        delete createData.province;
    } else if (data.address || data.city || data.province) {
        createData.address = {
            street: typeof data.address === 'string' ? data.address : "",
            province: data.city || data.province || "",
            provinceCode: "",
            district: "",
            districtCode: "",
            ward: "",
            wardCode: ""
        };
        delete createData.city;
        delete createData.province;
    }

    return await createRestaurantRepo(createData);
};
