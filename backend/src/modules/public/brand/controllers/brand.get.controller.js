import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getPublicBrandsService } from "../services/brand.get.service.js";

export const getPublicBrandsController = asyncHandler(async (req, res) => {
    const query = req.query;
    const result = await getPublicBrandsService(query);
    res.status(result.code).json(result.data);
});
