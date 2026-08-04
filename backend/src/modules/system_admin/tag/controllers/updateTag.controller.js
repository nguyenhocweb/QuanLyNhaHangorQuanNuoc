import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateTagService } from "../services/updateTag.service.js";

export const updateTagController = asyncHandler(async (req, res) => {
    const data = await updateTagService(req.params.id, req.body);
    return res.status(200).json(data);
});