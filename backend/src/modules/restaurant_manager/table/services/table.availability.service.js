import { getTableAvailabilityRepo } from "../repositories/table.availability.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const getTableAvailabilityService = async (restaurantId, data) => {
    let { reservation_date, start_time, end_time, party_size } = data;

    // Nếu không có end_time, tính toán mặc định (thường là +2 tiếng)
    if (!end_time) {
        const [hours, minutes] = start_time.split(':');
        const endHour = (parseInt(hours) + 2) % 24;
        end_time = `${endHour.toString().padStart(2, '0')}:${minutes}`;
    }

    if (start_time >= end_time && end_time !== "00:00") {
        throw new BadRequestError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
    }

    const areasWithTables = await getTableAvailabilityRepo(restaurantId, reservation_date, start_time, end_time);
    return areasWithTables;
};
