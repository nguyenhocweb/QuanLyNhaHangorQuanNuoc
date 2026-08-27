import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteAreaService } from "../services/area.delete.service.js";

export const deleteArea = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteAreaService(id);
    res.status(200).json({
        success: true,
        message: "Xóa khu vực thành công",
        data: result
    });
});
