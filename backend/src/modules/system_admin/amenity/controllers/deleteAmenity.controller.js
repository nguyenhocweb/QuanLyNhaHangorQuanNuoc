import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteAmenityService } from "../services/deleteAmenity.service.js";

export const deleteAmenityController = asyncHandler(async (req, res) => {
    const data = await deleteAmenityService(req.params.id);
    return res.status(200).json(data);
});