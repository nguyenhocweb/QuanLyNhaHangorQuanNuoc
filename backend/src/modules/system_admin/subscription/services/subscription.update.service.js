import * as updateRepo from "../repositories/subscription.update.repo.js";
import * as getRepo from "../repositories/subscription.get.repo.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

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

    return await updateRepo.updateSubscription(id, payload);
};
