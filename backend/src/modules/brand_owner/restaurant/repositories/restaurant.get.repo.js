import { prisma } from "../../../../databases/init.mongodb.js";

export const getRestaurantsRepo = async (where) => {
    return await prisma.restaurant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            categoryRestaurants: true,
            restaurantAmenities: true,
            tags: true
        }
    });
};

export const getRestaurantByIdRepo = async (where) => {
    return await prisma.restaurant.findFirst({
        where
    });
};

export const getRestaurantUtilitiesRepo = async (where) => {
    return await prisma.restaurant.findFirst({
        where,
        select: {
            categoryRestaurants: true,
            restaurantAmenities: true,
            tags: true
        }
    });
};
