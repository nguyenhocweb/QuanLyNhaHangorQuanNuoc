import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createTemplateService } from "../services/template.create.service.js";

export const createTemplateController = asyncHandler(async (req, res) => {
    const result = await createTemplateService(req.body);
    res.status(result.code).json(result);
});
