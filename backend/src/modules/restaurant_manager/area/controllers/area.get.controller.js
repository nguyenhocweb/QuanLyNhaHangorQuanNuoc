import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getAreasByRestaurantIdService, getAreaByIdService } from "../services/area.get.service.js";

export const getAreasByRestaurantId = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const result = await getAreasByRestaurantIdService(restaurantId);
    res.status(200).json({
        success: true,
        data: result
    });
});

export const getAreaById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await getAreaByIdService(id);
    res.status(200).json({
        success: true,
        data: result
    });
});
