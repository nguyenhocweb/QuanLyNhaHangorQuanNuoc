import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getTagService, getAllTagsService } from "../services/getTag.service.js";

export const getTagController = asyncHandler(async (req, res) => {
    const data = await getTagService(req.params.id);
    return res.status(200).json(data);
});

export const getAllTagsController = asyncHandler(async (req, res) => {
    const data = await getAllTagsService(req.query);
    return res.status(200).json(data);
});