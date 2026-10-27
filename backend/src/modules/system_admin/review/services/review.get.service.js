import { getSystemReviewsRepo } from "../repositories/review.get.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const getSystemReviewsService = async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    
    let filter = {};

    if (queryParams.is_public !== undefined && queryParams.is_public !== "") {
        filter.is_public = queryParams.is_public === "true" || queryParams.is_public === true;
    }

    if (queryParams.rating) {
        filter.overall_rating = parseInt(queryParams.rating);
    }

    if (queryParams.restaurantId) {
        filter.restaurantId = queryParams.restaurantId;
    }

    if (queryParams.brandId) {
        const restaurants = await prisma.restaurant.findMany({
            where: { brandId: queryParams.brandId },
            select: { id: true }
        });
        filter.restaurantId = { in: restaurants.map(r => r.id) };
    }

    if (queryParams.search && queryParams.search.trim()) {
        const keyword = queryParams.search.trim();
        filter.OR = [
            { comment: { contains: keyword, mode: "insensitive" } },
            { user: { name: { contains: keyword, mode: "insensitive" } } },
            { restaurant: { name: { contains: keyword, mode: "insensitive" } } }
        ];
    }

    const { total, reviews } = await getSystemReviewsRepo(filter, skip, limit);

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
