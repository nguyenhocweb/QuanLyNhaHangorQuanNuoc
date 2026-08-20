import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getAmenityService, getAllAmenitiesService } from "../services/getAmenity.service.js";

export const getAmenityController = asyncHandler(async (req, res) => {
    const data = await getAmenityService(req.params.id);
    return res.status(200).json(data);
});

export const getAllAmenitiesController = asyncHandler(async (req, res) => {
    const data = await getAllAmenitiesService(req.query);
    return res.status(200).json(data);
});