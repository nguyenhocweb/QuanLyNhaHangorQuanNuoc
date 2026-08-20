import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getTemplatesService } from "../services/template.get.service.js";

export const getTemplatesController = asyncHandler(async (req, res) => {
    const result = await getTemplatesService(req.query);
    res.status(result.code).json(result);
});
