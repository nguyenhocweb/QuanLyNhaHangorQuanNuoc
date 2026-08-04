import { getBrandReviewsRepo, getRestaurantsByBrand } from "../repositories/review.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getBrandReviewsService = async (brandId, queryParams) => {
    // 1. Lấy danh sách nhà hàng của thương hiệu
    let restaurantIds = await getRestaurantsByBrand(brandId);
    
    if (restaurantIds.length === 0) {
        return {
            reviews: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        };
    }

    // Nếu filter theo 1 nhà hàng cụ thể
    if (queryParams.restaurantId) {
        if (!restaurantIds.includes(queryParams.restaurantId)) {
            throw new NotFoundError("Nhà hàng này không thuộc thương hiệu của bạn");
        }
        restaurantIds = [queryParams.restaurantId];
    }

    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (queryParams.status) {
        filter.status = queryParams.status;
    }
    if (queryParams.rating) {
        filter.overall_rating = parseInt(queryParams.rating);
    }

    const { total, reviews } = await getBrandReviewsRepo(restaurantIds, filter, skip, limit);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
