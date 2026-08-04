import { getOperatingHoursRepo } from "../repositories/operating_hours.get.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getOperatingHoursService = async (restaurantId) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });
    
    if (!restaurant) {
        throw new NotFoundError("Nhà hàng không tồn tại");
    }

    const operatingHours = await getOperatingHoursRepo(restaurantId);
    
    // Nếu chưa có, trả về array rỗng
    return operatingHours;
};
