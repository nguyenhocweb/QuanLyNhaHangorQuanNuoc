import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createRestaurantService } from "../services/restaurant.create.service.js";

export const createRestaurant = asyncHandler(async (req, res) => {
    const newRestaurant = await createRestaurantService(req.body);
    return res.status(201).json(newRestaurant);
});
