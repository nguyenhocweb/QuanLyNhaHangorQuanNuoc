import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { saveTableLayoutService } from "../services/table.saveLayout.service.js";

export const saveTableLayout = asyncHandler(async (req, res) => {
    const result = await saveTableLayoutService(req.body);
    res.status(200).json({
        success: true,
        message: "Lưu cấu hình sơ đồ bàn thành công",
        data: result
    });
});
