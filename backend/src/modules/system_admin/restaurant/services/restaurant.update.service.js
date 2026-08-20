import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updateRestaurant } from "../repositories/restaurant.update.repo.js";

export const updateRestaurantService = async (id, data) => {
    try {
        const payload = { ...data };
        if (payload.statusByAdmin !== undefined) {
            if (typeof payload.statusByAdmin === 'boolean') {
                payload.statusByAdmin = payload.statusByAdmin ? 'ACTIVE' : 'INACTIVE';
            }
        }
        if (payload.statusByBrand !== undefined) {
            if (typeof payload.statusByBrand === 'boolean') {
                payload.statusByBrand = payload.statusByBrand ? 'ACTIVE' : 'INACTIVE';
            }
        }
        return await updateRestaurant(id, payload);
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Không tìm thấy nhà hàng");
        }
        throw error;
    }
};
