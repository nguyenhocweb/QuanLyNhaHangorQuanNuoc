import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { holdTableService } from "../services/table.hold.service.js";

export const holdTable = asyncHandler(async (req, res) => {
    // req.user được gán từ middleware authenticateToken
    const { id: tableId } = req.params;
    const userId = req.user.id; 

    // Gọi tới service để xử lý logic khóa bằng Redis
    const result = await holdTableService(tableId, userId);

    res.status(200).json({
        message: "Giữ bàn thành công",
        metadata: result
    });
});
