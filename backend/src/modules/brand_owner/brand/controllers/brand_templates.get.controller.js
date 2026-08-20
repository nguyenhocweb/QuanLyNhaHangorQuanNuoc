import { getBrandTemplatesService } from "../services/brand_templates.get.service.js";

export const getBrandTemplatesController = async (req, res) => {
    const userId = req.user.id;

    const result = await getBrandTemplatesService(userId);
    res.status(result.code).json(result);
};
