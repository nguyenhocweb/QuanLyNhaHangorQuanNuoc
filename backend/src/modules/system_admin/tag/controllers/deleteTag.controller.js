import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteTagService } from "../services/deleteTag.service.js";

export const deleteTagController = asyncHandler(async (req, res) => {
    const data = await deleteTagService(req.params.id);
    return res.status(200).json(data);
});