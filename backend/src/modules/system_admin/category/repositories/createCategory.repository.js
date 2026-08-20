import { prisma } from "../../../../databases/init.mongodb.js";

export const createCategoryRestaurantRepository = async (data) => {
    return prisma.category_Restaurant.create({
        data
    });
};
