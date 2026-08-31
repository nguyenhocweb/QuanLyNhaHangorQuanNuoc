import * as updateRepo from "../repositories/subscription.update.repo.js";
import * as getRepo from "../repositories/subscription.get.repo.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { DEFAULT_CORE_FEATURES } from "../../../../constants/subscription.constant.js";

// Cập nhật gói cước
export const updateSubscription = async (id, data) => {
    const existing = await getRepo.findSubscriptionById(id);
    
    if (!existing) {
        throw new NotFoundError("Gói cước không tồn tại");
    }

    if (data.name && data.name !== existing.name) {
        const nameConflict = await getRepo.findSubscriptionByName(data.name);
        if (nameConflict) {
            throw new ConflictError("Tên gói cước đã tồn tại");
        }
    }

    // Convert date strings to Date objects if present
    const payload = { ...data };
    if (payload.discountStartDate) payload.discountStartDate = new Date(payload.discountStartDate);
    if (payload.discountEndDate) payload.discountEndDate = new Date(payload.discountEndDate);

    // Luôn tự động gắn các tính năng cốt lõi (không thể bị thiếu/tắt)
    if (payload.featuresData !== undefined) {
        payload.featuresData = {
            ...DEFAULT_CORE_FEATURES,
            ...(typeof payload.featuresData === 'object' ? payload.featuresData : {})
        };
    }

    return await updateRepo.updateSubscription(id, payload);
};
