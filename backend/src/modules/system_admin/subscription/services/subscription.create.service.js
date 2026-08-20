import * as createRepo from "../repositories/subscription.create.repo.js";
import * as getRepo from "../repositories/subscription.get.repo.js";
import { ConflictError } from "../../../../core/constants/error/index.js";

// Tạo gói cước mới
export const createSubscription = async (data) => {
    const existing = await getRepo.findSubscriptionByName(data.name);
    
    if (existing) {
        throw new ConflictError("Tên gói cước đã tồn tại");
    }

    // Convert date strings to Date objects if present
    const payload = { ...data };
    if (payload.discountStartDate) payload.discountStartDate = new Date(payload.discountStartDate);
    if (payload.discountEndDate) payload.discountEndDate = new Date(payload.discountEndDate);

    return await createRepo.createSubscription(payload);
};
