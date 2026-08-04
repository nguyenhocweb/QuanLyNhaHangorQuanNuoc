import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createTableMaintenanceService } from "../services/table_maintenance.create.service.js";

export const createTableMaintenanceController = asyncHandler(async (req, res) => {
    const result = await createTableMaintenanceService(req.body, req.user);
    res.status(201).json({
        message: "Lên lịch bảo trì bàn thành công!",
        metadata: result
    });
});
