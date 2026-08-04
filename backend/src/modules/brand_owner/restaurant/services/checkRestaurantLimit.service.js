import { getBrandSubscriptionLimitRepo } from "../repositories/checkRestaurantLimit.repo.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

export const checkRestaurantLimitService = async (brandId) => {
    if (!brandId) throw new NotFoundError("Không tìm thấy thông tin Brand");

    const brand = await getBrandSubscriptionLimitRepo(brandId);
    
    if (!brand) throw new NotFoundError("Brand không tồn tại");

    const activeSubscription = brand.subscriptions[0];
    if (!activeSubscription) {
        throw new ConflictError("Thương hiệu chưa có gói cước nào đang hoạt động, không thể tạo nhà hàng.");
    }

    const maxRestaurants = activeSubscription.plan.maxRestaurants;
    const currentCount = brand.restaurantCount;

    // maxRestaurants = -1 means unlimited
    if (maxRestaurants !== -1 && currentCount >= maxRestaurants) {
        throw new ConflictError(`Gói cước hiện tại chỉ cho phép tạo tối đa ${maxRestaurants} nhà hàng. Bạn đã đạt giới hạn.`);
    }

    return true;
};
