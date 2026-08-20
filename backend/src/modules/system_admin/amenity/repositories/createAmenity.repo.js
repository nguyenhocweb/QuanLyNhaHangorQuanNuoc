import { prisma } from "../../../../databases/init.mongodb.js";

export const createAmenityRepo = async (data) => {
    return prisma.restaurant_Amenities.create({ data });
};