import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateRestaurantTemplateService } from "../services/updateRestaurantTemplate.service.js";

export const updateRestaurantTemplateController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { templateId, restaurantIds } = req.body;

    const result = await updateRestaurantTemplateService(userId, templateId, restaurantIds);
    res.status(result.code).json(result);
});
