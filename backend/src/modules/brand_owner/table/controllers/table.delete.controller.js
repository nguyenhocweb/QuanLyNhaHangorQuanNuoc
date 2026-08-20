import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { deleteTableService } from "../services/table.delete.service.js";

export const deleteTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteTableService(id);
    res.status(200).json({
        success: true,
        message: "Xóa bàn thành công",
        data: result
    });
});
