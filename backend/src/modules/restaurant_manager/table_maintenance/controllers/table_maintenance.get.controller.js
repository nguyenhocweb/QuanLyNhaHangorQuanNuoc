import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getTableMaintenanceService } from "../services/table_maintenance.get.service.js";

export const getTableMaintenanceController = asyncHandler(async (req, res) => {
    const restaurantId = req.query.restaurantId || req.params.restaurantId;
    const result = await getTableMaintenanceService(restaurantId, req.query);
    res.status(200).json({
        message: "Lấy danh sách bảo trì bàn thành công!",
        metadata: result
    });
});
