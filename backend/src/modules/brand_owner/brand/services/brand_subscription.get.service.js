import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { getBrandSubscriptionByBrandId } from "../repositories/brand_subscription.get.repo.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const getBrandSubscriptionService = async (userId) => {
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new ForbiddenError("Người dùng không thuộc thương hiệu nào");
    }

    const subscription = await getBrandSubscriptionByBrandId(employment.brandId);
    
    if (subscription) {
        // Ưu tiên sử dụng dữ liệu Snapshot (nếu có), fallback về dữ liệu gốc của Plan
        subscription.plan = {
            ...subscription.plan,
            name: subscription.planName || subscription.plan?.name,
            price: subscription.price ?? subscription.plan?.price,
            maxRestaurants: subscription.maxRestaurants ?? subscription.plan?.maxRestaurants,
            featuresData: subscription.featuresData || subscription.plan?.featuresData,
        };
    }
    
    return subscription;
};
