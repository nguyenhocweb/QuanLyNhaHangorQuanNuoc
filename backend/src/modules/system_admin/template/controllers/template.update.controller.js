import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { updateTemplateService } from "../services/template.update.service.js";

export const updateTemplateController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateTemplateService(id, req.body);
    res.status(result.code).json(result);
});
