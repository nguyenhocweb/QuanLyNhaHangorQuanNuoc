import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createAreaService } from "../services/area.create.service.js";

export const createArea = asyncHandler(async (req, res) => {
    const result = await createAreaService(req.body);
    res.status(201).json({
        success: true,
        message: "Tạo khu vực thành công",
        data: result
    });
});
