import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteRestaurantService } from "../services/restaurant.delete.service.js";

export const deleteRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteRestaurantService(id);
    return res.status(200).json({ message: "Xóa nhà hàng thành công" });
});
