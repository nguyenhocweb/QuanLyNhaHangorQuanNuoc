import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getPublicCategoriesService } from "../services/category.get.service.js";

export const getPublicCategoriesController = asyncHandler(async (req, res) => {
    const data = await getPublicCategoriesService();
    return res.status(200).json(data);
});
