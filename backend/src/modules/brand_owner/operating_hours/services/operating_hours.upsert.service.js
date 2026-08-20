import { upsertOperatingHoursRepo } from "../repositories/operating_hours.upsert.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const upsertOperatingHoursService = async (restaurantId, operatingHours) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });
    
    if (!restaurant) {
        throw new NotFoundError("Nhà hàng không tồn tại");
    }

    return await upsertOperatingHoursRepo(restaurantId, operatingHours);
};
