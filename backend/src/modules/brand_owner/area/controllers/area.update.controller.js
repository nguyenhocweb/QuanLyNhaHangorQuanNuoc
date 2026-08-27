import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateAreaService } from "../services/area.update.service.js";

export const updateArea = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await updateAreaService(id, req.body);
    res.status(200).json({
        success: true,
        message: "Cập nhật khu vực thành công",
        data: result
    });
});
