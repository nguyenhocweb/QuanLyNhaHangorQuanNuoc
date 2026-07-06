import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updateRestaurant } from "../repositories/restaurant.update.repo.js";

export const updateRestaurantService = async (id, data) => {
    try {
        const payload = { ...data };
        if (payload.isActive !== undefined) {
            payload.isActive = payload.isActive ? 'ACTIVE' : 'INACTIVE';
        }
        return await updateRestaurant(id, payload);
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Không tìm thấy nhà hàng");
        }
        throw error;
    }
};
