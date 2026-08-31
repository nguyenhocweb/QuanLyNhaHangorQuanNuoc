import { CONFIGURABLE_FEATURE_NAMES } from "../../../../constants/subscription.constant.js";
import * as getRepo from "../repositories/subscription.get.repo.js";

// Lấy danh sách tính năng nâng cao có thể cấu hình
export const getSubscriptionFeatures = async () => {
    return CONFIGURABLE_FEATURE_NAMES;
};

// Lấy danh sách gói cước (kèm phân trang, tìm kiếm)
export const getSubscriptions = async (params) => {
    const { page = 1, limit = 10, search = "", status } = params;
    const skip = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }
    
    if (status !== undefined && status !== "") {
        where.isActive = status === "true" || status === true;
    }

    const [data, total] = await Promise.all([
        getRepo.findSubscriptions(where, Number(skip), Number(limit)),
        getRepo.countSubscriptions(where)
    ]);

    return {
        data,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    };
};
