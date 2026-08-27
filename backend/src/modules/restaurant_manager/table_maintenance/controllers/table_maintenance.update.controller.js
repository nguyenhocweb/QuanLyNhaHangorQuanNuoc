import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateTableMaintenanceService } from "../services/table_maintenance.update.service.js";

export const updateTableMaintenanceController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateTableMaintenanceService(id, req.body);
    res.status(200).json({
        message: "Cập nhật lịch bảo trì thành công!",
        metadata: result
    });
});
