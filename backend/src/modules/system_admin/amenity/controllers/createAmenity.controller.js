import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createAmenityService } from "../services/createAmenity.service.js";

export const createAmenityController = asyncHandler(async (req, res) => {
    const data = await createAmenityService(req.body);
    return res.status(201).json(data);
});