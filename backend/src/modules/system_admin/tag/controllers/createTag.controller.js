import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createTagService } from "../services/createTag.service.js";

export const createTagController = asyncHandler(async (req, res) => {
    const data = await createTagService(req.body);
    return res.status(201).json(data);
});