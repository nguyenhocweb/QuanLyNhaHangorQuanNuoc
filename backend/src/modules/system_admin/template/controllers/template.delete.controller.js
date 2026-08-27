import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteTemplateService } from "../services/template.delete.service.js";

export const deleteTemplateController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteTemplateService(id);
    res.status(result.code).json(result);
});
