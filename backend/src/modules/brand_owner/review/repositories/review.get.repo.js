import { prisma } from "../../../../databases/init.mongodb.js";

export const getRestaurantsByBrand = async (brandId) => {
    const restaurants = await prisma.restaurant.findMany({
        where: { brandId },
        select: { id: true }
    });
    return restaurants.map(r => r.id);
};

export const getBrandReviewsRepo = async (restaurantIds, filter, skip, take) => {
    const [total, reviews] = await Promise.all([
        prisma.review_Restaurant.count({
            where: {
                restaurantId: { in: restaurantIds },
                ...filter
            }
        }),
        prisma.review_Restaurant.findMany({
            where: {
                restaurantId: { in: restaurantIds },
                ...filter
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                restaurant: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take
        })
    ]);

    return { total, reviews };
};
