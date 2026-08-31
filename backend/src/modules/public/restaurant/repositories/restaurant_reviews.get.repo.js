import { prisma } from "../../../../databases/init.mongodb.js";

export const getPublicRestaurantReviewsRepo = async (restaurantId, skip, limit, rating = null, sortBy = "latest", hasImage = false) => {
    const where = {
        restaurantId,
        is_public: true
    };

    if (rating && Number(rating) >= 1 && Number(rating) <= 5) {
        where.overall_rating = Number(rating);
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
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                reservation: {
                    select: {
                        guest_name: true,
                        party_size: true,
                        reservation_date: true
                    }
                }
            }
        })
    ]);

    return { total, reviews };
};
