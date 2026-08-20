import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateRestaurantService } from "../services/restaurant.update.service.js";

export const updateRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await updateRestaurantService(id, req.body);
    return res.status(200).json(updated);
});
