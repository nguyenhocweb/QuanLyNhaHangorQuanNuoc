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
        totalRating: 0,
        max_party_size: data.max_party_size || 50, // Default for Prisma requirement
        booking_window_days: data.booking_window_days || 7, // Default 7 days
        cancellation_hours: data.cancellation_hours || 24, // Default 24 hours
        deposit_required: data.deposit_required || false,
        deposit_amount: data.deposit_amount || null
    };
    
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
