import { prisma } from "../../../../databases/init.mongodb.js";

export const getOperatingHoursRepo = async (restaurantId) => {
    return prisma.operating_Hours.findMany({
        where: {
            restaurantId: restaurantId
        },
        orderBy: {
            day_of_week: 'asc'
        }
    });
};
