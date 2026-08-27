import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getDiscoverPromotionsService } from "../services/promotion.get-discover.service.js";

export const getDiscoverPromotionsController = asyncHandler(async (req, res) => {
    const userId = req.user?.id || null;
    const query = req.query;

    const result = await getDiscoverPromotionsService(userId, query);

    res.status(200).json({
        message: "Lấy danh sách khuyến mãi khám phá thành công",
        metadata: result
    });
});
