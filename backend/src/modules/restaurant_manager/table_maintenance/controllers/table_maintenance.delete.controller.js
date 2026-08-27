import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteTableMaintenanceService } from "../services/table_maintenance.delete.service.js";

export const deleteTableMaintenanceController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteTableMaintenanceService(id);
    res.status(200).json({
        message: "Xóa lịch bảo trì thành công!",
        metadata: result
    });
});
