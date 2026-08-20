import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { updateBrandTemplateService } from "../services/brand.update_template.service.js";

export const updateBrandTemplateController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { templateId } = req.body;

    const result = await updateBrandTemplateService(userId, templateId);
    res.status(result.code).json(result);
});
