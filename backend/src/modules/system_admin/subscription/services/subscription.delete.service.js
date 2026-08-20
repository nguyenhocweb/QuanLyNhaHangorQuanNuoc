import * as deleteRepo from "../repositories/subscription.delete.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

// Xóa gói cước
export const deleteSubscription = async (id) => {
    // Kiểm tra xem có brand nào đang sử dụng gói này không
    const usedByBrands = await deleteRepo.checkSubscriptionInUse(id);

    if (usedByBrands) {
        throw new BadRequestError("Không thể xóa gói cước đang được sử dụng bởi các thương hiệu");
    }

    return await deleteRepo.deleteSubscription(id);
};
