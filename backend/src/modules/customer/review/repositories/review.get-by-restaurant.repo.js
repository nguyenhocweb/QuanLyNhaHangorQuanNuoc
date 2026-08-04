import { prisma } from "../../../../databases/init.mongodb.js";

export const getReviewsByRestaurantRepo = async (restaurantId, filter, skip, take, sortBy) => {
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'helpful') {
        orderBy = { helpful_count: 'desc' };
    }

    const [total, reviews] = await Promise.all([
        prisma.review_Restaurant.count({
            where: {
                restaurantId,
                status: "APPROVED",
                ...filter
            }
        }),
        prisma.review_Restaurant.findMany({
            where: {
                restaurantId,
                status: "APPROVED",
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
