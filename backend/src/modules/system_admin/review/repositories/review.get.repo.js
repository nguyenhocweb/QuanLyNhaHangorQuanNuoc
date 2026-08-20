import { prisma } from "../../../../databases/init.mongodb.js";

export const getSystemReviewsRepo = async (filter, skip, take) => {
    const [total, reviews] = await Promise.all([
        prisma.review_Restaurant.count({
            where: filter
        }),
        prisma.review_Restaurant.findMany({
            where: filter,
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
                        id: true,
                        name: true,
                        brandId: true,
                        brand: {
                            select: { name: true }
                        }
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
