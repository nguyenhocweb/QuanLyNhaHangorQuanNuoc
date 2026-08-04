import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteAmenityRepo = async (id) => {
    return prisma.restaurant_Amenities.delete({ where: { id } });
};