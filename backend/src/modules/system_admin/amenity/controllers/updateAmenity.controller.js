import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateAmenityService } from "../services/updateAmenity.service.js";

export const updateAmenityController = asyncHandler(async (req, res) => {
    const data = await updateAmenityService(req.params.id, req.body);
    return res.status(200).json(data);
});