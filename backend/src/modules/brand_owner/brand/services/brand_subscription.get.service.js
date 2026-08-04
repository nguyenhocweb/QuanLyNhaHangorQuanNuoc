import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { getBrandSubscriptionByBrandId } from "../repositories/brand_subscription.get.repo.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const getBrandSubscriptionService = async (userId) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new ForbiddenError("Người dùng không thuộc thương hiệu nào");
    }

    const subscription = await getBrandSubscriptionByBrandId(employment.brandId);
    return subscription;
};
