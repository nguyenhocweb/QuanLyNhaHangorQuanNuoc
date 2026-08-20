import { prisma } from "../../../../databases/init.mongodb.js";

export const getAreasByRestaurantIdRepo = async (restaurantId) => {
    return await prisma.restaurant_Areas.findMany({
        where: { restaurantId, is_active: { not: "TERMINATED" } },
        include: { tabels: true },
        orderBy: { floor_number: 'asc' }
    });
};

export const getAreaByIdRepo = async (id) => {
    return await prisma.restaurant_Areas.findUnique({
        where: { id }
    });
};
