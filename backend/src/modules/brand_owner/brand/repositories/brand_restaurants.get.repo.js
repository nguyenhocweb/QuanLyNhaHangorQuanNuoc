import { prisma } from "../../../../databases/init.mongodb.js";

export const getBrandRestaurantsByBrandId = async (brandId) => {
    return await prisma.restaurant.findMany({
        where: { brandId },
        include: {
            categoryRestaurants: true,
            tags: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};
