import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createTableService } from "../services/table.create.service.js";

export const createTable = asyncHandler(async (req, res) => {
    const result = await createTableService(req.body);
    res.status(201).json({
        success: true,
        message: "Tạo bàn thành công",
        data: result
    });
});
