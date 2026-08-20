import { prisma } from "../../../../databases/init.mongodb.js";

export const updateAmenityRepo = async (id, data) => {
    return prisma.restaurant_Amenities.update({
        where: { id },
        data
    });
};