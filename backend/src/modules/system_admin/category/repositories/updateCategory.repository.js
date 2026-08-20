import { prisma } from "../../../../databases/init.mongodb.js";

export const updateCategoryRestaurantRepository = async (id, data) => {
    return prisma.category_Restaurant.update({
        where: { id },
        data
    });
};
