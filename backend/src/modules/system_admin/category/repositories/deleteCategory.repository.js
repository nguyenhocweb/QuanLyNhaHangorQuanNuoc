import { prisma } from "../../../../databases/init.mongodb.js";
export const deleteCategoryRestaurantRepository = async (id) => {
    return await prisma.category_Restaurant.delete({
        where: { id }
    });
};
