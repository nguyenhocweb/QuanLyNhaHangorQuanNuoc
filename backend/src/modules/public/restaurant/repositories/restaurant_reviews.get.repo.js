import { prisma } from "../../../../databases/init.mongodb.js";

export const getPublicRestaurantReviewsRepo = async (restaurantId, skip, limit, rating = null, sortBy = "latest", hasImage = false) => {
    const where = {
        restaurantId,
        status: "APPROVED"
    };

    if (rating && rating >= 1 && rating <= 5) {
        where.overall_rating = rating;
    }

    if (hasImage === 'true' || hasImage === true) {
        where.images = { isEmpty: false };
    }

    let orderBy = {};
    switch (sortBy) {
        case "oldest":
            orderBy = { createdAt: 'asc' };
            break;
        case "highest_rated":
            orderBy = { overall_rating: 'desc' };
            break;
        case "lowest_rated":
            orderBy = { overall_rating: 'asc' };
            break;
        case "latest":
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    const [total, reviews] = await Promise.all([
        prisma.review_Restaurant.count({
            where
        }),
        prisma.review_Restaurant.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                overall_rating: true,
                food_rating: true,
                service_rating: true,
                ambiance_rating: true,
                comment: true,
                staff_response: true,
                images: true,
                helpful_count: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        })
    ]);

    return { total, reviews };
};
