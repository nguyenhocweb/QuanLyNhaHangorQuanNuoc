import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getCategoriesRestaurantService } from "../services/getCategory.service.js";
export const getCategoriesRestaurantController = asyncHandler(async(req, res) => {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;
    const data = await getCategoriesRestaurantService({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        status
    });
    return res.status(200).json(data);
});