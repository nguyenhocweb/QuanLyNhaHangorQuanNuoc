import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { saveVoucherService } from "../services/promotion.save.service.js";

export const saveVoucherController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { identifier } = req.body;

    const result = await saveVoucherService(userId, identifier);

    res.status(201).json({
        message: "Lưu voucher vào ví thành công",
        metadata: result
    });
});
