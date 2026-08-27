import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getPublicBrandByIdService } from "../services/brand.getById.service.js";

export const getPublicBrandByIdController = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const result = await getPublicBrandByIdService(_id);
    res.status(result.code).json(result);
});
