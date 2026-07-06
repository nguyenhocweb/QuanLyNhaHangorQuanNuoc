import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getRestaurantsService, getRestaurantByIdService } from "../services/restaurant.get.service.js";

export const getRestaurants = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "", status = "all", city = "", rating = "", categoryId = "" } = req.query;
    console.log("Fetching restaurants with imageMain included...");
    const data = await getRestaurantsService({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        status,
        city,
        rating,
        categoryId
    });
    return res.status(200).json(data);
});

export const getRestaurantById = asyncHandler(async (req, res) => {
    const data = await getRestaurantByIdService(req.params.id);
    console.log('data',     data);
    return res.status(200).json(data);
});
