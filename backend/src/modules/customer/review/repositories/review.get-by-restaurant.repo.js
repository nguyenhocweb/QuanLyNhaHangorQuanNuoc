import { prisma } from "../../../../databases/init.mongodb.js";

export const getReviewsByRestaurantRepo = async (restaurantId, filter, skip, take, sortBy) => {
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
        orderBy = { createdAt: 'desc' }; // helpful_count removed from schema
    }

    const [total, reviews] = await Promise.all([
        prisma.review_Restaurant.count({
            where: {
                restaurantId,
                is_public: true,
                ...filter
            }
        }),
        prisma.review_Restaurant.findMany({
            where: {
                restaurantId,
                is_public: true,
                ...filter
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy,
            skip,
            take
        })
    ]);

    return { total, reviews };
};
