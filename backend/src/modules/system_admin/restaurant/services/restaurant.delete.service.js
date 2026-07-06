import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deleteRestaurant } from "../repositories/restaurant.delete.repo.js";

export const deleteRestaurantService = async (id) => {
    try {
        return await deleteRestaurant(id);
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Không tìm thấy nhà hàng để xóa");
        }
        throw error;
    }
};
