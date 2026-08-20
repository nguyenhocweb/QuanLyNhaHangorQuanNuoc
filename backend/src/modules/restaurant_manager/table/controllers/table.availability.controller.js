import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getTableAvailabilityService } from "../services/table.availability.service.js";

export const getTableAvailability = asyncHandler(async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    const result = await getTableAvailabilityService(restaurantId, req.body);
    
    res.status(200).json({
        message: "Lấy sơ đồ trạng thái bàn thành công",
        metadata: result
    });
});
