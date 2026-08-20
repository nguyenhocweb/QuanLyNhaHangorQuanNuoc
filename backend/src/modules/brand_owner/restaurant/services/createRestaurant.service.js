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
        maxPartySize: data.maxPartySize || 50, // Default for Prisma requirement
        bookingWindowDays: data.bookingWindowDays || 7, // Default 7 days
        cancellationHours: data.cancellationHours || 24, // Default 24 hours
        depositRequired: data.depositRequired || false,
        depositPerPax: data.depositPerPax || null
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
