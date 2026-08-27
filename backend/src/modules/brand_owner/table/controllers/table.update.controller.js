import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateTableService } from "../services/table.update.service.js";

export const updateTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateTableService(id, req.body);
    res.status(200).json({
        success: true,
        message: "Cập nhật bàn thành công",
        data: result
    });
});
