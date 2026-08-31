import { getPublicRestaurantHoursRepo } from "../repositories/restaurant_hours.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicRestaurantHoursService = async (id) => {
    const restaurant = await getPublicRestaurantHoursRepo(id);

    if (!restaurant) {
        throw new NotFoundError("Không tìm thấy nhà hàng hoặc nhà hàng đã tạm ngưng hoạt động.");
    }

    return {
        message: "Lấy giờ hoạt động thành công",
        metadata: {
            operating_hours: restaurant.operating_hours,
            special_schedules: restaurant.special_schedules
        },
    };
};
